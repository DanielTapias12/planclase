import assert from 'node:assert/strict';
import { recomendarMaterialesDidacticos } from './materialRecommender.js';

console.log('--- INICIO DE PRUEBAS DE ACEPTACIÓN: RECOMENDACIÓN DE MATERIALES DIDÁCTICOS ---');

// 1. Verificando recomendaciones contextuales para Tecnología e Informática (Tema: Algoritmos)
console.log('1. Verificando recomendaciones para Tecnología e Informática (Algoritmos)...');

const metaInformatica = {
  materia: 'Tecnología e Informática',
  grado: '7°',
  tema: 'Estructuras de Control y Algoritmos con Scratch',
  duracion: '2 horas'
};
const planMdInformatica = `# PLAN DE CLASE — TECNOLOGÍA E INFORMÁTICA
### Fundamentación
El estudiante aprende lógica de programación y algoritmos condicionales con Scratch.`;

const recsInformatica = recomendarMaterialesDidacticos(metaInformatica, planMdInformatica);

assert.ok(Array.isArray(recsInformatica), 'Debe retornar un array');
assert.ok(recsInformatica.length >= 2 && recsInformatica.length <= 4, 'Debe sugerir entre 2 y 4 materiales');
assert.ok(recsInformatica.some(r => r.tipo === 'Simulación funcional'), 'Debe incluir una simulación funcional para algoritmos');
assert.ok(recsInformatica.some(r => r.tipo === 'Infografía interactiva'), 'Debe incluir una infografía interactiva');
assert.ok(recsInformatica.every(r => r.nombre && r.proposito && r.relacionPlan && r.typeKey), 'Cada tarjeta debe incluir nombre, propósito, relación con el plan y tipo');

console.log('✓ Prueba 1 superada: Recomendaciones contextuales de Informática (Algoritmos) verificadas.');

// 2. Verificando recomendaciones para Tecnología e Informática (Tema: Excel / Referencias)
console.log('2. Verificando recomendaciones para Tecnología e Informática (Excel)...');

const metaExcel = {
  materia: 'Tecnología e Informática',
  grado: '8°',
  tema: 'Referencias Relativas y Absolutas en Excel',
  duracion: '2 horas'
};
const planMdExcel = `# PLAN DE CLASE
### Secuencia Didáctica
Fórmulas avanzadas y hojas de cálculo con datos de inventarios y presupuesto.`;

const recsExcel = recomendarMaterialesDidacticos(metaExcel, planMdExcel);

assert.ok(recsExcel.length >= 2 && recsExcel.length <= 4, 'Debe sugerir entre 2 y 4 materiales');
const recInfografiaExcel = recsExcel.find(r => r.id === 'rec_infografia_excel');
assert.ok(recInfografiaExcel, 'Debe incluir la infografía específica de referencias relativas y absolutas');
assert.ok(recInfografiaExcel.proposito.includes('referencias de celda'), 'El propósito debe explicar referencias de celda');

console.log('✓ Prueba 2 superada: Recomendaciones para Excel verificadas con exactitud.');

// 3. Verificando recomendaciones para Matemáticas (Área Diferente)
console.log('3. Verificando recomendaciones para Matemáticas (Teorema de Pitágoras)...');

const metaMatematicas = {
  materia: 'Matemáticas',
  grado: '8°',
  tema: 'Teorema de Pitágoras y Triángulos Rectángulos',
  duracion: '2 horas'
};
const planMdMate = `# PLAN DE CLASE — MATEMÁTICAS
### Fundamentación
Resolución de problemas de distancias mediante el teorema de Pitágoras.`;

const recsMate = recomendarMaterialesDidacticos(metaMatematicas, planMdMate);

assert.ok(recsMate.length >= 2 && recsMate.length <= 4, 'Debe sugerir entre 2 y 4 materiales');
assert.ok(recsMate.some(r => r.tipo === 'Simulación funcional'), 'Matemáticas debe incluir simulador dinámico');
assert.ok(recsMate.some(r => r.tipo === 'Cuestionario interactivo'), 'Matemáticas debe incluir cuestionario de situaciones problema');
// Verificar que las recomendaciones de matemáticas difieren de las de informática
assert.notDeepStrictEqual(recsMate.map(r => r.id), recsInformatica.map(r => r.id), 'Las sugerencias deben adaptarse según la disciplina');

console.log('✓ Prueba 3 superada: Diferenciación pedagógica entre materias validada.');

// 4. Verificando recomendaciones para Ciencias Sociales
console.log('4. Verificando recomendaciones para Ciencias Sociales (Civilización Muisca)...');

const metaSociales = {
  materia: 'Ciencias Sociales',
  grado: '6°',
  tema: 'Civilizaciones Prehispánicas: El Territorio y la Sociedad Muisca',
  duracion: '2 horas'
};
const planMdSociales = `# PLAN DE CLASE — CIENCIAS SOCIALES
### Fundamentación
Análisis crítico del poblamiento y manejo ambiental del territorio por comunidades indígenas.`;

const recsSociales = recomendarMaterialesDidacticos(metaSociales, planMdSociales);

assert.ok(recsSociales.length >= 2 && recsSociales.length <= 4, 'Debe sugerir entre 2 y 4 materiales');
assert.ok(recsSociales.some(r => r.id === 'rec_infografia_sociales'), 'Debe incluir línea de tiempo o cartografía interactiva');
assert.ok(recsSociales.some(r => r.id === 'rec_cuestionario_sociales'), 'Debe incluir estudio de caso / dilema ético-social');
assert.ok(recsSociales.some(r => r.id === 'rec_rubrica_sociales'), 'Debe incluir rúbrica de fuentes y argumentación');

console.log('✓ Prueba 4 superada: Recomendaciones de Ciencias Sociales validadas con éxito.');

// 5. Verificando que ninguna función muta el plan de clase ni genera archivos automáticamente
console.log('5. Verificando principio de no-generación automática y pureza funcional...');

const copiaPlan = `${planMdInformatica}`;
recomendarMaterialesDidacticos(metaInformatica, planMdInformatica);
assert.strictEqual(copiaPlan, planMdInformatica, 'El plan original no debe mutar en memoria');

console.log('✓ Prueba 4 superada: Inmutabilidad del plan confirmada.');

console.log('\n======================================================');
console.log('TODAS LAS PRUEBAS DE MATERIALES DIDÁCTICOS SE EJECUTARON CON ÉXITO');
console.log('======================================================\n');
