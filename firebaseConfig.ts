import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ##################################################################
// #                                                                #
// #     ¡ACCIÓN REQUERIDA! REEMPLAZA ESTO CON TU CONFIGURACIÓN     #
// #                                                                #
// ##################################################################
//
// 1. Ve a la consola de Firebase: https://console.firebase.google.com/
// 2. Crea un nuevo proyecto (o selecciona el que ya tienes).
// 3. En la vista general de tu proyecto, busca y haz clic en el ícono </> (Añadir aplicación web).
// 4. Dale un nombre a tu app y sigue los pasos que te indica Firebase.
// 5. Al final, Firebase te mostrará un objeto de configuración llamado `firebaseConfig`.
// 6. Copia TODO ese objeto y pégalo aquí abajo, reemplazando el objeto de ejemplo.
//
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX", // <-- REEMPLAZAR
  authDomain: "your-project-id.firebaseapp.com", // <-- REEMPLAZAR
  projectId: "your-project-id", // <-- REEMPLAZAR
  storageBucket: "your-project-id.appspot.com", // <-- REEMPLAZAR
  messagingSenderId: "123456789012", // <-- REEMPLAZAR
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxx" // <-- REEMPLAZAR
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos solo la instancia de la DB y la config.
// Las funciones como collection, addDoc, serverTimestamp, etc.,
// deben ser importadas directamente desde 'firebase/firestore' en cada
// componente para evitar errores de referencia circular.
export { db, firebaseConfig };