/* ============================================================
   Los 4 Fantásticos — Configuración de Firebase
   ============================================================

   1. Crea un proyecto en https://console.firebase.google.com
   2. Agrega una app Web (</>) y copia el objeto firebaseConfig.
   3. Pega aquí abajo los valores REALES (reemplaza los "TU_...").

   Nota: estas claves son públicas por diseño (van en el navegador).
   La seguridad de los datos se controla con las Reglas de Firestore,
   no ocultando esta config.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBCkkk3Y7p1KSiwU8Q1GK0KzXiolBfCDus",
  authDomain: "baseproyectos4f.firebaseapp.com",
  projectId: "baseproyectos4f",
  storageBucket: "baseproyectos4f.firebasestorage.app",
  messagingSenderId: "1022421747312",
  appId: "1:1022421747312:web:50f4197cfd27eef9a256b5",
};

const app = initializeApp(firebaseConfig);

// Instancia de la base de datos Firestore, lista para usar en projects.js
export const db = getFirestore(app);
