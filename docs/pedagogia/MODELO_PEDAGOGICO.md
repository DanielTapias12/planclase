# Modelo Pedagógico — PlanClase

## 1. Información General

* **Proyecto:** PlanClase.
* **Actividad:** ACT-003.
* **Semana:** 4.
* **Metodología de desarrollo:** Scrum adaptado al contexto académico.
* **Modelo pedagógico principal:** Constructivismo.

---

## 2. Propósito Educativo del Software

Basado en el análisis verificado del proyecto, el software educativo tiene el propósito de actuar como un andamiaje y entorno estructurado que asiste a docentes en el diseño, planificación y generación automatizada de secuencias didácticas completas, alineadas con la Guía 30 del MEN y los principios del Diseño Universal para el Aprendizaje (DUA) y Planes Individuales de Ajustes Razonables (PIAR).

---

## 3. Problema o Necesidad Educativa

### Necesidad educativa verificada
A partir de la documentación existente (`README.md` en la sección "Problema que Aborda"), se verifican explícitamente los siguientes elementos:
1. Sobrecarga y fragmentación documental al redactar planes.
2. Desarticulación con estándares nacionales (Guía 30 del MEN).
3. Barreras para la educación inclusiva y escasez de herramientas prácticas para DUA/PIAR.
4. Falta de sistematización de la práctica docente.

### Inferencia pedagógica basada en evidencia del proyecto
A partir de los elementos verificados y las funcionalidades del sistema (Wizard y selectores), se infiere la siguiente formulación de la necesidad:
"Dificultad o necesidad de los docentes para diseñar, estructurar, adaptar y diversificar experiencias de aprendizaje en Tecnología e Informática considerando competencias, metodologías activas e inclusión".

### Evidencia encontrada
La ausencia de herramientas automatizadas que combinen de manera integral los requerimientos ministeriales (Guía 30) con estrategias modernas de aprendizaje activo genera brechas en la calidad educativa y la inclusión en el aula.

### Evidencia encontrada
El wizard de 4 pasos para la planificación y el panel de Inclusión y Accesibilidad (DUA/PIAR) en el software son respuestas directas a esta necesidad.

---

## 4. Población Objetivo

### Usuario directo
Docentes, especialmente aquellos relacionados con el área de Tecnología e Informática.

### Beneficiarios indirectos
Estudiantes de Educación básica y media, correspondientes a los grados de 1.º a 11.º.

### Contextos educativos
* Instituciones educativas públicas.
* Instituciones educativas privadas.
* Zonas urbanas.
* Zonas rurales.

### Población prioritaria
Actualmente no se ha definido una población prioritaria específica (rango de edad o perfiles sociodemográficos exactos de los estudiantes finales).

---

## 5. Modelo Pedagógico Principal

**Constructivismo.**

El Constructivismo postula que el aprendizaje es un proceso de construcción activa, significativa y contextualizada por parte del individuo. En el marco del proyecto PlanClase, el constructivismo orienta la creación de secuencias didácticas en las que el estudiante no es un receptor pasivo, sino un participante activo que explora, indaga y resuelve problemas. Las funcionalidades del software, como la integración de proyectos (ABP), mapas conceptuales, y retroalimentación interactiva (trivias), materializan este enfoque, guiando al docente para que diseñe clases donde el estudiante construye su propio conocimiento.

---

## 6. Justificación de la Selección

El Constructivismo es coherente con:
* **Aprendizaje activo:** Las planificaciones generadas promueven metodologías donde el estudiante explora e interactúa.
* **Construcción del conocimiento:** El uso de organizadores gráficos y esquemas conceptuales (D3.js).
* **Resolución de problemas:** Directamente integrado como componente de la Guía 30 ("Solución de problemas con tecnología").
* **Rol mediador del docente:** El docente utiliza la plataforma para crear andamiajes, no solo para dictar contenidos.
* **Uso del software:** Es una herramienta generadora de recursos y estructuradora de procesos, no un simple transmisor de información.

---

## 7. Enfoques y Estrategias Complementarias

### 7.1 Aprendizaje Activo
* **Relación con Constructivismo:** Centraliza la participación del estudiante en la experiencia de aprendizaje.
* **Relación con el software:** El generador incentiva al docente a diseñar momentos de "Desarrollo" y "Cierre" basados en interacciones reales.
* **Funcionalidades:** Cuestionarios interactivos y juegos de palabras.
* **Actividades:** Prácticas evaluativas formativas.

### 7.2 Aprendizaje Basado en Problemas (ABP)
* **Relación con Constructivismo:** Partir de un problema real para que los estudiantes investiguen y propongan soluciones construyendo saberes.
* **Relación con el software:** Es una de las metodologías activas explícitamente disponibles para selección en el Paso 2 del Wizard.
* **Funcionalidades:** Selección de metodologías en el planificador.
* **Actividades:** Retos de investigación en aula.

### 7.3 Pensamiento Computacional
* **Relación con Constructivismo:** Estimula la descomposición de problemas y la lógica de construcción de soluciones.
* **Relación con el software:** Disponible como metodología didáctica en la configuración.
* **Funcionalidades:** Adaptaciones Unplugged (desconectado) mencionadas en el Paso 1 y 2.
* **Actividades:** Juegos lógicos y algoritmos desconectados.

### 7.4 Design Thinking
* **Relación con Constructivismo:** Enfoque centrado en el usuario para iterar ideas y construir prototipos.
* **Relación con el software:** Opción metodológica en el planificador didáctico.
* **Funcionalidades:** Selección metodológica.
* **Actividades:** Diseño de artefactos por parte de los estudiantes.

### 7.5 Gamificación
* **Relación con Constructivismo:** Brinda motivación intrínseca y entornos seguros para el ensayo y error.
* **Relación con el software:** Sopas de letras, trivias y herramientas lúdicas generables.
* **Funcionalidades:** Módulos lúdicos y lógicas de retroalimentación inmediata.
* **Actividades:** Retos interactivos para comprobar saberes previos.

### 7.6 Indagación
* **Relación con Constructivismo:** Despierta la curiosidad y la búsqueda autónoma de respuestas.
* **Relación con el software:** Fomentado en los momentos iniciales de las secuencias.
* **Funcionalidades:** Estructura de "Saberes Previos" en el Diagrama de Contenidos.
* **Actividades:** Foros, mesas redondas, resolución de incógnitas.

---

## 8. Rol del Usuario que Aprende

**Beneficiario (Estudiante):**
* Participante activo, analítico y creador.
* Toma decisiones al resolver problemas tecnológicos e interactuar con los recursos lúdicos (trivias, sopas de letras).
* Construye conocimiento y genera artefactos y evidencias.

*(Nota: El usuario directo del sistema es el Docente, pero el enfoque pedagógico modela al Estudiante como el centro del proceso formativo, según se desprende de las metodologías generadas por el sistema).*

---

## 9. Rol del Docente

* **Diseñador:** Crea secuencias, adapta recursos, define tiempos y metodologías.
* **Mediador / Facilitador:** Utiliza los mapas conceptuales y las estrategias DUA para tender puentes entre el conocimiento y el estudiante.
* **Evaluador:** Emplea las rúbricas analíticas generadas para una valoración formativa (Superior, Alto, Básico, Bajo).

*(No aplica como usuario pasivo; el docente está en constante actividad de planificación e investigación [IAP/DSRM]).*

---

## 10. Rol del Software Educativo

* **Herramienta de apoyo docente:** Optimiza la labor de planeación y reduce la fragmentación documental.
* **Generador de recursos:** Produce rúbricas, diapositivas y juegos en tiempo real.
* **Entorno de planificación:** Facilita la articulación de la Guía 30 MEN y los parámetros DUA a través del Wizard interactivo.
* **Facilitador de estrategias educativas:** Concreta teóricamente metodologías como ABP o Gamificación en instrumentos utilizables.

---

## 11. Ambiente de Aprendizaje

* **Contexto escolar:** Ambientes formales (educación básica y media).
* **Mediado digitalmente e Híbrido:** Contempla el uso de proyector, configuración 1 a 1 (un computador por estudiante) y formato "Unplugged" (desconectado).
* **Público y Privado:** Mapeo institucional de formatos PEI adaptable a múltiples contextos organizacionales, tanto urbanos como rurales.

---

## 12. Estrategias de Aprendizaje

| Estrategia | Funcionalidad | Proceso de aprendizaje |
|---|---|---|
| Práctica y Juego | Módulos de Sopas de Letras y Trivias (Canvas) | Memorización activa, recuperación de saberes, motivación. |
| Representación Visual | Mapas conceptuales y diapositivas interactivas (D3.js) | Organización de la información, estructuración del pensamiento. |
| Exploración Autónoma | Asistente de paso a paso y "Profe Guía" (para el docente) | Auto-capacitación y reflexión sobre la propia práctica didáctica. |
| Inclusión y Accesibilidad | Panel DUA/PIAR, alto contraste, fuente para dislexia | Adaptación perceptiva y cognitiva para garantizar equidad. |

---

## 13. Actividades que Permite Desarrollar el Software

| Funcionalidad | Actividad educativa | Estrategia pedagógica | Evidencia |
|---|---|---|---|
| Módulo Trivia Interactiva | Comprobación de saberes previos o evaluación formativa | Gamificación / Evaluación Formativa | Código `quiz-game.ts` |
| Generador de Rúbricas | Valoración del desempeño de los estudiantes según criterios MEN | Evaluación Analítica / Constructivismo | `README.md` (Sección 4) |
| Ajustes DUA/PIAR | Adaptación de la clase para estudiantes con discapacidad | Inclusión / Diseño Universal | `index.css` (tokens DUA) |
| Sistematización IAP/DSRM | Documentación de la práctica educativa del docente | Reflexión de la Práctica (Docente) | Funciones de portafolio de experiencias |

---

## 14. Inclusión y Diversidad

La diversidad es un pilar arquitectónico de PlanClase:
* **DUA (Diseño Universal para el Aprendizaje):** Accesibilidad visual integrada (modo sepia, dislexia, interlineado, etc.) que impacta directamente el entorno del usuario docente y los instrumentos generables.
* **PIAR:** El Wizard incluye un Paso 4 específico para ajustes razonables, abarcando discapacidad visual, auditiva, física/motora y neurodiversidad (TEA, TDAH, talentos excepcionales), permitiendo al docente adaptar la enseñanza a la diversidad del aula.

---

## 15. Relación con Competencias

* **Competencia:** Reconocimiento de principios tecnológicos y evolución (MEN Guía 30).
* **Estrategia:** ABP / Pensamiento Computacional.
* **Actividad:** Investigación de evolución de artefactos (diseñada por el docente vía Wizard).
* **Evidencia:** Productos de aula (documentados en el portafolio) y evaluación mediante rúbrica analítica generada.

*(Las competencias específicas se mapean dinámicamente desde el Paso 3 del sistema).*

---

## 16. Relación con MODESEC

| Dimensión MODESEC | Relación con el Modelo Pedagógico |
|---|---|
| **Necesidad Educativa** | Responde a la desarticulación curricular y sobrecarga documental docente. |
| **Objetivos** | Facilitar el andamiaje para experiencias de aprendizaje constructivistas. |
| **Competencias / Indicadores** | Extraídos e incorporados dinámicamente de la Guía 30 MEN en la rúbrica analítica (Superior, Alto, Básico, Bajo). |
| **Diseño Pedagógico** | Orientado a metodologías activas (ABP, Gamificación) y Constructivismo. |
| **Diseño Computacional** | Interfaz SPA con módulos de accesibilidad DUA que permiten la configuración inclusiva de la secuencia. |
| **Evaluación** | Módulos formativos y rúbricas analíticas generadas algorítmicamente. |

---

## 17. Relación con SECMALI

| Elemento SECMALI | Descripción Relacional |
|---|---|
| **Objeto de conocimiento** | La Tecnología y la Informática (conceptos, procesos, artefactos y sistemas). |
| **Estudiante** | Participante activo que construye conocimiento apoyado en las metodologías diseñadas. |
| **Docente** | Mediador y diseñador de la experiencia educativa (usuario principal de PlanClase). |
| **Software Educativo** | PlanClase como herramienta facilitadora, estructuradora de contenidos e instrumentos (trivias, DUA). |
| **Ambiente de aprendizaje** | El contexto donde se despliegan los planes (1 a 1, proyector, desconectado). |

---

## 18. Evidencia Científica

El respaldo científico específico del modelo pedagógico será consolidado posteriormente mediante una actividad independiente de revisión y análisis de artículos científicos.

---

## 19. Decisión del Equipo

El equipo decidió utilizar:
**Constructivismo como modelo pedagógico principal.**

Complementado por:
* Aprendizaje Activo.
* ABP (Aprendizaje Basado en Problemas).
* Pensamiento Computacional.
* Design Thinking.
* Gamificación.
* Indagación.

**Participantes:** Todos los integrantes del equipo (Zoe Peñata, Luis Caldera, Daniel Tapias, Maira Ortega, María Soto, María Ubarne).

---

## 20. Conclusiones

* **Coherencia pedagógica:** El software refleja fielmente una concepción constructivista, al dotar al docente de herramientas (ABP, mapas, gamificación) que exigen un rol activo del estudiante.
* **Fortalezas:** Profunda integración del enfoque inclusivo (DUA/PIAR) y alineación estricta con normatividad nacional (MEN Guía 30).
* **Aspectos pendientes de mejora:** Consolidar el respaldo científico (artículos) y validar formalmente los perfiles demográficos exactos (población prioritaria).
* **Próximas acciones:** Ejecutar la actividad independiente de la Matriz de 15 Artículos Científicos para fundamentar rigurosamente el modelo SECMALI.
