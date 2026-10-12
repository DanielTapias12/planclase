# ACT-015 — Validar Usabilidad y Accesibilidad (DUA)

## 1. Información General
- **ID de la Actividad:** ACT-015
- **Nombre:** Validar Usabilidad y Accesibilidad (DUA)
- **Semana de Ejecución:** Semana 5 y 6
- **Estado:** EN PROCESO

## 2. Participación del Equipo
- **Daniel Tapias (Desarrollador / Frontend):** Refactorización técnica de accesibilidad, captura accesible de teclado, traps de foco y semántica HTML5 (Participación verificada).
- **Luis Caldera (Desarrollador / Frontend):** Diseño de contrastes, legibilidad tipográfica en paneles esmerilados y diseño centrado en el usuario (Participación verificada).
- **Zoe Peñata, Maira Ortega, María Soto, María Ubarne:** Validación pedagógica del Diseño Universal para el Aprendizaje (DUA), principios PIAR y reducción de sobrecarga cognitiva en docentes (Participación reportada).

## 3. Avances Reales y Rectificación de Estado

### IMPLEMENTADO Y VERIFICADO EN CÓDIGO
- **Diseño Universal para el Aprendizaje (DUA) en Secuencias Didácticas:**
  - Integración en el Wizard de planificación (Paso 4) de opciones específicas para ajustes razonables (PIAR), adaptando la secuencia didáctica para estudiantes con discapacidad visual, auditiva, motora o neurodiversidad.
- **Accesibilidad en Paneles Translúcidos (Glassmorphism):**
  - Aseguramiento de niveles de contraste cromático superiores al ratio WCAG AA sobre fondos ambientales mediante el uso de tarjetas de cristal con desenfoque de 20-30px y tipografías en tonos oscuros sólidos (`#1E3D37`, `#0E2621`).
- **Navegación Semántica y Estructura Accesible:**
  - Empleo de elementos semánticos HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) y atributos de accesibilidad (`aria-label`, `aria-expanded`, `role="dialog"`).
- **Gestión Accesible de Ventanas Emergentes:**
  - Cierre ergonómico mediante la tecla `Escape`, botón de cierre enfocado y bloqueo de scroll (`overflow: hidden`) para evitar desorientación durante la interacción con modales montados por portal.

### EN PROCESO DE EVALUACIÓN Y PRUEBAS CONTINUAS
- Aplicación formal de la Escala de Usabilidad del Sistema (SUS) a una muestra de docentes.
- Ejecución de auditorías automáticas de accesibilidad mediante Lighthouse y Axe Core.
- Pruebas con tecnologías de asistencia y lectores de pantalla (NVDA / TalkBack).

## 4. Integración de IA
- Asistencia en la generación de recomendaciones DUA dentro de los planes generados algorítmicamente por el motor de IA.

## 5. Evaluación Académica
- Cumplimiento: 3 — Adecuado
- Calidad: 4 — Consolidado
- Evidencia: 4 — Consolidado
- Documentación: 4 — Consolidado
- Responsabilidad: 4 — Consolidado
- Coherencia: 4 — Consolidado
