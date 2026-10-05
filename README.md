# Inspiracte

> **Plataforma Educativa para la Planeación Curricular y Generación de Instrumentos Didácticos**

Inspiracte es una plataforma web orientada a docentes, diseñada para asistir en el diseño, estructuración y generación automatizada de secuencias didácticas completas, utilizando Inteligencia Artificial (Google Gemini) bajo los estándares curriculares del Ministerio de Educación Nacional de Colombia.

---

## 1. Tecnologías Utilizadas

* **Frontend:** React 19, React Router v7, Zustand, Framer Motion, Lucide React, React Markdown, Vite.
* **Backend/BaaS:** Firebase (Auth, Firestore).
* **Inteligencia Artificial:** API REST de Google Gemini (gemini-3.8-flash) para la sugerencia de propósitos, estándares (MEN Guía 30), generación de planes de clase y material complementario (rúbricas, cuestionarios, flashcards, juegos de roles, sopas de letras, etc.).

---

## 2. Equipo de Desarrollo — Grupo 2

| Integrante | Rol Scrum | Responsabilidades Principales |
|---|---|---|
| **Zoe Peñata** | Scrum Master | Coordinación del proceso Scrum, gestión de tiempos y seguimiento a compromisos |
| **María Soto** | Product Owner | Definición y priorización del backlog y pertinencia didáctica del producto |
| **María Ubarne** | Product Owner | Validación de requerimientos pedagógicos y articulación curricular |
| **Luis Caldera** | Development Team | Desarrollo frontend, diseño y maquetación de interfaces interactivas (UI/UX) |
| **Daniel Tapias** | Development Team | Desarrollo frontend, gestión técnica del repositorio Git y control de versiones |
| **Maira Ortega** | Development Team | Desarrollo, validación funcional de la plataforma y seguimiento a actividades |

Consulte el detalle completo de responsabilidades en [docs/proyecto/EQUIPO_Y_ROLES.md](docs/proyecto/EQUIPO_Y_ROLES.md).

---

## 3. Metodología de Trabajo

El proyecto articula dos marcos complementarios:

* **SCRUM (Marco de Gestión y Desarrollo):** Gobierna la dinámica de trabajo en equipo, roles oficiales, planificación de Sprints, bitácoras de campo y monitoreo semanal de entregables.
* **MODESEC (Marco Orientador de Diseño Educativo):** Modela la fundamentación didáctica del software educativo (necesidad educativa, competencias MEN Guía 30, indicadores en rúbricas, diseño pedagógico y accesibilidad DUA).

Consulte la fundamentación completa en [docs/proyecto/METODOLOGIA.md](docs/proyecto/METODOLOGIA.md).

---

## 4. Instalación y Ejecución

### Prerrequisitos
* Node.js (v18+)

### Pasos
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Ejecutar entorno de desarrollo:
   ```bash
   npm run dev
   ```
