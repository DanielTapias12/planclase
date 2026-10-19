# ACT-009 — Descripción de Ventanas

## 1. Información General
- **ID de la Actividad:** ACT-009 (Actividad 7 del Plan de Trabajo)
- **Nombre:** Descripción de Ventanas
- **Semana de Ejecución:** Semana 6 / Semana 10 (Consolidación)
- **Estado:** COMPLETADA
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial)
- **Producto Esperado:** `DESCRIPCION_VENTANAS.md` en la raíz del proyecto y en `docs/diseno-multimedial/`.

---

## 2. Objetivo y Justificación

### Objetivo General
Documentar formal y exhaustivamente la interfaz gráfica de usuario de INSPIRATEC mediante la inspección real de cada ventana, describiendo sus áreas principales, elementos multimedia, tipografía, acciones del usuario, botones y mecanismos de navegación, siguiendo el formato estándar de MODESEC.

### Justificación Técnica
La descripción de ventanas constituye el inventario funcional y visual de referencia para el equipo de desarrollo, el aseguramiento de la calidad (QA) y la validación pedagógica. Asegura que cada pantalla implementada en el código fuente (`src/pages/*`) cumpla con los principios de diseño DUA, la regla de accesibilidad WCAG y la coherencia metodológica con la Guía 30 del MEN.

---

## 3. Participantes y Roles Scrum

| Participante | Rol Scrum Oficial | Contribución en ACT-009 |
|---|---|---|
| **Zoe Peñata** | Scrum Master | Facilitación del sprint, control de completitud del inventario de ventanas y verificación del formato institucional. |
| **Luis Caldera** | Development Team / UI-UX Lead | Levantamiento de capturas de pantalla reales en alta resolución del sistema Glassmorphism y mapeo visual. |
| **Daniel Tapias** | Development Team / Git Lead | Auditoría técnica de rutas en `App.jsx`, verificación de eventos DOM (`onClick`, `onChange`), props y serialización Markdown. |
| **Maira Ortega** | Facilitadora de Equipo | Revisión de consistencia en textos instruccionales y verificación de la carga cognitiva en la navegación. |
| **María Soto** | Product Owner | Validación de coherencia curricular de las plantillas y alineación con los momentos didácticos del MEN. |
| **María Ubarne** | Product Owner Support | Auditoría de componentes inclusivos DUA y accesibilidad por voz (Web Speech API) en la biblioteca. |

---

## 4. Evidencias y Productos Generados

- **Documento Maestro:** [`DESCRIPCION_VENTANAS.md`](../../DESCRIPCION_VENTANAS.md)
- **Copia Institucional:** [`docs/diseno-multimedial/DESCRIPCION_VENTANAS.md`](../diseno-multimedial/DESCRIPCION_VENTANAS.md)
- **Carpeta de Evidencias Fotográficas Reales (`docs/evidencias/ACT-009/`):**
  - `V01_inicio.png` (Ventana de Inicio)
  - `V04_mis_planes.png` (Mis Planes de Clase — Repositorio Personal)
  - `V05_adn_pedagogico.png` (Mi ADN Pedagógico & Estudio Transversal — Vista General)
  - `V05_adn_pedagogico_pestana1.png` (ADN — Pestaña 1: Memoria de Éxito Automática)
  - `V05_adn_pedagogico_pestana2.png` (ADN — Pestaña 2: Caja de Herramientas y DUA)
  - `V05_adn_pedagogico_pestana3.png` (ADN — Pestaña 3: Matriz de Transversalidad)
  - `V05_adn_pedagogico_pestana4.png` (ADN — Pestaña 4: Recursos Probados en Aula)
  - `V06_plantillas.png` (Mis Estructuras de Clase — Catálogo de Modelos)
  - `V02_planificador.png` (Planificador de Clases — Vista General)
  - `V02_planificador_fase1.png` (Planificador — Fase 1: Información básica y ADN)
  - `V02_planificador_fase2.png` (Planificador — Fase 2: Metodología y Metas)
  - `V02_planificador_fase3.png` (Planificador — Fase 3: Estándares y DBA)
  - `V02_planificador_fase4.png` (Planificador — Fase 4: Inclusión DUA/PIAR)
  - `V02_planificador_grafo.png` (Planificador — Grafo Interactivo de Prerrequisitos MEN)
  - `V03_editor.png` (Editor Curricular y Co-docente IA)
  - `V07_biblioteca.png` (Biblioteca Comunitaria — Recursos Abiertos)
  - `V09_foro.png` (Foro Docente Interactivo — Diálogo y Comunidades)
  - `V10_configuracion.png` (Configuración de IA Gemini)
  - `V10_administracion.png` (Panel de Administración y Control — Vista General)
  - `V10_administracion_analiticas.png` (Administración — Pestaña 1: Analíticas y Métricas Gráficas)
  - `V10_administracion_directorio.png` (Administración — Pestaña 2: Directorio de Docentes y Habeas Data)
  - `V10_administracion_adn_colectivo.png` (Administración — Pestaña 3: Identidad & ADN Pedagógico Colectivo)
  - `V10_administracion_tickets.png` (Administración — Pestaña 4: Tickets de Soporte y Atención)
  - `V12_ayuda.png` (Centro de Ayuda Pedagógica — Base de Conocimiento y Guías)
  - `V13_soporte.png` (Soporte Técnico Institucional — Mesa de Ayuda y Tickets)
- **Registro de Uso de IA:** [`docs/ia/REGISTRO_IA_ACT-009.md`](../ia/REGISTRO_IA_ACT-009.md)
