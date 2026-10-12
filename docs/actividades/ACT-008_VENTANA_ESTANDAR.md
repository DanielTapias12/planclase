# ACT-008 — Definir la Ventana Estándar

## 1. Información General
- **ID de la Actividad:** ACT-008
- **Nombre:** Definir la Ventana Estándar
- **Semana de Ejecución:** Semana 6
- **Estado:** EN PROCESO
- **Participación:** Equipo completo (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne) — Participación reportada/verificada.

## Diagnóstico y Estado Actual (En Proceso)
La actividad se encuentra **en proceso**. Si bien el software INSPIRATEC cuenta con una distribución funcional en su vista principal estructurada según los principios de la Ventana Estándar de MODESEC (Header, Menú de Navegación, Contenido Central, Acciones y Footer), se está ajustando y formalizando la especificación estándar con base en la reciente unificación de estilos visuales Glassmorphism 2026 y la arquitectura de modales con portal.

## Criterios de la Ventana Estándar en Proceso de Estandarización
1. **Header Institucional:** Barra superior translúcida con logo INSPIRATEC, accesos directos de accesibilidad DUA y menú de usuario asimétrico sin recuadros toscos.
2. **Menú Lateral / Navegación Principal:** Sidebar flotante con navegación semántica a las secciones clave de la plataforma.
3. **Área de Trabajo Central (Workspace):** Superficie dinámica sobre panel de cristal esmerilado que aloja formularios, tarjetas y visualizadores.
4. **Sistema de Acciones y Modales:** Botonera ergonómica y soporte de ventanas emergentes montadas en `document.body` (`createPortal`) con oscurecimiento y desenfoque inmersivo del contenido estándar.
5. **Footer / Información de Contexto:** Pie sutil con estado de guardado, versión y créditos institucionales.

## Evidencias
- Documento técnico en desarrollo: `docs/diseno-multimedial/VENTANA_ESTANDAR.md`.
- Esquema vectorial: `docs/diseno-multimedial/VENTANA_ESTANDAR.svg`.
- Implementación en código en `src/index.css` y componentes de página.

## Próximos Compromisos
- Concluir la revisión y formalización de las métricas de espaciado y márgenes globales para la aprobación definitiva de la Ventana Estándar por parte del equipo y la docente guía.
