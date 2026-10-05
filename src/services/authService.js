import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { useAppStore } from '../store/useAppStore';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const initAuth = () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      useAppStore.getState().setUserId(user.uid);
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let profile = userDoc.exists() ? userDoc.data() : { nombre: 'Docente', rol: 'Docente' };
        
        // Usar el correo directamente de la autenticación de Firebase
        profile.email = user.email || profile.email || '';

        // Forzar y corregir rol admin si el correo coincide
        const normalizedEmail = profile.email.toLowerCase().trim();
        if (normalizedEmail === 'danieltapiasacosta39@gmail.com') {
          profile.rol = 'Admin';
          // Intentar actualizar en DB si no estaba
          if (!userDoc.exists() || userDoc.data()?.rol !== 'Admin') {
            await setDoc(doc(db, 'users', user.uid), { rol: 'Admin', email: profile.email }, { merge: true });
          }
        }
        
        useAppStore.getState().setUserProfile(profile);
      } catch(e) {
        console.error("Error loading profile", e);
      }
    } else {
      useAppStore.getState().setUserId(null);
      useAppStore.getState().setUserProfile(null);
    }
  });
};

export const registerUser = async (nombre, institucion, nivel, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  const profileData = {
    nombre,
    institucion,
    nivel,
    email,
    rol: 'Docente'
  };
  await setDoc(doc(db, 'users', user.uid), profileData);
  return user;
};

export const loginUser = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

// Función para inicializar el admin solicitado
export const initAdminAccount = async () => {
  const adminEmail = 'Danieltapiasacosta39@gmail.com';
  const adminPass = '1234567890';
  try {
    await loginUser(adminEmail, adminPass);
    console.log("Admin ya existe y se ha logueado.");
  } catch (error) {
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      try {
        await registerUser("Daniel Tapias (Admin)", "INSPIRATEC", "Media", adminEmail, adminPass);
        await setDoc(doc(db, 'users', auth.currentUser.uid), { rol: 'Admin' }, { merge: true });
        console.log("Admin account created successfully.");
      } catch(e) {
        console.log("Could not create admin:", e);
      }
    }
  }
};
