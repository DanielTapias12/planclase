# Mapa de Navegación — INSPIRATEC

## 1. Propósito
Definir y documentar la arquitectura de la información y el mapa de navegación del software educativo INSPIRATEC, asegurando que los usuarios puedan transitar por las funcionalidades de la aplicación de manera intuitiva, lógica y con un bajo nivel de carga cognitiva. Este documento sirve como soporte técnico y académico para evidenciar el cumplimiento de las reglas de oro de diseño de interfaces.

## 2. Criterio de diseño
El diseño del mapa de navegación se fundamenta en un modelo de **Jerarquía Estructural con Navegación Global (Ancla)**. Al tratarse de una Single Page Application (SPA), se ha evitado representar modales informativos, paneles flotantes o contenedores dinámicos ocultos como "ventanas separadas". El mapa representa exclusivamente los contenedores principales de vista (`display: block / none`) gestionados por el enrutador local de la aplicación.

## 3. Ventanas identificadas

| ID | Ventana | Descripción | Tipo |
|---|---|---|---|
| **V1** | Autenticación | Login y registro de docentes. | Principal / Acceso |
| **V2** | Inicio / Generador | Asistente (Wizard) de 4 pasos para configurar un plan. | Principal / Troncal |
| **V3** | Resultado del Plan | Visualización del plan generado y herramientas derivadas. | Principal / Destino |
| **V4** | Mis Planes | Repositorio personal de planes guardados. | Secundaria / Módulo |
| **V5** | Biblioteca | Repositorio de planes compartidos por la comunidad. | Secundaria / Módulo |
| **V6** | Plantillas | Carga y gestión de formatos institucionales (PEI). | Secundaria / Módulo |
| **V7** | Experiencias | Registro y sistematización de evidencias docentes. | Secundaria / Módulo |
| **V8** | Foro | Espacio de debate y comunidad académica. | Secundaria / Módulo |
| **V9** | Soporte | Sistema de tickets de ayuda técnica. | Secundaria / Módulo |
| **V10** | Ayuda | Guías estáticas y documentación de uso. | Secundaria / Módulo |
| **V11** | Panel Admin | Tablero de métricas (exclusivo para rol admin). | Secundaria / Módulo |

## 4. Relaciones de navegación

| Origen | Acción/Navegación | Destino |
|---|---|---|
| V1 | Iniciar Sesión / Registrarse | V2 |
| Menú Global | Clic en cualquier módulo (Mis planes, Biblioteca, etc) | V4, V5, V6, V7, V8, V9, V10, V11 |
| V2 | Completar Wizard y "Generar" | V3 |
| V3 | "Cerrar" / "Nuevo Plan" | V2 |
| Menú Global | "Salir" | V1 |

## 5. Regla de máximo 3 interacciones

La regla de máximo 3 interacciones se evalúa sobre el **acceso al contenido formativo** pasivo o previamente generado, partiendo desde el Inicio (V2).

*Nota metodológica sobre el Generador (V2)*: El Wizard de cuatro pasos es un proceso secuencial de configuración (creación activa); por ello no se contabiliza como una ruta de acceso a contenido y se excluye de esta métrica.

| Módulo / Herramienta | Origen | Interacción 1 | Interacción 2 | Interacción 3 | ¿Accede al contenido? | Cumple |
|---|---|---|---|---|---|---|
| **Biblioteca** | Inicio (V2) | Clic en Sidebar "Biblioteca" | Buscar / Filtrar (Opcional) | Clic en "Ver Plan" | Sí | **Cumple** |
| **Mis Planes** | Inicio (V2) | Clic en Sidebar "Mis Planes" | Clic en Plan guardado | N/A (Contenido visible) | Sí | **Cumple** |
| **Plantillas** | Inicio (V2) | Clic en Sidebar "Plantillas" | Clic en formato deseado | Visualizar / Descargar | Sí | **Cumple** |
| **Experiencias** | Inicio (V2) | Clic en Sidebar "Experiencias"| Clic en experiencia de la lista | N/A (Contenido visible) | Sí | **Cumple** |
| **Ayuda** | Inicio (V2) | Clic en Sidebar "Ayuda" | Seleccionar artículo/tema | N/A (Contenido visible) | Sí | **Cumple** |
| **OVA / Diapositivas** | Resultado (V3) | Clic botón "Diapositivas OVA" | N/A (Abre modal/iframe) | N/A | Sí | **Cumple** |
| **Cuestionarios** | Resultado (V3) | Clic botón "Cuestionarios" | Confirmar en modal (Opcional)| N/A (Despliega test) | Sí | **Cumple** |
| **Juegos (Sopa)** | Resultado (V3) | Clic botón "Sopa de letras" | Confirmar en modal (Opcional)| N/A (Carga el juego) | Sí | **Cumple** |

**Conclusión del Auditor:** CUMPLE LA REGLA DE 3 INTERACCIONES.
Ninguna ruta pasiva o de consumo de contenido formativo/generado excede el límite de 3 interacciones.

## 6. Navegación global

Los siguientes elementos persisten en la interfaz independientemente de la ventana activa:
- **Barra Lateral (Sidebar)**: Menú de navegación ancla.
- **Asistente DUA**: Panel flotante superior derecho de accesibilidad (tamaño de fuente, contraste, modo dislexia).
- **Guía Asistente (Tour)**: Widget inferior izquierdo para ayuda contextual.
- **Header Superior**: Información de usuario y botón de cierre de sesión.

## 7. Flujo del Diseñador de Planeación (V2)

El código fuente confirma que el Wizard no cambia de ventana (no usa `navigateTo`), sino que alterna la clase `active-step` en el mismo contenedor (`wizardContainer`). Por tanto, se representa como un flujo interno de V2:
`Paso 1 (Datos Básicos) → Paso 2 (Metodología) → Paso 3 (Estándares) → Paso 4 (DUA) → [LLAMADO API]`

## 8. Herramientas derivadas del resultado (V3)

El resultado (V3) concentra la generación de recursos complementarios. Estos no abren ventanas nuevas, sino que despliegan vistas dinámicas o iframes dentro de V3:
- Generación de Rúbricas.
- OVA (Diapositivas y Pizarra).
- Cuestionarios interactivos.
- Sopa de letras.
- Panel de edición directa.
- Exportación en formato PDF o Word.

## 9. Decisiones de diseño

1. **Agrupación estructural**: Se eliminaron las propuestas de V10-V13 (pasos del wizard) y V15-V20 (herramientas) como ventanas independientes, mapeándolas correctamente como estados internos de V2 y V3 respectivamente, para reflejar el comportamiento real del enrutador SPA.
2. **Navegación Circular Mitigada**: El usuario siempre tiene a la vista el Menú Lateral, impidiendo que quede "atrapado" en un callejón sin salida y cumpliendo la regla de Control del Usuario.

## 10. Limitaciones identificadas

La plataforma es una SPA sin uso de la History API (`window.history.pushState`). Por lo tanto, el uso del botón físico "Atrás" del navegador provocará la salida total del aplicativo web, lo que requiere mantener los controles internos de regreso (como "Cancelar" o el menú global) siempre visibles.

## 11. Participación del equipo

- **Daniel Tapias (Desarrollador / Frontend)**: Análisis técnico de navegación en el DOM (`ui.ts`, `dom-elements.ts`), confirmación de rutas sin estado y estructuración técnica del mapa.
- **Luis Caldera (Desarrollador / Frontend)**: Validación de coherencia del flujo de usuario, representación de interacciones (SVG) y diseño general del mapa conceptual.
- **Zoe Peñata (Scrum Master)**: Verificación de requisitos académicos de la actividad (ACT-006) y validación final de consistencia.
- **María Soto (Product Owner) & María Ubarne (Apoyo PO)**: Validación de los recorridos clave de acceso al contenido (evaluación regla de 3 clics).
- **Maira Ortega (Facilitadora)**: Revisión cruzada de principios de interfaz de usuario.

## 12. Evidencias técnicas
El diagnóstico y el diseño del mapa están directamente amparados por:
- `src/ui.ts` (Función `navigateTo(page)` confirmando las ventanas troncales).
- `src/dom-elements.ts` (Mapeo de los contenedores `.style.display`).
- Módulos confirmados de gamificación y reportes de aula implementados en código estático.
