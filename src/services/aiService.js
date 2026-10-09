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
  "Tecnología e Informática": "Debes basarte en las Orientaciones Generales para la Educación en Tecnología de Colombia. Enfatiza en pensamiento computacional, uso responsable de TIC y solución de problemas tecnológicos.",
  "Matemáticas": "Debes basarte en los Estándares Básicos y DBA de Matemáticas de Colombia. El plan debe enfocarse en la resolución de problemas (Pensamiento Numérico, Espacial, Aleatorio).",
  "Lenguaje (Español)": "Debes basarte en los Estándares Básicos y DBA de Lenguaje de Colombia. Enfócate en producción textual, comprensión lectora y el enfoque semántico-comunicativo.",
  "Inglés": "Debes basarte en los DBA de Inglés de Colombia y el Marco Común Europeo (MCER). Incluye explícitamente secciones para Listening, Speaking, Reading y Writing."
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
  const prompt = `Como experto pedagogo alineado con los lineamientos oficiales, sugiere propósitos y objetivos de aprendizaje (1 o 2 párrafos cortos) para una clase con el siguiente contexto:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales: ${reglas}
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
  const prompt = `Como experto curricular en Colombia, sugiere qué competencias y desempeños aplican para esta clase:
Tema: ${wizardData.tema}
Grado: ${wizardData.grado}
Área Curricular: ${wizardData.materia}
Lineamientos Legales: ${reglas}
Objetivos: ${wizardData.objetivos}
Responde SOLO con una lista de los componentes y estándares aplicables, sin saludos.`;

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
export const generatePlan = async (apiKey, wizardData) => {
  let formatInstructions = '';

  if (wizardData.formato === 'Estructura estándar INSPIRATEC') {
    formatInstructions = `Formatea la respuesta siguiendo estrictamente esta estructura con los mismos títulos e íconos (usa sintaxis Markdown para negritas y listas):

### 1. 🧾 Caracterización de la clase
**Nombre de la Institución**: [A completar]  
**Sede**: [A completar]  
**Título**: ${wizardData.tema}  
**Área / Asignatura**: ${wizardData.materia}  
**Grado**: ${wizardData.grado}  
**Duración**: ${wizardData.duracion}  

### 2. 🎯 Desempeños de aprendizaje
**Evidencia de aprendizaje**: (Redacta la evidencia basada en los objetivos)  
**Propósito**: (Redacta el propósito general)  
**Competencia ciudadana**: (Relacionado a los estándares)  

### 3. 🧠 Desarrollo de la clase (momentos pedagógicos)
**¿QUÉ VOY A APRENDER? (Exploración)**  
(Describe la motivación y activación de saberes previos)  

**PRACTICO LO QUE APRENDÍ (Estructuración y práctica colaborativa)**  
(Desarrolla el grueso de la clase y las actividades principales según la metodología elegida)  

**PRACTICO EN CASA (Transferencia y refuerzo)**  
(Actividad sugerida para realizar en casa)  

### 4. 📊 Evaluación
**DOY CUENTA DE LO QUE APRENDÍ**  
(Proporciona un mecanismo de evaluación formativa, ej. Semáforo del aprendizaje o preguntas de reflexión visual)  

### 5. 🤝 Adaptaciones Inclusivas
(Describe adaptaciones basadas en las necesidades marcadas: ${wizardData.inclusion.join(', ')}. Usa estrategias visuales o DUA si aplica.)

### 6. 🛠️ Material Interconectado Recomendado (Formato ROCA)
(Analiza el plan generado y escoge UNO de los siguientes materiales: Rúbrica, Diapositivas, Preguntas o Juego.
Estructura tu recomendación usando el formato ROCA:
**R**azón: Por qué este material es el más adecuado para el tema.
**O**bjetivo: Qué logrará el estudiante con él.
**C**ontexto: En qué momento exacto de la clase debe usarse.
**A**ctividad: Cómo se ejecutará.

Al final de la recomendación, debes incluir la siguiente etiqueta exacta dependiendo del material que elegiste:
Si elegiste Rúbrica: [GENERAR_RUBRICA]
Si elegiste Diapositivas: [GENERAR_DIAPOSITIVAS]
Si elegiste Preguntas: [GENERAR_PREGUNTAS]
Si elegiste Juego/Sopa de Letras: [GENERAR_JUEGO]
)`;
  } else if (wizardData.formatoInstrucciones && wizardData.formatoInstrucciones.trim() !== '') {
    formatInstructions = `Formatea la respuesta adaptándose estrictamente al siguiente formato solicitado por el docente (${wizardData.formato}):
    
${wizardData.formatoInstrucciones}

Asegúrate de adaptar el contenido de la clase a esta estructura solicitada.`;
  } else {
    formatInstructions = `Formatea la respuesta adaptándose al formato solicitado: "${wizardData.formato}".
Asegúrate de incluir de manera estructurada en Markdown:
- Información general de la clase.
- Elementos curriculares (Objetivos, Estándares).
- Secuencia didáctica (Inicio, Desarrollo, Cierre).
- Criterios de evaluación.
- Adaptaciones Inclusivas (DUA).`;
  }

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
Estándares MEN: ${wizardData.estandaresMEN.join(', ')}
Inclusión (DUA): ${wizardData.inclusion.join(', ')} ${wizardData.otrasNecesidades}

${formatInstructions}`;

  try {
    const planText = await callGeminiApi(apiKey, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 8192 }
    });
    return planText;
  } catch (error) {
    throw new Error('Error al generar el plan: ' + error.message);
  }
};

/**
 * Modificación del plan existente mediante chat
 */
export const modifyPlan = async (apiKey, planActual, instruccion) => {
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
    }
    return text.trim();
  } catch (error) {
    throw new Error('Error al modificar el plan: ' + error.message);
  }
};

/**
 * Generación de material complementario (rúbricas, diapositivas, quizzes, juegos)
 */
export const generateComplementaryMaterial = async (apiKey, planActual, type) => {
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
