# ACT-010 — Elaboración del Guion Técnico Multimedial

## 1. Información General
- **ID de la Actividad:** ACT-010 (Actividad 8 del Cronograma de Trabajo)
- **Nombre Oficial:** Elaboración del Guion Técnico Multimedial
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación)
- **Prioridad:** Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial)
- **Producto Esperado:** `GUION_TECNICO_MULTIMEDIAL.md` en la raíz del proyecto y en `docs/diseno-multimedial/`.

---

## 2. Objetivo y Justificación

### Objetivo General
Elaborar el **Guion Técnico Multimedial integral de INSPIRATEC**, documentando la totalidad de la aplicación ventana por ventana, desde la pantalla inicial hasta el último módulo funcional y cuadro de diálogo modal, basándose estrictamente en el código fuente implementado, las hojas de estilo vigentes y la ejecución en vivo del software.

### Justificación Técnica
Bajo el marco de ingeniería de software educativo y la metodología MODESEC, el guion técnico multimedial formaliza el inventario completo de componentes gráficos, recursos sonoros, visuales, de animación y de interacción, asegurando la trazabilidad de cada botón, campo, evento (`onClick`, `onChange`, `onSubmit`) y acción del sistema, garantizando que el diseño implementado responda fielmente a las especificaciones curriculares y de accesibilidad DUA.

---

## 3. Responsables y Participantes

| Integrante | Rol Scrum Oficial | Contribución Específica en ACT-010 |
|---|---|---|
| **Daniel Tapias** | Development Team / Git Lead | Auditoría integral del código en `src/`, mapeo de eventos, rutas en `App.jsx`, tokens CSS y generación del documento maestro. |
| **Luis Caldera** | Development Team / UI-UX Lead | Levantamiento fotográfico de capturas reales de la interfaz Glassmorphism y validación de componentes de interacción. |
| **María Soto** | Product Owner | Verificación de coherencia entre los elementos técnicos del planificador y los lineamientos de la Guía 30 del MEN. |
| **María Ubarne** | Product Owner Support | Auditoría de componentes DUA en el editor y accesibilidad por voz (Web Speech API) en la biblioteca de materiales. |
| **Zoe Peñata** | Scrum Master | Control de calidad del formato institucional de 6 columnas y verificación de exhaustividad de las 15 ventanas. |
| **Maira Ortega** | Facilitadora de Equipo | Revisión de legibilidad tipográfica (Lora/DM Sans), flujos de navegación y trazabilidad de modales. |

---

## 4. Estructura y Entregables Generados

- **Documento Maestro en la Raíz:** [`GUION_TECNICO_MULTIMEDIAL.md`](../../GUION_TECNICO_MULTIMEDIAL.md)
- **Copia de Respaldo Institucional:** [`docs/diseno-multimedial/GUION_TECNICO_MULTIMEDIAL.md`](../diseno-multimedial/GUION_TECNICO_MULTIMEDIAL.md)
- **Carpeta de Evidencias y Capturas Reales:** `docs/evidencias/ACT-010/`
  - `V01_inicio.png` (Ventana de Inicio)
  - `V02_planificador.png` (Planificador de Clases)
  - `V03_editor.png` (Editor Curricular y Co-docente IA)
  - `V04_mis_planes.png` (Mis Planes Guardados)
  - `V06_plantillas.png` (Plantillas Curriculares)
  - `V07_biblioteca.png` (Biblioteca de Recursos y Generador)
  - `V10_configuracion.png` (Configuración de IA Gemini)
