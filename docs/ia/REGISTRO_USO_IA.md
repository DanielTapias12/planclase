# Registro Ético de Uso de Inteligencia Artificial (ROCAS)

Este documento centraliza el registro transparente y ético de las interacciones con herramientas de Inteligencia Artificial generativa utilizadas como apoyo durante el ciclo de vida del proyecto **PlanClase (INSPIRATEC)**, conforme a las directrices de la asignatura.

---

## Metodología de Registro (ROCAS)

Cada interacción significativa se documenta utilizando el marco estructurado:
* **R — Rol:** ¿Qué papel asumió la IA?
* **O — Objetivo:** ¿Qué se buscaba lograr?
* **C — Contexto:** ¿Bajo qué condiciones académicas y técnicas se dio la interacción?
* **A — Acción:** ¿Cuál fue la instrucción exacta (prompt)?
* **S — Salida / Solución:** ¿Qué se obtuvo y cómo lo validó el equipo humano?

---

## Registro de Prompts e Interacciones

### 1. Reestructuración Arquitectónica y Documentación Inicial (ACT-001)

* **R — Rol:** Arquitecto de Software, Administrador de Git/GitHub, Analista de Proyecto y Gestor de Documentación Académica.
* **O — Objetivo:** Reemplazar de forma segura la versión anterior del repositorio con la nueva versión local más avanzada, limpiando ramas obsoletas sin perder el historial, y documentando formalmente el equipo, los roles Scrum y la articulación con MODESEC.
* **C — Contexto:** Proyecto PlanClase (INSPIRATEC), transición a una nueva versión técnica superior. Rama principal de GitHub.
* **A — Acción (Prompt Principal):**
  > *"Actúa como Arquitecto de Software, Administrador de Git/GitHub, Analista de Proyecto y Gestor de Documentación Académica. CONTEXTO GENERAL: Actualmente tengo abierto un NUEVO PROYECTO LOCAL. Quiero utilizar esta nueva versión del proyecto para reemplazar el contenido principal del repositorio GitHub... NO inventes información sobre funcionalidades..."*
* **S — Salida / Validación:** La IA orquestó la limpieza del repositorio, configuró un `.gitignore` estricto y generó los artefactos iniciales (`FICHA_PROYECTO.md`, `EQUIPO_Y_ROLES.md`, `SCRUM_Y_MODESEC.md`, `SEMANA_01.md`, `MONITOREO_SEMANAL.md`). El equipo verificó la exclusión correcta de archivos sensibles y la coherencia de los roles asignados a los 6 miembros del Grupo 2.

### 2. Diagrama de Contenidos y Avance Frontend (ACT-002)

* **R — Rol:** Asistente de Arquitectura de Información y Documentación Técnica.
* **O — Objetivo:** Estructurar el código Mermaid y el archivo vectorial SVG correspondiente al mapa mental de 7 módulos de PlanClase, y documentar el avance colaborativo del frontend.
* **C — Contexto:** Proyecto PlanClase (INSPIRATEC), consolidación del mapa curricular de la plataforma.
* **A — Acción (Prompt Principal):**
  > **PENDIENTE:** Registrar prompt definitivo utilizado para la elaboración del Diagrama de Contenidos y la validación de mejoras visuales en el frontend.
* **S — Salida / Validación:** Se generó el documento `DIAGRAMA_DE_CONTENIDOS.md`, los códigos Mermaid para `mindmap` y `flowchart TD`, y la representación SVG. El equipo (Específicamente el Product Owner) contrastó la salida con el mapa mental gráfico provisto y las orientaciones de la Guía 30 del MEN, asegurando concordancia estricta antes de integrarlo.

---

## Políticas de Uso Ético

1. **La IA es un Asistente, no un Autor:** Ninguna pieza de código, diagrama o texto generada por IA se integra al repositorio sin una revisión humana crítica.
2. **Trazabilidad Absoluta:** Todas las decisiones estructurales sugeridas por la IA deben documentarse.
3. **No Invención de Evidencia:** Está estrictamente prohibido utilizar IA para generar evidencia ficticia sobre tareas no realizadas o participación no verificable de los integrantes del equipo.

---

### 3. Análisis y Definición del Modelo Pedagógico (ACT-003)

* **R - Rol:** Asistente de análisis pedagógico, epistemológico y estructuración documental académica.
* **O - Objetivo:** Apoyar la articulación del modelo pedagógico constructivista con el código fuente de PlanClase, sustentar científicamente las metodologías activas (ABP, Pensamiento Computacional, Gamificación, DUA/PIAR), caracterizar la población prioritaria y formalizar la validación colegiada del equipo.
* **C - Contexto:** Proyecto PlanClase (INSPIRATEC), alineación con MODESEC, SECMALI y MEN Guía 30.
* **A - Acción (Prompt Principal):**
  > *"Analiza el proyecto PlanClase, identifica sus componentes educativos verificables en el código (Wizard, D3.js, Trivias, DUA) y estructura el documento del Modelo Pedagógico bajo el enfoque Constructivista y de Aprendizaje Activo. Incorpora la evidencia científica de respaldo (Piaget, Vygotsky, Papert, Wing, CAST, MEN) y prepara la validación unánime del equipo para cerrar la actividad ACT-003 como Completada."*
* **S - Salida / Validación:** Se consolidó `docs/pedagogia/MODELO_PEDAGOGICO.md` (20 secciones), `docs/actividades/ACT-003_MODELO_PEDAGOGICO.md` (estado COMPLETADA, Nivel 4) y la trazabilidad en diario de campo. El equipo (Product Owner, PO Support, Scrum Master y Desarrolladores) revisó y aprobó unánimemente el contenido sin contradicciones con la visión del producto.

### 3. Análisis de los 7 Hábitos en INSPIRATEC (ACT-016)

* **R — Rol:** Analista documental y asistente de clasificación de evidencias.
* **O — Objetivo:** Relacionar acciones documentadas del proyecto con los 7 hábitos.
* **C — Contexto:** Repositorio INSPIRATEC, registros históricos y presentación proporcionada.
* **A — Acción:** Prompt solicitando inspección del repositorio, clasificación de integrantes según hábitos observados, y generación de una matriz de trazabilidad documentada con distinción estricta de nivel probatorio.
* **S — Salida / Validación:** Se generó la matriz de trazabilidad y el informe académico ACT-016. La validación humana de las inferencias y recomendaciones de mejora se encuentra PENDIENTE.

---

### 4. Consolidación del Diseño de Aprendizaje bajo MODESEC (ACT-013)

* **R — Rol:** Asesor Curricular y Diseñador de Software Educativo MODESEC.
* **O — Objetivo:** Elaborar la matriz de derivación pedagógica: Competencia -> Indicador -> Modelo Constructivista -> Estrategia -> Actividad -> Evidencia.
* **C — Contexto:** Cierre de la brecha curricular de la Fase II de MODESEC y articulación de la Guía 30 MEN con las secuencias didácticas generadas en INSPIRATEC.
* **A — Acción:** Estructuración de la matriz formal en 5 columnas cubriendo los 4 componentes ministeriales y las dimensiones transversales de Gamificación y DUA/PIAR.
* **S — Salida / Validación:** Creación de `docs/pedagogia/DISENO_DE_APRENDIZAJE.md` y ficha `ACT-013`. Validado por el Product Owner y equipo pedagógico.

---

### 5. Auditoría Integral de Usabilidad y Accesibilidad por Pantallas (ACT-015)

* **R — Rol:** Auditor de Usabilidad Heurística y Accesibilidad DUA/WCAG 2.1 AA.
* **O — Objetivo:** Evaluar cada pantalla desarrollada en torno a Control del Usuario (regresar/cancelar/navegar), Carga Cognitiva (información/memoria/iconos) y Consistencia (colores/botones/tipografía).
* **C — Contexto:** Validación de interfaces tras el rediseño con estética Glassmorphism 2026 y modales con `createPortal` montados en `document.body`.
* **A — Acción:** Evaluación heurística y calificación detallada de las 12 pantallas y componentes transversales del aplicativo.
* **S — Salida / Validación:** Ficha técnica actualizada en `docs/actividades/ACT-015_USABILIDAD_ACCESIBILIDAD.md`. Verificado en código y vistas activas por los desarrolladores frontend y facilitadores.

---

### 6. Verificación de Frontend: UX, Movilidad y Patrones Pressman (ACT-017)

* **R — Rol:** Experto Senior en Ingeniería de Software Frontend y Auditor Ergonómico de Interfaces Educativas.
* **O — Objetivo:** Auditar exhaustivamente la aplicación bajo los 16 criterios formales de los Capítulos 12, 13 y 14 de Roger S. Pressman & Bruce R. Maxim (9na Edición), cuantificando el nivel de cumplimiento y sustentándolo con evidencias tangibles de código y comportamiento de la interfaz interactiva.
* **C — Contexto:** Semana 10 del curso Informática Educativa / Diseño de Interfaces de Usuario. Evaluación formativa previa al cierre de entregables de frontend.
* **A — Acción:** Ejecutar la lista de chequeo oficial de 16 ítems asignando 2 pts (Cumple), 1 pt (Cumple Parcialmente) o 0 pts (No Cumple). Identificar causas raíz de debilidades en código (antipatrones, validaciones nativas, fallas de persistencia de borrador, ausencia de focus ring y desconexión de breadcrumbs) y relacionar el desempeño de los 6 miembros con los 7 hábitos de Covey.
* **S — Salida / Validación:** Ficha oficial generada en `docs/actividades/ACT-017_LISTA_CHEQUEO_FRONTEND_PRESSMAN.md` con 22/32 pts (68.75%) y post-implementación de 30/32 pts (93.75%). El equipo humano evaluó las debilidades y validó las mejoras implementadas.

---

### 7. Verificación de Frontend: Sistemas Tutores Inteligentes y Metacognición (ACT-018)

* **R — Rol:** Experto Senior en Frontend, Especialista en Sistemas Tutores Inteligentes (STI / ITS) y Metacognición Computacional (Marco Teórico Dr. Manuel Fernando Caro Piñeres, UNAL 2015).
* **O — Objetivo:** Auditar exhaustivamente el frontend de INSPIRATEC verificando el reflejo en la interfaz de los 4 módulos canónicos de Wenger/Caro, las 5 características de interfaz adaptativa donde se experimenta la tutoría inteligente y el soporte a la metacognición mediante la arquitectura de Doble Lazo de Razonamiento (*Double-Loop Architecture*).
* **C — Contexto:** Semana 10 del curso Informática Educativa / Diseño de Interfaces de Usuario. Evaluación formativa que contrasta el sistema con la tesis doctoral de referencia de la Universidad Nacional de Colombia.
* **A — Acción:** Aplicación del instrumento de 12 ítems ponderado a 24 puntos (escala C: 2 pts, CP: 1 pt, NC: 0 pts, NA: N/A), documentando evidencias observables en componentes JSX, servicios de IA y estilos CSS, consolidando el dictamen cuantitativo y cualitativo.
* **S — Salida / Validación:** Creación de `docs/actividades/ACT-018_LISTA_CHEQUEO_STI_CARO.md` y `docs/ia/REGISTRO_IA_ACT-018.md` con puntaje de 24/24 pts (100% - Sobresaliente). Validado técnicamente por el equipo de desarrollo frontend y pedagógico.

