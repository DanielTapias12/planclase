import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { generatePlan, suggestObjectives, suggestStandards } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Save } from 'lucide-react';

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSuggestingObj, setIsSuggestingObj] = useState(false);
  const [isSuggestingStd, setIsSuggestingStd] = useState(false);
  
  const { wizardData, updateWizardData, apiKey, setPlanGenerado, setPlanStatus } = useAppStore();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && (!wizardData.tema || !wizardData.recursos)) {
      alert("Por favor completa el Tema y los Recursos disponibles (marcados con *).");
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };
  
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const arr = wizardData[name] || [];
      if (checked) updateWizardData({ [name]: [...arr, value] });
      else updateWizardData({ [name]: arr.filter(item => item !== value) });
    } else {
      if (name === 'materia') {
        updateWizardData({ [name]: value, recursos: '' });
      } else {
        updateWizardData({ [name]: value });
      }
    }
  };

  const handleSuggestObjectives = async () => {
    if (!apiKey) return alert("Configura tu API Key en la sección Administración/BYOK.");
    setIsSuggestingObj(true);
    try {
      const text = await suggestObjectives(apiKey, wizardData);
      updateWizardData({ objetivos: text });
    } catch (e) {
      alert(e.message);
    }
    setIsSuggestingObj(false);
  };

  const handleSuggestStandards = async () => {
    if (!apiKey) return alert("Configura tu API Key en la sección Administración/BYOK.");
    setIsSuggestingStd(true);
    try {
      const text = await suggestStandards(apiKey, wizardData);
      updateWizardData({ estandaresMEN: [text] }); 
    } catch (e) {
      alert(e.message);
    }
    setIsSuggestingStd(false);
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      alert("Por favor, configura tu API Key primero.");
      navigate('/administracion'); // Placeholder para config
      return;
    }
    setIsGenerating(true);
    try {
      const plan = await generatePlan(apiKey, wizardData);
      setPlanGenerado(plan);
      setPlanStatus('borrador');
      navigate('/editor');
    } catch (error) {
      alert(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const stepsInfo = [
    { num: 1, title: 'Información básica', desc: 'Contexto de tu clase para construir una planificación pertinente.' },
    { num: 2, title: 'Metodología', desc: 'Define cómo orientarás el aprendizaje de tus estudiantes.' },
    { num: 3, title: 'Estándares', desc: 'Conecta las actividades con los referentes curriculares.' },
    { num: 4, title: 'Inclusión', desc: 'Anticipa barreras de aprendizaje y considera apoyos.' }
  ];

  return (
    <div className="planificador-view" style={{ padding: '0 20px 60px 20px', maxWidth: '900px' }}>
      
      {/* Header Centralizado */}
      <div className="planificador-header" style={{ textAlign: 'center', marginBottom: '48px', marginTop: '24px' }}>
        <h2 style={{ fontSize: '36px', color: 'var(--primary-active)', marginBottom: '12px' }}>Planificador de Clases</h2>
        <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Construye secuencias didácticas estructuradas con asistencia de Inteligencia Artificial.
        </p>
      </div>
      
      {/* Indicador de Progreso Mejorado */}
      <div id="tour-wizard-progress" className="planificador-progress" style={{ marginBottom: '48px', padding: '0 40px' }}>
        {stepsInfo.map(s => (
          <div key={s.num} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, width: '120px', marginLeft: '-45px', marginRight: '-45px' }}>
            <div className={`planificador-step ${step === s.num ? 'active' : ''} ${step > s.num ? 'completed' : ''}`} style={{ marginBottom: '12px', width: '40px', height: '40px', fontSize: '16px' }}>
              {s.num}
            </div>
            <span style={{ fontSize: '13px', fontWeight: step === s.num ? '700' : '500', color: step === s.num ? 'var(--primary-active)' : 'var(--text-secondary)', textAlign: 'center' }}>
              {s.title}
            </span>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '40px 48px', backgroundColor: '#FFFFFF', boxShadow: '0 8px 30px rgba(0,0,0,0.04)' }}>
        
        {/* Título interno de la fase */}
        <div style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '22px', color: 'var(--primary-active)', marginBottom: '8px' }}>Fase {step}: {stepsInfo[step-1].title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{stepsInfo[step-1].desc}</p>
        </div>

        <div className="planificador-form" style={{ gap: '0' }}>
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label>Nombre de la clase o tema <span style={{color: 'var(--error-color)'}}>*</span></label>
                <input id="tour-wizard-start" type="text" name="tema" value={wizardData.tema} onChange={handleChange} placeholder={wizardData.materia === 'Matemáticas' ? "Ej.: Suma de fracciones con distinto denominador" : wizardData.materia === 'Lenguaje (Español)' ? "Ej.: El cuento y sus partes" : wizardData.materia === 'Inglés' ? "Ej.: Verb To Be (Present Simple)" : "Ej.: Introducción a la programación con Scratch"} />
                <div className="planificador-help" style={{ marginTop: '6px' }}>El tema orienta las actividades, los objetivos y los recursos generados.</div>
              </div>

              <div className="planificador-row" style={{ gap: '32px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Formato de plan de clase</label>
                  <select id="tour-wizard-format" name="formato" value={wizardData.formato} onChange={handleChange}>
                    <option value="Estructura estándar INSPIRATEC">Estructura estándar INSPIRATEC</option>
                    <option value="Plantilla Comunitaria Básica">Plantilla Comunitaria Básica</option>
                    {wizardData.formato && !['Estructura estándar INSPIRATEC', 'Plantilla Comunitaria Básica'].includes(wizardData.formato) && (
                      <option value={wizardData.formato}>{wizardData.formato}</option>
                    )}
                  </select>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Grado</label>
                  <select name="grado" value={wizardData.grado} onChange={handleChange}>
                    <option value="">Seleccione un grado</option>
                    <option value="1ro">1ro Primaria</option>
                    <option value="2do">2do Primaria</option>
                    <option value="3ro">3ro Primaria</option>
                    <option value="4to">4to Primaria</option>
                    <option value="5to">5to Primaria</option>
                    <option value="6to">6to Bachillerato</option>
                    <option value="7mo">7mo Bachillerato</option>
                    <option value="8vo">8vo Bachillerato</option>
                    <option value="9no">9no Bachillerato</option>
                    <option value="10mo">10mo Media</option>
                    <option value="11mo">11mo Media</option>
                  </select>
                </div>
              </div>

              <div className="planificador-row" style={{ gap: '32px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Área Curricular</label>
                  <select name="materia" value={wizardData.materia} onChange={handleChange}>
                    <option value="Tecnología e Informática">Tecnología e Informática</option>
                    <option value="Matemáticas">Matemáticas</option>
                    <option value="Lenguaje (Español)">Lenguaje (Español)</option>
                    <option value="Inglés">Inglés</option>
                  </select>
                </div>
                <div className="input-group" style={{ margin: 0, flex: 1 }}>
                  <label>Duración y sesiones</label>
                  <input type="text" name="duracion" value={wizardData.duracion} onChange={handleChange} placeholder="Ej.: 90 minutos, 2 sesiones" />
                </div>
              </div>

              <div className="planificador-row" style={{ gap: '32px' }}>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Cantidad de estudiantes</label>
                  <input type="number" name="numEstudiantes" value={wizardData.numEstudiantes} onChange={handleChange} placeholder="Ej.: 30" min="1" />
                  <div className="planificador-help" style={{ marginTop: '6px' }}>Permite ajustar la viabilidad de actividades grupales.</div>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Disponibilidad de recursos <span style={{color: 'var(--error-color)'}}>*</span></label>
                  <select id="tour-wizard-resources" name="recursos" value={wizardData.recursos} onChange={handleChange}>
                    <option value="">Selecciona una opción de recursos</option>
                    {wizardData.materia === 'Matemáticas' ? (
                      <>
                        <option value="A. Aula Tradicional">A. Aula Tradicional: Pizarrón, cuadernos, material concreto (tapas, palillos, ábacos).</option>
                        <option value="B. Aula con Apoyo Tecnológico">B. Aula con Apoyo Tecnológico: Acceso ocasional a calculadoras y un proyector.</option>
                        <option value="C. Aula Tecnológicamente Integrada">C. Aula Tecnológicamente Integrada: Computadoras/Tablets para usar GeoGebra, Desmos o simuladores.</option>
                        <option value="D. Espacio Abierto/Canchas">D. Espacio Abierto/Canchas: Ideal para medir distancias, calcular áreas reales o estadística en campo.</option>
                      </>
                    ) : wizardData.materia === 'Inglés' ? (
                      <>
                        <option value="A. Aula Básica sin Internet">A. Aula Básica sin Internet: Flashcards, material impreso, tablero y grabadora de audio/parlante.</option>
                        <option value="B. Aula Audiovisual (TV/Proyector)">B. Aula Audiovisual (TV/Proyector): Acceso a TV, proyector o sonido para escuchar diálogos o ver videos.</option>
                        <option value="C. Laboratorio de Idiomas / Dispositivos">C. Laboratorio de Idiomas / Dispositivos: Computadoras o tablets individuales con auriculares y micrófonos.</option>
                        <option value="D. Entorno Social (Role-play)">D. Entorno Social (Role-play): Espacio amplio (auditorio o patio) para dramatizaciones y juegos de roles (TPR).</option>
                      </>
                    ) : wizardData.materia === 'Lenguaje (Español)' ? (
                      <>
                        <option value="A. Aula Tradicional (Lectoescritura)">A. Aula Tradicional (Lectoescritura): Libros físicos, periódicos, diccionarios y hojas.</option>
                        <option value="B. Aula con Proyección">B. Aula con Proyección: Acceso a TV o proyector para análisis de medios, cortometrajes o lectura grupal.</option>
                        <option value="C. Sala de Informática">C. Sala de Informática: Computadoras para redacción digital, blogs o investigación.</option>
                        <option value="D. Biblioteca / Entorno Lector">D. Biblioteca / Entorno Lector: Espacio diseñado para lectura silenciosa, debates y mesas redondas.</option>
                      </>
                    ) : (
                      <>
                        <option value="A. Aula Tradicional (Informática Desconectada)">A. Aula Tradicional (Informática Desconectada): Pizarrón, marcadores, papel, reciclados. Acceso nulo a tecnología.</option>
                        <option value="B. Aula con Apoyo Tecnológico Básico">B. Aula con Apoyo Tecnológico Básico: Acceso ocasional a computadoras/internet.</option>
                        <option value="C. Aula Tecnológicamente Integrada (1 a 1)">C. Aula Tecnológicamente Integrada (1 a 1): Buena conectividad, acceso regular a dispositivos.</option>
                        <option value="D. Laboratorio / Taller de Herramientas">D. Laboratorio / Taller de Herramientas: Herramientas manuales, equipamiento estándar.</option>
                        <option value="E. Espacio Maker / Robótica">E. Espacio Maker / Robótica: Impresoras 3D, robótica, sensores.</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <label>Metodología de enseñanza prioritaria</label>
                <select name="metodologiaSTEAM" value={wizardData.metodologiaSTEAM} onChange={handleChange}>
                  <option value="">Selecciona una metodología...</option>
                  <option value="Clase magistral">Clase magistral</option>
                  <option value="Aprendizaje activo">Aprendizaje activo</option>
                  <option value="Aprendizaje práctico">Aprendizaje práctico</option>
                  <option value="Aprendizaje social y emocional">Aprendizaje social y emocional</option>
                  <option value="DUA: Diseño Universal para el Aprendizaje">DUA: Diseño Universal para el Aprendizaje</option>
                  <option value="Aprendizaje Basado en Casos">Aprendizaje Basado en Casos</option>
                  <option value="Aprendizaje Basado en Indagación">Aprendizaje Basado en Indagación</option>
                  <option value="Aprendizaje Basado en Investigación">Aprendizaje Basado en Investigación</option>
                  <option value="Aprendizaje Basado en Problemas (ABP)">Aprendizaje Basado en Problemas (ABP)</option>
                  <option value="Aprendizaje Basado en Proyectos (ABPro)">Aprendizaje Basado en Proyectos (ABPro)</option>
                  <option value="Aprendizaje Basado en Retos">Aprendizaje Basado en Retos</option>
                  <option value="Aprendizaje Colaborativo">Aprendizaje Colaborativo</option>
                  <option value="Aprendizaje Invertido (Flipped Learning)">Aprendizaje Invertido (Flipped Learning)</option>
                  <option value="Design Thinking">Design Thinking</option>
                  <option value="Gamificación">Gamificación</option>
                  <option value="Aprendizaje Servicio">Aprendizaje Servicio</option>
                  <option value="Microlearning">Microlearning</option>
                  <option value="STEAM">STEAM</option>
                  <option value="Pensamiento Computacional">Pensamiento Computacional</option>
                  <option value="Otra (describir en objetivos/contenido)">Otra (describir en objetivos/contenido)</option>
                </select>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>¿Qué quieres que aprendan tus estudiantes?</label>
                  <button type="button" className="btn btn-secondary" onClick={handleSuggestObjectives} disabled={isSuggestingObj || !wizardData.metodologiaSTEAM} style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }} title={!wizardData.metodologiaSTEAM ? 'Debes seleccionar una metodología STEAM primero' : ''}>
                    {isSuggestingObj ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} color="#8b5cf6" />} Sugerir con IA
                  </button>
                </div>
                <textarea 
                  name="objetivos" 
                  value={wizardData.objetivos} 
                  onChange={handleChange} 
                  placeholder="Ej.: Identificar los elementos de un algoritmo y construir una secuencia de instrucciones utilizando Scratch..."
                  style={{ minHeight: '180px' }}
                ></textarea>
                <div className="planificador-help" style={{ marginTop: '8px' }}>Puedes escribir libremente o utilizar el asistente IA para generar una base basada en el tema anterior.</div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div className="input-group" style={{ margin: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Estándares y objetivos de aprendizaje</label>
                  <button type="button" className="btn btn-secondary" onClick={handleSuggestStandards} disabled={isSuggestingStd} style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }}>
                    {isSuggestingStd ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} color="#8b5cf6" />} Sugerir estándares
                  </button>
                </div>
                <textarea 
                  name="estandaresMEN" 
                  value={wizardData.estandaresMEN.join('\n')} 
                  onChange={(e) => updateWizardData({ estandaresMEN: [e.target.value] })} 
                  placeholder="Registra componentes curriculares, competencias, estándares u objetivos específicos..."
                  style={{ minHeight: '220px' }}
                ></textarea>
                <div className="planificador-help" style={{ marginTop: '8px' }}>Pega aquí los referentes curriculares oficiales, o pide ayuda a la IA y revisa la propuesta generada.</div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <p style={{ fontWeight: 500, margin: 0, fontSize: '15px' }}>Selecciona si hay alguna condición que requiera ajustes en la clase generada:</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', backgroundColor: 'var(--bg-sage-soft)', padding: '24px', borderRadius: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="checkbox" name="inclusion" value="Discapacidad visual" checked={wizardData.inclusion.includes("Discapacidad visual")} onChange={handleChange} style={{ width: '18px', height: '18px' }} /> 
                  Discapacidad visual
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="checkbox" name="inclusion" value="Discapacidad auditiva" checked={wizardData.inclusion.includes("Discapacidad auditiva")} onChange={handleChange} style={{ width: '18px', height: '18px' }} /> 
                  Discapacidad auditiva
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="checkbox" name="inclusion" value="Discapacidad motora" checked={wizardData.inclusion.includes("Discapacidad motora")} onChange={handleChange} style={{ width: '18px', height: '18px' }} /> 
                  Discapacidad motora
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', backgroundColor: 'white', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <input type="checkbox" name="inclusion" value="PIAR aplicable" checked={wizardData.inclusion.includes("PIAR aplicable")} onChange={handleChange} style={{ width: '18px', height: '18px' }} /> 
                  PIAR Institucional
                </label>
              </div>

              <div className="input-group" style={{ margin: 0 }}>
                <label>Otra necesidad o condición específica (Opcional)</label>
                <input type="text" name="otrasNecesidades" value={wizardData.otrasNecesidades} onChange={handleChange} placeholder="Ej: Trastorno del Espectro Autista (TEA)" />
                <div className="planificador-help" style={{ marginTop: '6px' }}>La IA usará esta información para proponer adaptaciones pedagógicas (DUA) al final del documento.</div>
              </div>
            </div>
          )}

          {/* Barra de Navegación Inferior */}
          <div className="planificador-actions" style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              {step > 1 ? (
                <button type="button" className="btn btn-secondary" onClick={handlePrev} style={{ minWidth: '120px' }}>
                  <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Volver
                </button>
              ) : <div style={{ width: '120px' }}></div>}
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => alert("Borrador guardado localmente.")}>
                <Save size={18} style={{ marginRight: '8px' }} /> Guardar progreso
              </button>
              
              {step < 4 ? (
                <button id="tour-wizard-next" type="button" className="btn" onClick={handleNext} style={{ minWidth: '140px' }}>
                  Siguiente <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              ) : (
                <button type="button" className="btn" onClick={handleGenerate} disabled={isGenerating} style={{ minWidth: '200px', backgroundColor: 'var(--primary-active)' }}>
                  {isGenerating ? <Loader2 size={18} className="spin" style={{ marginRight: '8px' }} /> : <Sparkles size={18} style={{ marginRight: '8px' }} color="#F7F3ED" />} 
                  {isGenerating ? 'Generando plan...' : 'Generar Clase'}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
