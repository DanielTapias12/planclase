# ACT-015 — Validar Usabilidad y Accesibilidad (DUA)

## 1. Información General
- **ID de la Actividad:** ACT-015
- **Nombre:** Validar Usabilidad y Accesibilidad (DUA)
- **Semana de Ejecución:** Semana 5 y 6
- **Estado:** EN PROCESO

## 2. Participación del Equipo
- **Daniel Tapias (Desarrollador / Frontend):** Refactorización técnica de accesibilidad, ARIA y menús semánticos (Participación verificada).
- **Luis Caldera (Desarrollador / Frontend):** Diseño de contrastes, UX y legibilidad visual (Participación verificada).
- **Zoe Peñata, Maira Ortega, María Soto, María Ubarne:** Revisión pedagógica de principios DUA y carga cognitiva (Participación reportada).

## 3. Avances Reales Consolidados
Esta actividad agrupa la implementación de pautas de accesibilidad y el Diseño Universal para el Aprendizaje (DUA) en el frontend.

### IMPLEMENTADO Y VERIFICADO FUNCIONALMENTE
- **Navegación Semántica:** Sustitución de contenedores `div` genéricos por `<nav>` en menús principales (Commit `3e344d4`).
- **Modal de Inclusión DUA:** Panel interactivo para ajuste de tamaño de fuente, contraste y preferencias visuales (Commit `e3d6675`).
- **Soporte de Teclado y ARIA:** Refactorización del dropdown DUA para navegación con tabulador (`Tab`), cierre con `Escape` y estados dinámicos `aria-expanded` y `aria-label` en botones interactivos (Commit `99b056c`).
- **Contraste y Tamaños de Texto:** Implementación de variables CSS reactivas a la configuración DUA establecida por el usuario.

### PENDIENTE DE VALIDACIÓN / PROPUESTO
- Pruebas estrictas del escalado de fuente en dispositivos móviles.
- Validación con lectores de pantalla reales (Screen Readers).
- Auditoría Lighthouse integral.

*Nota: No se afirma cumplimiento total de accesibilidad web (WCAG) sin realizar pruebas exhaustivas y herramientas de auditoría certificadas.*

## 4. Integración de IA
- Uso de IA para la validación: no verificable con la evidencia disponible de forma explícita en registros.

## 5. Evaluación Académica
- Cumplimiento: 3 - Adecuado
- Calidad: 4 - Consolidado
- Evidencia: 4 - Consolidado
- Documentación: 4 - Consolidado
- Responsabilidad: 4 - Consolidado
- Coherencia: 4 - Consolidado
