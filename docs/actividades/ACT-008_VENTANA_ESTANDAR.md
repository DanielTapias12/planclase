# ACT-008 — Definir la Ventana Estándar

## 1. Información General
- **Estado:** COMPLETADA
- **Participación:** Equipo completo (Daniel Tapias, Luis Caldera, Zoe Peñata, Maira Ortega, María Soto, María Ubarne) - Participación reportada/verificada.

## Diagnóstico
Se identificó que el software INSPIRATEC posee una arquitectura en su vista principal ("Inicio / Wizard") que empata correctamente con los principios de la Ventana Estándar de MODESEC, dividiéndose funcionalmente en Header, Menú, Contenido, Acciones y Footer, lo que permite usarla como modelo.

## Evaluación

| Criterio | Estado | Observación |
|----------|--------|-------------|
| Cumplimiento | 3 — Adecuado | La estructura cumple con la teoría requerida, a falta de revisión grupal. |
| Calidad | 4 — Consolidado | Se documentó sobre el software real ejecutado y funcional. |
| Evidencia | 4 — Consolidado | Se incluyen capturas reales fotográficas y esquemas conceptuales SVG. |
| Documentación | 4 — Consolidado | Toda la trazabilidad académica, roles y diarios de campo fue registrada. |
| Responsabilidad | 4 — Consolidado | Se separaron labores verificadas de labores reportadas sin invenciones. |
| Coherencia | 4 — Consolidado | La vista analizada corresponde a la arquitectura actual de la aplicación. |

## Fortalezas
- **Objetividad:** Se analizó el frontend existente sin inventar mockups para satisfacer un requerimiento teórico.
- **Trazabilidad:** Cada paso del proceso fue registrado exhaustivamente (ROCAS, Diario de campo).

## Aspectos por mejorar
- **Validación final:** Confirmar formalmente con el Product Owner si el comportamiento adaptativo del Menú (colapso en móviles) requiere ser documentado como una segunda Ventana Estándar de formato móvil.

## Evidencias verificadas

### Evidencia documental
- `docs/diseno-multimedial/VENTANA_ESTANDAR.md`
- `docs/diario-campo/SEMANA_06.md`

### Evidencia técnica
- Archivo CSS y JSX (`index.tsx`, `index.css`) correspondientes a las áreas funcionales.

### Evidencia visual
- `docs/evidencias/ACT-008_VENTANA_ESTANDAR_INSPIRATEC.png`
- `docs/evidencias/VENTANA_ESTANDAR_EXPLICADA.png` (anotada).
- `docs/diseno-multimedial/VENTANA_ESTANDAR.svg`

### Evidencia de IA
- `docs/ia/REGISTRO_IA_ACT-008.md`
- `docs/ia/PROMPT_ACT-008_VENTANA_ESTANDAR.md`

## Información faltante
No se identifica información faltante para la formalización documental de la actividad.

## Acciones recomendadas
- Trasladar las pautas de espaciado y márgenes derivadas de esta ventana a la hoja de estilos global para forzar la consistencia en futuras vistas.

## Próximos compromisos
- Zoe Peñata (Scrum Master): Validar que la documentación corresponda a los entregables semanales y realizar el respectivo "merge/commit" a la rama principal.
