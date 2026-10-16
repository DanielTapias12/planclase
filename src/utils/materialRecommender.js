/**
 * Motor contextual de recomendaciones de materiales didácticos para INSPIRATEC.
 * 
 * Analiza el área, grado, tema, objetivos y momentos del plan de clase
 * para sugerir entre 2 y 4 recursos digitales y pedagógicos que el docente
 * puede decidir generar bajo demanda.
 * 
 * Regla de oro: Ningún material se genera automáticamente.
 */

export const recomendarMaterialesDidacticos = (metadata = {}, planMarkdown = '') => {
  const materia = (metadata?.materia || '').toLowerCase();
  const tema = metadata?.tema || 'Contenido curricular';
  const grado = metadata?.grado || 'Grado escolar';
  const mdLower = (planMarkdown || '').toLowerCase();

  const recomendaciones = [];

  // 1. REGLAS PARA TECNOLOGÍA E INFORMÁTICA
  if (materia.includes('tecnología') || materia.includes('informática') || materia.includes('computación')) {
    if (mdLower.includes('algoritmo') || mdLower.includes('programación') || mdLower.includes('código') || mdLower.includes('scratch') || mdLower.includes('lógica')) {
      recomendaciones.push({
        id: 'rec_simulacion_algoritmos',
        nombre: `Simulador interactivo de ejecución paso a paso: ${tema}`,
        tipo: 'Simulación funcional',
        typeKey: 'simulacion',
        proposito: 'Permite visualizar en tiempo real cómo cambian las variables y el flujo de control en la estructura lógica.',
        relacionPlan: 'Refuerza la fase de desarrollo y la modelación práctica de algoritmos.',
        contextoEspecifico: `Crear un simulador interactivo en HTML5/JS para ${tema} en ${grado}, con controles de ejecución (play, pausa, paso a paso) y visualización gráfica del estado de variables.`
      });

      recomendaciones.push({
        id: 'rec_infografia_flujo',
        nombre: `Infografía interactiva: Conceptos clave y estructuras de ${tema}`,
        tipo: 'Infografía interactiva',
        typeKey: 'infografia',
        proposito: 'Facilita la comprensión visual de conceptos abstractos y su aplicación en la resolución de problemas cotidianos.',
        relacionPlan: 'Apoya el momento de inicio y la fundamentación curricular para diferentes estilos de aprendizaje.',
        contextoEspecifico: `Diseñar una infografía interactiva en HTML5/CSS con tarjetas desplegables y esquemas visuales sobre ${tema}.`
      });

      recomendaciones.push({
        id: 'rec_cuestionario_formativo',
        nombre: `Cuestionario interactivo con retroalimentación inmediata: ${tema}`,
        tipo: 'Cuestionario interactivo',
        typeKey: 'preguntas',
        proposito: 'Evaluar formativamente el dominio de conceptos y la predicción de resultados algorítmicos.',
        relacionPlan: 'Complementa la fase de cierre y la evaluación formativa establecida en el plan.',
        contextoEspecifico: `Generar una prueba formativa interactiva con preguntas de opción múltiple, retos de código y retroalimentación pedagógica instantánea.`
      });
    } else if (mdLower.includes('excel') || mdLower.includes('hoja de cálculo') || mdLower.includes('fórmula') || mdLower.includes('datos')) {
      recomendaciones.push({
        id: 'rec_infografia_excel',
        nombre: `Infografía interactiva: Referencias relativas y absolutas en Excel`,
        tipo: 'Infografía interactiva',
        typeKey: 'infografia',
        proposito: 'Comprender cómo cambian las referencias de celda al copiar una fórmula y cómo una referencia absoluta mantiene fija una celda.',
        relacionPlan: 'Refuerza la actividad práctica sobre el cálculo y procesamiento de datos numéricos.',
        contextoEspecifico: `Infografía interactiva interactuable que demuestre el comportamiento de fórmulas y referencias de celda fijas vs relativas.`
      });

      recomendaciones.push({
        id: 'rec_taller_contexto',
        nombre: `Guía de laboratorio guiado: Análisis de datos con ${tema}`,
        tipo: 'Actividad práctica',
        typeKey: 'reto_lab',
        proposito: 'Guiar al estudiante mediante una situación auténtica de gestión de inventarios o presupuesto.',
        relacionPlan: 'Desarrolla la actividad central de la secuencia didáctica.',
        contextoEspecifico: `Laboratorio guiado con dataset de ejemplo, pasos estructurados y preguntas de análisis.`
      });

      recomendaciones.push({
        id: 'rec_rubrica_evaluacion',
        nombre: `Rúbrica de evaluación analítica: Desempeño en ${tema}`,
        tipo: 'Rúbrica formativa',
        typeKey: 'rubrica',
        proposito: 'Establecer descriptores claros de calidad para valorar la formulación y precisión en las hojas de cálculo.',
        relacionPlan: 'Alineada con los criterios de evaluación formativa del plan.',
        contextoEspecifico: `Rúbrica analítica en tabla interactiva con niveles (Superior, Alto, Básico, Bajo) y criterios de desempeño específicos.`
      });
    } else {
      // General Tecnología
      recomendaciones.push({
        id: 'rec_infografia_tech_general',
        nombre: `Infografía explicativa interactiva: ${tema}`,
        tipo: 'Infografía interactiva',
        typeKey: 'infografia',
        proposito: `Explicar de forma visual e interactiva los principios de ${tema} y su impacto tecnológico en la sociedad.`,
        relacionPlan: 'Apoya la fundamentación conceptual y el componente curricular MEN.',
        contextoEspecifico: `Infografía modular interactiva para ${grado} sobre ${tema}.`
      });

      recomendaciones.push({
        id: 'rec_juego_conceptos',
        nombre: `Juego pedagógico de asociación y retos: ${tema}`,
        tipo: 'Juego educativo',
        typeKey: 'juegos',
        proposito: 'Consolidar el vocabulario técnico y los conceptos clave mediante mecánicas lúdicas de emparejamiento.',
        relacionPlan: 'Dinamiza la fase de consolidación y cierre de la clase.',
        contextoEspecifico: `Juego interactivo en HTML5/JS con tarjetas de asociación de conceptos y retos de aplicación para ${tema}.`
      });

      recomendaciones.push({
        id: 'rec_rubrica_tech',
        nombre: `Rúbrica socioformativa de valoración: ${tema}`,
        tipo: 'Rúbrica formativa',
        typeKey: 'rubrica',
        proposito: 'Proveer a los estudiantes una guía de autoevaluación y coevaluación sobre los productos desarrollados.',
        relacionPlan: 'Estructura la evaluación formativa en el momento de cierre.',
        contextoEspecifico: `Rúbrica socioformativa con criterios claros adaptados a ${grado}.`
      });
    }
  } 
  // 2. REGLAS PARA MATEMÁTICAS
  else if (materia.includes('matemática') || materia.includes('geometría') || materia.includes('álgebra')) {
    recomendaciones.push({
      id: 'rec_simulacion_mate',
      nombre: `Laboratorio virtual y simulador dinámico: ${tema}`,
      tipo: 'Simulación funcional',
      typeKey: 'simulacion',
      proposito: 'Explorar visualmente la variación de parámetros, gráficas y representaciones numéricas o geométricas.',
      relacionPlan: 'Potencia la comprensión conceptual durante el momento de desarrollo.',
      contextoEspecifico: `Simulador matemático en HTML5 Canvas/SVG para manipular parámetros y ver transformaciones dinámicas en ${tema}.`
    });

    recomendaciones.push({
      id: 'rec_preguntas_mate',
      nombre: `Banco de situaciones problema interactivas: ${tema}`,
      tipo: 'Cuestionario interactivo',
      typeKey: 'preguntas',
      proposito: 'Entrenar el razonamiento lógico-matemático y la formulación de soluciones paso a paso.',
      relacionPlan: 'Refuerza los estándares y competencias de resolución de problemas del plan.',
      contextoEspecifico: `Cuestionario con resolución detallada paso a paso y pistas pedagógicas.`
    });

    recomendaciones.push({
      id: 'rec_infografia_mate',
      nombre: `Infografía de síntesis visual: Propiedades y teoremas de ${tema}`,
      tipo: 'Infografía interactiva',
      typeKey: 'infografia',
      proposito: 'Sintetizar fórmulas, diagramas explicativos y aplicaciones en el mundo real.',
      relacionPlan: 'Sirve como material de apoyo y memoria de aprendizaje para los estudiantes.',
      contextoEspecifico: `Infografía con fórmulas formateadas y ejemplos contextualizados.`
    });
  } 
  // 3. REGLAS PARA CIENCIAS SOCIALES
  else if (materia.includes('social') || materia.includes('historia') || materia.includes('geografía') || materia.includes('democracia')) {
    recomendaciones.push({
      id: 'rec_infografia_sociales',
      nombre: `Línea de tiempo / Cartografía interactiva: ${tema}`,
      tipo: 'Infografía interactiva',
      typeKey: 'infografia',
      proposito: 'Explorar sincrónica y diacrónicamente los procesos históricos, actores sociales y transformaciones espaciales.',
      relacionPlan: 'Potencia la interpretación de fuentes y la ubicación espaciotemporal en la secuencia.',
      contextoEspecifico: `Línea de tiempo o mapa interactivo en HTML5/SVG con hitos clave, testimonios y capas de análisis para ${tema}.`
    });

    recomendaciones.push({
      id: 'rec_cuestionario_sociales',
      nombre: `Estudio de caso y dilema ético-social: ${tema}`,
      tipo: 'Cuestionario interactivo',
      typeKey: 'preguntas',
      proposito: 'Desarrollar el juicio crítico, el análisis de perspectivas y la formulación de argumentos fundamentados.',
      relacionPlan: 'Alineado con los estándares de relaciones ético-políticas y competencias ciudadanas.',
      contextoEspecifico: `Actividad interactiva con estudio de caso, análisis de posturas y preguntas de contraste reflexivo.`
    });

    recomendaciones.push({
      id: 'rec_rubrica_sociales',
      nombre: `Rúbrica de argumentación y uso crítico de fuentes: ${tema}`,
      tipo: 'Rúbrica formativa',
      typeKey: 'rubrica',
      proposito: 'Establecer criterios formativos para valorar la rigurosidad en el uso de fuentes y la fundamentación ciudadana.',
      relacionPlan: 'Estructura la evaluación de los aprendizajes esperados en el momento de cierre.',
      contextoEspecifico: `Rúbrica socioformativa analítica con niveles de desempeño para debates o ensayos en Ciencias Sociales.`
    });
  }
  // 4. REGLAS PARA CIENCIAS NATURALES
  else if (materia.includes('natural') || materia.includes('biología') || materia.includes('física') || materia.includes('química') || (materia.includes('ciencias') && !materia.includes('social'))) {
    recomendaciones.push({
      id: 'rec_simulacion_ciencias',
      nombre: `Simulador experimental de laboratorio: ${tema}`,
      tipo: 'Simulación funcional',
      typeKey: 'simulacion',
      proposito: 'Recrear fenómenos naturales o reacciones científicas mediante control de variables independientes.',
      relacionPlan: 'Sustituye o complementa el laboratorio escolar en la fase de desarrollo.',
      contextoEspecifico: `Simulador científico interactivo con control de temperatura, reactivos o fuerzas según ${tema}.`
    });

    recomendaciones.push({
      id: 'rec_infografia_ciencias',
      nombre: `Póster infográfico interactivo: Ciclos y procesos de ${tema}`,
      tipo: 'Infografía interactiva',
      typeKey: 'infografia',
      proposito: 'Explicar los componentes de un sistema biológico o físico con etiquetas interactivas.',
      relacionPlan: 'Facilita la fase de conceptualización y atención a la diversidad visual (DUA).',
      contextoEspecifico: `Póster científico interactivo con capas de información desplegables.`
    });

    recomendaciones.push({
      id: 'rec_rubrica_ciencias',
      nombre: `Rúbrica de informe de indagación científica: ${tema}`,
      tipo: 'Rúbrica formativa',
      typeKey: 'rubrica',
      proposito: 'Evaluar la formulación de hipótesis, recolección de evidencias y conclusiones de los estudiantes.',
      relacionPlan: 'Estructura la evaluación de los aprendizajes esperados en el plan.',
      contextoEspecifico: `Rúbrica de indagación científica con descriptores de observación y análisis.`
    });
  } 
  // 4. FALLBACK GENERAL CONTEXTUALIZADO
  else {
    recomendaciones.push({
      id: 'rec_infografia_general',
      nombre: `Infografía explicativa interactiva: ${tema}`,
      tipo: 'Infografía interactiva',
      typeKey: 'infografia',
      proposito: `Facilitar la asimilación visual y contextualizada de los conceptos centrales de ${tema}.`,
      relacionPlan: 'Refuerza los objetivos de aprendizaje y la activación cognitiva inicial.',
      contextoEspecifico: `Infografía estructurada con puntos clave y ejemplos aplicados de ${tema}.`
    });

    recomendaciones.push({
      id: 'rec_cuestionario_general',
      nombre: `Cuestionario interactivo de comprobación formativa: ${tema}`,
      tipo: 'Cuestionario interactivo',
      typeKey: 'preguntas',
      proposito: 'Comprobar el nivel de apropiación de los contenidos y detectar oportunidades de refuerzo.',
      relacionPlan: 'Apoya el momento de cierre y la verificación de evidencias del plan.',
      contextoEspecifico: `Cuestionario interactivo formativo con retroalimentación explicativa.`
    });

    recomendaciones.push({
      id: 'rec_rubrica_general',
      nombre: `Rúbrica formativa de desempeño: ${tema}`,
      tipo: 'Rúbrica formativa',
      typeKey: 'rubrica',
      proposito: 'Establecer criterios explícitos para la autoevaluación y valoración de los trabajos estudiantiles.',
      relacionPlan: 'Alineada con los criterios de evaluación definidos en la planeación.',
      contextoEspecifico: `Rúbrica analítica por niveles de desempeño para ${tema}.`
    });
  }

  // Garantizar entre 2 y 4 recomendaciones pertinentes
  return recomendaciones.slice(0, 4);
};
