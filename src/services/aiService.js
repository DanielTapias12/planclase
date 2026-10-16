import { resolveEffectiveTemplate } from './templates/genericTemplates';

/**
 * AI Service para INSPIRATEC
 * Gestión de llamadas a Google Gemini con cascada de modelos inteligente,
 * recuperación automática ante saturación (503), cuotas (429) y obsolescencia (404).
 */

// Cascada de modelos disponibles y soportados para v1beta
const CANDIDATE_MODELS = [
  'gemini-flash-latest',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-2.5-flash'
];

let activeWorkingModel = CANDIDATE_MODELS[0];

/**
 * Llamada centralizada y resiliente a la API de Gemini.
 * Realiza fallback automático entre modelos soportados y reintentos ante fallas transitorias.
 */
export const callGeminiApi = async (apiKey, requestBody, maxRetriesPerModel = 2) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  // Ordenamos los modelos para probar primero el último que funcionó exitosamente
  const modelsToTry = [
    activeWorkingModel,
    ...CANDIDATE_MODELS.filter(m => m !== activeWorkingModel)
  ];

  let lastError = null;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < maxRetriesPerModel; attempt++) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        // Si el modelo no existe o no soporta el método (404), pasamos de inmediato al siguiente modelo
        if (response.status === 404) {
          console.warn(`[Inspiratec AI] El modelo ${model} no está disponible (404). Probando alternativa...`);
          break; // Salta al siguiente modelo
        }

        // Si hay congestión (503) o límite de tasa temporal (429)
        if (response.status === 503 || response.status === 429) {
          console.warn(`[Inspiratec AI] Modelo ${model} devolvió ${response.status} (intento ${attempt + 1}).`);
          if (attempt < maxRetriesPerModel - 1) {
            await new Promise(r => setTimeout(r, 1500 * (attempt + 1)));
            continue;
          }
          // Si agotamos intentos con este modelo, pasamos al siguiente candidato
          break;
        }

        const data = await response.json();

        if (!response.ok) {
          const apiMsg = data.error?.message || `Error HTTP ${response.status}`;
          lastError = new Error(apiMsg);
          
          // Si es error de API Key inválida, no tiene sentido seguir probando otros modelos
          if (response.status === 400 && apiMsg.includes('API_KEY_INVALID')) {
            throw new Error('La API Key proporcionada no es válida. Por favor, verifica tu clave de Google AI Studio.');
          }
          break; // Prueba siguiente modelo
        }

        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
          // Guardamos el modelo funcional como preferido para llamadas futuras
          activeWorkingModel = model;
          return data.candidates[0].content.parts[0].text;
        }

        if (data.promptFeedback?.blockReason) {
          throw new Error(`El contenido fue bloqueado por políticas de seguridad: ${data.promptFeedback.blockReason}`);
        }

        lastError = new Error('Respuesta sin texto generado por el modelo.');
      } catch (err) {
        lastError = err;
        if (err.message.includes('API Key no configurada') || err.message.includes('no es válida')) {
          throw err;
        }
        // Error de red
        if (attempt < maxRetriesPerModel - 1) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }
  }

  throw new Error(`Error en el servicio de IA: ${lastError?.message || 'No fue posible conectar con ningún modelo de Gemini.'}`);
};

const REGLAS_MEN = {
  "Tecnología e Informática": "Debes basarte en las Orientaciones Generales para la Educación en Tecnología de Colombia (Guía 30 MEN). Enfatiza en pensamiento computacional, uso responsable de TIC y solución de problemas tecnológicos.",
  "Matemáticas": "Debes basarte en los Estándares Básicos de Competencias y DBA de Matemáticas de Colombia. El plan debe enfatizar el razonamiento, la modelación y la resolución de problemas (pensamientos numérico, espacial, métrico, aleatorio y variacional).",
  "Ciencias Naturales": "Debes basarte en los Estándares Básicos de Competencias en Ciencias Naturales y DBA de Colombia. Enfatiza en la indagación científica, la comprensión de fenómenos y el análisis riguroso de evidencias empíricas.",
  "Lengua Castellana": "Debes basarte en los Estándares Básicos de Competencias y DBA de Lenguaje de Colombia. Enfócate en comprensión y producción textual, oralidad, procesos discursivos y enfoque semántico-comunicativo.",
  "Inglés": "Debes basarte en los Estándares Básicos de Competencias en Lenguas Extranjeras: Inglés (Guía 22 MEN), los DBA de Inglés de Colombia y el Marco Común Europeo de Referencia para las Lenguas (MCER). Enfócate en el desarrollo de la competencia comunicativa (dimensiones lingüística, pragmática y sociolingüística). Selecciona las habilidades pertinentes para el objetivo de la sesión (Listening, Speaking, Reading, Writing) e incorpora vocabulario, expresiones funcionales y estructuras contextualizadas según el grado y nivel de los estudiantes, articulando las fases Warm-up, Presentation, Practice, Production y Wrap-up cuando sean pedagógicamente pertinentes."
};

/**
 * Prueba de conexión a la API de Gemini
 */
export const testApiConnection = async (apiKey) => {
  try {
    const result = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: "Responde únicamente con: OK" }] }],
      generationConfig: { maxOutputTokens: 10 }
    });
    return Boolean(result && result.length > 0);
  } catch (error) {
    console.warn("[Inspiratec AI] Error al probar conexión:", error.message);
    return false;
  }
};

/**
 * Sugerencia de objetivos de aprendizaje basada en el contexto curricular
 */
export const suggestObjectives = async (apiKey, wizardData) => {
  const reglas = REGLAS_MEN[wizardData.materia] || REGLAS_MEN["Tecnología e Informática"];
  const prompt = `Como experto pedagogo alineado con los lineamientos oficiales del MEN de Colombia, sugiere propósitos y objetivos de aprendizaje (1 o 2 párrafos cortos y precisos) para una clase con el siguiente contexto:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales y Pedagógicos: ${reglas}
Metodología: ${wizardData.metodologiaSTEAM}
Recursos: ${wizardData.recursos}
Responde SOLO con el texto de los objetivos formativos coherentes con las orientaciones, sin saludos ni formato markdown adicional.`;

  try {
    const text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
    });
    return text.trim();
  } catch (error) {
    throw new Error('Error al sugerir objetivos: ' + error.message);
  }
};

/**
 * Sugerencia de estándares MEN y DBA
 */
export const suggestStandards = async (apiKey, wizardData) => {
  const reglas = REGLAS_MEN[wizardData.materia] || REGLAS_MEN["Tecnología e Informática"];
  const prompt = `Como experto curricular en Colombia, sugiere qué competencias, estándares MEN y DBA aplican para esta clase:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales: ${reglas}
Objetivos: ${wizardData.objetivos}

INSTRUCCIÓN CRÍTICA DE RIGOR: No inventes códigos ni números ficticios de estándares o DBA. Cita únicamente referentes curriculares reales y pertinentes del Ministerio de Educación Nacional de Colombia (MEN) y Colombia Aprende. Si un DBA no aplica de forma exacta al grado o tema, no lo fuerces ni inventes numeraciones.
Responde SOLO con la lista de componentes y estándares aplicables, sin saludos.`;

  try {
    const text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
    });
    return text.trim();
  } catch (error) {
    throw new Error('Error al sugerir estándares: ' + error.message);
  }
};

/**
 * Generación completa del plan de clase
 */
export const generatePlan = async (apiKey, wizardData, customTemplates = []) => {
  // Resuelve la plantilla efectiva respetando que los formatos propios de docentes prevalecen estructuralmente
  const effectiveTemplate = resolveEffectiveTemplate(wizardData, customTemplates);
  const formatInstructions = effectiveTemplate.instrucciones;

  const orientacionDisciplinar = `
ORIENTACIÓN DIDÁCTICA Y DISCIPLINAR CRÍTICA:
1. SELECCIÓN PERTINENTE: Los apartados disciplinares (por ejemplo: DBA, representaciones matemáticas específicas, errores frecuentes, precauciones de seguridad de laboratorio, género textual, tipos de evidencias o herramientas digitales/manipulativas) NO deben ser campos obligatorios universales mecánicos. Selecciona y desarrolla ÚNICAMENTE los apartados que sean directamente pertinentes al objetivo formativo de la clase, el grado escolar (${wizardData.grado || 'del nivel'}), el contexto real y los recursos disponibles (${wizardData.recursos || 'especificados'}). Si un apartado no aplica al tema concreto, no lo fuerces.
2. RIGOR CURRICULAR SIN INVENTAR: NO inventes estándares ni códigos ficticios de DBA. Fundaméntate estrictamente en los referentes reales y vigentes del Ministerio de Educación Nacional de Colombia (MEN) y Colombia Aprende. Si no dispones del código exacto de un DBA, describe el aprendizaje formativo real sin crear números inventados.
3. ORGANIZACIÓN PEDAGÓGICA Y TIEMPOS: Presenta una estructura coherente y jerárquica con instrucciones concretas, diferenciando las orientaciones del docente y las acciones esperadas de los estudiantes. Si se indican tiempos por fase, asegúrate de que sean realistas y que la suma de los momentos corresponda exactamente a la duración disponible (${wizardData.duracion || 'de la sesión'}).
4. NOTACIÓN MATEMÁTICA Y FÓRMULAS: En caso de incluir fórmulas, ecuaciones o expresiones de cálculo, utiliza delimitadores estándar ($...$ o $$...$$) o símbolos matemáticos directos (×, ÷, ±, ², ³). No utilices barras invertidas duplicadas ni escapes de código innecesarios.
5. FORMATO DE RESPUESTA: Entrega directamente el documento pedagógico estructurado en Markdown legible. NO envuelvas todo el plan en bloques de código con triple comilla invertida (\`\`\`markdown).
6. RECURSOS GENERABLES POR LA IA: Solo cuando sea estrictamente necesario para visualizar un concepto pedagógico complejo (como un diagrama de flujo, una infografía del hardware, un esquema de una red, una simulación o un modelo interactivo), puedes sugerir un recurso visual interactivo en la mediación o recursos de la clase. Formatea la sugerencia así: [GENERATE_IMAGE: "una descripción detallada del recurso pedagógico interactivo a generar"].
`;

  const reglas = REGLAS_MEN[wizardData.materia] || REGLAS_MEN["Tecnología e Informática"];
  const prompt = `Actúa como un planificador experto en el área de ${wizardData.materia}. Tus lineamientos legales son: ${reglas}. Genera un plan de clase estructurado en formato Markdown con la siguiente información:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Materia: ${wizardData.materia}
Duración: ${wizardData.duracion} (${wizardData.sesiones} sesiones)
Estudiantes: ${wizardData.numEstudiantes}
Recursos: ${wizardData.recursos}
Metodología: ${wizardData.metodologiaSTEAM}
Objetivos: ${wizardData.objetivos}
Estándares MEN: ${Array.isArray(wizardData.estandaresMEN) ? wizardData.estandaresMEN.join(', ') : (wizardData.estandaresMEN || '')}
Inclusión (DUA): ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : ''} ${wizardData.otrasNecesidades || ''}

${orientacionDisciplinar}

${formatInstructions}`;

  try {
    const planText = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
    
    let cleaned = (planText || '').trim();
    if (cleaned.startsWith('```markdown')) {
      cleaned = cleaned.replace(/^```markdown\s*/i, '').replace(/```\s*$/i, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
    }
    return cleaned.trim();
  } catch (error) {
    throw new Error('Error al generar el plan: ' + error.message);
  }
};

/**
 * Modificación del plan existente mediante chat (Soporta Modo Directo y Modo Socrático Guiado)
 * @param {string} apiKey - Clave API de Gemini
 * @param {string} planActual - Texto markdown del plan actual
 * @param {string} instruccion - Mensaje o comando del docente
 * @param {'direct' | 'socratic'} [modo='direct'] - Modo de mediación pedagógica
 * @param {Array} [historial=[]] - Historial reciente de la conversación
 * @returns {Promise<{ tipo: string, planModificado: string|null, textoDialogo: string }>}
 */
export const modifyPlan = async (apiKey, planActual, instruccion, modo = 'direct', historial = []) => {
  if (modo === 'socratic') {
    const formattedHistory = (historial || [])
      .slice(-4)
      .map(h => `${h.role === 'user' ? 'Docente' : 'Tutor Socrático'}: ${h.text}`)
      .join('\n');

    const prompt = `Actúa como un Tutor Pedagógico y Co-docente Experto aplicando la Táctica Socrática y el Modelo de Agencia Compartida (Caro 2015, Zimmerman & Nkambou).
Tu rol en este modo NO es reescribir ciegamente el plan ante una orden escueta, sino dialogar reflexivamente con el docente para potenciar su criterio didáctico antes o durante la modificación.

PLAN DE CLASE ACTUAL:
${planActual}

${formattedHistory ? `HISTORIAL DE DIÁLOGO PREVIO:\n${formattedHistory}\n` : ''}

NUEVA INTERVENCIÓN DEL DOCENTE:
"${instruccion}"

INSTRUCCIONES DE RESPUESTA:
1. Realiza una intervención dialogal reflexiva (máximo 2 párrafos concisos) donde:
   - Valides el propósito pedagógico de la solicitud.
   - Formules 1 o 2 preguntas reflexivas socráticas (por ejemplo: articulación con conocimientos previos, mitigación de barreras DUA/PIAR, dosificación del tiempo o evaluación formativa).
   - Sugieras cómo se puede concretar el ajuste en la secuencia didáctica.
2. Si la solicitud amerita un ajuste concreto al plan de clase, incluye al final una propuesta de plan actualizado delimitada EXACTAMENTE entre las etiquetas:
<<<PLAN_PROPUESTO>>>
[Aquí el plan completo en Markdown actualizado con tu sugerencia integrada]
<<<FIN_PLAN_PROPUESTO>>>
Si la intervención del docente es una consulta conceptual o no amerita cambiar el texto aún, omite las etiquetas delimitadas.`;

    try {
      let text = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.65, maxOutputTokens: 8192 }
      });

      const planRegex = /<<<PLAN_PROPUESTO>>>([\s\S]*?)<<<FIN_PLAN_PROPUESTO>>>/;
      const match = text.match(planRegex);
      let planPropuesto = null;
      let textoDialogo = text;

      if (match) {
        planPropuesto = match[1].replace(/```markdown\s*/i, '').replace(/```\s*$/i, '').trim();
        textoDialogo = text.replace(planRegex, '').trim();
      }

      return {
        tipo: 'socratic',
        textoDialogo,
        planModificado: planPropuesto
      };
    } catch (error) {
      throw new Error('Error en el diálogo socrático: ' + error.message);
    }
  }

  // Modo Directo (Comportamiento rápido tradicional)
  const prompt = `Eres un asistente experto en la edición de planes de clase. El usuario te proporcionará un plan en formato Markdown y te dará instrucciones para modificarlo. Tu respuesta DEBE SER ÚNICAMENTE el plan de clase completo y actualizado en formato Markdown. No incluyas saludos ni explicaciones. Solo el código Markdown.

Este es el plan actual:
${planActual}

Aplica esta instrucción: ${instruccion}`;

  try {
    let text = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.5, maxOutputTokens: 8192 }
    });
    if (text.startsWith('```markdown')) {
      text = text.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/```\n?/g, '');
    }
    const cleanMarkdown = text.trim();
    return {
      tipo: 'direct',
      planModificado: cleanMarkdown,
      textoDialogo: 'He actualizado el plan de clase según tu indicación directa. Revisa los cambios reflejados en el documento.'
    };
  } catch (error) {
    throw new Error('Error al modificar el plan: ' + error.message);
  }
};


/**
 * Generación de material complementario (rúbricas, diapositivas, quizzes, juegos)
 */
export const generateComplementaryMaterial = async (apiKey, planActual, type, contextoEspecifico = '') => {
  let materialPrompt = '';

  if (type === 'rubrica') {
    materialPrompt = `Basado en el siguiente plan de clase, genera una Rúbrica de Evaluación interactiva para calificar a los estudiantes.
Tu respuesta debe ser un HTML completo. Utiliza <table> para la estructura de la rúbrica.
MUY IMPORTANTE: Incluye código JavaScript embebido para que la rúbrica sea interactiva: el profesor debe poder hacer clic en las celdas de calificación para seleccionarlas (resaltándolas visualmente) y la aplicación debe calcular automáticamente una puntuación final en la parte inferior.
Aplica estilos en línea CSS profesionales y modernos (colores verde salvia, estados de hover, etc).`;
  } else if (type === 'diapositivas') {
    materialPrompt = `Basado en el siguiente plan de clase, genera el contenido para unas Diapositivas de Presentación interactivas (máximo 5 diapositivas).
Tu respuesta debe ser un HTML completo. MUY IMPORTANTE: Incluye código JavaScript embebido para que funcione como una presentación real (añade botones o teclas de flecha para 'Siguiente' y 'Anterior' que cambien la diapositiva visible ocultando las demás).
Representa cada diapositiva usando estilos CSS muy modernos, animaciones de transición suaves, flexbox, y tipografía grande y legible.`;
  } else if (type === 'preguntas') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un Quiz Interactivo (5 de selección múltiple y 2 abiertas).
Tu respuesta debe ser un HTML completo. MUY IMPORTANTE: Incluye código JavaScript embebido para que el estudiante pueda seleccionar opciones, hacer clic en 'Comprobar' y ver feedback inmediato (marcando en verde las correctas y en rojo las incorrectas), y calcular un puntaje final.
Usa una interfaz de usuario limpia y moderna similar a un formulario interactivo.`;
  } else if (type === 'juegos') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un Juego interactivo, específicamente una Sopa de Letras con 10 conceptos clave de la clase y una lista de las palabras a buscar.
Tu respuesta debe ser un HTML completo. MUY IMPORTANTE: Incluye todo el código JavaScript necesario para que la sopa de letras sea 100% jugable: el usuario debe poder arrastrar el cursor o hacer clic sobre las letras para seleccionar palabras. Si encuentra una palabra de la lista, debe tacharse automáticamente y la palabra en la grilla debe quedar resaltada permanentemente. Añade un mensaje de victoria al completar.
Diseña la cuadrícula y el panel de forma lúdica y amigable usando CSS.`;
  } else if (type === 'taller_contexto') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un Taller de Contexto Real con 5 problemas matemáticos aplicados a la vida cotidiana.
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'guia_modelacion') {
    materialPrompt = `Basado en el siguiente plan de clase, genera una Guía de Modelación (paso a paso) para que el estudiante visualice el problema matemático.
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'reading') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un ejercicio de Reading Comprehension (un texto corto en inglés ajustado al nivel MCER con preguntas de selección múltiple).
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'roleplay_en' || type === 'roleplay_lit') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un guion de Juego de Roles (Role-Play). ${type === 'roleplay_en' ? 'En inglés para practicar Speaking.' : 'Ejercicio literario, de dramatización o debate basado en el tema.'}
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'flashcards') {
    materialPrompt = `Basado en el siguiente plan de clase, genera unas Flashcards de Vocabulario Interactivas (lista de palabras clave, con uso en contexto y pronunciación aproximada).
Tu respuesta debe ser un HTML completo. MUY IMPORTANTE: Incluye lógica de JavaScript y CSS 3D Transforms para que al hacer clic en cada tarjeta, esta gire (efecto flip 3D) mostrando la definición/traducción en el reverso.
Diseña las tarjetas como un carrusel navegable o una cuadrícula de cartas interactivas.`;
  } else if (type === 'taller_lectura') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un Taller de Comprensión y Lectura Crítica (un texto argumentativo o narrativo con preguntas de análisis crítico).
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'produccion_textual') {
    materialPrompt = `Basado en el siguiente plan de clase, genera unas Pautas de Producción Textual (guía estructurada para escribir un cuento, ensayo o artículo de opinión).
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'reto_lab') {
    materialPrompt = `Basado en el siguiente plan de clase, genera una guía de Reto de Laboratorio paso a paso para ejecutar una práctica en software o hardware.
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  } else if (type === 'infografia') {
    materialPrompt = `Basado en el siguiente plan de clase, genera una Infografía Interactiva explicativa con diagramas SVG interactivos, bloques modulares desplegables y animaciones CSS puras.
Tu respuesta debe ser un HTML completo e interactivo. El estudiante debe poder hacer clic en cada concepto o fase para ver detalles explicativos, ejemplos visuales y conclusiones clave.
Aplica una paleta de diseño editorial limpia, accesible, con tipografía nítida y contraste óptimo.`;
  } else if (type === 'simulacion') {
    materialPrompt = `Basado en el siguiente plan de clase, genera una Simulación Funcional e interactiva utilizando HTML5 Canvas o SVG dinámico y JavaScript nativo.
Tu respuesta debe ser un HTML completo con controles de simulación (deslizadores de parámetros, botones de reproducir/pausar/reiniciar, y gráficos o animación en tiempo real).
El estudiante debe poder experimentar directamente variando variables del tema y observando los resultados inmediatos de forma tangible y pedagógica.`;
  } else if (type === 'estudio_caso') {
    materialPrompt = `Basado en el siguiente plan de clase, genera un Estudio de Caso Tecnológico (análisis de un problema tecnológico real y cómo resolverlo usando Pensamiento Computacional).
Tu respuesta debe ser EXCLUSIVAMENTE código HTML válido. Usa estilos en línea CSS profesionales y modernos.`;
  }

  const systemInstruction = `Eres un desarrollador web experto. Tu objetivo es crear un recurso educativo interactivo, visualmente atractivo y completamente funcional en un único archivo HTML.
El usuario te dará una descripción del recurso que necesita.
Debes utilizar todo el potencial de HTML, CSS Puro (NO USES Tailwind ni otras librerías CSS por CDN, escribe los estilos en línea o en una etiqueta <style>) y JavaScript.
El resultado debe ser un archivo HTML portable que funcione sin conexión.
Asegúrate de que el diseño sea responsivo, limpio y educativo.
IMPORTANTE: NO inventes URLs de imágenes externas. Si necesitas iconos, usa emojis, o dibuja los elementos necesarios usando CSS o SVG integrado.
OBLIGATORIO: DEBES ESCRIBIR LÓGICA DE JAVASCRIPT FUNCIONAL DENTRO DE ETIQUETAS <script> PARA QUE EL RECURSO SEA INTERACTIVO. 
CRÍTICO: NO uses atributos de eventos en línea en el HTML (como onclick="mifuncion()"). En su lugar, usa document.getElementById('id').addEventListener('click', mifuncion) dentro del <script> para evitar errores de Scope (ReferenceError).
Devuelve ÚNICAMENTE el código HTML completo, comenzando con <!DOCTYPE html> y terminando con </html>. No incluyas explicaciones ni bloques de código markdown.`;

  const prompt = `${systemInstruction}
  
  Crea un recurso educativo interactivo en HTML basado en este material: ${materialPrompt}
  ${contextoEspecifico ? `\nINSTRUCCIONES Y CONTEXTO PEDAGÓGICO ESPECÍFICO DEL MATERIAL SELECCIONADO:\n${contextoEspecifico}\n` : ''}
  Utiliza los parámetros de la estructura ROCA (Razón, Objetivo, Contexto, Actividad) definidos al final del plan para darle un enfoque real y pedagógico a este material.
  
  PLAN DE CLASE:
  ${planActual}`;

  try {
    let htmlResult = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
    htmlResult = htmlResult.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return htmlResult;
  } catch (error) {
    throw new Error('Error al generar material: ' + error.message);
  }
};

/**
 * Genera un recurso educativo interactivo, visualmente atractivo y autónomo en un único archivo HTML
 * a partir de una descripción detallada (simulaciones, infografías, diagramas de flujo, esquemas).
 * 
 * @param {string} apiKey - Clave API de Google AI Studio / Gemini
 * @param {string} prompt - Descripción del recurso pedagógico interactivo a generar
 * @returns {Promise<string>} Código HTML completo listo para embeber en un iframe o descargar
 */
export const generateHtmlResource = async (apiKey, prompt) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  const systemInstruction = `Eres un desarrollador web experto. Tu objetivo es crear un recurso educativo interactivo, visualmente atractivo y completamente funcional en un único archivo HTML.
El usuario te dará una descripción del recurso que necesita (por ejemplo, "una infografía minimalista de un teclado", "una simulación del ciclo del agua", "un diagrama interactivo de la célula").
Debes utilizar todo el potencial de HTML, CSS (puedes usar CSS puro o librerías confiables) y JavaScript.
El resultado debe ser un archivo HTML portable que funcione sin conexión (a menos que requiera cargar librerías externas por CDN, lo cual está permitido).
Asegúrate de que el diseño sea responsivo, limpio y educativo.
IMPORTANTE: NO inventes URLs de imágenes externas (ej. <img src="url_placeholder">). Si necesitas iconos, usa librerías confiables como FontAwesome o dibuja los elementos necesarios usando CSS o SVG integrado.
Devuelve ÚNICAMENTE el código HTML completo, comenzando con <!DOCTYPE html> y terminando con </html>. No incluyas explicaciones ni bloques de código markdown (como \`\`\`html).`;

  try {
    const responseText = await callGeminiApi(apiKey, {
      contents: [{ 
        parts: [{ 
          text: `${systemInstruction}\n\nCrea un recurso educativo interactivo en HTML basado en esta descripción: "${prompt}".` 
        }] 
      }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });

    let htmlContent = (responseText || '').trim();
    if (htmlContent.startsWith('```html')) htmlContent = htmlContent.substring(7);
    else if (htmlContent.startsWith('```')) htmlContent = htmlContent.substring(3);
    if (htmlContent.endsWith('```')) htmlContent = htmlContent.substring(0, htmlContent.length - 3);
    return htmlContent.trim();
  } catch (error) {
    throw new Error('Error al generar recurso interactivo: ' + error.message);
  }
};

