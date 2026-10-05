# Diario de Campo — Semana Actual

## Información General
- **Participantes:** Zoe Peñata (Scrum Master), María Soto (PO), María Ubarne (PO), Maira Ortega (Facilitación), Luis Caldera (Frontend), Daniel Tapias (Frontend).
- **Fechas:** Septiembre 2026.

## Registro del Trabajo Colaborativo

### Revisión Colectiva del Frontend
El equipo realizó una validación visual del frontend y determinó la necesidad de realizar un diagnóstico técnico para las actividades ACT-014 y ACT-015.

### Decisiones Tomadas (Pendientes de Validación por el Equipo)
- **Asistente Virtual:** Se identificó que la imagen descargada tiene una cuadrícula gris y blanca simulando transparencia. Se decidió, por ahora, aplicar un recorte circular (`border-radius: 50%` o `clip-path: circle()`) temporal, pero la recomendación técnica oficial es remover el fondo externamente y reemplazar el archivo `robot-mascot.png`.
- **Accesibilidad:** Se detectó la falta de la etiqueta semántica `<nav>` en la cabecera. Se priorizó esta mejora para la próxima fase técnica.
- **Interacción del Hub Docente:** Se verificó y ajustó el comportamiento del "Hub Docente STEAM" para que se ejecute solo la primera vez que un usuario accede (validando con `localStorage`), evitando su reapertura constante.

### Uso de Inteligencia Artificial (Antigravity)
- **R (Rol):** Asistente Técnico y Auditor de Accesibilidad.
- **O (Objetivo):** Diagnosticar el estado del frontend (ACT-014 y ACT-015) y documentar los hallazgos.
- **C (Contexto):** El equipo requiere un mapeo exacto de las funcionalidades antes de proceder con el commit final o aplicar cambios severos a la UI.
- **A (Acción):** Análisis de código fuente (HTML, CSS, JS), revisión del cumplimiento DUA y reporte de mejoras.
- **S (Salida):** Reporte de 14 puntos, actualización documental y sugerencia de priorización de correcciones.

### Avance de Actividad ACT-004 (Matriz Científica)
- **Contexto:** Se requiere consolidar 15 artículos indexados como evidencia para INSPIRATEC, distribuidos en 3 categorías (Pedagogía, Arquitectura, GUI).
- **Desarrollo:** Se estructuró la matriz `MATRIZ_15_ARTICULOS.md` integrando los 15 artículos priorizados y los artículos reemplazados, con trazabilidad hacia MODESEC.
- **Observaciones:** Se detectó que el PDF base reportaba a un único responsable (Luis Caldera) para los 15 artículos.
- **Decisiones tomadas:** 
  1. Se acordó distinguir entre "Responsable reportado" (histórico) y "Responsable de análisis" (asignación del equipo). 
  2. Queda pendiente la validación humana de la asignación final de los responsables de análisis para ajustar la evaluación de "Responsabilidad" de ACT-004.
  3. Se realizó una revisión académica final que determinó el reemplazo de ARQ-05 (Microservicios) por el artículo "A Tool-Based Perspective on Software Code Maintainability Metrics" (Ardito et al., 2020), dado que se adecúa más a la arquitectura real de INSPIRATEC y permite fundamentar la calidad del código, pasando el original a la lista de complementarios.
- **Próximos compromisos:** Aprobar asignación de análisis por parte del equipo y concluir evaluación final de ACT-004.

### Análisis de los 7 Hábitos (ACT-016)
- **Contexto:** Evaluación de las dinámicas del equipo bajo la perspectiva de Stephen R. Covey.
- **Desarrollo:** Se realizó una auditoría de todo el repositorio (commits, bitácoras, actas) documentando si el desempeño en cada hábito correspondía a "Evidencia verificada", "Participación reportada" o si no había suficiente evidencia.
- **Hallazgos:** Fuerte tendencia a centralizar la evidencia verificable (commits) en el perfil de Daniel Tapias, mientras que el resto del equipo cuenta con abundante "Participación reportada" en actas y bitácoras. Evidencia transversal y absoluta de Hábito 7 (Mejora continua) en la adopción de la nueva versión.
- **Decisiones:** Se redactó el documento ACT-016 estableciendo una matriz clara.
- **Próximos compromisos:** El equipo humano debe validar las inferencias realizadas antes de dar la actividad por 100% cerrada.
