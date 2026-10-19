# Mockups de Alta Fidelidad — INSPIRATEC
## Ecosistema Digital de Andamiaje Pedagógico y Co-diseño Curricular

---

### Identificación de la Actividad
- **Código:** ACT-007 (Actividad 5 del Plan de Trabajo)
- **Denominación Oficial:** Diseñar Mockups de Alta Fidelidad
- **Semana:** Semana 3 / Semana 10 (Consolidación)
- **Marco Metodológico:** MODESEC (Fase II — Diseño Educativo y Multimedial) y las Tres Reglas de Oro de Theo Mandel
- **Ubicación:** `docs/diseno-interface/mockups/`

---

## 1. Inventario de Mockups de Alta Fidelidad

En correspondencia con los requerimientos de la actividad, se consolidaron los 4 mockups representativos del flujo nuclear del software:

| Archivo Mockup | Vista Representada | Ruta en el Frontend | Propósito en el Flujo |
|---|---|---|---|
| **`mockup-inicio.png`** | Ventana de Inicio | `/home` | Entrada editorial, resumen de métricas y acceso rápido a modelos. |
| **`mockup-planificador.png`** | Planificador de Clases (Wizard) | `/` | Co-diseño guiado en 4 fases tripartitas (Básica, Metodología, MEN, DUA). |
| **`mockup-grafo-prerrequisitos.png`** | Grafo Ontológico de Prerrequisitos | Modal / `/` | Explorador interactivo de competencias y progresión de la Guía 30 del MEN. |
| **`mockup-adn-pedagogico.png`** | Mi ADN Pedagógico & Transversalidad | `/adn-pedagogico` | Memoria contextual, métricas de éxito y configuración del perfil docente. |
| **`mockup-caja-herramientas.png`** | Caja de Herramientas y DUA | `/adn-pedagogico` | Selección de dinámicas de inicio, evaluación formativa y receta pedagógica. |
| **`mockup-dashboard.png`** | Repositorio / Dashboard | `/mis-planes` | Panel de gestión curricular, filtrado, sincronización y acciones sobre planes. |
| **`mockup-actividad.png`** | Arquitectura Curricular / Plantillas | `/plantillas` | Catálogo de estructuras didácticas, transferencia al asistente e inspección. |
| **`mockup-resultados.png`** | Editor Curricular / Resultados | `/editor` | Lienzo de trabajo con el plan generado, co-docente socrático IA y exportación. |
| **`mockup-admin-analiticas.png`** | Administración — Analíticas | `/administracion` | Métricas KPI macroscópicas, Donut Chart SVG por nivel y producción STEAM. |
| **`mockup-admin-directorio.png`** | Administración — Directorio | `/administracion` | Registro de claustro docente, filtros por nivel y protección Habeas Data. |
| **`mockup-admin-adn-colectivo.png`** | Administración — ADN Colectivo | `/administracion` | Diagnóstico declarada vs aplicada, caja DUA institucional y banco probado. |
| **`mockup-admin-tickets.png`** | Administración — Tickets Soporte | `/administracion` | Gestión y resolución en tiempo real de incidencias y dudas pedagógicas. |

---

## 2. Aplicación de las Tres Reglas de Oro de Theo Mandel

### Regla 1: Dar el Control al Usuario
- **Navegación Soberana:** El docente puede retroceder, pausar o cancelar cualquier operación en el planificador mediante el guardado de borradores intermedios.
- **Transparencia y No Imposición:** El co-docente socrático de IA formula preguntas y propuestas reflexivas sin mutar arbitrariamente el texto del plan de clase. La decisión final de aceptar o rechazar cambios recae siempre en el usuario.
- **Acciones Reversibles:** Los cuadros de diálogo modales de confirmación segura (`ConfirmModal.jsx`) previenen la eliminación accidental de secuencias didácticas.

### Regla 2: Reducir la Carga de Memoria del Usuario
- **Reconocimiento sobre Recuerdo:** En lugar de obligar al docente a recordar estándares del MEN o taxonomías, el sistema despliega selectores estructurados con los DBA, competencias de la Guía 30 y principios DUA.
- **Visibilidad del Estado del Sistema:** La barra de pasos del wizard (`1. Información básica`, `2. Metodología`, `3. Estándares`, `4. Inclusión DUA`) y el semáforo de conectividad con Gemini en la barra superior informan en todo momento la situación del sistema.
- **Metadatos Explícitos en Tarjetas:** Cada tarjeta de plan o plantilla exhibe claramente su grado escolar, materia, fecha y estado de publicación, evitando la necesidad de abrir el archivo para conocer su contenido.

### Regla 3: Mantener la Consistencia Visual
- **Sistema de Diseño Unificado:** Todos los mockups comparten la paleta cromática verde salvia (`#477A72`) y petróleo (`#142B25`, `#183630`), con superficies de cristal translúcido marfil (`rgba(255, 254, 250, 0.86)` con `backdrop-filter: blur(16px)`).
- **Tipografía Coherente:** Jerarquía estricta con fuente serif `Lora` para títulos/métricas y sans-serif `DM Sans` para controles de interfaz y lectura continua.
- **Iconografía Homogénea:** Familia vectorial completa de `lucide-react` con grosores de trazo y tamaños uniformes en todas las vistas.

---

## 3. Especificaciones Visuales por Mockup

### 3.1 Mockup 1 — Inicio (`mockup-inicio.png`)
- **Colores:** Fondo marfil translúcido `rgba(255, 254, 250, 0.86)`, borde blanco `rgba(255, 255, 255, 0.94)`, acento verde institucional `#183630`, alerta advertencia `#EA580C`.
- **Tipografía:** Título H1 en `Lora` (28px, bold, color `#142B25`), textos en `DM Sans` (14.5px, color `#243630`).
- **Iconos:** `Sparkles`, `PlusCircle`, `BookOpen`, `Dna`, `FileText`, `Settings`, `ArrowRight`.
- **Botones:** Botón primario *"Iniciar Planificador de Clases"*, botón secundario *"Ver Plantillas Curriculares"*, botón *"Calibrar / Cambiar"*.
- **Distribución:** Layout asimétrico con dock lateral flotante a la izquierda, barra de utilidades superior a la derecha y tres franjas de contenido centradas.

### 3.2 Mockup 2 — Planificador de Clases (`mockup-planificador.png`)
- **Colores:** Banner verde suave para ADN Pedagógico, tarjetas de formulario en cristal marfil con bisel blanco de 1px, botones de acción en verde petróleo `#183630`.
- **Tipografía:** Título H1 `Lora` (26px), stepper numerado en `DM Sans` (13px, semibold), inputs y selectores (14px).
- **Iconos:** `RotateCcw`, `Check`, `CheckSquare`, `ArrowRight`, `ArrowLeft`, `Save`, `Sparkles`, `Share2`, `Eye`, `VolumeX`, `Accessibility`, `ShieldCheck`.
- **Botones:** Botón *"Comenzar nuevo plan en blanco"*, *"Sugerir con IA"*, *"Grafo de Prerrequisitos (MEN)"*, *"Sugerir estándares"*, *"Guardar progreso"*, *"Siguiente →"*, *"← Volver"*, *"Generar Clase"*.
- **Distribución:** Layout secuencial estructurado por tarjetas temáticas agrupadas (Tema, Audiencia, Recursos, Metodología, DUA).

### 3.3 Mockup 3 — Grafo Interactivo de Prerrequisitos (`mockup-grafo-prerrequisitos.png`)
- **Colores:** Columnas de cristal translúcido por ciclos escolares, nodos con bordes codificados por color según eje disciplinar (verde, azul, naranja), aristas SVG en verde salvia.
- **Tipografía:** Encabezados de columna y códigos MEN en `DM Sans` (11px a 13px, bold).
- **Iconos:** `Layers`, `Compass`, `ZoomIn`, `ZoomOut`, `RotateCcw`.
- **Botones:** Selectores de Grado y Eje, controles de escala y zoom (85%), nodos clicables de transferencia.
- **Distribución:** Modal/Drawer de amplia visualización (90% viewport) con canvas SVG interactivo.

### 3.4 Mockup 4 — Dashboard de Planes (`mockup-dashboard.png`)
- **Colores:** Tarjetas en cristal translúcido, insignias verdes de estado `#166534`, fondo de acento tenue `#E7EDE7`.
- **Tipografía:** Título H1 `Lora` (28px), metadatos en `DM Sans` (12px, semibold), títulos de tarjetas `Lora` (18px).
- **Iconos:** `Search`, `RefreshCw`, `PlusCircle`, `Eye`, `Sparkles`, `Share2`, `Download`, `Copy`, `Trash2`.
- **Botones:** *"Sincronizar"*, *"Crear Nuevo Plan"*, pestañas de filtro (*Todos*, *Guardados*, *Sistematizados*, *En Biblioteca*), botoneras de tarjeta (*Abrir*, *Sistematizar*, etc.).
- **Distribución:** Cabecera con migas de pan y métricas, barra de búsqueda y filtros intermedia, cuadrícula responsive de 3 columnas para tarjetas.

### 3.5 Mockup 5 — Actividad y Plantillas (`mockup-actividad.png`)
- **Colores:** Badges ámbar de estructura predeterminada, badges verdes de pública, fondo marfil de alto contraste.
- **Tipografía:** Título H1 `Lora` (28px), encabezados de plantillas en `Lora` (17px, bold), descripciones en `DM Sans` (13px).
- **Iconos:** `Layers`, `Plus`, `Search`, `Globe`, `CheckCircle`, `Eye`, `Share2`, `Trash2`.
- **Botones:** Botón primario *"+ Nueva Estructura"*, botones en tarjetas *"Usar en Asistente"*, botones *"Ver"*.
- **Distribución:** Panel superior con contador cuantitativo de modelos, barra de búsqueda temática y rejilla de 6 tarjetas de modelos del MEN.

### 3.6 Mockup 6 — Resultados y Editor (`mockup-resultados.png`)
- **Colores:** Superficie blanca elevada para el lienzo del documento, panel lateral con tinte suave de co-docente, texto de alto contraste WCAG AAA.
- **Tipografía:** Formato Markdown con títulos H1-H3 en `Lora` y párrafos en `DM Sans`.
- **Iconos:** `Save`, `Download`, `MessageSquare`, `Layers`, `FileCheck`.
- **Botones:** *"Guardar Plan"*, *"Exportar PDF"*, *"Descargar MD"*, *"Auditar DUA"*, *"Generar Rúbrica"*.
- **Distribución:** Vista dividida (*split-screen*) con editor estructurado en el 65% del ancho y panel de asistencia socrática en el 35%.

### 3.7 Mockups 7 a 10 — Módulo de Administración y Control
- **`mockup-admin-analiticas.png`:**
  - **Colores:** Pestañas translúcidas marfil `rgba(255, 254, 250, 0.86)`, Donut Chart SVG con arcos verde bosque `#183630`, verde salvia `#477A72` y gris platino, barras de progreso STEAM.
  - **Tipografía:** Cifras KPI en `Lora` (32px, bold), leyendas y porcentajes en `DM Sans` (12px a 14px).
  - **Iconos:** `BarChart3`, `Users`, `BookOpen`, `Sparkles`, `Award`, `Activity`.
  - **Distribución:** 4 tarjetas KPI en cuadrícula superior, panel Donut a la izquierda y producción STEAM a la derecha.
- **`mockup-admin-directorio.png`:**
  - **Colores:** Tabla con filas de cristal blanco `rgba(255, 255, 255, 0.92)`, badge de Habeas Data verde esmeralda con borde fino.
  - **Tipografía:** Cabeceras en `DM Sans` (13px, semibold), correos y nombres en `DM Sans` (14px).
  - **Iconos:** `Search`, `CheckCircle2`, `Lock`, `Unlock`, `Users`.
  - **Botones:** Filtros por nivel formativo (*Todos*, *Primaria*, *Secundaria*, *Media*), botones *"Ver Detalle"*.
- **`mockup-admin-adn-colectivo.png`:**
  - **Colores:** Badges institucionales verdes, barra comparativa con indicador de brecha curricular del 80%, estrellas doradas en banco de recursos.
  - **Tipografía:** Títulos H1 y métricas de claustro en `Lora`, etiquetas DUA y proyectos en `DM Sans`.
  - **Iconos:** `Dna`, `Layers`, `Lightbulb`, `Star`, `Compass`, `ShieldCheck`.
  - **Botones:** Botón *"Ir a mi ADN Personal"*, botones *"Ver Ficha"* en huella curricular docente.
- **`mockup-admin-tickets.png`:**
  - **Colores:** Badge de estado "Pendiente" en fondo ámbar suave `#FEF3C7` con texto `#92400E`, botón de respuesta en verde bosque `#183630`.
  - **Tipografía:** Asunto de ticket en `Lora` (20px, bold), metadatos y cuerpo en `DM Sans` (14px).
  - **Iconos:** `MessageSquare`, `Send`, `Clock`, `ShieldAlert`.
  - **Botones:** Botón primario *"Responder"* con icono `Send`.

