import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { modifyPlan } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  Edit, 
  Eye,
  FileText, 
  FileCode, 
  PlusCircle, 
  ListChecks, 
  MonitorPlay, 
  HelpCircle, 
  Puzzle, 
  Send, 
  Loader2, 
  X, 
  Download, 
  Maximize2, 
  Sparkles, 
  ChevronDown,
  CheckCircle2,
  Clock,
  BookOpen,
  MessageSquare
} from 'lucide-react';

import { savePlanToDB, updatePlanInDB } from '../services/dbService';
import { generateComplementaryMaterial } from '../services/aiService';

export default function EditorPage() {
  const { 
    planGenerado, 
    setPlanGenerado, 
    apiKey, 
    sesionChatIA, 
    addMensajeChatIA, 
    wizardData, 
    planStatus, 
    setPlanStatus, 
    resetWizard, 
    userId, 
    planId, 
    setPlanId, 
    recursosAnexos, 
    addRecursoAnexo, 
    planesCount, 
    setPlanesCount 
  } = useAppStore();

  const [prompt, setPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editablePlan, setEditablePlan] = useState(planGenerado || '');
  const [activeMobileTab, setActiveMobileTab] = useState('doc'); // 'doc' | 'chat'
  
  // Modal states for complementary materials
  const [showMaterialMenu, setShowMaterialMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContentHtml, setModalContentHtml] = useState('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState(false);
  
  const chatEndRef = useRef(null);
  const materialMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (materialMenuRef.current && !materialMenuRef.current.contains(event.target)) {
        setShowMaterialMenu(false);
      }
    };
    if (showMaterialMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMaterialMenu]);

  useEffect(() => {
    if (!isModalOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsModalOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [isModalOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sesionChatIA]);

  useEffect(() => {
    if (planGenerado) {
      setEditablePlan(planGenerado);
    }
  }, [planGenerado]);

  const handleModify = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !apiKey || !planGenerado) return;

    const userMsg = prompt.trim();
    addMensajeChatIA({ role: 'user', text: userMsg });
    setPrompt('');
    setIsModifying(true);

    try {
      const newPlan = await modifyPlan(apiKey, planGenerado, userMsg);
      setPlanGenerado(newPlan);
      addMensajeChatIA({ role: 'ia', text: "He actualizado el plan según tus instrucciones. Revisa los cambios reflejados en el documento." });
    } catch (error) {
      addMensajeChatIA({ role: 'ia', text: "Hubo un error al modificar el plan: " + error.message });
    } finally {
      setIsModifying(false);
    }
  };

  const handleManualSave = () => {
    setPlanGenerado(editablePlan);
    setIsEditMode(false);
  };

  const handleSaveToBackend = async () => {
    if (!userId) {
      alert("No hay un usuario activo. Por favor espera a que se conecte con Firebase.");
      return;
    }
    
    setIsSaving(true);
    try {
      if (planId) {
        await updatePlanInDB(planId, planGenerado, recursosAnexos);
        setPlanStatus('guardado');
      } else {
        const newPlanId = await savePlanToDB(userId, wizardData, planGenerado, recursosAnexos);
        setPlanId(newPlanId);
        setPlanStatus('guardado');
        setPlanesCount(planesCount + 1);
      }
    } catch (e) {
      alert("Error al guardar: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleDownloadWord = () => {
    let anexosText = '';
    if (recursosAnexos && recursosAnexos.length > 0) {
      anexosText = '\n\n---\n<h3>Recursos Interactivos Anexos</h3>\n<ul>';
      recursosAnexos.forEach(r => {
        anexosText += `<li><strong>${r.title}</strong>: (Este recurso es interactivo. Ábrelo desde la plataforma Inspiratec para visualizarlo o descárgalo en HTML).</li>`;
      });
      anexosText += '</ul>';
    }

    const contentElement = document.getElementById('plan-content-wrapper');
    const renderedHtml = contentElement ? contentElement.innerHTML : `<div style="white-space: pre-wrap;">${planGenerado}</div>`;

    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Plan de Clase - Inspiratec</title></head><body>
      <div style="font-family: Arial, sans-serif;">${renderedHtml}</div>
      ${anexosText}
      </body></html>
    `;
    const blob = new Blob(['\ufeff', htmlContent], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTheme = wizardData?.tema ? wizardData.tema.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'clase';
    a.download = `Plan_Inspiratec_${cleanTheme}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleGenerateMaterial = async (type, title) => {
    if (!apiKey) {
      alert("Configura tu API Key primero.");
      return;
    }
    setModalTitle(title);
    setIsModalOpen(true);
    setIsGeneratingMaterial(true);
    setModalContentHtml('');

    try {
      const html = await generateComplementaryMaterial(apiKey, planGenerado, type);
      setModalContentHtml(html);
    } catch (e) {
      setModalContentHtml(`<div style="color:var(--error-color); text-align:center; padding:24px;">Error: ${e.message}</div>`);
    } finally {
      setIsGeneratingMaterial(false);
    }
  };

  const downloadMaterialHtml = () => {
    const blob = new Blob([modalContentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalTitle.replace(/ /g, '_')}.html`;
    a.click();
  };

  const handleAnexarAlPlan = () => {
    addRecursoAnexo({
      title: modalTitle,
      html: modalContentHtml
    });
    setIsModalOpen(false);
  };

  if (!planGenerado) {
    return (
      <div className="editor-view" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div className="mgmt-header" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: '#142B25' }}>
            <BookOpen size={30} />
          </div>
          <span className="editorial-badge">Planificador Curricular</span>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: '#142B25', marginBottom: '12px', fontWeight: 700 }}>
            No hay una secuencia didáctica activa
          </h2>
          <p style={{ color: '#3D5A53', fontSize: '15px', lineHeight: '1.6', marginBottom: '28px', maxWidth: '480px' }}>
            Dirígete al asistente de creación para configurar los objetivos curriculares y generar una propuesta con el co-docente de IA.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/')} style={{ padding: '12px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <PlusCircle size={18} /> Crear nueva secuencia didáctica
          </button>
        </div>
      </div>
    );
  }

  const renderGeneradorInteligente = () => {
    const match = planGenerado.match(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/);
    if (!match) return null;
    
    const typeMap = {
      'RUBRICA': { id: 'rubrica', icon: <ListChecks size={18} />, text: 'Generar Rúbrica recomendada' },
      'DIAPOSITIVAS': { id: 'diapositivas', icon: <MonitorPlay size={18} />, text: 'Generar Diapositivas recomendadas' },
      'PREGUNTAS': { id: 'preguntas', icon: <HelpCircle size={18} />, text: 'Generar Preguntas recomendadas' },
      'JUEGO': { id: 'juegos', icon: <Puzzle size={18} />, text: 'Generar Juego recomendado' }
    };
    
    const action = typeMap[match[1]];
    if (!action) return null;
    
    return (
      <div className="editor-ai-suggest-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
          <Sparkles size={20} style={{ color: '#D4AF37' }} />
          <h4 style={{ color: '#142B25', margin: 0, fontSize: '17px', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
            Sugerencia del Tejedor Inteligente
          </h4>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '20px', color: '#3D5A53', maxWidth: '580px', margin: '0 auto 20px auto', lineHeight: '1.5' }}>
          El co-docente sugiere crear este material complementario alineado con los parámetros de la secuencia actual para garantizar la coherencia metodológica.
        </p>
        <button 
          className="btn btn-primary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }} 
          onClick={() => handleGenerateMaterial(action.id, action.text)}
        >
          {action.icon} <span>{action.text}</span>
        </button>
      </div>
    );
  };

  const getMaterialOptions = () => {
    switch (wizardData?.materia) {
      case 'Matemáticas': return [
        { id: 'taller_contexto', label: 'Taller de Contexto Real', icon: <ListChecks size={16}/> },
        { id: 'guia_modelacion', label: 'Guía de Modelación', icon: <MonitorPlay size={16}/> },
        { id: 'preguntas', label: 'Quiz Interactivo', icon: <HelpCircle size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      case 'Inglés': return [
        { id: 'reading', label: 'Reading Comprehension', icon: <FileText size={16}/> },
        { id: 'roleplay_en', label: 'Role-Play Scripts', icon: <FileCode size={16}/> },
        { id: 'flashcards', label: 'Flashcards Interactivas', icon: <MonitorPlay size={16}/> },
        { id: 'juegos', label: 'Sopa de Letras (EN)', icon: <Puzzle size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      case 'Lenguaje (Español)': return [
        { id: 'taller_lectura', label: 'Taller de Comprensión', icon: <FileText size={16}/> },
        { id: 'produccion_textual', label: 'Producción Textual', icon: <Edit size={16}/> },
        { id: 'roleplay_lit', label: 'Juego de Roles Literario', icon: <FileCode size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      default: return [
        { id: 'reto_lab', label: 'Reto de Laboratorio', icon: <MonitorPlay size={16}/> },
        { id: 'estudio_caso', label: 'Estudio de Caso', icon: <FileText size={16}/> },
        { id: 'diapositivas', label: 'Presentación Interactiva', icon: <MonitorPlay size={16}/> },
        { id: 'preguntas', label: 'Banco de Preguntas', icon: <HelpCircle size={16}/> },
        { id: 'juegos', label: 'Juegos y Recursos Lúdicos', icon: <Puzzle size={16}/> }
      ];
    }
  };

  return (
    <div className="editor-view">
      
      {/* Barra de Acciones Centralizada de Cristal Translúcido */}
      <header className="editor-toolbar-card">
        <div className="editor-toolbar-meta">
          <div className="editor-title-row">
            <h1 className="editor-title">
              {wizardData?.tema || 'Secuencia Didáctica'}
            </h1>
            <span className={`editor-badge ${planStatus === 'guardado' ? 'saved' : 'draft'}`}>
              {planStatus === 'guardado' ? (
                <>
                  <CheckCircle2 size={13} /> Guardado en la nube
                </>
              ) : (
                <>
                  <Clock size={13} /> Borrador en edición
                </>
              )}
            </span>
          </div>
          <div className="editor-meta-tags">
            <span className="editor-meta-tag">
              <BookOpen size={13} /> {wizardData?.materia || 'General'}
            </span>
            <span className="editor-meta-tag">
              {wizardData?.grado || 'Sin grado'}
            </span>
            {wizardData?.duracion && (
              <span className="editor-meta-tag">
                <Clock size={13} /> {wizardData.duracion}
              </span>
            )}
          </div>
        </div>
        
        <div className="editor-toolbar-actions">
          {/* Botón Principal Guardar */}
          <button 
            className="btn btn-primary" 
            onClick={handleSaveToBackend}
            disabled={isSaving}
            style={{ minHeight: '40px', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            {isSaving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} 
            <span>{planStatus === 'guardado' ? 'Guardado' : 'Guardar'}</span>
          </button>
          
          {/* Toggle Modo Edición Manual */}
          <button 
            className="editor-btn-pill" 
            style={{ 
              backgroundColor: isEditMode ? 'rgba(71, 122, 114, 0.18)' : undefined,
              borderColor: isEditMode ? 'rgba(71, 122, 114, 0.45)' : undefined,
              color: isEditMode ? '#142B25' : undefined
            }} 
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? <Eye size={15} /> : <Edit size={15} />}
            <span>{isEditMode ? 'Ver Documento' : 'Editar Markdown'}</span>
          </button>

          {/* Exportación */}
          <div className="editor-btn-group">
            <button 
              className="editor-btn-pill" 
              style={{ padding: '6px 12px', fontSize: '13px', background: 'transparent', border: 'none', boxShadow: 'none' }} 
              onClick={handlePrintPdf}
              title="Exportar a PDF o Imprimir"
            >
              <FileText size={15} /> <span>PDF</span>
            </button>
            <button 
              className="editor-btn-pill" 
              style={{ padding: '6px 12px', fontSize: '13px', background: 'transparent', border: 'none', boxShadow: 'none' }} 
              onClick={handleDownloadWord}
              title="Descargar documento de Word"
            >
              <FileCode size={15} /> <span>Word</span>
            </button>
          </div>

          <div className="editor-separator"></div>

          <button 
            className="editor-btn-pill" 
            style={{ background: 'transparent', border: 'none', boxShadow: 'none', color: '#477A72' }} 
            onClick={() => { resetWizard(); navigate('/'); }}
            title="Iniciar nueva secuencia desde cero"
          >
            <PlusCircle size={16} /> <span>Nuevo</span>
          </button>

          {/* Menú Dropdown para Materiales Interactivos */}
          <div ref={materialMenuRef} style={{ position: 'relative', zIndex: 120 }}>
            <button 
              className="btn btn-primary" 
              style={{ 
                minHeight: '40px', 
                padding: '8px 18px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '13.5px'
              }} 
              onClick={() => setShowMaterialMenu(!showMaterialMenu)}
              aria-expanded={showMaterialMenu}
              aria-haspopup="true"
            >
              <Sparkles size={15} /> 
              <span>Material Didáctico</span> 
              <ChevronDown size={14} />
            </button>
            
            {showMaterialMenu && (
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 'calc(100% + 8px)', 
                  right: 0, 
                  backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  borderRadius: '16px', 
                  boxShadow: '0 20px 45px rgba(0, 0, 0, 0.22), 0 4px 12px rgba(0, 0, 0, 0.08)', 
                  border: '1px solid rgba(255, 255, 255, 0.95)', 
                  zIndex: 1000, 
                  minWidth: '270px', 
                  overflow: 'hidden' 
                }}
              >
                <div style={{ padding: '12px 18px', backgroundColor: 'rgba(71, 122, 114, 0.08)', borderBottom: '1px solid rgba(49, 91, 84, 0.1)', fontSize: '12px', fontWeight: 700, color: '#1E3B34', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Recomendados para {wizardData?.materia || 'tu clase'}
                </div>
                {getMaterialOptions().map(opt => (
                  <button 
                    key={opt.id}
                    onClick={() => { handleGenerateMaterial(opt.id, opt.label); setShowMaterialMenu(false); }}
                    style={{ 
                      width: '100%', 
                      textAlign: 'left', 
                      padding: '12px 18px', 
                      background: 'none', 
                      border: 'none', 
                      borderBottom: '1px solid rgba(49, 91, 84, 0.06)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px', 
                      cursor: 'pointer', 
                      color: '#142B25', 
                      fontSize: '13.5px',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(71, 122, 114, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <span style={{ color: '#315B54' }}>{opt.icon}</span>
                    <span style={{ fontWeight: 500 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Selector de pestañas para vista móvil / tablet */}
      <div className="editor-mobile-tabs">
        <button 
          className={`editor-mobile-tab-btn ${activeMobileTab === 'doc' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('doc')}
        >
          <BookOpen size={16} /> <span>Documento</span>
        </button>
        <button 
          className={`editor-mobile-tab-btn ${activeMobileTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveMobileTab('chat')}
        >
          <MessageSquare size={16} /> 
          <span>Co-docente IA {sesionChatIA.length > 0 && `(${sesionChatIA.length})`}</span>
        </button>
      </div>

      {/* Espacio de Trabajo: Documento Principal + Co-docente IA */}
      <div className="editor-workspace">
        
        {/* Panel del Documento Principal */}
        <div 
          className="editor-doc-pane" 
          style={{ display: activeMobileTab === 'doc' || window.innerWidth >= 992 ? 'flex' : 'none' }}
        >
          <div className="editor-doc-card">
            {isEditMode ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <label htmlFor="markdown-editor" style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>
                    Editor de Código Markdown
                  </label>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Los cambios se guardan directamente en el plan activo
                  </span>
                </div>
                <textarea 
                  id="markdown-editor"
                  value={editablePlan} 
                  onChange={(e) => setEditablePlan(e.target.value)} 
                  style={{ 
                    width: '100%', 
                    minHeight: '640px', 
                    padding: '16px', 
                    fontFamily: 'monospace', 
                    fontSize: '14px', 
                    lineHeight: '1.6',
                    border: '1px solid var(--border-color)', 
                    borderRadius: 'var(--radius-sm)', 
                    marginBottom: '16px',
                    backgroundColor: '#FAFAF9',
                    color: '#1C1917',
                    resize: 'vertical'
                  }}
                />
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button className="btn-outline" onClick={() => setIsEditMode(false)}>
                    Cancelar
                  </button>
                  <button className="btn btn-primary" onClick={handleManualSave}>
                    <Save size={16} /> Aplicar cambios
                  </button>
                </div>
              </div>
            ) : (
              <article className="markdown-content" id="plan-content-wrapper">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  components={{
                    table: ({ ...props }) => (
                      <div className="editor-doc-table-wrapper">
                        <table className="plan-sequence-table" {...props} />
                      </div>
                    ),
                    h3: ({ ...props }) => (
                      <h3 
                        style={{ 
                          color: 'var(--primary-active)', 
                          fontSize: '20px', 
                          borderBottom: '1px solid var(--border-color)', 
                          paddingBottom: '8px', 
                          marginTop: '32px', 
                          marginBottom: '16px', 
                          fontFamily: 'var(--font-heading)' 
                        }} 
                        {...props} 
                      />
                    )
                  }}
                >
                  {planGenerado.replace(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/g, '')}
                </ReactMarkdown>
                
                {/* Render de Materiales Anexos (Iframes aislados) */}
                {recursosAnexos && recursosAnexos.length > 0 && (
                  <div style={{ marginTop: '44px', borderTop: '2px dashed var(--border-color)', paddingTop: '32px' }}>
                    <h3 style={{ color: 'var(--primary-active)', fontSize: '22px', marginBottom: '20px', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MonitorPlay size={22} /> Recursos Didácticos Anexos
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {recursosAnexos.map((recurso, idx) => (
                        <div key={idx} style={{ backgroundColor: 'var(--surface-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)' }}>
                            <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <MonitorPlay size={16} style={{ color: 'var(--primary-sage)' }} /> {recurso.title}
                            </h4>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button 
                                className="btn-outline" 
                                onClick={() => {
                                  const blob = new Blob([recurso.html], { type: 'text/html' });
                                  const url = URL.createObjectURL(blob);
                                  window.open(url, '_blank');
                                }}
                                style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                              >
                                <Maximize2 size={13} /> Ampliar
                              </button>
                              <button 
                                className="btn" 
                                onClick={() => {
                                  const blob = new Blob([recurso.html], { type: 'text/html' });
                                  const url = URL.createObjectURL(blob);
                                  const a = document.createElement('a');
                                  a.href = url;
                                  a.download = `${recurso.title.replace(/ /g, '_')}.html`;
                                  a.click();
                                }}
                                style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'var(--primary-sage)' }}
                              >
                                <Download size={13} /> Descargar HTML
                              </button>
                            </div>
                          </div>
                          <div style={{ padding: 0, height: '400px', width: '100%', backgroundColor: '#FFF' }}>
                            <iframe 
                              srcDoc={recurso.html}
                              sandbox="allow-scripts"
                              style={{ width: '100%', height: '100%', border: 'none' }}
                              title={recurso.title}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {renderGeneradorInteligente()}
              </article>
            )}
          </div>
        </div>

        {/* Panel Lateral: Asistente Co-docente IA */}
        <aside 
          className="editor-chat-pane" 
          style={{ display: activeMobileTab === 'chat' || window.innerWidth >= 992 ? 'block' : 'none' }}
        >
          <div className="editor-chat-card">
            
            <div className="editor-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                  <Sparkles size={17} style={{ color: '#D4AF37' }} /> Co-docente IA
                </h2>
                <span className="editor-chat-online-badge">
                  <span className="editor-chat-online-dot" />
                  En línea
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#3D5A53', margin: 0, lineHeight: '1.45' }}>
                Ajusta partes de la secuencia en tiempo real con indicaciones pedagógicas situadas.
              </p>
            </div>
            
            {/* Mensajes del Chat */}
            <div className="editor-chat-messages">
              {sesionChatIA.length === 0 && (
                <div className="editor-chat-welcome-bubble">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#142B25', marginBottom: '4px' }}>
                    <span>👋 Hola, soy tu co-docente didáctico.</span>
                  </div>
                  ¿Deseas modificar algún momento de la clase? Por ejemplo:
                  <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(71, 122, 114, 0.4)', fontStyle: 'italic', fontSize: '12.5px' }}>
                    "Haz que la actividad de inicio incluya un reto gamificado" o "Adapta la evaluación formativa para DUA".
                  </div>
                </div>
              )}
              {sesionChatIA.map((msg, i) => (
                <div 
                  key={i} 
                  className={msg.role === 'user' ? 'editor-chat-msg-user' : 'editor-chat-msg-ia'}
                >
                  {msg.text}
                </div>
              ))}
              {isModifying && (
                <div className="editor-chat-msg-ia" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#142B25', fontWeight: 500 }}>
                  <Loader2 size={16} className="spin" style={{ color: '#315B54' }} /> Reescribiendo la secuencia pedagógica...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Formulario de Entrada */}
            <form onSubmit={handleModify} className="editor-chat-input-bar">
              <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)} 
                placeholder="Escribe tu instrucción pedagógica..." 
                className="editor-chat-input"
                disabled={isModifying || isEditMode}
                aria-label="Instrucción para el co-docente de IA"
              />
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '0 14px', minHeight: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
                disabled={isModifying || isEditMode || !prompt.trim()}
                title="Enviar instrucción a la IA"
              >
                <Send size={15} />
              </button>
            </form>
            {isEditMode && (
              <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '8px', padding: '4px 8px', backgroundColor: 'rgba(254, 242, 242, 0.8)', borderRadius: '6px' }}>
                Desactiva el modo de edición de código para interactuar con el co-docente IA.
              </div>
            )}
          </div>
        </aside>

      </div>
      
      {/* Modal para Material Complementario HTML */}
      {isModalOpen && (
        <div className="editor-modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}>
          <div className="editor-modal-card" role="dialog" aria-modal="true" aria-labelledby="material-modal-title">
            
            {/* Header del Modal */}
            <div className="modal-glass-header" style={{ padding: '18px 26px' }}>
              <h3 id="material-modal-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                <Sparkles size={18} style={{ color: '#D4AF37' }} /> {modalTitle}
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!isGeneratingMaterial && (
                  <>
                    <button onClick={handleAnexarAlPlan} className="editor-btn-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px' }}>
                      <PlusCircle size={15} /> Anexar al Plan
                    </button>
                    <button onClick={downloadMaterialHtml} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '13px' }}>
                      <Download size={15} /> Descargar HTML
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="modal-glass-close-btn"
                  aria-label="Cerrar modal de material"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Contenido del Modal */}
            <div style={{ padding: 0, overflow: 'hidden', flex: 1, backgroundColor: '#FFF', display: 'flex', minHeight: '520px' }}>
              {isGeneratingMaterial ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', color: 'var(--text-secondary)', gap: '16px', padding: '48px', textAlign: 'center' }}>
                  <Loader2 size={44} className="spin" style={{ color: 'var(--primary-sage)' }} />
                  <div>
                    <h4 style={{ color: 'var(--text-main)', fontSize: '16px', marginBottom: '6px' }}>Elaborando material pedagógico interactivo</h4>
                    <p style={{ fontSize: '13.5px', maxWidth: '420px', margin: '0 auto' }}>Generando código HTML accesible y autónomo según los contenidos de tu secuencia...</p>
                  </div>
                </div>
              ) : (
                <iframe 
                  srcDoc={modalContentHtml}
                  sandbox="allow-scripts"
                  style={{ width: '100%', height: '100%', minHeight: '520px', border: 'none', backgroundColor: '#FFF' }}
                  title="Material Generado"
                />
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
