/* ============================================================
   Los 4 Fantásticos — Carga de proyectos desde Firestore
   ============================================================

   Lee los documentos de la colección "proyectos" y genera una
   tarjeta por cada uno dentro del carrusel.

   Campos esperados en cada documento (por ahora):
     - nombre_proyecto : string
     - descripcion     : string
     - url_imagen       : string  (URL pública de la imagen en Supabase)

   Para agregar más campos en el futuro, basta con leerlos en
   buildCard() y mostrarlos donde quieras.
   ============================================================ */

import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Nombre de la colección en Firestore.
const COLLECTION = "proyectos";

/**
 * Escapa texto para insertarlo de forma segura como contenido HTML.
 */
function escapeHTML(value) {
  return String(value == null ? "" : value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Construye el <li> de una tarjeta de proyecto a partir de los datos.
 */
function buildCard(data) {
  const nombre = escapeHTML(data.nombre_proyecto);
  const descripcion = escapeHTML(data.descripcion);
  const urlImagen = escapeHTML(data.url_imagen);

  const li = document.createElement("li");
  li.className = "project-card";
  li.innerHTML = `
    <div class="project-card__media">
      <img src="${urlImagen}" alt="Imagen del proyecto ${nombre}" data-img="project" />
      <div class="project-card__placeholder">
        <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true">
          <path fill="currentColor" d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 11l2.5 3.01L14.5 9.5l4.5 6H5l3.5-4.5z"/>
        </svg>
        <span>Imagen del proyecto</span>
      </div>
    </div>
    <div class="project-card__body">
      <h3 class="project-card__title">${nombre}</h3>
      <p class="project-card__desc">${descripcion}</p>
    </div>
  `;
  return li;
}

/**
 * Muestra un mensaje (cargando / vacío / error) en el carrusel.
 */
function showState(track, message) {
  track.innerHTML = `<li class="carousel__state" data-projects-state>${escapeHTML(
    message
  )}</li>`;
}

/**
 * Lee los proyectos desde Firestore y los renderiza en el carrusel.
 */
async function loadProjects() {
  const track = document.querySelector("[data-carousel-track]");
  if (!track) return;

  try {
    const snapshot = await getDocs(collection(db, COLLECTION));

    if (snapshot.empty) {
      showState(track, "Aún no hay proyectos para mostrar.");
      return;
    }

    // Vaciar el estado de "Cargando…" y construir las tarjetas.
    track.innerHTML = "";
    snapshot.forEach(function (doc) {
      track.appendChild(buildCard(doc.data()));
    });

    // Reactivar el control de placeholders en las imágenes nuevas
    // e inicializar el carrusel ahora que ya hay tarjetas.
    if (window.L4F) {
      window.L4F.initImages(track);
      window.L4F.initCarousels();
    }
  } catch (error) {
    console.error("Error al cargar los proyectos desde Firebase:", error);
    showState(track, "No se pudieron cargar los proyectos. Intenta más tarde.");
  }
}

document.addEventListener("DOMContentLoaded", loadProjects);
