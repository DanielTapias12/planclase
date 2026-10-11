# INSPIRATEC — Documentación Técnica de Actualización Visual y Sistema de Modales

**Fecha de Actualización:** Octubre 2026  
**Proyecto:** INSPIRATEC — Software Educativo para la Planeación Curricular y Generación de Instrumentos Didácticos  
**Equipo:** Grupo 2 — Licenciatura en Informática / Diseño y Desarrollo de Software Educativo III, Universidad de Córdoba  

---

## 1. Resumen Ejecutivo de Cambios

En esta fase de evolución del proyecto se refinó la experiencia de usuario (UX/UI), consolidando un lenguaje visual institucional basado en **Glassmorphism (vidrio esmerilado translúcido)**, fondos ambientales fotográficos de alta resolución y un sistema unificado y accesible para todas las ventanas emergentes (modales, popovers y diálogos de confirmación) de la plataforma.

---

## 2. Mejoras Específicas Realizadas

### 2.1. Barra Superior y Menú de Usuario (Armonización Asimétrica)
- **Eliminación del recuadro interior del usuario:** Se eliminó el fondo blanco sólido y el borde tosco que enmarcaba al botón de usuario en la barra superior.
- **Asimetría elegante:** Ahora el botón del usuario (`Admin` / `Docente`) se apoya orgánicamente sobre la cápsula translúcida común mediante la clase `.user-menu-btn`, integrando un avatar circular de 28px con tipografía de 13px (`font-weight: 600`, `#1E3D37`) y hover sutil, emparejándose con el estilo de **Configuración IA**.

### 2.2. Sistema Unificado de Ventanas Emergentes (`.modal-glass-*`)
Se creó una arquitectura modular de clases CSS en `src/index.css`:
- `.modal-glass-backdrop`: Fondo oscuro inmersivo (`rgba(14, 38, 33, 0.72)` a `rgba(8, 20, 18, 0.82)`) con desenfoque de 14px.
- `.modal-glass-card`: Tarjetas translúcidas con desenfoque de 30px (`backdrop-filter: blur(30px) saturate(140%)`), bordes de luz blanca sutil (`1px solid rgba(255, 255, 255, 0.95)`), esquinas redondeadas de 24px y sombras volumétricas.
- `.modal-glass-header` y `.modal-glass-footer`: Cabecera y pie con fondos esmerilados y líneas divisorias translúcidas casi imperceptibles.
- `.modal-glass-close-btn`: Botón de cierre ergonómico con micro-interacciones hover y soporte accesible para tecla `Escape`.
- **Bloqueo de scroll:** Todos los modales implementan bloqueo automático del scroll de fondo (`overflow: hidden` en `document.body`) mientras están visibles.

### 2.3. Migración de Modales en Toda la Plataforma
1. **Menú de Usuario / Popover (`UserMenu.jsx`):** Rediseñado con `.user-menu-popover-glass` y `.user-menu-item-glass`.
2. **Modal Mi Perfil (`UserMenu.jsx`):** Presentación elegante de datos docentes y rol.
3. **Modal Cambiar Contraseña (`UserMenu.jsx`):** Inputs de cristal con botones para mostrar/ocultar contraseñas (`Eye` / `EyeOff`), validación en tiempo real y retroalimentación inmediata.
4. **Modal de Términos y Condiciones (`TermsAndConditionsModal.jsx`):** Migración completa al sistema de cristal, montado mediante `createPortal` en `document.body`.
5. **Modal de Esquema Pedagógico en Plantillas (`PlantillasPage.jsx`):** Tarjeta de cristal con desglose visual de los 3 Momentos Didácticos (Inicio, Desarrollo, Cierre), Principios DUA y Evaluación Formativa.
6. **Modal de Previsualización en Biblioteca Comunitaria (`BibliotecaPage.jsx`):** Visor Markdown enriquecido con badges de grado/materia y clonación directa.
7. **Modal de Detalle Docente en Administración (`AdministracionPage.jsx`):** Visualización clara de datos docentes, estado de Habeas Data y métricas.
8. **Modal de Material Complementario en Editor (`EditorPage.jsx`):** Visor HTML interactivo integrado al sistema de cabeceras esmeriladas.

### 2.4. Componente Reutilizable de Confirmación Destructiva (`ConfirmModal.jsx`)
- Se creó `src/components/ConfirmModal.jsx` para erradicar las alertas nativas grises del navegador (`window.confirm`).
- Integrado con feedback claro y botón de confirmación en:
  - **Mis Planes (`MisPlanesPage.jsx`):** Al eliminar planes de clase.
  - **Plantillas (`PlantillasPage.jsx`):** Al eliminar estructuras personalizadas.
  - **Experiencias (`ExperienciasPage.jsx`):** Al eliminar experiencias sistematizadas.

### 2.5. Corrección de Contraste y Legibilidad en «Acerca de» (`AboutPage.jsx`)
- Se identificó que el texto del encabezado "El Equipo Creador" y su subtítulo institucional carecían de fondo protector sobre la imagen fotográfica exterior de fondo.
- Se envolvió la sección en una tarjeta translúcida de alto contraste (`.mgmt-card` con `backdrop-filter: blur(20px)`), garantizando una legibilidad óptima al 100% y agregando el distintivo institucional `Talento Unicordobés`.

### 2.6. Pantalla Intermedia de Carga Cinematográfica (`WizardPage.jsx` y `EditorPage.jsx`)
- Overlay inmersivo con spinner pulsante, textos reflexivos sobre co-docencia y barra de progreso durante la consulta y generación de secuencias con el motor Google Gemini.

---

## 3. Estado de Compilación y Validación
- **Vite Build:** Compilación limpia verificada con `pnpm run build` sin errores de módulos ni dependencias rotas.
- **Seguridad:** Los datos sensibles de contacto docente continúan protegidos con cifrado y persistencia validada en Firebase.
