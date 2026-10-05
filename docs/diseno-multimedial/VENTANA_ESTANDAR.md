# Ventana Estándar — INSPIRATEC

## 1. Identificación
**ID:** ACT-008  
**Semana:** 6  
**Prioridad:** Alta  

## 2. Objetivo
Registrar que la actividad busca definir una estructura de ventana que sirva como referencia para el diseño de las demás interfaces de INSPIRATEC, tomando como base el enfoque académico MODESEC.

## 3. Ventana real seleccionada
Se ha analizado la interfaz real del **Inicio / Generador de planes de clase (Wizard)**. Esta ventana fue seleccionada porque refleja fielmente los elementos estructurales (Header, Menú, Contenido, Acciones, Footer) en el entorno de producción, garantizando que el diseño estándar propuesto no sea un modelo hipotético sino la base arquitectónica real sobre la cual ya opera el software.

## 4. Evidencia visual real
**Archivo:** `ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png`  
**Ubicación:** `docs/evidencias/ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png`  
**Vista representada:** Interfaz de Inicio y paso 1 del Wizard de generación de planes.  
**Elementos observables:** Logo, menú superior e inferior (en móviles) o lateral, formulario central, barra de progreso y botones de acción primaria.

![Ventana estándar de INSPIRATEC](../../docs/evidencias/ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png)

## 5. Imagen explicativa
Evidencia visual anotada utilizada para identificar las áreas funcionales de la Ventana Estándar.

**Archivo:** `VENTANA_ESTANDAR_EXPLICADA.png`  
**Ubicación:** `docs/evidencias/VENTANA_ESTANDAR_EXPLICADA.png`

![Ventana estándar anotada](../../docs/evidencias/VENTANA_ESTANDAR_EXPLICADA.png)

## 6. Distribución de la ventana

| Sección | Función | Elementos reales identificados |
|---------|---------|--------------------------------|
| **Header** | Identidad y navegación principal | Logotipo de INSPIRATEC, indicación de "DOCENTE PRO", perfil del usuario, botón de Accesibilidad (DUA) y opción de Salir. |
| **Menú** | Acceso a módulos | Barra de navegación secundaria con enlaces a: Inicio, Mis Planes, Experiencias, Biblioteca, Plantillas, Foro, Soporte y Ayuda. |
| **Contenido** | Actividad principal | Área central adaptativa que aloja el progreso (Pasos 1 al 4) y el formulario interactivo ("Información Básica"). |
| **Acciones** | Interacción | Botones anclados a la tarea actual: "Guardar borrador" y "Siguiente: Contexto y Entorno". |
| **Footer** | Información complementaria | Franja inferior con derechos de autor (© 2026 INSPIRATEC Colombia), propósito educativo y alineación curricular del MEN. |

## 7. Descripción funcional
La ventana estándar divide la carga cognitiva en regiones especializadas:
- La navegación global (Header/Menú) es persistente.
- El área de trabajo (Contenido) es adaptativa.
- El flujo de tareas (Acciones) es contextual.
- La validación legal y académica (Footer) se mantiene al cierre de la vista.

## 8. Relación con MODESEC
En concordancia con el Diseño Multimedial de MODESEC, la formalización de esta ventana estándar asegura consistencia, predictibilidad y accesibilidad para el docente. Funciona como plantilla maestra para el resto de los módulos del sistema (como *Mis Planes* o *Biblioteca*), reduciendo la curva de aprendizaje.

## 9. Participación del equipo
- **Zoe Peñata (Scrum Master):** Coordinación y seguimiento de la actividad, organización de la documentación, validación colaborativa (Participación reportada).
- **Luis Caldera (Desarrollo Frontend):** Revisión de la estructura visual, análisis de la interfaz, aportes al diseño frontend (Participación verificada).
- **Daniel Tapias (Desarrollo Frontend):** Revisión técnica de la interfaz, identificación de elementos implementados en DOM, apoyo en documentación técnica (Participación verificada).
- **Maira Ortega (Facilitación):** Revisión de UX, organización y validación colaborativa (Participación reportada).
- **María Soto (Product Owner):** Revisión desde la perspectiva del producto y del usuario docente (Participación reportada).
- **María Ubarne (Apoyo PO):** Revisión y validación del resultado (Participación reportada).

## 10. Uso de IA
Se utilizó **Antigravity (Gemini 3.1 Pro)** para analizar la estructura real del DOM, generar scripts de captura (`Puppeteer`) y formular los reportes académicos basándose en el análisis directo del código, asegurando la no invención de elementos ficticios.

## 11. Observaciones
Se observó que en el software real, el Menú y el Header se fusionan dependiendo de la resolución (comportamiento responsivo), pero conceptualmente conservan la segmentación de la Ventana Estándar sugerida.

## 12. Evaluación
- **Estado final:** Completada.
- Todos los componentes solicitados han sido evidenciados y trazados en el repositorio sin invención de artefactos.
