# ACT-009 — Descripción de Ventanas

## Información General
- **Semana:** 6
- **Estado:** COMPLETADA

## Objetivo
Documentar formalmente el diseño y la estructura gráfica de cada ventana del frontend de INSPIRATEC, mediante la extracción y descripción de elementos visuales comprobables, siguiendo los lineamientos metodológicos de MODESEC.

## Descripción
Esta actividad comprende el análisis visual exhaustivo de las interfaces de usuario. Mediante el uso de capturas reales obtenidas del entorno de pruebas, se procedió a recortar y clasificar los componentes (Header, Nav, Contenido, Botones) en matrices de verificación visual.

## Alcance
El análisis abarca las siguientes secciones interactivas:
1. Generador de Planes de Clase
2. Experiencias de Aprendizaje (Foro)
3. Plantillas Institucionales
4. Biblioteca de Recursos
5. Mis Planes
6. Ayuda y Soporte

## Metodología de análisis
1. Extracción de capturas de pantalla integrales del sistema en ejecución.
2. Identificación de áreas funcionales y recortes precisos (crops) de la interfaz.
3. Clasificación de multimedia y navegación según los campos de la tabla MODESEC.
4. Vinculación estricta de las funciones documentadas con los botones y opciones realmente visibles.

## Participación del Equipo

### Participación Verificada (Técnica)
- **Daniel Tapias:** Implementación del frontend base y diseño estructural (`src/`, HTML/CSS) verificado en el repositorio.
- **Luis Caldera:** Soporte en la lógica de navegación y estructuración de datos.

### Participación Reportada (Metodología y Análisis)
- **Zoe Peñata, Maira Ortega, María Soto, María Ubarne:** Reportadas en la fase de auditoría visual, redacción de las tablas y descripciones funcionales alineadas con las exigencias del informe MODESEC.

## Evidencias
Se generaron y utilizaron recortes comprobables ubicados en:
- `docs/evidencias/ACT-009/generador/`
- `docs/evidencias/ACT-009/experiencias/`
- `docs/evidencias/ACT-009/plantillas/`
- `docs/evidencias/ACT-009/biblioteca/`
- `docs/evidencias/ACT-009/mis-planes/`
- `docs/evidencias/ACT-009/ayuda/`

*Nota: Las capturas completas se encuentran en el nivel superior de `ACT-009/` (`01_generador.png`, etc.).*

El producto resultante es el documento: **`docs/diseno-multimedial/DESCRIPCION_VENTANAS.md`**.

## Uso de IA
- **Durante el diseño original:** Uso de IA no verificable con la evidencia disponible respecto a la ideación inicial de las ventanas.
- **IA utilizada para documentación/análisis actual:** Se utilizaron scripts automatizados de procesamiento de imágenes (`Jimp` vía NodeJS) para asistir en el recorte exacto de los elementos visuales y en la redacción tabular de la evidencia. (Contexto: Asegurar calidad técnica. Acción: Recorte de imágenes. Salida: Archivos PNG seccionados).

## Evaluación de la Actividad
Se evaluará la exactitud entre las tablas creadas y la interfaz real desplegada en el entorno de pruebas, así como el estricto cumplimiento de la matriz de requerimientos MODESEC.

## Información Faltante
- Validación y aprobación por parte de todo el equipo de las descripciones redactadas.

## Acciones Recomendadas
- Validar conjuntamente las descripciones con el código desplegado.
- Formalizar el documento final una vez se dé el visto bueno académico.
