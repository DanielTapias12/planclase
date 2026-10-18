import assert from 'node:assert';
import fs from 'node:fs';
import { 
  resolveRealIdentification, 
  formatIdentificationMarkdown, 
  injectRealIdentificationIntoPlan,
  DEFAULT_IDENTIFICATION 
} from '../services/templates/identificationResolver.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: IDENTIFICACIÓN POR DEFECTO Y EXCLUSIÓN DE GRUPO/PERIODO ---');

// 1. Verificación de valores por defecto cuando no hay perfil ni datos
console.log('1. Verificando valores predeterminados sin perfil ni formulario...');

const resDefault = resolveRealIdentification({}, null);

assert.strictEqual(resDefault.institucion, 'Institución Educativa Técnica Distrital', 'Institución por defecto debe ser Técnica Distrital');
assert.strictEqual(resDefault.docente, 'Equipo de Matemáticas', 'Docente por defecto debe ser Equipo de Matemáticas');
assert.strictEqual(resDefault.grado, '10°', 'Grado por defecto debe ser 10°');
assert.strictEqual(resDefault.area, 'Matemáticas', 'Área por defecto debe ser Matemáticas');
assert.strictEqual(resDefault.duracionTexto, '90 minutos (1 sesión continua)', 'Duración por defecto debe ser 90 minutos (1 sesión continua)');
assert.strictEqual(resDefault.grupo, undefined, 'Grupo NO debe estar presente en los datos consolidados');
assert.strictEqual(resDefault.periodo, undefined, 'Periodo NO debe estar presente en los datos consolidados');

console.log('✓ Prueba 1 superada: Valores predeterminados institucionales y curriculares verificados.');

// 2. Verificación del bloque formateado en Markdown
console.log('2. Verificando formato canónico Markdown...');

const mdBlock = formatIdentificationMarkdown(resDefault);
console.log('Bloque generado:\n' + mdBlock);

assert(mdBlock.includes('- **Institución Educativa:** Institución Educativa Técnica Distrital'), 'Debe incluir Institución Educativa');
assert(mdBlock.includes('- **Docente:** Equipo de Matemáticas'), 'Debe incluir Docente');
assert(mdBlock.includes('- **Grado:** 10°'), 'Debe incluir Grado sin grupo');
assert(mdBlock.includes('- **Área / Asignatura:** Matemáticas'), 'Debe incluir Área / Asignatura');
assert(mdBlock.includes('- **Duración:** 90 minutos (1 sesión continua)'), 'Debe incluir Duración');
assert(mdBlock.includes('- **Metodología:** Aprendizaje Activo'), 'Debe incluir Metodología');
assert(mdBlock.includes('- **Recursos:** Materiales de aula y ambiente de aprendizaje'), 'Debe incluir Recursos');

assert(!mdBlock.includes('Grupo'), 'El bloque Markdown NO debe contener Grupo');
assert(!mdBlock.includes('Periodo'), 'El bloque Markdown NO debe contener Periodo');
assert(!mdBlock.includes('10-A'), 'El bloque Markdown NO debe contener 10-A');

console.log('✓ Prueba 2 superada: Bloque Markdown estrictamente formateado y limpio.');

// 3. Verificación de inyección y eliminación radical de grupo y periodo
console.log('3. Verificando limpieza e inyección en un plan con residuos antiguos de grupo y periodo...');

const planConResiduos = `
# PLAN DE CLASE — MATEMÁTICAS

### Identificación
- **Institución:** Institución Educativa Técnica del Contexto | Sede: Principal
- **Área:** Matemáticas | Asignatura: Álgebra
- **Grado y Grupo:** 10° (10-A) — 36 estudiantes
- **Tutor (IE):** Docente Titular | Docente en formación: Docente Planificador
- **Periodo Académico:** Segundo Periodo
- **Fecha de aplicación:** 16 de octubre de 2026 | Duración: 90 minutos, 1 sesión

### B. Fundamentación curricular
- **Objetivo de aprendizaje:** Comprender sistemas de ecuaciones lineales...
`;

const planLimpio = injectRealIdentificationIntoPlan(planConResiduos, resDefault);
console.log('Plan inyectado y depurado:\n' + planLimpio);

assert(!planLimpio.includes('Grupo'), 'No debe quedar ninguna mención de Grupo');
assert(!planLimpio.includes('10-A'), 'No debe quedar la mención de 10-A');
assert(!planLimpio.includes('Periodo'), 'No debe quedar ninguna mención de Periodo');
assert(!planLimpio.includes('Segundo Periodo'), 'No debe quedar Segundo Periodo');
assert(!planLimpio.includes('Sede'), 'No debe quedar Sede');
assert(!planLimpio.includes('Tutor'), 'No debe quedar Tutor');
assert(!planLimpio.includes('Docente en formación'), 'No debe quedar Docente en formación');
assert(!planLimpio.includes('Fecha de aplicación'), 'No debe quedar Fecha de aplicación');

assert(planLimpio.includes('- **Institución Educativa:** Institución Educativa Técnica Distrital'));
assert(planLimpio.includes('- **Docente:** Equipo de Matemáticas'));
assert(planLimpio.includes('- **Grado:** 10°'));
assert(planLimpio.includes('- **Área / Asignatura:** Matemáticas'));
assert(planLimpio.includes('- **Duración:** 90 minutos (1 sesión continua)'));
assert(planLimpio.includes('### B. Fundamentación curricular'));

console.log('✓ Prueba 3 superada: Residuos de grupo y periodo eliminados radicalmente sin alterar el contenido formativo.');

// 4. Verificación de respeto a datos reales del perfil del usuario cuando están presentes
console.log('4. Verificando que prevalece la información registrada por el usuario si la tiene...');

const userProfileRegistrado = {
  nombre: 'Dra. Carmen Solano',
  institucion: 'Colegio Distrital San José',
  area: 'Física y Matemáticas'
};

const resConPerfil = resolveRealIdentification({ grado: '11mo', duracion: '120 minutos' }, userProfileRegistrado);

assert.strictEqual(resConPerfil.institucion, 'Colegio Distrital San José');
assert.strictEqual(resConPerfil.docente, 'Dra. Carmen Solano');
assert.strictEqual(resConPerfil.area, 'Física y Matemáticas');
assert.strictEqual(resConPerfil.grado, '11mo');
assert(!resConPerfil.duracionTexto.includes('Grupo'));

console.log('✓ Prueba 4 superada: Se respetan los datos del perfil cuando el docente los ha registrado.');

// 5. Verificación de especificidades propias de cada área en genericTemplates
console.log('5. Verificando que cada área conserva su estructura disciplinar propia...');
import { 
  FORMATO_MATEMATICAS, 
  FORMATO_CIENCIAS_NATURALES, 
  FORMATO_CIENCIAS_SOCIALES, 
  FORMATO_INGLES 
} from '../services/templates/genericTemplates.js';

const mockWizardMat = { tema: 'Teorema de Pitágoras', materia: 'Matemáticas', metodologiaSTEAM: 'ABP', recursos: 'Calculadoras y reglas' };
const promptMat = FORMATO_MATEMATICAS.generarPromptInstrucciones(mockWizardMat, null);
assert(promptMat.includes('Pensamiento matemático predominante'), 'Matemáticas debe incluir pensamiento matemático');
assert(promptMat.includes('numérico, espacial, métrico, aleatorio o variacional'), 'Matemáticas debe incluir los tipos de pensamiento');
assert(promptMat.includes('Tema y situación contextual de aprendizaje'), 'Matemáticas debe incluir tema y situación contextual');
assert(promptMat.includes('- **Metodología:** ABP'), 'Matemáticas debe incluir Metodología en identificación');
assert(promptMat.includes('- **Recursos:** Calculadoras y reglas'), 'Matemáticas debe incluir Recursos en identificación');

const mockWizardNat = { tema: 'Ciclo del Agua', materia: 'Ciencias Naturales', metodologiaSTEAM: 'Indagación', recursos: 'Termómetros y recipientes' };
const promptNat = FORMATO_CIENCIAS_NATURALES.generarPromptInstrucciones(mockWizardNat, null);
assert(promptNat.includes('Eje temático o fenómeno por estudiar'), 'Ciencias Naturales debe incluir eje temático o fenómeno');
assert(promptNat.includes('Contexto ambiental, biológico, físico o químico relacionado con la clase'), 'Ciencias Naturales debe incluir contexto ambiental/biológico/físico/químico');
assert(promptNat.includes('- **Metodología:** Indagación'), 'Ciencias Naturales debe incluir Metodología en identificación');

const mockWizardSoc = { tema: 'La Revolución Industrial', materia: 'Ciencias Sociales', metodologiaSTEAM: 'Debate Crítico', recursos: 'Fuentes primarias y mapas' };
const promptSoc = FORMATO_CIENCIAS_SOCIALES.generarPromptInstrucciones(mockWizardSoc, null);
assert(promptSoc.includes('Eje temático y problema de indagación social'), 'Ciencias Sociales debe incluir eje temático y problema de indagación social');
assert(promptSoc.includes('Contexto sociocultural, histórico o geográfico relevante'), 'Ciencias Sociales debe incluir contexto sociocultural, histórico o geográfico relevante');
assert(promptSoc.includes('- **Metodología:** Debate Crítico'), 'Ciencias Sociales debe incluir Metodología en identificación');

const mockWizardIng = { tema: 'Daily Routines', materia: 'Inglés', metodologiaSTEAM: 'Communicative Approach', recursos: 'Flashcards y audios' };
const promptIng = FORMATO_INGLES.generarPromptInstrucciones(mockWizardIng, null);
assert(promptIng.includes('Unidad temática o situación comunicativa'), 'Inglés debe incluir unidad temática o situación comunicativa');
assert(promptIng.includes('Tema y contexto de uso del inglés'), 'Inglés debe incluir tema y contexto de uso del inglés');
assert(promptIng.includes('Nivel de competencia esperado, cuando esté definido'), 'Inglés debe incluir nivel de competencia esperado');
assert(promptIng.includes('- **Metodología:** Communicative Approach'), 'Inglés debe incluir Metodología en identificación');

console.log('✓ Prueba 5 superada: Estructuras y especificidades disciplinares de cada área estrictamente conservadas.');

console.log('\n========================================================================');
console.log('TODAS LAS PRUEBAS DE IDENTIFICACIÓN Y ESTRUCTURAS POR ÁREA PASARON');
console.log('========================================================================\n');
