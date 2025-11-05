import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp, collection, addDoc } from "firebase/firestore";

// ------------------------------------------------------------------
// ATENCIÓN: REEMPLAZA ESTO CON LA CONFIGURACIÓN DE TU PROYECTO FIREBASE
// ------------------------------------------------------------------
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto (o selecciona uno existente).
// 3. En la vista general del proyecto, haz clic en el icono </> para añadir una app web.
// 4. Sigue los pasos y Firebase te dará un objeto `firebaseConfig`.
// 5. Copia y pega los valores aquí abajo.
// ¡NUNCA compartas este archivo públicamente si contiene claves reales!
// Para este proyecto de demostración, está bien, pero para producción
// se usan variables de entorno.
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:xxxxxxxxxxxxxxxxx"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportamos las funciones que usaremos para que no haya que importarlas en cada componente
export { db, collection, addDoc, serverTimestamp };
