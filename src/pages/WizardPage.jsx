import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { generatePlan, suggestObjectives, suggestStandards } from '../services/aiService';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Save, 
  Check, 
  BookOpen, 
  Users, 
  Layers, 
  Eye, 
  VolumeX, 
  Accessibility, 
  ShieldCheck, 
  HelpCircle,
  AlertCircle,
  RefreshCw,
  Clock,
  Compass,
  CheckCircle2
} from 'lucide-react';

export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generationPhase, setGenerationPhase] = useState(0);
  const [progressPercent, setProgressPercent] = useState(18);
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
    if (isGenerating) return; // Prevent duplicate requests
    if (!apiKey) {
      setGenerationError("Por favor configura tu API Key de Gemini en Configuración para generar secuencias con IA.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const plan = await generatePlan(apiKey, wizardData);
      setPlanGenerado(plan);
      setPlanStatus('borrador');
      navigate('/editor');
    } catch (error) {
      setGenerationError(error.message || "Ocurrió un error al contactar al servicio de IA. Por favor verifica tu conexión y tu API Key.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    let phaseTimer;
    let progressTimer;
    if (isGenerating) {
      setGenerationPhase(0);
      setProgressPercent(16);

      phaseTimer = setInterval(() => {
        setGenerationPhase(prev => (prev < 3 ? prev + 1 : prev));
      }, 2400);

      progressTimer = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 94) return 94;
          return prev + Math.floor(Math.random() * 4 + 2);
        });
      }, 350);
    } else {
      setGenerationPhase(0);
      setProgressPercent(18);
    }
    return () => {
      clearInterval(phaseTimer);
      clearInterval(progressTimer);
    };
  }, [isGenerating]);

  const generationPhases = [
    {
      title: "Interpretando requerimientos curriculares y audiencia",
      detail: `Sintonizando ${wizardData?.materia || 'área curricular'}, grado ${wizardData?.grado || 'asignado'} y enfoque metodológico.`,
      icon: <BookOpen size={15} />
    },
    {
      title: "Estructurando momentos didácticos (Inicio, Desarrollo, Cierre)",
      detail: `Dosificando tiempos de clase (${wizardData?.duracion || 'sesión'}) y articulando actividades con metodología ${wizardData?.metodologia || 'activa'}.`,
      icon: <Layers size={15} />
    },
    {
      title: "Tejiendo principios y apoyos de Inclusión (DUA)",
      detail: "Integrando representaciones múltiples, flexibilizaciones y ajustes razonables.",
      icon: <ShieldCheck size={15} />
    },
    {
      title: "Sintonizando co-docente didáctico y evaluación formativa",
      detail: "Configurando criterios de evaluación, rúbricas y sugerencias didácticas interactivas.",
      icon: <Sparkles size={15} />
    }
  ];

  const stepsInfo = [
    { num: 1, title: 'Información básica', desc: 'Contexto de tu clase para construir una planificación pertinente.' },
    { num: 2, title: 'Metodología', desc: 'Define cómo orientarás el aprendizaje de tus estudiantes.' },
    { num: 3, title: 'Estándares', desc: 'Conecta las actividades con los referentes curriculares oficiales.' },
    { num: 4, title: 'Inclusión (DUA)', desc: 'Anticipa barreras de aprendizaje y considera apoyos específicos.' }
  ];

  const inclusionOptions = [
    {
      value: "Discapacidad visual",
      label: "Discapacidad visual",
      desc: "Apoyo con audio, descripción y material táctil",
      icon: <Eye size={18} color="var(--primary-active)" />
    },
    {
      value: "Discapacidad auditiva",
      label: "Discapacidad auditiva",
      desc: "Apoyo visual, subtítulos y lenguaje de señas",
      icon: <VolumeX size={18} color="var(--primary-active)" />
    },
    {
      value: "Discapacidad motora",
      label: "Discapacidad motora",
      desc: "Adaptaciones de movilidad y acceso físico",
      icon: <Accessibility size={18} color="var(--primary-active)" />
    },
    {
      value: "PIAR aplicable",
      label: "PIAR Institucional",
      desc: "Plan Individual de Ajustes Razonables",
      icon: <ShieldCheck size={18} color="var(--primary-active)" />
    }
  ];

  const progressPercentage = ((step - 1) / (stepsInfo.length - 1)) * 100;

  return (
    <div className="wizard-container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '36px 32px 64px' }}>
      {/* 1. Panel Editorial de Cabecera y Stepper (Mismo desenfoque y estilo de Inicio) */}
      <section 
        className="planificador-header-panel"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '22px',
          padding: '38px 42px',
          marginBottom: '26px',
          boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
        }}
      >
        <div className="planificador-header" style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="editorial-badge" style={{ margin: '0 auto 14px auto' }}>
            <Sparkles size={14} color="#2B524A" />
            <span>Secuencia Didáctica Guiada</span>
          </div>
          <h1 style={{ fontSize: '34px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
            Planificador de Clases
          </h1>
          <p style={{ fontSize: '15.5px', color: '#243630', maxWidth: '720px', margin: '0 auto', lineHeight: '1.65', fontWeight: 500 }}>
            Configura los propósitos pedagógicos, metodología y adaptaciones DUA para generar tu secuencia didáctica estructurada con asistencia de IA.
          </p>
        </div>
        
        {/* Stepper / Indicador de Progreso Responsive */}
        <div id="tour-wizard-progress" className="wizard-stepper" style={{ marginBottom: 0 }}>
          <div className="wizard-stepper-track">
            <div 
              className="wizard-stepper-progress-fill" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          {stepsInfo.map(s => {
            const isCompleted = step > s.num;
            const isActive = step === s.num;
            return (
              <div 
                key={s.num} 
                className={`wizard-step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className="wizard-step-bubble" aria-current={isActive ? 'step' : undefined}>
                  {isCompleted ? <Check size={18} strokeWidth={2.5} /> : s.num}
                </div>
                <span className="wizard-step-label">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Tarjeta de Formulario y Fase Pedagógica (Mismo desenfoque y panel de cristal) */}
      <div 
        className="wizard-card"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '24px',
          boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
        }}
      >
        {/* Encabezado de la Fase Actual */}
        <div className="wizard-section-header">
          <h3 className="wizard-section-title">
            Fase {step}: {stepsInfo[step - 1].title}
          </h3>
          <p className="wizard-section-desc">
            {stepsInfo[step - 1].desc}
          </p>
        </div>

        {/* Formulario */}
        <div className="planificador-form">

          {/* ==================== FASE 1: INFORMACIÓN BÁSICA ==================== */}
          {step === 1 && (
            <div>
              {/* Grupo 1: Tema y Formato */}
              <div className="wizard-group">
                <div className="wizard-group-title">
                  <BookOpen size={16} /> Tema y Estructura
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label htmlFor="tour-wizard-start">
                      Nombre de la clase o tema <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <input 
                      id="tour-wizard-start" 
                      type="text" 
                      name="tema" 
                      value={wizardData.tema} 
                      onChange={handleChange} 
                      placeholder={
                        wizardData.materia === 'Matemáticas' 
                          ? "Ej.: Suma de fracciones con distinto denominador" 
                          : wizardData.materia === 'Lenguaje (Español)' 
                          ? "Ej.: El cuento y sus partes narrativas" 
                          : wizardData.materia === 'Inglés' 
                          ? "Ej.: Verb To Be (Present Simple in Context)" 
                          : "Ej.: Introducción a la programación por bloques con Scratch"
                      } 
                    />
                    <div className="planificador-help">
                      El tema orienta las actividades, los objetivos y los recursos generados.
                    </div>
                  </div>

                  <div className="input-group" style={{ margin: 0 }}>
                    <label htmlFor="tour-wizard-format">Formato de plan de clase</label>
                    <select 
                      id="tour-wizard-format" 
                      name="formato" 
                      value={wizardData.formato} 
                      onChange={handleChange}
                    >
                      <option value="Estructura estándar INSPIRATEC">Estructura estándar INSPIRATEC</option>
                      <option value="Plantilla Comunitaria Básica">Plantilla Comunitaria Básica</option>
                      {wizardData.formato && !['Estructura estándar INSPIRATEC', 'Plantilla Comunitaria Básica'].includes(wizardData.formato) && (
                        <option value={wizardData.formato}>{wizardData.formato}</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Grupo 2: Audiencia y Tiempo */}
              <div className="wizard-group">
                <div className="wizard-group-title">
                  <Users size={16} /> Audiencia y Temporalidad
                </div>
                <div className="planificador-row" style={{ gap: '20px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label>Grado escolar</label>
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
                  <div className="input-group" style={{ margin: 0 }}>
                    <label>Duración y sesiones</label>
                    <input 
                      type="text" 
                      name="duracion" 
                      value={wizardData.duracion} 
                      onChange={handleChange} 
                      placeholder="Ej.: 90 minutos, 2 sesiones" 
                    />
                  </div>
                </div>

                <div className="input-group" style={{ margin: '20px 0 0 0' }}>
                  <label>Cantidad de estudiantes</label>
                  <input 
                    type="number" 
                    name="numEstudiantes" 
                    value={wizardData.numEstudiantes} 
                    onChange={handleChange} 
                    placeholder="Ej.: 30" 
                    min="1" 
                  />
                  <div className="planificador-help">
                    Permite ajustar la viabilidad de actividades grupales y dinámicas cooperativas.
                  </div>
                </div>
              </div>

              {/* Grupo 3: Área Curricular y Recursos */}
              <div className="wizard-group">
                <div className="wizard-group-title">
                  <Layers size={16} /> Área Curricular y Recursos
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div className="input-group" style={{ margin: 0 }}>
                    <label>Área Curricular</label>
                    <select name="materia" value={wizardData.materia} onChange={handleChange}>
                      <option value="Tecnología e Informática">Tecnología e Informática</option>
                      <option value="Matemáticas">Matemáticas</option>
                      <option value="Lenguaje (Español)">Lenguaje (Español)</option>
                      <option value="Inglés">Inglés</option>
                    </select>
                  </div>

                  <div className="input-group" style={{ margin: 0 }}>
                    <label htmlFor="tour-wizard-resources">
                      Disponibilidad de recursos para {wizardData.materia || 'la clase'} <span style={{ color: 'var(--error-color)' }}>*</span>
                    </label>
                    <select 
                      id="tour-wizard-resources" 
                      name="recursos" 
                      value={wizardData.recursos} 
                      onChange={handleChange}
                    >
                      <option value="">Selecciona una opción de recursos...</option>
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
                    <div className="planificador-help">
                      La IA adecuará las actividades al equipamiento real disponible en tu institución.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== FASE 2: METODOLOGÍA Y OBJETIVOS ==================== */}
          {step === 2 && (
            <div>
              <div className="wizard-group">
                <div className="wizard-group-title">
                  <Layers size={16} /> Metodología de Enseñanza
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Metodología prioritaria para la secuencia</label>
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
                  <div className="planificador-help">
                    La metodología guía el tipo de dinámicas (fases de inicio, desarrollo y cierre).
                  </div>
                </div>
              </div>

              <div className="wizard-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="wizard-group-title" style={{ margin: 0 }}>
                    <Sparkles size={16} /> Objetivos de Aprendizaje
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleSuggestObjectives} 
                    disabled={isSuggestingObj || !wizardData.metodologiaSTEAM} 
                    style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }} 
                    title={!wizardData.metodologiaSTEAM ? 'Debes seleccionar una metodología primero' : 'Sugerir objetivos pedagógicos con IA'}
                  >
                    {isSuggestingObj ? <Loader2 size={16} className="spin" /> : <Sparkles size={15} color="var(--primary-active)" />} 
                    {isSuggestingObj ? 'Generando...' : 'Sugerir con IA'}
                  </button>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>¿Qué competencias o desempeños deseas que logren los estudiantes?</label>
                  <textarea 
                    name="objetivos" 
                    value={wizardData.objetivos} 
                    onChange={handleChange} 
                    placeholder="Ej.: Identificar los elementos de un algoritmo y construir una secuencia lógica paso a paso para resolver un problema cotidiano..."
                    style={{ minHeight: '160px' }}
                  />
                  <div className="planificador-help">
                    Puedes redactar tus propios objetivos o utilizar la sugerencia asistida con IA basada en el tema y metodología.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== FASE 3: ESTÁNDARES ==================== */}
          {step === 3 && (
            <div>
              <div className="wizard-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div className="wizard-group-title" style={{ margin: 0 }}>
                    <BookOpen size={16} /> Estándares y Referentes Curriculares
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleSuggestStandards} 
                    disabled={isSuggestingStd} 
                    style={{ padding: '6px 14px', minHeight: '36px', fontSize: '13px', borderRadius: '20px' }}
                  >
                    {isSuggestingStd ? <Loader2 size={16} className="spin" /> : <Sparkles size={15} color="var(--primary-active)" />} 
                    {isSuggestingStd ? 'Consultando...' : 'Sugerir estándares'}
                  </button>
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Estándares Básicos de Competencias (MEN), DBA u objetivos curriculares</label>
                  <textarea 
                    name="estandaresMEN" 
                    value={wizardData.estandaresMEN.join('\n')} 
                    onChange={(e) => updateWizardData({ estandaresMEN: [e.target.value] })} 
                    placeholder="Ej.: Reconozco principios y conceptos propios de la tecnología, así como momentos de la historia que le han permitido al hombre transformar el entorno para resolver problemas..."
                    style={{ minHeight: '200px' }}
                  />
                  <div className="planificador-help">
                    Pega aquí los referentes oficiales de tu colegio o ministerio, o usa la asistencia de la IA para sugerir competencias alineadas.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== FASE 4: INCLUSIÓN Y DUA ==================== */}
          {step === 4 && (
            <div>
              <div className="wizard-group">
                <div className="wizard-group-title">
                  <Accessibility size={16} /> Condiciones para Ajustes Razonables (DUA)
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Selecciona si en tu grupo hay estudiantes con condiciones que requieran ajustes de representación, expresión o compromiso:
                </p>

                <div className="wizard-choice-grid">
                  {inclusionOptions.map((opt) => {
                    const isSelected = wizardData.inclusion.includes(opt.value);
                    return (
                      <label 
                        key={opt.value}
                        className={`wizard-choice-card ${isSelected ? 'selected' : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          name="inclusion" 
                          value={opt.value} 
                          checked={isSelected} 
                          onChange={handleChange} 
                        />
                        <div className="wizard-choice-card-content">
                          <span className="wizard-choice-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {opt.icon} {opt.label}
                          </span>
                          <span className="wizard-choice-card-desc">
                            {opt.desc}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="wizard-group">
                <div className="wizard-group-title">
                  <HelpCircle size={16} /> Necesidades Específicas Adicionales
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label>Otra condición particular o necesidad pedagógica (Opcional)</label>
                  <input 
                    type="text" 
                    name="otrasNecesidades" 
                    value={wizardData.otrasNecesidades} 
                    onChange={handleChange} 
                    placeholder="Ej.: Trastorno del Espectro Autista (TEA), TDAH, o baja conectividad domiciliaria" 
                  />
                  <div className="planificador-help">
                    La Inteligencia Artificial incorporará adaptaciones DUA y apoyos pertinentes directamente en el plan generado.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== BARRA DE NAVEGACIÓN INFERIOR ==================== */}
          <div className="planificador-actions" style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              {step > 1 ? (
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handlePrev} 
                  style={{ minWidth: '120px' }}
                >
                  <ArrowLeft size={16} /> Volver
                </button>
              ) : (
                <div style={{ width: '120px' }} />
              )}
            </div>
            
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => alert("Borrador guardado localmente en tu sesión.")}
              >
                <Save size={16} /> Guardar progreso
              </button>
              
              {step < 4 ? (
                <button 
                  id="tour-wizard-next" 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleNext} 
                  style={{ minWidth: '140px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span>Siguiente</span> <ArrowRight size={16} />
                </button>
              ) : (
                <button 
                  id="tour-wizard-next"
                  type="button" 
                  className="btn btn-primary" 
                  onClick={handleGenerate} 
                  disabled={isGenerating} 
                  style={{ minWidth: '200px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {isGenerating ? <Loader2 size={16} className="spin" /> : <Sparkles size={16} />} 
                  <span>{isGenerating ? 'Generando plan...' : 'Generar Clase'}</span>
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>

      {/* ==================== APARTADO INTERMEDIO CINEMATOGRÁFICO DE CREACIÓN CON IA ==================== */}
      {(isGenerating || generationError) && typeof document !== 'undefined' && createPortal(
        <div 
          className="wizard-generating-cinematic-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="gen-modal-title"
        >
          <div className="wizard-generating-cinematic-card">
            {isGenerating ? (
              <div>
                {/* Núcleo Inteligente Orbe Generativo */}
                <div className="wizard-generating-orb-container">
                  <div className="wizard-generating-orb-ring-outer" />
                  <div className="wizard-generating-orb-ring" />
                  <div className="wizard-generating-orb">
                    <Sparkles size={32} />
                  </div>
                </div>

                {/* Encabezado Editorial */}
                <span className="editorial-badge" style={{ margin: '0 auto 12px auto' }}>
                  <Sparkles size={13} /> Co-docente Didáctico Activo
                </span>
                
                <h3 id="gen-modal-title" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(22px, 2.5vw, 26px)',
                  fontWeight: 700,
                  color: '#142B25',
                  marginBottom: '8px',
                  letterSpacing: '-0.015em'
                }}>
                  Tejiendo tu Secuencia Didáctica
                </h3>

                <p style={{
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  color: '#3D5A53',
                  marginBottom: '18px',
                  maxWidth: '540px',
                  margin: '0 auto 18px auto'
                }}>
                  Diseñando momentos de aprendizaje alineados a tu contexto institucional y a los referentes curriculares.
                </p>

                {/* Píldoras de Metadatos de la Secuencia */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '22px' }}>
                  <span className="editor-meta-tag">
                    <BookOpen size={13} /> {wizardData?.tema || 'Tema de la clase'}
                  </span>
                  <span className="editor-meta-tag">
                    <Users size={13} /> Grado: {wizardData?.grado || 'Sin grado'}
                  </span>
                  <span className="editor-meta-tag">
                    <Layers size={13} /> {wizardData?.materia || 'General'}
                  </span>
                  <span className="editor-meta-tag">
                    <Clock size={13} /> {wizardData?.duracion || '90 min'}
                  </span>
                </div>

                {/* Barra de Progreso Fluida */}
                <div className="wizard-generating-progress-track">
                  <div 
                    className="wizard-generating-progress-bar"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Fases Secuenciales de Construcción Pedagógica */}
                <div className="wizard-generating-phases">
                  {generationPhases.map((phase, idx) => {
                    const isCompleted = generationPhase > idx;
                    const isActive = generationPhase === idx;

                    return (
                      <div 
                        key={idx}
                        className={`wizard-generating-phase-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                      >
                        <div 
                          className="wizard-generating-phase-icon"
                          style={{
                            backgroundColor: isCompleted 
                              ? '#10B981' 
                              : isActive 
                              ? '#315B54' 
                              : 'rgba(71, 122, 114, 0.15)',
                            color: isCompleted || isActive ? '#FFFFFF' : '#477A72'
                          }}
                        >
                          {isCompleted ? (
                            <Check size={16} />
                          ) : isActive ? (
                            <Loader2 size={16} className="spin" />
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ 
                            fontSize: '13.5px', 
                            fontWeight: isActive ? 700 : 600, 
                            color: isActive ? '#142B25' : isCompleted ? '#234B43' : '#64748B',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}>
                            {phase.title}
                          </div>
                          <div style={{ 
                            fontSize: '12px', 
                            color: isActive ? '#3D5A53' : '#94A3B8',
                            marginTop: '2px',
                            lineHeight: '1.4'
                          }}>
                            {phase.detail}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Cita Didáctica al Pie */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.65)',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                  fontSize: '12.5px',
                  color: '#477A72',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontStyle: 'italic'
                }}>
                  <Compass size={15} />
                  <span>"El Diseño Universal para el Aprendizaje maximiza la autonomía de cada estudiante en el aula."</span>
                </div>
              </div>
            ) : (
              <div>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto',
                  color: '#DC2626'
                }}>
                  <AlertCircle size={32} />
                </div>
                <h3 id="gen-modal-title" style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#142B25',
                  marginBottom: '10px'
                }}>
                  No se pudo completar la generación
                </h3>
                <p style={{
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: '#991B1B',
                  backgroundColor: 'rgba(254, 242, 242, 0.8)',
                  border: '1px solid rgba(252, 165, 165, 0.6)',
                  padding: '14px 18px',
                  borderRadius: '14px',
                  marginBottom: '24px',
                  textAlign: 'left',
                  wordBreak: 'break-word'
                }}>
                  {generationError}
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button 
                    type="button" 
                    className="editor-btn-pill" 
                    onClick={() => setGenerationError(null)}
                  >
                    Revisar datos del formulario
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleGenerate}
                    style={{ padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <RefreshCw size={15} /> Reintentar generación
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

