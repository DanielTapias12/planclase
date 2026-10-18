# Diario de Campo — Semana Actual (Semana 10)

## Información General
- **Participantes:** Zoe Peñata (Scrum Master), María Soto (PO), María Ubarne (PO Support), Maira Ortega (Facilitadora), Luis Caldera (Frontend / UI-UX Lead), Daniel Tapias (Frontend / Git Lead).
- **Fecha:** 16 de Octubre de 2026.
- **Ciclo:** Semana 10 — Verificación Heurística, Ergonómica y de Patrones del Frontend (Fase III MODESEC / Pressman & Maxim).
- **Actividad Central:** ACT-017 — Lista de Chequeo para la Verificación del Frontend: UX, Movilidad y Patrones de Diseño.

---

## Registro del Trabajo Colaborativo Realizado

### 1. Ejecución de la Lista de Chequeo Oficial (ACT-017)
- Se aplicó rigurosamente la lista de chequeo basada en los Capítulos 12, 13 y 14 de Pressman & Maxim (9na Edición).
- Se auditaron 16 criterios formales en código y ejecución:
  - **Capítulo 12 (UX Design):** Planos de Garrett, Reglas de Mandel, Modelado de Personas, Tognazzini, Accesibilidad WCAG (POUR) y Métricas SUS.
  - **Capítulo 13 (Design for Mobility):** Pirámide Móvil/Web, Ergonomía de la Thumb Zone, Sensibilidad al Contexto y Resiliencia de Red.
  - **Capítulo 14 (Pattern-Based UI):** Desacoplamiento MVC/Componentes, Patrones de Navegación de van Welie/Tidwell, Patrones de Entrada y Prevención de Antipatrones (The Blob, Mystery Meat, Modal Hell).
- **Resultado Consolidado:** **22 / 32 puntos (68.75%)**, clasificado como *Básico con Observaciones*.
- Se documentó el informe completo en `docs/actividades/ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md`.

### 2. Hallazgos Críticos y Backlog de Remediación
- **Sustitución de Alertas Nativas:** Se identificó el uso de `alert()` en `WizardPage.jsx` y otras vistas; se priorizó su reemplazo por *Inline Validation* reactiva.
- **Persistencia del Borrador del Wizard:** Se acordó corregir el hook de montaje en `WizardPage.jsx` para evitar el reseteo involuntario de formularios.
- **Antipatrón The Blob:** Se programó la modularización de componentes extensos (> 1.000 líneas) en subcomponentes atómicos.
- **Navegación por Teclado y Foco:** Se detectó la falta de `:focus-visible` debido a reglas con `outline: none;`. Se definió una regla global accesible.
- **Integración de Breadcrumbs y Zona del Pulgar:** Se programó el montaje del componente `Breadcrumbs.jsx` y la creación de una barra fija inferior para móvil.

### 3. Matriz de los 7 Hábitos de Covey en ACT-017
- Se actualizó `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md` incorporando la sección 5.11 con el registro de aplicación de hábitos de los 6 participantes:
  - Daniel Tapias: H1 (Proactividad) y H7 (Afilar la Sierra).
  - Luis Caldera: H2 (Fin en Mente) y H5 (Primero Comprender).
  - Zoe Peñata: H3 (Primero lo Primero) y H6 (Sinergizar).
  - Maira Ortega: H4 (Ganar-Ganar) y H5 (Primero Comprender).
  - María Soto: H2 (Fin en Mente) y H4 (Ganar-Ganar).
  - María Ubarne: H5 (Primero Comprender) y H6 (Sinergizar).

---

## Registro de Uso de Inteligencia Artificial (ROCAS)
- Se formalizó la ficha técnica en `docs/ia/REGISTRO_IA_ACT-017.md` y `docs/ia/REGISTRO_IA_ACT-018.md`, actualizando `docs/ia/REGISTRO_USO_IA.md` bajo el marco ROCAS (Rol, Objetivo, Contexto, Acción, Salida y Validación Humana).

---

### 4. Ejecución de la Lista de Chequeo de Sistemas Tutores Inteligentes (ACT-018)
- Se contrastó el frontend de INSPIRATEC con la investigación doctoral del Dr. Manuel Fernando Caro Piñeres (Universidad Nacional de Colombia, 2015).
- Se auditaron 12 criterios organizados en:
  - **Bloque 1 (4 Módulos Canónicos de Wenger/Caro):** Dominio (MEN/DBA), Estudiante/Overlay (DUA/PIAR y estados de planes), Tutor (tácticas didácticas y temporalización) e Interfaz Ergonómica (*Warm Glassmorphism*).
  - **Bloque 2 (5 Características de Tutoría Inteligente):** Multimodalidad (prosa vs recursos interactivos 3D), Navegación adaptativa (secuencial vs global con breadcrumbs), Andamiaje graduado en 3 niveles, Curaduría resiliente de modelos IA y Replanificación en caliente.
  - **Bloque 3 (Metacognición y Prototipo FUNPRO):** Doble Lazo de Razonamiento (*Double-Loop Architecture*), Juicios Metacognitivos (certeza y metamemoria) y Agencia Compartida (*Shared Agency*).
- **Resultado Consolidado:** **24 / 24 puntos (100%)**, catalogado como *Sobresaliente / Certificación de Sistema Tutor Inteligente Aprobada*.
- Se documentó el informe completo en `docs/actividades/ACT-018_LISTA_CHEQUEO_STI_CARO.md`.

---

### 5. Elaboración del Guion Didáctico Integral (ACT-011)
- Se desarrolló formalmente el Guion Didáctico institucional de INSPIRATEC, estructurado en los 10 apartados obligatorios y respondiendo a la pregunta central formativa: *¿Qué aprenderá el usuario mediante este software, cómo lo aprenderá y qué evidencias permitirán reconocer ese aprendizaje?*.
- Se realizó una auditoría integral del código fuente (`src/`) para sustentar cada apartado con evidencias de funcionamiento real (Wizard de 4 pasos, editor interactivo, generador de quizzes, flashcards, diapositivas y soporte DUA/PIAR), diferenciando capacidades existentes de propuestas futuras.
- Se documentó el producto oficial en [`docs/pedagogia/GUION_DIDACTICO.md`](../pedagogia/GUION_DIDACTICO.md) y [`GUION_DIDACTICO.md`](../../GUION_DIDACTICO.md) en la raíz.
- Se registró el uso de IA bajo el marco ROCAS en `docs/ia/REGISTRO_IA_ACT-011.md` y se actualizó la matriz de hábitos en `docs/actividades/ACT-016_ANALISIS_7_HABITOS_INSPIRATEC.md` (Sección 5.12).

---

### 6. Diseño de la Guía de Metáforas MODESEC (ACT-012)
- Se elaboró la Guía de Metáforas oficial de INSPIRATEC bajo la directriz de fidelidad estricta al software existente, sin inventar ni reinterpretar elementos visuales.
- Se auditaron e inventariaron 30 elementos gráficos reales en la tabla institucional de 3 columnas (Nombre, Imagen, Descripción).
- Se extrajeron 33 archivos vectoriales SVG originales de `node_modules/lucide-react/dist/esm/icons/` a `docs/diseno-multimedial/iconos/`, garantizando una representación gráfica 100% fidedigna.
- Se fundamentó la metáfora instrumental del «Taller de Co-Creación del Arquitecto Curricular» en sus tres dimensiones: metáfora visual, representación visual y función operativa.
- Se formalizó el entregable en [`docs/diseno-multimedial/GUIA_DE_METAFORAS.md`](../diseno-multimedial/GUIA_DE_METAFORAS.md) y [`GUIA_DE_METAFORAS.md`](../../GUIA_DE_METAFORAS.md), actualizando la ficha `ACT-012_GUIA_DE_METAFORAS.md`, evidencias y hábitos (Sección 5.13).

---

## Acuerdos y Próximos Compromisos
1. **Zoe Peñata (Scrum Master):** Monitorear la ejecución del plan de acción derivado de la evaluación, verificar entregables de ACT-011 y ACT-012, y preparar la entrega de la Semana 10.
2. **Daniel Tapias y Luis Caldera (Frontend Developers):** Consolidar las evidencias y mantener la integridad del frontend, del soporte multimodal y de la iconografía vectorial.
3. **María Soto y María Ubarne (Product Owners):** Validar la experiencia de usuario y realizar las pruebas con docentes de muestra para la recolección del índice SUS.
