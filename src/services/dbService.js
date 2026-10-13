import { db } from '../firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';

export const getPlanById = async (planId) => {
  try {
    const planRef = doc(db, "planes", planId);
    const planSnap = await getDoc(planRef);
    if (planSnap.exists()) {
      return { id: planSnap.id, ...planSnap.data() };
    }
    return null;
  } catch (e) {
    console.error("Error al obtener plan por ID: ", e);
    throw e;
  }
};

export const savePlanToDB = async (userId, planData, markdown, recursosAnexos = []) => {
  try {
    const docRef = await addDoc(collection(db, "planes"), {
      userId,
      ...planData,
      markdown,
      recursosAnexos,
      estado: 'Guardado',
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const updatePlanInDB = async (planId, updatedMarkdown, recursosAnexos = []) => {
  try {
    const planRef = doc(db, "planes", planId);
    await updateDoc(planRef, {
      markdown: updatedMarkdown,
      recursosAnexos,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.error("Error updating document: ", e);
    throw e;
  }
};

export const getMisPlanes = async (userId) => {
  try {
    const q = query(collection(db, "planes"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const planes = [];
    querySnapshot.forEach((doc) => {
      planes.push({ id: doc.id, ...doc.data() });
    });
    // Ordenar localmente por createdAt descendente
    planes.sort((a, b) => {
      const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
      const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
      return dateB - dateA;
    });
    return planes;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
};

export const savePlantillaToDB = async (userId, plantillaData) => {
  try {
    const docRef = await addDoc(collection(db, "plantillas"), {
      userId,
      ...plantillaData,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding template: ", e);
    throw e;
  }
};

export const getPlantillas = async (userId) => {
  try {
    // Trae las públicas y las del usuario
    const q = query(collection(db, "plantillas")); // Simplificado para el MVP
    const querySnapshot = await getDocs(q);
    const plantillas = [];
    querySnapshot.forEach((doc) => {
      plantillas.push({ id: doc.id, ...doc.data() });
    });
    return plantillas;
  } catch (e) {
    console.error("Error getting templates: ", e);
    throw e;
  }
};

export const deletePlanFromDB = async (planId) => {
  try {
    await deleteDoc(doc(db, "planes", planId));
  } catch(e) {
    console.error("Error deleting plan", e);
    throw e;
  }
};

export const updatePlanStatus = async (planId, updateData) => {
  try {
    await updateDoc(doc(db, "planes", planId), updateData);
  } catch(e) {
    console.error("Error updating plan", e);
    throw e;
  }
};

export const deletePlantillaFromDB = async (plantillaId) => {
  try {
    await deleteDoc(doc(db, "plantillas", plantillaId));
  } catch(e) {
    console.error("Error deleting template", e);
    throw e;
  }
};

export const updatePlantillaPublic = async (plantillaId, isPublic) => {
  try {
    await updateDoc(doc(db, "plantillas", plantillaId), { publico: isPublic });
  } catch(e) {
    console.error("Error updating template", e);
    throw e;
  }
};

export const getAllUsers = async () => {
  try {
    const q = query(collection(db, "users"));
    const snapshot = await getDocs(q);
    const users = [];
    snapshot.forEach((doc) => users.push({ id: doc.id, ...doc.data() }));
    return users;
  } catch(e) {
    console.error("Error fetching users", e);
    return [];
  }
};

export const getGlobalStats = async () => {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const planesSnap = await getDocs(collection(db, "planes"));
    
    let experienciasCount = 0;
    let planesPorUsuario = {};

    planesSnap.forEach(doc => {
      const data = doc.data();
      if(data.estado === 'Sistematizado' || data.estado === 'Biblioteca') {
        experienciasCount++;
      }
      if (data.userId) {
        planesPorUsuario[data.userId] = (planesPorUsuario[data.userId] || 0) + 1;
      }
    });

    return {
      totalUsers: usersSnap.size,
      totalPlanes: planesSnap.size,
      totalExperiencias: experienciasCount,
      estudiantesImpactados: planesSnap.size * 25, // Estimado de 25 por plan
      planesPorUsuario
    };
  } catch(e) {
    console.error("Error fetching stats", e);
    return { totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0, planesPorUsuario: {} };
  }
};

// =======================
// FORO
// =======================
export const getForoMessages = async () => {
  try {
    const q = query(collection(db, "foro"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const msgs = [];
    snapshot.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
    return msgs;
  } catch(e) {
    console.error("Error getting foro", e);
    return [];
  }
};

export const addForoMessage = async (userId, nombre, rol, texto) => {
  try {
    await addDoc(collection(db, "foro"), {
      userId,
      nombre,
      rol,
      texto,
      respuestas: [],
      createdAt: serverTimestamp()
    });
  } catch(e) {
    console.error("Error adding foro msg", e);
    throw e;
  }
};

export const addForoReply = async (msgId, userId, nombre, rol, texto) => {
  try {
    const docRef = doc(db, "foro", msgId);
    // Para simplificar, leemos y reescribimos el array de respuestas.
    // En producción se usaría arrayUnion, pero esto basta para el MVP
    const msgData = await getDocs(query(collection(db, "foro"), where("__name__", "==", msgId)));
    let currentRespuestas = [];
    msgData.forEach(d => { currentRespuestas = d.data().respuestas || [] });
    
    await updateDoc(docRef, {
      respuestas: [...currentRespuestas, { userId, nombre, rol, texto, date: new Date().toISOString() }]
    });
  } catch(e) {
    console.error("Error replying foro msg", e);
    throw e;
  }
};

// =======================
// TICKETS DE SOPORTE
// =======================
export const getTickets = async () => {
  try {
    const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    const tickets = [];
    snapshot.forEach(doc => tickets.push({ id: doc.id, ...doc.data() }));
    return tickets;
  } catch(e) {
    console.error("Error getting tickets", e);
    return [];
  }
};

export const addTicket = async (userId, nombre, email, asunto, descripcion) => {
  try {
    await addDoc(collection(db, "tickets"), {
      userId,
      nombre,
      email,
      asunto,
      descripcion,
      estado: 'Pendiente',
      respuestaAdmin: '',
      createdAt: serverTimestamp()
    });
  } catch(e) {
    console.error("Error adding ticket", e);
    throw e;
  }
};

export const respondTicket = async (ticketId, respuesta) => {
  try {
    await updateDoc(doc(db, "tickets", ticketId), {
      respuestaAdmin: respuesta,
      estado: 'Resuelto',
      updatedAt: serverTimestamp()
    });
  } catch(e) {
    console.error("Error responding ticket", e);
    throw e;
  }
};
