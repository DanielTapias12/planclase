import { db } from '../firebase.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, where, serverTimestamp, orderBy } from 'firebase/firestore';

const LOCAL_PLANS_KEY = 'inspiratec_local_saved_plans';

const getAppStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return null;
};

export const getLocalSavedPlans = () => {
  const storage = getAppStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(LOCAL_PLANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("Error leyendo planes guardados locales:", e);
    return [];
  }
};

export const saveLocalSavedPlan = (plan) => {
  const storage = getAppStorage();
  if (!storage || !plan) return;
  try {
    const list = getLocalSavedPlans();
    const targetId = plan.id;
    const filtered = list.filter(p => p.id !== targetId);
    filtered.unshift(plan);
    storage.setItem(LOCAL_PLANS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn("Error guardando plan localmente:", e);
  }
};

export const removeLocalSavedPlan = (planId) => {
  const storage = getAppStorage();
  if (!storage || !planId) return;
  try {
    const list = getLocalSavedPlans();
    const filtered = list.filter(p => p.id !== planId);
    storage.setItem(LOCAL_PLANS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn("Error eliminando plan local:", e);
  }
};

export const getPlanById = async (planId) => {
  if (!planId) return null;

  // 1. Intentar consultar en Firestore
  try {
    const planRef = doc(db, "planes", planId);
    const planSnap = await getDoc(planRef);
    if (planSnap.exists()) {
      return { id: planSnap.id, ...planSnap.data() };
    }
  } catch (e) {
    console.warn("Firestore inaccesible o documento no encontrado en nube, buscando localmente:", e);
  }

  // 2. Buscar en almacenamiento local guardado
  const localList = getLocalSavedPlans();
  const localMatch = localList.find(p => p.id === planId);
  if (localMatch) {
    return localMatch;
  }

  // 3. Buscar en la sesión activa en localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const activeRaw = localStorage.getItem('inspiratec_active_session');
      if (activeRaw) {
        const active = JSON.parse(activeRaw);
        const state = active?.state || active;
        if (state?.planGenerado && (state.planId === planId || !planId || planId === 'plan_sesion_activa')) {
          return {
            id: planId || state.planId || 'plan_sesion_activa',
            markdown: state.planGenerado,
            ...(state.activePlanMetadata || {}),
            recursosAnexos: state.recursosAnexos || [],
            estado: 'Guardado'
          };
        }
      }
    } catch (_) {}
  }

  return null;
};

export const savePlanToDB = async (userId, planData, markdown, recursosAnexos = []) => {
  const effectiveUserId = userId || 'anon';
  const localId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  
  const localRecord = {
    id: localId,
    userId: effectiveUserId,
    ...planData,
    markdown,
    recursosAnexos: (Array.isArray(recursosAnexos) && recursosAnexos.length > 0) ? recursosAnexos : (Array.isArray(planData?.recursosAnexos) ? planData.recursosAnexos : []),
    estado: 'Guardado',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Guardar inmediatamente en almacenamiento local seguro
  saveLocalSavedPlan(localRecord);

  // Intentar persistir en Firestore con timeout seguro
  try {
    const safeCall = (promise, ms = 2000) => {
      let t;
      const timeout = new Promise((_, reject) => {
        t = setTimeout(() => reject(new Error('Firestore timeout')), ms);
      });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
    };

    const docRef = await safeCall(addDoc(collection(db, "planes"), {
      userId: effectiveUserId,
      ...planData,
      markdown,
      recursosAnexos: (Array.isArray(recursosAnexos) && recursosAnexos.length > 0) ? recursosAnexos : (Array.isArray(planData?.recursosAnexos) ? planData.recursosAnexos : []),
      estado: 'Guardado',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));

    if (docRef && docRef.id) {
      // Re-asociar el registro local con el ID definitivo de Firestore
      removeLocalSavedPlan(localId);
      localRecord.id = docRef.id;
      saveLocalSavedPlan(localRecord);
      return docRef.id;
    }
  } catch (e) {
    console.warn("No se pudo escribir en Firestore (se preserva la copia local segura):", e?.message || e);
  }

  return localId;
};

export const updatePlanInDB = async (planId, updatedMarkdown, recursosAnexos = []) => {
  if (!planId) return;

  // Actualizar copia local
  const localList = getLocalSavedPlans();
  const index = localList.findIndex(p => p.id === planId);
  if (index >= 0) {
    localList[index].markdown = updatedMarkdown;
    localList[index].recursosAnexos = recursosAnexos;
    localList[index].updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(localList));
    } catch (_) {}
  }

  // Actualizar en Firestore
  try {
    const planRef = doc(db, "planes", planId);
    await updateDoc(planRef, {
      markdown: updatedMarkdown,
      recursosAnexos,
      updatedAt: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore update diferido:", e);
  }
};

export const getMisPlanes = async (userId) => {
  const mergedMap = new Map();
  const effectiveUserId = userId || 'anon';

  // 1. Consultar Firestore para el usuario activo
  if (effectiveUserId && effectiveUserId !== 'anon') {
    try {
      const q = query(collection(db, "planes"), where("userId", "==", effectiveUserId));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        mergedMap.set(docSnap.id, { id: docSnap.id, ...data });
      });
    } catch (e) {
      console.warn("Error al consultar planes en Firestore por userId:", e);
    }
  }

  // 2. Consultar si hay planes registrados como 'anon' en Firestore
  try {
    const qAnon = query(collection(db, "planes"), where("userId", "==", "anon"));
    const snapAnon = await getDocs(qAnon);
    snapAnon.forEach((docSnap) => {
      if (!mergedMap.has(docSnap.id)) {
        mergedMap.set(docSnap.id, { id: docSnap.id, ...docSnap.data() });
      }
    });
  } catch (_) {}

  // 3. Fusionar con planes del almacenamiento local seguro
  const localPlans = getLocalSavedPlans();
  localPlans.forEach((lp) => {
    if (lp && lp.id && !mergedMap.has(lp.id)) {
      mergedMap.set(lp.id, lp);
    }
  });

  const allPlanes = Array.from(mergedMap.values());

  // Ordenar por fecha descendente
  allPlanes.sort((a, b) => {
    const getMs = (p) => {
      if (!p) return 0;
      if (p.createdAt?.toDate) return p.createdAt.toDate().getTime();
      if (p.createdAt?.toMillis) return p.createdAt.toMillis();
      if (typeof p.createdAt === 'string') return new Date(p.createdAt).getTime() || 0;
      if (p.updatedAt?.toDate) return p.updatedAt.toDate().getTime();
      if (typeof p.updatedAt === 'string') return new Date(p.updatedAt).getTime() || 0;
      return 0;
    };
    return getMs(b) - getMs(a);
  });

  return allPlanes;
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
  if (!planId) return;
  const cleanId = typeof planId === 'object' ? planId.id : planId;
  if (!cleanId) return;

  // 1. Eliminar del almacenamiento local seguro
  removeLocalSavedPlan(cleanId);

  // 2. Si la sesión activa en storage/Zustand tiene este plan, limpiarla para evitar que siga abierto o se re-guarde
  const storage = getAppStorage();
  if (storage) {
    try {
      const activeRaw = storage.getItem('inspiratec_active_session');
      if (activeRaw) {
        const parsed = JSON.parse(activeRaw);
        const state = parsed?.state || parsed;
        if (state && (state.planId === cleanId || !state.planId)) {
          state.planGenerado = '';
          state.planId = null;
          state.activePlanMetadata = null;
          state.planStatus = 'borrador';
          state.recursosAnexos = [];
          state.sesionChatIA = [];
          storage.setItem('inspiratec_active_session', JSON.stringify(parsed));
        }
      }
    } catch (e) {
      console.warn("Error limpiando sesión activa tras eliminar plan:", e);
    }
  }

  // 3. Eliminar de Firestore con timeout seguro para no bloquear la UI si hay problemas de red
  try {
    const safeCall = (promise, ms = 2500) => {
      let t;
      const timeout = new Promise((_, reject) => {
        t = setTimeout(() => reject(new Error('Firestore timeout')), ms);
      });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
    };
    await safeCall(deleteDoc(doc(db, "planes", cleanId)));
  } catch(e) {
    console.warn("Plan eliminado localmente. Error o diferido en Firestore:", e?.message || e);
  }
};

export const updatePlanStatus = async (planId, updateData) => {
  const localList = getLocalSavedPlans();
  const index = localList.findIndex(p => p.id === planId);
  if (index >= 0) {
    Object.assign(localList[index], updateData);
    try {
      localStorage.setItem(LOCAL_PLANS_KEY, JSON.stringify(localList));
    } catch (_) {}
  }
  try {
    await updateDoc(doc(db, "planes", planId), updateData);
  } catch(e) {
    console.warn("Estado actualizado localmente. Error en Firestore:", e);
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
      planesPorUsuario,
      allPlanes: planesSnap.docs.map(d => ({ id: d.id, ...d.data() }))
    };
  } catch(e) {
    console.error("Error fetching stats", e);
    return { totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0, planesPorUsuario: {} };
  }
};

// =======================
// FORO DOCENTE
// =======================
const LOCAL_FORO_KEY = 'inspiratec_foro_cache';

const DEFAULT_FORO_SEEDS = [
  {
    id: 'seed-foro-1',
    titulo: 'Estrategias para implementar el marco DUA en ciencias y matemáticas',
    texto: 'Estimados colegas, en la institución hemos comenzado a articular el Diseño Universal para el Aprendizaje (DUA) con las secuencias didácticas de aula. Sin embargo, en grados como 7mo y 8vo a veces nos cuesta diseñar múltiples formas de representación sin sobrecargar los tiempos de clase de 90 minutos.\n\n¿Qué metodologías o recursos interactivos les han funcionado mejor para flexibilizar la presentación de conceptos abstractos?',
    categoria: 'Inclusión y DUA',
    etiquetas: ['DUA', 'Ciencias', 'Flexibilización', 'Secundaria'],
    nombre: 'Prof. Carlos Ramírez',
    rol: 'Docente de Ciencias',
    userId: 'docente_carlos_1',
    destacado: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    respuestas: [
      {
        id: 'r-seed-1',
        nombre: 'Dra. Elena Gómez',
        rol: 'Admin',
        userId: 'admin_elena',
        texto: 'Hola Carlos. Una estrategia potente es usar estaciones de aprendizaje de 15 minutos: una estación táctil/concreta, una digital o visual (como simulaciones PhET) y una de discusión guiada. Permite que los estudiantes elijan su canal de acceso principal sin cambiar el objetivo curricular.',
        date: new Date(Date.now() - 3600000 * 3).toISOString()
      },
      {
        id: 'r-seed-2',
        nombre: 'Lic. Andrés Restrepo',
        rol: 'Docente',
        userId: 'docente_andres_2',
        texto: 'Totalmente de acuerdo con Elena. En matemáticas nos sirvió además incorporar el co-docente de INSPIRATEC para que sugiera rúbricas formativas diferenciadas por niveles de complejidad.',
        date: new Date(Date.now() - 3600000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'seed-foro-2',
    titulo: 'Integración ética y pedagógica de IA Generativa en las aulas de bachillerato',
    texto: 'Abro este debate para conocer cómo están orientando a los estudiantes de 10mo y 11mo grado en el uso de herramientas de inteligencia artificial. No queremos caer en la prohibición punitiva, sino orientar la IA hacia el desarrollo del pensamiento crítico, la verificación de fuentes y la producción textual propia.\n\n¿Tienen lineamientos o acuerdos de aula que les hayan dado buenos resultados?',
    categoria: 'Inteligencia artificial en educación',
    etiquetas: ['IA Educativa', 'Ética Digital', 'Pensamiento Crítico', 'Bachillerato'],
    nombre: 'Lic. Mariana Vargas',
    rol: 'Docente de Lenguaje',
    userId: 'docente_mariana_3',
    destacado: true,
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 7).toISOString(),
    respuestas: [
      {
        id: 'r-seed-3',
        nombre: 'Daniel Tapias',
        rol: 'Admin',
        userId: 'admin_danieltapias',
        texto: 'Excelente iniciativa, Mariana. En INSPIRATEC promovemos el enfoque de la IA como un "co-docente" o espejo cognitivo: se le pide al estudiante que analice los sesgos de la respuesta generada y justifique qué partes reformularía con sus propias palabras.',
        date: new Date(Date.now() - 3600000 * 8).toISOString()
      }
    ]
  },
  {
    id: 'seed-foro-3',
    titulo: 'Diseño de proyectos STEAM con materiales de bajo costo y reciclables',
    texto: 'Comparto una experiencia de aula en 5to de primaria: creamos prototipos de filtración de agua caseros articulando Ciencias Naturales, Matemáticas (cálculo de caudales) y Tecnología. El costo fue mínimo y el compromiso de los niños fue altísimo.\n\n¿Quién se suma a crear un repositorio abierto de rúbricas para evaluar este tipo de proyectos?',
    categoria: 'Innovación pedagógica',
    etiquetas: ['STEAM', 'Aprendizaje Basado en Proyectos', 'Primaria', 'Sostenibilidad'],
    nombre: 'Prof. Javier Morales',
    rol: 'Docente',
    userId: 'docente_javier_4',
    destacado: false,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString(),
    respuestas: []
  },
  {
    id: 'seed-foro-4',
    titulo: '¿Cómo dosificar los tiempos de clase cuando las actividades prácticas se alargan?',
    texto: 'Colegas, me pasa con frecuencia en Tecnología e Informática que la fase de desarrollo se extiende más de lo planeado y la actividad de cierre o metacognición termina reducida a 2 minutos. ¿Qué pautas utilizan para mantener la disciplina temporal sin cortar abruptamente la indagación de los estudiantes?',
    categoria: 'Preguntas y ayuda entre docentes',
    etiquetas: ['Gestión del Tiempo', 'Momentos de Clase', 'Evaluación Formativa'],
    nombre: 'Lic. Patricia Ospina',
    rol: 'Docente de Tecnología',
    userId: 'docente_patricia_5',
    destacado: false,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    respuestas: []
  }
];

const getForoStorage = () => {
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) return globalThis.localStorage;
  return null;
};

export const getLocalForoMessages = () => {
  const storage = getForoStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(LOCAL_FORO_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

export const saveLocalForoMessage = (item) => {
  const storage = getForoStorage();
  if (!storage) return;
  try {
    const list = getLocalForoMessages();
    const idx = list.findIndex(m => m.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.unshift(item);
    storage.setItem(LOCAL_FORO_KEY, JSON.stringify(list));
  } catch (_) {}
};

export const removeLocalForoMessage = (id) => {
  const storage = getForoStorage();
  if (!storage) return;
  try {
    const list = getLocalForoMessages().filter(m => m.id !== id);
    storage.setItem(LOCAL_FORO_KEY, JSON.stringify(list));
  } catch (_) {}
};

export const getForoMessages = async () => {
  const mergedMap = new Map();

  // 1. Consultar Firestore
  try {
    const q = query(collection(db, "foro"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      mergedMap.set(docSnap.id, { id: docSnap.id, ...data });
    });
  } catch(e) {
    console.warn("Error leyendo foro desde Firestore, operando con almacenamiento local:", e);
  }

  // 2. Fusionar con caché local
  const localList = getLocalForoMessages();
  localList.forEach(m => {
    if (m && m.id && !mergedMap.has(m.id)) {
      mergedMap.set(m.id, m);
    }
  });

  // 3. Semilla inicial si aún no existen discusiones registradas
  if (mergedMap.size === 0) {
    DEFAULT_FORO_SEEDS.forEach(seed => {
      mergedMap.set(seed.id, seed);
      saveLocalForoMessage(seed);
    });
  }

  const allMsgs = Array.from(mergedMap.values());
  
  // Normalizar campos en cada mensaje
  allMsgs.forEach(msg => {
    if (!msg.titulo) {
      msg.titulo = msg.texto ? msg.texto.split('\n')[0].slice(0, 75) : 'Discusión docente';
    }
    if (!msg.categoria) {
      msg.categoria = 'Estrategias didácticas';
    }
    if (!Array.isArray(msg.etiquetas)) {
      msg.etiquetas = [];
    }
    if (!Array.isArray(msg.respuestas)) {
      msg.respuestas = [];
    }
  });

  // Ordenar por fecha descendente
  allMsgs.sort((a, b) => {
    const getMs = (p) => {
      if (!p) return 0;
      if (p.createdAt?.toDate) return p.createdAt.toDate().getTime();
      if (p.createdAt?.toMillis) return p.createdAt.toMillis();
      if (typeof p.createdAt === 'string') return new Date(p.createdAt).getTime() || 0;
      if (p.updatedAt?.toDate) return p.updatedAt.toDate().getTime();
      if (typeof p.updatedAt === 'string') return new Date(p.updatedAt).getTime() || 0;
      return 0;
    };
    return getMs(b) - getMs(a);
  });

  return allMsgs;
};

export const addForoMessage = async (userId, nombre, rol, textoOrData, maybeExtra = {}) => {
  const isObj = typeof textoOrData === 'object' && textoOrData !== null;
  const rawTexto = isObj ? textoOrData.texto : (typeof textoOrData === 'string' ? textoOrData : '');
  const rawTitulo = isObj ? textoOrData.titulo : (maybeExtra.titulo || rawTexto.split('\n')[0].slice(0, 75) || 'Nueva discusión');
  const categoria = isObj ? (textoOrData.categoria || 'Estrategias didácticas') : (maybeExtra.categoria || 'Estrategias didácticas');
  const etiquetas = isObj ? (textoOrData.etiquetas || []) : (maybeExtra.etiquetas || []);
  const destacado = isObj ? !!textoOrData.destacado : !!maybeExtra.destacado;

  const newDocData = {
    userId: userId || 'anon',
    nombre: nombre || 'Docente',
    rol: rol || 'Docente',
    titulo: rawTitulo.trim(),
    texto: rawTexto.trim(),
    categoria,
    etiquetas,
    destacado,
    respuestas: []
  };

  const safeFirestoreCall = (promise, ms = 2000) => {
    let t;
    const timeout = new Promise((_, reject) => {
      t = setTimeout(() => reject(new Error('Firestore timeout')), ms);
    });
    return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
  };

  try {
    const docRef = await safeFirestoreCall(addDoc(collection(db, "foro"), {
      ...newDocData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));
    const savedItem = { 
      id: docRef.id, 
      ...newDocData, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveLocalForoMessage(savedItem);
    return docRef.id;
  } catch(e) {
    console.warn("Firestore diferido o sin permisos, persistiendo en almacenamiento local:", e?.message || e);
    const localId = 'foro_' + Date.now();
    const savedItem = { 
      id: localId, 
      ...newDocData, 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    saveLocalForoMessage(savedItem);
    return localId;
  }
};

export const addForoReply = async (msgId, userId, nombre, rol, texto) => {
  const replyObj = {
    id: 'reply_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId: userId || 'anon',
    nombre: nombre || 'Docente',
    rol: rol || 'Docente',
    texto: texto.trim(),
    date: new Date().toISOString()
  };

  // 1. Actualizar caché local de inmediato
  const localList = getLocalForoMessages();
  const foundIndex = localList.findIndex(m => m.id === msgId);
  if (foundIndex >= 0) {
    const current = localList[foundIndex];
    current.respuestas = [...(current.respuestas || []), replyObj];
    current.updatedAt = new Date().toISOString();
    saveLocalForoMessage(current);
  }

  // 2. Intentar actualizar Firestore con timeout seguro
  try {
    const safeCall = (promise, ms = 2000) => {
      let t;
      const timeout = new Promise((_, reject) => {
        t = setTimeout(() => reject(new Error('Firestore timeout')), ms);
      });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
    };

    const docRef = doc(db, "foro", msgId);
    const msgData = await safeCall(getDocs(query(collection(db, "foro"), where("__name__", "==", msgId))));
    let currentRespuestas = [];
    if (msgData) {
      msgData.forEach(d => { currentRespuestas = d.data().respuestas || [] });
    }
    
    await safeCall(updateDoc(docRef, {
      respuestas: [...currentRespuestas, replyObj],
      updatedAt: serverTimestamp()
    }));
  } catch(e) {
    console.warn("Respuesta guardada localmente. Firestore update diferido:", e?.message || e);
  }

  return replyObj;
};

export const deleteForoMessage = async (msgId) => {
  removeLocalForoMessage(msgId);
  try {
    const safeCall = (promise, ms = 2000) => {
      let t;
      const timeout = new Promise((_, reject) => {
        t = setTimeout(() => reject(new Error('Firestore timeout')), ms);
      });
      return Promise.race([promise, timeout]).finally(() => clearTimeout(t));
    };
    await safeCall(deleteDoc(doc(db, "foro", msgId)));
  } catch(e) {
    console.warn("Mensaje eliminado localmente. Firestore delete diferido:", e?.message || e);
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


// ==========================================
// CALIFICACIONES Y COMENTARIOS DE EXPERIENCIAS
// ==========================================

export const getCalificacionesPlan = (planId, planData = null) => {
  if (planData && Array.isArray(planData.calificaciones) && planData.calificaciones.length > 0) {
    return planData.calificaciones;
  }
  const localList = getLocalSavedPlans();
  const found = localList.find(p => p.id === planId);
  if (found && Array.isArray(found.calificaciones) && found.calificaciones.length > 0) {
    return found.calificaciones;
  }
  const storage = getAppStorage();
  if (storage) {
    try {
      const aux = storage.getItem(`inspiratec_calificaciones_${planId}`);
      if (aux) return JSON.parse(aux);
    } catch (_) {}
  }
  return [];
};

export const addCalificacionPlan = async (planId, calificacion) => {
  const nuevaCalificacion = {
    id: calificacion.id || `cal_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    usuarioId: calificacion.usuarioId || 'anon',
    usuarioNombre: calificacion.usuarioNombre || 'Docente Colega',
    usuarioRol: calificacion.usuarioRol || 'Docente',
    estrellas: Number(calificacion.estrellas) || 5,
    comentario: (calificacion.comentario || '').trim(),
    fecha: calificacion.fecha || new Date().toISOString()
  };

  const storage = getAppStorage();
  let updatedCalificaciones = [];

  // 1. Guardar en registro local persistente
  const localList = getLocalSavedPlans();
  const index = localList.findIndex(p => p.id === planId);
  if (index >= 0) {
    const prev = Array.isArray(localList[index].calificaciones) ? localList[index].calificaciones : [];
    const prevIdx = prev.findIndex(c => c.usuarioId === nuevaCalificacion.usuarioId && c.usuarioId !== 'anon');
    if (prevIdx >= 0) {
      prev[prevIdx] = nuevaCalificacion;
      updatedCalificaciones = [...prev];
    } else {
      updatedCalificaciones = [nuevaCalificacion, ...prev];
    }
    localList[index].calificaciones = updatedCalificaciones;
    if (storage) {
      try {
        storage.setItem(LOCAL_PLANS_KEY, JSON.stringify(localList));
      } catch (_) {}
    }
  } else {
    if (storage) {
      try {
        const auxKey = `inspiratec_calificaciones_${planId}`;
        const auxPrev = JSON.parse(storage.getItem(auxKey) || '[]');
        const prevIdx = auxPrev.findIndex(c => c.usuarioId === nuevaCalificacion.usuarioId && c.usuarioId !== 'anon');
        if (prevIdx >= 0) {
          auxPrev[prevIdx] = nuevaCalificacion;
          updatedCalificaciones = [...auxPrev];
        } else {
          updatedCalificaciones = [nuevaCalificacion, ...auxPrev];
        }
        storage.setItem(auxKey, JSON.stringify(updatedCalificaciones));
      } catch (_) {}
    }
  }

  // 2. Persistir en Firestore si el plan existe en la nube
  try {
    const planRef = doc(db, 'planes', planId);
    const snap = await getDoc(planRef);
    if (snap.exists()) {
      const data = snap.data();
      const prevCloud = Array.isArray(data.calificaciones) ? data.calificaciones : [];
      const prevIdx = prevCloud.findIndex(c => c.usuarioId === nuevaCalificacion.usuarioId && c.usuarioId !== 'anon');
      let cloudList = [];
      if (prevIdx >= 0) {
        prevCloud[prevIdx] = nuevaCalificacion;
        cloudList = [...prevCloud];
      } else {
        cloudList = [nuevaCalificacion, ...prevCloud];
      }
      await updateDoc(planRef, { calificaciones: cloudList });
      updatedCalificaciones = cloudList;
    }
  } catch (err) {
    console.warn('Calificación persistida localmente. Error en Firestore:', err);
  }

  return updatedCalificaciones;
};

export const deleteCalificacionPlan = async (planId, calificacionId) => {
  const storage = getAppStorage();
  let remaining = [];

  const localList = getLocalSavedPlans();
  const index = localList.findIndex(p => p.id === planId);
  if (index >= 0) {
    const prev = Array.isArray(localList[index].calificaciones) ? localList[index].calificaciones : [];
    remaining = prev.filter(c => c.id !== calificacionId);
    localList[index].calificaciones = remaining;
    if (storage) {
      try { storage.setItem(LOCAL_PLANS_KEY, JSON.stringify(localList)); } catch (_) {}
    }
  }

  if (storage) {
    try {
      const auxKey = `inspiratec_calificaciones_${planId}`;
      const auxPrev = JSON.parse(storage.getItem(auxKey) || '[]');
      remaining = auxPrev.filter(c => c.id !== calificacionId);
      storage.setItem(auxKey, JSON.stringify(remaining));
    } catch (_) {}
  }

  try {
    const planRef = doc(db, 'planes', planId);
    const snap = await getDoc(planRef);
    if (snap.exists()) {
      const data = snap.data();
      const prevCloud = Array.isArray(data.calificaciones) ? data.calificaciones : [];
      const newCloud = prevCloud.filter(c => c.id !== calificacionId);
      await updateDoc(planRef, { calificaciones: newCloud });
      remaining = newCloud;
    }
  } catch (err) {
    console.warn('Eliminación persistida localmente:', err);
  }

  return remaining;
};
