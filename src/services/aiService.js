import { resolveEffectiveTemplate } from './templates/genericTemplates';
import { resolveRealIdentification, injectRealIdentificationIntoPlan } from './templates/identificationResolver';
import { useAppStore } from '../store/useAppStore';
import { getPedagogicalDna, formatDnaPromptDirective } from './pedagogicalDnaService';
import { 
  buildPresentationHtml, 
  generateGamifiedQuizHTML,
  generateInteractiveQuestionsHTML, 
  generateWordsearchHTML, 
  generateInteractiveRubricHTML, 
  generateInteractiveFlashcardsHTML, 
  injectShareBarIntoHtml 
} from './materials/index.js';

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
export const generatePlan = async (apiKey, wizardData, customTemplates = [], userProfile = null) => {
  // Obtener perfil del usuario del store si no fue provisto como argumento
  const effectiveProfile = userProfile || useAppStore?.getState?.()?.userProfile || null;
  const realData = resolveRealIdentification(wizardData, effectiveProfile);

  // Resuelve la plantilla efectiva respetando que los formatos propios de docentes prevalecen estructuralmente
  const effectiveTemplate = resolveEffectiveTemplate(wizardData, customTemplates, effectiveProfile);
  const formatInstructions = effectiveTemplate.instrucciones;

  // Carga del ADN Pedagógico y memoria contextual si está habilitado
  let directivaAdn = '';
  if (wizardData?.aplicarAdnPedagógico !== false) {
    try {
      const targetUid = effectiveProfile?.uid || useAppStore?.getState?.()?.userId || 'anon';
      const dna = await getPedagogicalDna(targetUid);
      directivaAdn = formatDnaPromptDirective(dna, wizardData);
    } catch (e) {
      console.warn("No se pudo cargar el ADN pedagógico para el prompt:", e);
    }
  }

  const orientacionDisciplinar = `
ORIENTACIÓN DIDÁCTICA Y DISCIPLINAR CRÍTICA:
1. SELECCIÓN PERTINENTE: Los apartados disciplinares (por ejemplo: DBA, representaciones matemáticas específicas, errores frecuentes, precauciones de seguridad de laboratorio, género textual, tipos de evidencias o herramientas digitales/manipulativas) NO deben ser campos obligatorios universales mecánicos. Selecciona y desarrolla ÚNICAMENTE los apartados que sean directamente pertinentes al objetivo formativo de la clase, el grado escolar (${realData.grado || 'del nivel'}), el contexto real y los recursos disponibles (${wizardData.recursos || 'especificados'}). Si un apartado no aplica al tema concreto, no lo fuerces.
2. RIGOR CURRICULAR SIN INVENTAR: NO inventes estándares ni códigos ficticios de DBA. Fundaméntate estrictamente en los referentes reales y vigentes del Ministerio de Educación Nacional de Colombia (MEN) y Colombia Aprende. Si no dispones del código exacto de un DBA, describe el aprendizaje formativo real sin crear números inventados.
3. DATOS DE IDENTIFICACIÓN REALES: En la sección '### Identificación', debes transcribir fielmente los datos reales provistos sin modificarlos ni reemplazarlos por texto ficticio o nombres de ejemplo.
4. ORGANIZACIÓN PEDAGÓGICA Y TIEMPOS: Presenta una estructura coherente y jerárquica con instrucciones concretas, diferenciando las orientaciones del docente y las acciones esperadas de los estudiantes. Si se indican tiempos por fase, asegúrate de que sean realistas y que la suma de los momentos corresponda exactamente a la duración disponible (${realData.duracionTexto}).
5. NOTACIÓN MATEMÁTICA Y FÓRMULAS: En caso de incluir fórmulas, ecuaciones o expresiones de cálculo, utiliza delimitadores estándar ($...$ o $$...$$) o símbolos matemáticos directos (×, ÷, ±, ², ³). No utilices barras invertidas duplicadas ni escapes de código innecesarios.
6. FORMATO DE RESPUESTA: Entrega directamente el documento pedagógico estructurado en Markdown legible. NO envuelvas todo el plan en bloques de código con triple comilla invertida (\`\`\`markdown).
7. RECURSOS GENERABLES POR LA IA: Solo cuando sea estrictamente necesario para visualizar un concepto pedagógico complejo (como un diagrama de flujo, una infografía del hardware, un esquema de una red, una simulación o un modelo interactivo), puedes sugerir un recurso visual interactivo en la mediación o recursos de la clase. Formatea la sugerencia así: [GENERATE_IMAGE: "una descripción detallada del recurso pedagógico interactivo a generar"].
`;

  const reglas = REGLAS_MEN[wizardData.materia] || REGLAS_MEN["Tecnología e Informática"];
  const prompt = `Actúa como un planificador experto en el área de ${wizardData.materia}. Tus lineamientos legales son: ${reglas}. Genera un plan de clase estructurado en formato Markdown con la siguiente información:
Tema: ${wizardData.tema}
Institución: ${realData.institucion}
Área: ${realData.area}
Grado: ${realData.grado}
Docente: ${realData.docente}
Duración: ${realData.duracionTexto}
Estudiantes: ${wizardData.numEstudiantes || '30'}
Recursos: ${wizardData.recursos}
Metodología: ${wizardData.metodologiaSTEAM || 'Aprendizaje Activo'}
Objetivos: ${wizardData.objetivos}
Estándares MEN: ${Array.isArray(wizardData.estandaresMEN) ? wizardData.estandaresMEN.join(', ') : (wizardData.estandaresMEN || '')}
Inclusión (DUA): ${Array.isArray(wizardData.inclusion) ? wizardData.inclusion.join(', ') : ''} ${wizardData.otrasNecesidades || ''}

${directivaAdn}
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

    // Inyección de garantía: asegura que la sección de Identificación refleje los datos reales del usuario
    cleaned = injectRealIdentificationIntoPlan(cleaned, realData);

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
 * Extrae metadatos pedagógicos del plan de clase para contextualizar materiales
 */
const extractPlanMetadata = (planMarkdown = '') => {
  let title = 'Secuencia Didáctica';
  let subject = 'Informática y Tecnología';
  let grade = '';

  const titleMatch = planMarkdown.match(/#\s*(?:Plan de Clase:?|Secuencia Didáctica:?)\s*([^\n\r]+)/i) ||
                     planMarkdown.match(/\*\*Tema(?:\s*o\s*Contenido)?:\*\*\s*([^\n\r|]+)/i) ||
                     planMarkdown.match(/Tema:\s*([^\n\r|]+)/i);
  if (titleMatch && titleMatch[1]) title = titleMatch[1].trim();

  const subjectMatch = planMarkdown.match(/\*\*Área(?:\/Asignatura)?:\*\*\s*([^\n\r|]+)/i) ||
                       planMarkdown.match(/Área:\s*([^\n\r|]+)/i);
  if (subjectMatch && subjectMatch[1]) subject = subjectMatch[1].trim();

  const gradeMatch = planMarkdown.match(/\*\*Grado:\*\*\s*([^\n\r|]+)/i) ||
                     planMarkdown.match(/Grado:\s*([^\n\r|]+)/i);
  if (gradeMatch && gradeMatch[1]) grade = gradeMatch[1].trim();

  return { title, subject, grade };
};

/**
 * Generación de material complementario (rúbricas, diapositivas, quizzes, juegos, flashcards)
 * Garantiza interactividad autónoma (offline), audio sintetizado, temporizadores,
 * navegación por teclado y barra universal de compartir e imprimir.
 */
export const generateComplementaryMaterial = async (apiKey, planActual, type, contextoEspecifico = '') => {
  const meta = extractPlanMetadata(planActual);
  const normalizedType = (type || '').toLowerCase();

  // 1. DIAPOSITIVAS / PRESENTACIÓN PEDAGÓGICA INTERACTIVA
  if (normalizedType === 'diapositivas' || normalizedType === 'presentacion' || normalizedType === 'slides' || normalizedType === 'ova') {
    try {
      const prompt = `Basado en el siguiente plan de clase, genera el contenido para unas Diapositivas de Presentación pedagógicas (entre 4 y 6 diapositivas).
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "${meta.title}",
  "subject": "${meta.subject}",
  "grade": "${meta.grade}",
  "slides": [
    {
      "title": "Título claro de la diapositiva",
      "subtitle": "Subtítulo o pregunta orientadora",
      "content": ["Punto clave 1", "Punto clave 2", "Punto clave 3"],
      "notes": "Consejo o nota pedagógica para el docente durante la explicación"
    }
  ]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
      });
      const cleanJson = res.replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/i, '').replace(/\`\`\`\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return buildPresentationHtml({
        title: parsed.title || meta.title,
        subject: parsed.subject || meta.subject,
        grade: parsed.grade || meta.grade,
        slides: Array.isArray(parsed.slides) ? parsed.slides : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de diapositivas local:', err.message);
      return buildPresentationHtml({
        title: meta.title,
        subject: meta.subject,
        grade: meta.grade
      });
    }
  }

  // 2. PREGUNTAS / CUESTIONARIO FORMATIVO INTERACTIVO (con pistas DUA y retroalimentación)
  if (normalizedType === 'preguntas' || normalizedType === 'cuestionario') {
    try {
      const prompt = `Basado en el siguiente plan de clase, genera un Banco de 4 a 5 Preguntas Formativas de selección múltiple con pistas DUA y retroalimentación pedagógica.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "Cuestionario: ${meta.title}",
  "subject": "${meta.subject}",
  "grade": "${meta.grade}",
  "questions": [
    {
      "question": "¿Pregunta pedagógica contextualizada con el tema?",
      "options": ["Opción correcta y fundamentada", "Opción distractora creíble 1", "Opción distractora creíble 2", "Opción distractora creíble 3"],
      "correctIndex": 0,
      "hint": "Pista pedagógica DUA para orientar el razonamiento del estudiante.",
      "explanation": "Explicación detallada de por qué esta es la respuesta correcta y qué concepto valida."
    }
  ]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
      });
      const cleanJson = res.replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/i, '').replace(/\`\`\`\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return generateInteractiveQuestionsHTML({
        title: parsed.title || `Cuestionario: ${meta.title}`,
        subject: parsed.subject || meta.subject,
        grade: parsed.grade || meta.grade,
        questions: Array.isArray(parsed.questions) ? parsed.questions : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de preguntas local:', err.message);
      return generateInteractiveQuestionsHTML({
        title: `Cuestionario: ${meta.title}`,
        subject: meta.subject,
        grade: meta.grade
      });
    }
  }

  // 3. JUEGOS / TRIVIA GAMIFICADA (con sonido Web Audio, temporizador, rachas y medallas)
  if (normalizedType === 'juegos' || normalizedType === 'juego' || normalizedType === 'game' || normalizedType === 'trivia' || normalizedType === 'quiz') {
    try {
      const prompt = `Basado en el siguiente plan de clase, genera una Trivia Gamificada interactiva de 5 retos rápidos de selección múltiple para jugar en clase.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "Juego Trivia: ${meta.title}",
  "subject": "${meta.subject}",
  "questions": [
    {
      "question": "¿Reto o pregunta lúdica de comprobación?",
      "options": ["Respuesta correcta", "Distractor 1", "Distractor 2", "Distractor 3"],
      "correctIndex": 0,
      "feedback": "¡Genial! Breve mensaje de felicitación y concepto clave aprendido."
    }
  ]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
      });
      const cleanJson = res.replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/i, '').replace(/\`\`\`\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return generateGamifiedQuizHTML({
        title: parsed.title || `Juego Trivia: ${meta.title}`,
        subject: parsed.subject || meta.subject,
        questions: Array.isArray(parsed.questions) ? parsed.questions : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de juego trivia local:', err.message);
      return generateGamifiedQuizHTML({
        title: `Juego Trivia: ${meta.title}`,
        subject: meta.subject
      });
    }
  }

  // 4. SOPA DE LETRAS TEMÁTICA INTERACTIVA
  if (normalizedType === 'sopa' || normalizedType === 'sopa_letras' || normalizedType === 'wordsearch') {
    try {
      const prompt = `Basado en el siguiente plan de clase, extrae entre 8 y 10 conceptos o palabras clave fundamentales para una Sopa de Letras educativa.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "Sopa de Letras: ${meta.title}",
  "subject": "${meta.subject}",
  "words": ["PALABRA1", "PALABRA2", "PALABRA3", "PALABRA4", "PALABRA5", "PALABRA6", "PALABRA7", "PALABRA8"]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.5, maxOutputTokens: 2048 }
      });
      const cleanJson = res.replace(/^\`\`\`json\s*/i, '').replace(/^\`\`\`\s*/i, '').replace(/\`\`\`\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return generateWordsearchHTML({
        title: parsed.title || `Sopa de Letras: ${meta.title}`,
        subject: parsed.subject || meta.subject,
        words: Array.isArray(parsed.words) ? parsed.words : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de sopa de letras local:', err.message);
      return generateWordsearchHTML({
        title: `Sopa de Letras: ${meta.title}`,
        subject: meta.subject
      });
    }
  }

  // 4. RÚBRICA ANALÍTICA INTERACTIVA
  if (normalizedType === 'rubrica' || normalizedType === 'rubricas') {
    try {
      const prompt = `Basado en el siguiente plan de clase, genera una Rúbrica Analítica de Evaluación formativa con 3 o 4 criterios esenciales.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "Rúbrica: ${meta.title}",
  "subject": "${meta.subject}",
  "grade": "${meta.grade}",
  "criteria": [
    {
      "name": "Nombre del criterio evaluativo",
      "weight": 30,
      "levels": {
        "superior": "Descriptor de desempeño superior (5.0)",
        "alto": "Descriptor de desempeño alto (4.0)",
        "basico": "Descriptor de desempeño básico (3.2)",
        "bajo": "Descriptor de desempeño bajo (2.0)"
      }
    }
  ]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
      });
      const cleanJson = res.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return generateInteractiveRubricHTML({
        title: parsed.title || `Rúbrica: ${meta.title}`,
        subject: parsed.subject || meta.subject,
        grade: parsed.grade || meta.grade,
        criteria: Array.isArray(parsed.criteria) ? parsed.criteria : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de rúbrica local:', err.message);
      return generateInteractiveRubricHTML({
        title: `Rúbrica: ${meta.title}`,
        subject: meta.subject,
        grade: meta.grade
      });
    }
  }

  // 5. FLASHCARDS 3D INTERACTIVAS
  if (normalizedType === 'flashcards') {
    try {
      const prompt = `Basado en el siguiente plan de clase, genera entre 5 y 8 Flashcards de vocabulario y conceptos clave interactivos.
Devuelve ÚNICAMENTE un objeto JSON válido con este formato:
{
  "title": "Flashcards: ${meta.title}",
  "subject": "${meta.subject}",
  "grade": "${meta.grade}",
  "cards": [
    {
      "front": "Término o concepto",
      "back": "Definición clara, contextualizada y comprensible",
      "category": "Categoría conceptual"
    }
  ]
}
${contextoEspecifico ? `Instrucciones adicionales: ${contextoEspecifico}` : ''}
PLAN DE CLASE:
${planActual}`;

      const res = await callGeminiApi(apiKey, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.6, maxOutputTokens: 4096 }
      });
      const cleanJson = res.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      return generateInteractiveFlashcardsHTML({
        title: parsed.title || `Flashcards: ${meta.title}`,
        subject: parsed.subject || meta.subject,
        grade: parsed.grade || meta.grade,
        cards: Array.isArray(parsed.cards) ? parsed.cards : []
      });
    } catch (err) {
      console.warn('[INSPIRATEC] Fallback a generador de flashcards local:', err.message);
      return generateInteractiveFlashcardsHTML({
        title: `Flashcards: ${meta.title}`,
        subject: meta.subject,
        grade: meta.grade
      });
    }
  }

  // 6. OTROS MATERIALES (Infografía, Simulación, Taller de Contexto, Guía, etc.)
  let materialPrompt = '';
  if (normalizedType === 'taller_contexto') {
    materialPrompt = `genera un Taller de Contexto Real interactivo con 5 problemas prácticos aplicados a la vida cotidiana. Incluye campos de entrada, botones interactivos para 'Verificar solución / Pista' y retroalimentación explicativa paso a paso.`;
  } else if (normalizedType === 'infografia') {
    materialPrompt = `genera una Infografía Interactiva explicativa con diagramas visuales en SVG o CSS, tarjetas desplegables tipo acordeón y botones interactivos para explorar cada fase conceptual.`;
  } else if (normalizedType === 'simulacion') {
    materialPrompt = `genera una Simulación Interactiva en HTML5 Canvas o SVG dinámico con controles funcionales (deslizadores de parámetros, botones de reproducir, pausar y reiniciar) que permitan al estudiante experimentar directamente con las variables del tema.`;
  } else if (normalizedType === 'reading') {
    materialPrompt = `genera un ejercicio interactivo de Reading Comprehension con texto en inglés, preguntas interactivas con comprobación inmediata y glosario flotante de términos clave.`;
  } else if (normalizedType === 'guia_modelacion') {
    materialPrompt = `genera una Guía de Modelación Matemática paso a paso interactiva con visualizadores geométricos o numéricos y comprobación de respuestas.`;
  } else {
    materialPrompt = `genera un recurso interactivo autónomo con interfaz moderna, botones con addEventListener funcionales y retroalimentación en pantalla.`;
  }

  const systemInstruction = `Eres un desarrollador web experto. Tu objetivo es crear un recurso educativo interactivo, visualmente atractivo y 100% funcional en un único archivo HTML.
Debes escribir todo el código CSS y JavaScript puro dentro del mismo archivo sin librerías externas por CDN.
El recurso debe ser completamente funcional e interactivo para estudiantes y docentes.
IMPORTANTE: Usa document.getElementById(...).addEventListener('click', ...) dentro de una etiqueta <script> al final del body para garantizar que los eventos funcionen siempre y no fallen por scope.
Devuelve ÚNICAMENTE el código HTML completo desde <!DOCTYPE html> hasta </html>.`;

  const prompt = `${systemInstruction}
  
Crea un recurso educativo en HTML para: ${materialPrompt}
${contextoEspecifico ? `\nInstrucciones específicas: ${contextoEspecifico}\n` : ''}
TEMA: ${meta.title} | ÁREA: ${meta.subject} | GRADO: ${meta.grade}

PLAN DE CLASE:
${planActual}`;

  try {
    let htmlResult = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
    htmlResult = htmlResult.replace(/^```html\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    return injectShareBarIntoHtml(htmlResult, { title: meta.title, subject: meta.subject, grade: meta.grade });
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
 * @returns {Promise<string>} Código HTML completo listo para embeber en un iframe o descargar con barra de compartir
 */
export const generateHtmlResource = async (apiKey, prompt) => {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API Key no configurada. Por favor, ingresa tu clave en Configuración.');
  }

  const systemInstruction = `Eres un desarrollador web experto. Tu objetivo es crear un recurso educativo interactivo, visualmente atractivo y completamente funcional en un único archivo HTML.
Debes utilizar HTML5, CSS moderno y JavaScript nativo autocontenido.
El resultado debe ser un archivo HTML portable que funcione sin conexión.
Asegúrate de que el diseño sea responsivo, limpio y educativo.
Usa addEventListener en el JavaScript para la interactividad. No dependas de librerías externas.
Devuelve ÚNICAMENTE el código HTML completo, comenzando con <!DOCTYPE html> y terminando con </html>. Sin bloques markdown.`;

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
    htmlContent = htmlContent.trim();

    return injectShareBarIntoHtml(htmlContent, {
      title: prompt.slice(0, 45),
      subject: 'Recurso Pedagógico Interactivo'
    });
  } catch (error) {
    throw new Error('Error al generar recurso interactivo: ' + error.message);
  }
};

