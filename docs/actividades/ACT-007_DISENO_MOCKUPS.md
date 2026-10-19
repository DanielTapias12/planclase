# ACT-007 — Diseñar Mockups de Alta Fidelidad

## 1. Información General
- **ID de la Actividad:** ACT-007 (Actividad 5 del Plan de Trabajo)
- **Nombre Oficial:** Diseñar Mockups de Alta Fidelidad
- **Semana de Ejecución:** Semana 3 / Semana 10 (Consolidación)
- **Prioridad:** Muy Alta
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial) y Principios de Interacción de Theo Mandel
- **Ubicación de Entregables:** `docs/diseno-interface/mockups/`

---

## 2. Objetivo y Justificación

### Objetivo General
Diseñar y formalizar los mockups de alta fidelidad correspondientes a las vistas neurálgicas del software educativo INSPIRATEC, definiendo su paleta cromática, jerarquía tipográfica, iconografía, componentes de botón, distribución espacial y flujos de acción del usuario, garantizando el estricto cumplimiento de las tres reglas de oro de Theo Mandel.

### Justificación Técnica
Los mockups de alta fidelidad cierran la brecha entre el modelo conceptual (diagramas de contenido y mapas de navegación) y la implementación interactiva en código fuente. Permiten al equipo multidisciplinar auditar la ergonomía de la interfaz, el contraste cromático para docentes con fatiga visual y la disposición intuitiva de los controles pedagógicos antes del despliegue masivo en aula.

---

## 3. Participantes y Roles Scrum

| Participante | Rol Scrum Oficial | Contribución Específica en ACT-007 |
|---|---|---|
| **Luis Caldera** | Development Team / UI-UX Lead | Diseño y refinamiento de la estética Glassmorphism 2026, paleta cromática y maquetación de los 4 mockups de alta fidelidad. |
| **Daniel Tapias** | Development Team / Git Lead | Verificación de viabilidad técnica en React/Vite, exportación de capturas de alta resolución y trazabilidad de estilos en CSS. |
| **María Soto** | Product Owner | Aseguramiento de que el mockup de resultados y actividad refleje los tres momentos de clase exigidos por la Guía 30 del MEN. |
| **María Ubarne** | Product Owner Support | Validación de la accesibilidad cognitiva y apoyos DUA representados en los mockups. |
| **Zoe Peñata** | Scrum Master | Verificación del cumplimiento de los requisitos de la Semana 03 y alineación con las tres reglas de Theo Mandel. |
| **Maira Ortega** | Facilitadora de Equipo | Auditoría de la carga de memoria visual y consistencia de espaciados en la cuadrícula. |

---

## 4. Productos y Mockups Entregados

Los 6 mockups de alta fidelidad requeridos fueron archivados en `docs/diseno-interface/mockups/`:

1. **`mockup-inicio.png`:** Ventana de Inicio (`/home`), bienvenida personalizada, indicadores de estado y modelos.
2. **`mockup-planificador.png`:** Planificador de Clases (`/`), asistente secuencial en 4 fases tripartitas con memoria de ADN pedagógico.
3. **`mockup-grafo-prerrequisitos.png`:** Grafo Interactivo de Prerrequisitos Curriculares (MEN), red ontológica de competencias por ciclos de grado de 1° a 11°.
4. **`mockup-dashboard.png`:** Panel y Repositorio de Mis Planes de Clase (`/mis-planes`), búsqueda en tiempo real, filtros y gestión de secuencias.
5. **`mockup-actividad.png`:** Catálogo de Estructuras y Modelos Curriculares (`/plantillas`), transferencia al asistente e inspección de plantillas.
6. **`mockup-resultados.png`:** Editor Curricular y Asistente Socrático (`/editor`), lienzo de trabajo con plan generado y panel de co-diseño con IA.

---

## 5. Evaluación de las Tres Reglas de Oro de Theo Mandel

1. **Dar el Control al Usuario:**
   - Soberanía pedagógica en la generación de secuencias.
   - Guardado de borradores intermedios y navegación no lineal reversible.
   - Cuadros de confirmación modal (`ConfirmModal.jsx`) para acciones destructivas.
2. **Reducir la Carga de Memoria:**
   - Reconocimiento antes que recuerdo mediante selectores curriculares estructurados (MEN / DBA / DUA).
   - Metadatos directos y explícitos en cada tarjeta de la interfaz sin necesidad de abrir archivos.
   - Stepper visual visible en el planificador que indica el avance secuencial.
3. **Mantener Consistencia Visual:**
   - Paleta corporativa de marca: Verde salvia (`#477A72`) y petróleo (`#142B25`, `#183630`).
   - Tipografía dual armónica: `Lora` (serif para encabezados) y `DM Sans` (sans-serif para lectura y controles).
   - Tratamientos Glassmorphism canónicos de alto contraste (`rgba(255, 254, 250, 0.86)` con `backdrop-filter: blur(16px)`).
