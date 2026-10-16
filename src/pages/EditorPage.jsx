import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAppStore } from '../store/useAppStore';
import { modifyPlan } from '../services/aiService';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  MessageSquare,
  Trash2,
  AlertCircle,
  PanelRightClose,
  PanelRightOpen,
  Zap,
  Lightbulb,
  Check
} from 'lucide-react';

import { savePlanToDB, updatePlanInDB, getPlanById } from '../services/dbService';
import { auth } from '../firebase';
import { generateComplementaryMaterial } from '../services/aiService';
import { exportPlanToPdf } from '../services/export/pdf/pdfEngine';
import { exportPlanToWord } from '../services/export/word/wordEngine';
import { formatCurricularMarkdown } from '../services/export/curricularMarkdownFormatter';
import { formatMathForWeb } from '../utils/mathFormatter';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
import StructuredPlanDocument from '../components/StructuredPlanDocument';
import MaterialesGenerablesSection from '../components/MaterialesGenerablesSection';
import { recomendarMaterialesDidacticos } from '../utils/materialRecommender';

export default function EditorPage() {
  const { 
    planGenerado, 
    setPlanGenerado, 
    apiKey, 
    sesionChatIA, 
    addMensajeChatIA, 
    wizardData,
    activePlanMetadata,
    planStatus, 
    setPlanStatus, 
    setEstadoCambios,
    resetWizard, 
    userId, 
    userProfile,
    planId, 
    setPlanId, 
    recursosAnexos, 
    addRecursoAnexo, 
    removeRecursoAnexo,
    loadPlan,
    planesCount, 
    setPlanesCount 
  } = useAppStore();

  const currentMetadata = useMemo(() => activePlanMetadata || wizardData || {}, [activePlanMetadata, wizardData]);

  const [searchParams] = useSearchParams();
  const urlPlanId = searchParams.get('id');

  const [prompt, setPrompt] = useState('');
  const [chatMode, setChatMode] = useState('direct'); // 'direct' | 'socratic'
  const [isModifying, setIsModifying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [editablePlan, setEditablePlan] = useState(planGenerado || '');
  const [activeMobileTab, setActiveMobileTab] = useState('doc'); // 'doc' | 'chat'
  const [saveFeedback, setSaveFeedback] = useState(null); // { type: 'success' | 'error', text: string }
  const [generatingRecId, setGeneratingRecId] = useState(null);

  // Recomendaciones contextuales de materiales didácticos bajo demanda (2 a 4 opciones)
  const recomendaciones = useMemo(() => {
    if (!planGenerado) return [];
    return recomendarMaterialesDidacticos(currentMetadata, planGenerado);
  }, [currentMetadata, planGenerado]);
  
  // Estado de visibilidad del co-docente IA con persistencia local
  const [isChatOpen, setIsChatOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('inspiratec_chat_collapsed') !== 'true';
    }
    return true;
  });

  const toggleChat = () => {
    setIsChatOpen(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_chat_collapsed', String(!next));
      }
      return next;
    });
  };

  // Modal states for complementary materials
  const [showMaterialMenu, setShowMaterialMenu] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContentHtml, setModalContentHtml] = useState('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingWord, setIsExportingWord] = useState(false);
  
  const chatEndRef = useRef(null);
  const materialMenuRef = useRef(null);
  const navigate = useNavigate();

  const processedDoc = useMemo(() => {
    if (!planGenerado) return '';
    const formatted = formatCurricularMarkdown(planGenerado);
    return formatMathForWeb(formatted);
  }, [planGenerado]);

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

  // Sincronización precisa y segura con el ID de la URL y Firestore
  useEffect(() => {
    let isCancelled = false;

    const syncPlan = async () => {
      // 1. Si no hay ID en la URL pero tenemos un planId activo persistido, sincronizamos la URL
      if (!urlPlanId && planId) {
        navigate(`/editor?id=${planId}`, { replace: true });
        return;
      }

      // 2. Si hay urlPlanId y coincide con el planId actual y el documento está en memoria:
      if (urlPlanId && planId === urlPlanId && planGenerado && planGenerado.trim().length > 20) {
        return;
      }

      // 3. Si hay urlPlanId y difiere de la sesión en memoria o falta el contenido:
      if (urlPlanId) {
        try {
          setIsLoadingPlan(true);
          setLoadError(null);
          const remotePlan = await getPlanById(urlPlanId);
          if (isCancelled) return;
          if (remotePlan) {
            loadPlan(remotePlan, remotePlan.markdown, remotePlan.id);
          } else {
            setLoadError(`No se encontró el plan de clase solicitado.`);
          }
        } catch (err) {
          if (isCancelled) return;
          console.warn("No se pudo cargar el plan desde Firestore:", err);
          setLoadError("No fue posible cargar el plan desde la base de datos.");
        } finally {
          if (!isCancelled) {
            setIsLoadingPlan(false);
          }
        }
      }
    };

    syncPlan();

    return () => {
      isCancelled = true;
    };
  }, [urlPlanId, planId, planGenerado, loadPlan, navigate]);

  const handleModify = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !apiKey || !planGenerado) return;

    const userMsg = prompt.trim();
    addMensajeChatIA({ role: 'user', text: userMsg });
    setPrompt('');
    setIsModifying(true);

    try {
      const result = await modifyPlan(apiKey, planGenerado, userMsg, chatMode, sesionChatIA);

      if (chatMode === 'direct') {
        if (result.planModificado) {
          setPlanGenerado(result.planModificado);
          setPlanStatus('modificado');
          setEstadoCambios(true);
        }
        addMensajeChatIA({ 
          role: 'ia', 
          text: result.textoDialogo,
          tipo: 'directo'
        });
      } else {
        // Modo Diálogo Socrático Guiado (Caro 2015)
        addMensajeChatIA({ 
          role: 'ia', 
          text: result.textoDialogo,
          tipo: 'socratico',
          planSugerido: result.planModificado
        });
      }
    } catch (error) {
      addMensajeChatIA({ role: 'ia', text: "Hubo un error al procesar la indicación: " + error.message });
    } finally {
      setIsModifying(false);
    }
  };

  const handleAplicarPropuestaSocratica = (planSugerido) => {
    if (!planSugerido) return;
    setPlanGenerado(planSugerido);
    setPlanStatus('modificado');
    setEstadoCambios(true);
    setSaveFeedback({ type: 'success', text: 'Ajuste socrático aplicado exitosamente al documento.' });
    setTimeout(() => setSaveFeedback(null), 3500);
  };

  const handleSaveToBackend = async () => {
    const effectiveUserId = userId || auth.currentUser?.uid || 'anon';
    
    setIsSaving(true);
    setSaveFeedback(null);
    try {
      if (planId) {
        await updatePlanInDB(planId, planGenerado, recursosAnexos);
        setPlanStatus('guardado');
        setEstadoCambios(false);
        setSaveFeedback({ type: 'success', text: 'Cambios guardados en Mis Planes con éxito.' });
      } else {
        const newPlanId = await savePlanToDB(effectiveUserId, currentMetadata, planGenerado, recursosAnexos);
        setPlanId(newPlanId);
        setPlanStatus('guardado');
        setEstadoCambios(false);
        setPlanesCount((planesCount || 0) + 1);
        setSaveFeedback({ type: 'success', text: 'Plan guardado exitosamente en Mis Planes.' });
        navigate(`/editor?id=${newPlanId}`, { replace: true });
      }
      setTimeout(() => setSaveFeedback(null), 4000);
    } catch (e) {
      setSaveFeedback({ type: 'error', text: 'Error al guardar: ' + (e.message || 'Verifica la conexión.') });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPdf = async () => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);

    try {
      await exportPlanToPdf({
        plan: {
          ...currentMetadata,
          recursosAnexos
        },
        markdown: planGenerado,
        userProfile,
        planId
      });
    } catch (err) {
      console.error('[INSPIRATEC PDF] Error al exportar:', err.message);
      alert(err.message || 'Error al generar el documento PDF.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadWord = async () => {
    if (isExportingWord) return;
    setIsExportingWord(true);

    try {
      await exportPlanToWord({
        plan: {
          ...currentMetadata,
          recursosAnexos
        },
        markdown: planGenerado,
        userProfile,
        planId
      });
    } catch (err) {
      console.error('[INSPIRATEC WORD] Error al exportar:', err.message);
      alert(err.message || 'Error al generar el documento de Word.');
    } finally {
      setIsExportingWord(false);
    }
  };

  const handleGenerateMaterial = async (type, title, contextoEspecifico = '', recId = null) => {
    if (!apiKey) {
      alert("Configura tu API Key primero.");
      return;
    }
    setGeneratingRecId(recId);
    setModalTitle(title);
    setIsModalOpen(true);
    setIsGeneratingMaterial(true);
    setModalContentHtml('');

    try {
      const html = await generateComplementaryMaterial(apiKey, planGenerado, type, contextoEspecifico);
      setModalContentHtml(html);
    } catch (e) {
      setModalContentHtml(`<div style="color:var(--error-color); text-align:center; padding:24px;">Error: ${e.message}</div>`);
    } finally {
      setIsGeneratingMaterial(false);
      setGeneratingRecId(null);
    }
  };

  const handleGenerarRecomendacion = async (rec) => {
    await handleGenerateMaterial(rec.typeKey, rec.nombre, rec.contextoEspecifico, rec.id);
  };

  const downloadMaterialHtml = () => {
    const blob = new Blob([modalContentHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalTitle.replace(/ /g, '_')}.html`;
    a.click();
  };

  const handleAnexarAlPlan = async () => {
    if (!modalTitle || !modalContentHtml) {
      setIsModalOpen(false);
      return;
    }

    const nuevoRecurso = {
      title: modalTitle,
      html: modalContentHtml,
      tipo: modalTitle,
      anexadoAt: new Date().toISOString()
    };

    // 1. Guardar de inmediato en el store (se persiste en localStorage con persist middleware)
    addRecursoAnexo(nuevoRecurso);
    setIsModalOpen(false);

    // 2. Persistencia y sincronización automática inmediata con Firestore
    const currentList = Array.isArray(recursosAnexos) ? recursosAnexos : [];
    const updatedList = [...currentList.filter(r => r.title !== modalTitle), nuevoRecurso];

    if (planId) {
      try {
        await updatePlanInDB(planId, planGenerado, updatedList);
        setPlanStatus('guardado');
      } catch (err) {
        console.error("Error al actualizar anexo en Firestore:", err);
      }
    } else if (planGenerado) {
      try {
        const effectiveUserId = userId || auth.currentUser?.uid || 'anon';
        const newId = await savePlanToDB(effectiveUserId, currentMetadata, planGenerado, updatedList);
        setPlanId(newId);
        setPlanStatus('guardado');
        setPlanesCount((planesCount || 0) + 1);
        navigate(`/editor?id=${newId}`, { replace: true });
      } catch (err) {
        console.error("Error al autoguardar nuevo plan con anexo:", err);
      }
    }
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


  const getMaterialOptions = () => {
    switch (currentMetadata?.materia) {
      case 'Matemáticas': return [
        { id: 'taller_contexto', label: 'Taller de Contexto Real', icon: <ListChecks size={16}/> },
        { id: 'guia_modelacion', label: 'Guía de Modelación', icon: <MonitorPlay size={16}/> },
        { id: 'preguntas', label: 'Quiz Interactivo', icon: <HelpCircle size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      case 'Ciencias Naturales': return [
        { id: 'reto_lab', label: 'Guía de Indagación / Lab', icon: <MonitorPlay size={16}/> },
        { id: 'estudio_caso', label: 'Estudio de Fenómeno', icon: <FileText size={16}/> },
        { id: 'preguntas', label: 'Quiz de Indagación', icon: <HelpCircle size={16}/> },
        { id: 'rubrica', label: 'Rúbrica Científica', icon: <ListChecks size={16}/> }
      ];
      case 'Inglés': return [
        { id: 'reading', label: 'Reading Comprehension', icon: <FileText size={16}/> },
        { id: 'roleplay_en', label: 'Role-Play Scripts', icon: <FileCode size={16}/> },
        { id: 'flashcards', label: 'Flashcards Interactivas', icon: <MonitorPlay size={16}/> },
        { id: 'juegos', label: 'Sopa de Letras (EN)', icon: <Puzzle size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      case 'Lengua Castellana':
      case 'Lenguaje (Español)': return [
        { id: 'taller_lectura', label: 'Taller de Comprensión', icon: <FileText size={16}/> },
        { id: 'produccion_textual', label: 'Producción Textual', icon: <Edit size={16}/> },
        { id: 'roleplay_lit', label: 'Juego de Roles Literario', icon: <FileCode size={16}/> },
        { id: 'rubrica', label: 'Rúbrica de Evaluación', icon: <ListChecks size={16}/> }
      ];
      case 'Tecnología e Informática':
      case 'Informática': return [
        { id: 'reto_lab', label: 'Guía de Práctica / Taller Digital', icon: <MonitorPlay size={16}/> },
        { id: 'estudio_caso', label: 'Estudio de Caso Tecnológico', icon: <FileText size={16}/> },
        { id: 'preguntas', label: 'Cuestionario de Evaluación', icon: <HelpCircle size={16}/> },
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

  const breadcrumbsItems = [
    { label: 'Inicio', href: '/home', onClick: (e) => { e.preventDefault(); navigate('/home'); } },
    { label: 'Mis Planes', href: '/mis-planes', onClick: (e) => { e.preventDefault(); navigate('/mis-planes'); } },
    { label: currentMetadata?.tema || 'Editor de Clase' }
  ];

  return (
    <div className="editor-view" style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 32px 64px' }}>
      
      {/* Migas de Pan para orientación jerárquica */}
      <div style={{ marginBottom: '14px' }}>
        <Breadcrumbs items={breadcrumbsItems} />
      </div>

      {/* Notificación no invasiva de estado de guardado */}
      {saveFeedback && (
        <div 
          role="status" 
          aria-live="polite"
          style={{
            marginBottom: '16px',
            padding: '12px 20px',
            borderRadius: '14px',
            fontSize: '13.5px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: saveFeedback.type === 'success' ? 'rgba(236, 253, 245, 0.95)' : 'rgba(254, 242, 242, 0.95)',
            color: saveFeedback.type === 'success' ? '#065F46' : '#991B1B',
            border: saveFeedback.type === 'success' ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid rgba(239, 68, 68, 0.35)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
          }}
        >
          {saveFeedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{saveFeedback.text}</span>
        </div>
      )}

      {/* Barra de Acciones Centralizada de Cristal Translúcido (Mismo desenfoque y estilo de Inicio) */}
      <header 
        className="editor-toolbar-card"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '22px',
          padding: '24px 34px',
          marginBottom: '26px',
          boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
        }}
      >
        <div className="editor-toolbar-meta">
          <div className="editor-title-row">
            <h1 className="editor-title" style={{ fontSize: '28px', fontFamily: 'var(--font-heading)', color: '#142B25', fontWeight: 700, letterSpacing: '-0.015em' }}>
              {currentMetadata?.tema || 'Secuencia Didáctica'}
            </h1>
            <span className={`editor-badge ${planStatus === 'guardado' ? 'saved' : 'draft'}`}>
              {planStatus === 'guardado' ? (
                <>
                  <CheckCircle2 size={13} /> Guardado en Mis Planes
                </>
              ) : planStatus === 'generado' ? (
                <>
                  <Sparkles size={13} /> Propuesta generada (sin guardar)
                </>
              ) : planStatus === 'modificado' ? (
                <>
                  <Clock size={13} /> Cambios pendientes por guardar
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
              <BookOpen size={13} /> {currentMetadata?.materia || 'General'}
            </span>
            <span className="editor-meta-tag">
              {currentMetadata?.grado || 'Sin grado'}
            </span>
            {currentMetadata?.duracion && (
              <span className="editor-meta-tag">
                <Clock size={13} /> {currentMetadata.duracion}
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
            <span>
              {isSaving 
                ? 'Guardando...' 
                : planStatus === 'guardado' 
                ? 'Guardado' 
                : planStatus === 'modificado' 
                ? 'Guardar cambios' 
                : 'Guardar en Mis Planes'}
            </span>
          </button>
          
          {/* Toggle Modo Edición Estructurada del Plan */}
          <button 
            className="editor-btn-pill" 
            style={{ 
              backgroundColor: isEditMode ? 'rgba(71, 122, 114, 0.18)' : undefined,
              borderColor: isEditMode ? 'rgba(71, 122, 114, 0.45)' : undefined,
              color: isEditMode ? '#142B25' : undefined
            }} 
            onClick={() => setIsEditMode(!isEditMode)}
            title={isEditMode ? "Ver documento pedagógico estructurado" : "Editar directamente los apartados y la secuencia didáctica del plan"}
          >
            {isEditMode ? <Eye size={15} /> : <Edit size={15} />}
            <span>{isEditMode ? 'Ver Documento' : 'Editar Plan'}</span>
          </button>

          {/* Exportación */}
          <div className="editor-btn-group">
            <button 
              className="editor-btn-pill" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '13px', 
                background: 'transparent', 
                border: 'none', 
                boxShadow: 'none',
                opacity: isExportingPdf ? 0.7 : 1,
                cursor: isExportingPdf ? 'wait' : 'pointer'
              }} 
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              title={isExportingPdf ? "Generando documento PDF profesional..." : "Descargar documento PDF oficial"}
            >
              {isExportingPdf ? <Loader2 size={15} className="spin" /> : <FileText size={15} />}
              <span>{isExportingPdf ? 'Generando...' : 'PDF'}</span>
            </button>
            <button 
              className="editor-btn-pill" 
              style={{ 
                padding: '6px 12px', 
                fontSize: '13px', 
                background: 'transparent', 
                border: 'none', 
                boxShadow: 'none',
                opacity: isExportingWord ? 0.7 : 1,
                cursor: isExportingWord ? 'wait' : 'pointer'
              }} 
              onClick={handleDownloadWord}
              disabled={isExportingWord}
              title={isExportingWord ? "Generando documento Word..." : "Descargar documento de Word"}
            >
              {isExportingWord ? <Loader2 size={15} className="spin" /> : <FileCode size={15} />}
              <span>{isExportingWord ? 'Generando...' : 'Word'}</span>
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

          {/* Botón de alternancia del Co-docente IA */}
          <button 
            type="button"
            className={`editor-btn-pill editor-chat-toggle-pill ${isChatOpen ? 'active' : ''}`} 
            style={{ 
              backgroundColor: isChatOpen ? 'rgba(71, 122, 114, 0.16)' : undefined,
              borderColor: isChatOpen ? 'rgba(71, 122, 114, 0.40)' : undefined,
              color: isChatOpen ? '#142B25' : undefined,
              fontWeight: isChatOpen ? 700 : 600
            }} 
            onClick={toggleChat}
            aria-label={isChatOpen ? "Ocultar panel del co-docente IA" : "Mostrar panel del co-docente IA"}
            title={isChatOpen ? "Ocultar co-docente IA para ampliar la vista del documento" : "Mostrar co-docente IA para conversar o ajustar"}
          >
            {isChatOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
            <span>{isChatOpen ? 'Ocultar Co-docente' : 'Co-docente IA'}</span>
            {sesionChatIA.length > 0 && (
              <span className="editor-badge-chat-count">{sesionChatIA.length}</span>
            )}
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
          <div 
            className="editor-doc-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
            }}
          >
            {isLoadingPlan ? (
              <div style={{ padding: '72px 24px', textAlign: 'center', color: '#315B54' }}>
                <Loader2 size={36} className="spin" style={{ margin: '0 auto 16px auto', display: 'block' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#142B25', marginBottom: '8px' }}>
                  Recuperando documento...
                </h3>
                <p style={{ fontSize: '14px', color: '#576864' }}>
                  Sincronizando la planeación desde la base de datos oficial.
                </p>
              </div>
            ) : loadError ? (
              <div style={{ padding: '72px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <AlertCircle size={30} />
                </div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#142B25', marginBottom: '8px' }}>
                  {loadError}
                </h3>
                <p style={{ fontSize: '14px', color: '#576864', maxWidth: '420px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  El documento solicitado no pudo ser recuperado. Puedes consultar tu lista de planes guardados o iniciar una nueva clase.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-secondary" onClick={() => navigate('/mis-planes')}>
                    Ir a Mis Planes
                  </button>
                  <button className="btn btn-primary" onClick={() => navigate('/planificador')}>
                    Ir al Planificador
                  </button>
                </div>
              </div>
            ) : !planGenerado ? (
              <div style={{ padding: '72px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(71, 122, 114, 0.12)', color: '#315B54', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <BookOpen size={28} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', marginBottom: '8px' }}>
                  No hay una planeación activa en el Editor
                </h3>
                <p style={{ fontSize: '14px', color: '#576864', maxWidth: '440px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                  Utiliza el Planificador para diseñar una nueva secuencia didáctica con asistencia de IA o abre un plan existente desde tu biblioteca.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button className="btn btn-primary" onClick={() => navigate('/planificador')}>
                    Crear Nueva Clase
                  </button>
                  <button className="btn btn-secondary" onClick={() => navigate('/mis-planes')}>
                    Ver Mis Planes
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '820px', margin: '0 auto', padding: '8px 4px' }}>
                <StructuredPlanDocument 
                  markdown={processedDoc}
                  isEditing={isEditMode}
                  onSave={(newMarkdown) => {
                    setPlanGenerado(newMarkdown);
                    setPlanStatus('modificado');
                    setEstadoCambios(true);
                    setIsEditMode(false);
                    setSaveFeedback({ type: 'success', text: 'Cambios aplicados exitosamente al documento.' });
                    setTimeout(() => setSaveFeedback(null), 3500);
                  }}
                  onCancel={() => {
                    setIsEditMode(false);
                  }}
                />

                {!isEditMode && (
                  <>
                    {/* Apartado pedagógico: Materiales que puedes generar */}
                    <MaterialesGenerablesSection
                      recomendaciones={recomendaciones}
                      onGenerarMaterial={handleGenerarRecomendacion}
                      isGenerating={isGeneratingMaterial}
                      generatingId={generatingRecId}
                    />

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
                                      setModalTitle(recurso.title);
                                      setModalContentHtml(recurso.html);
                                      setIsGeneratingMaterial(false);
                                      setIsModalOpen(true);
                                    }}
                                    style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                                    title="Ver en ventana emergente con fondo desenfocado"
                                  >
                                    <Maximize2 size={13} /> Ver en Ventana
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
                                  <button 
                                    className="btn-outline" 
                                    onClick={async () => {
                                      removeRecursoAnexo(idx);
                                      const updated = (recursosAnexos || []).filter((_, i) => i !== idx);
                                      if (planId) {
                                        try {
                                          await updatePlanInDB(planId, planGenerado, updated);
                                        } catch (e) {
                                          console.error("Error al remover anexo en Firestore:", e);
                                        }
                                      }
                                    }}
                                    style={{ padding: '6px 12px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px', color: '#DC2626', borderColor: 'rgba(220, 38, 38, 0.35)' }}
                                    title="Desanexar material de este plan"
                                  >
                                    <Trash2 size={13} /> Quitar
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Panel Lateral: Asistente Co-docente IA */}
        <aside 
          className={`editor-chat-pane ${!isChatOpen ? 'is-collapsed' : ''}`} 
          style={{ 
            display: !isChatOpen ? 'none' : (activeMobileTab === 'chat' || (typeof window !== 'undefined' && window.innerWidth >= 992) ? 'block' : 'none') 
          }}
          aria-hidden={!isChatOpen}
        >
          <div 
            className="editor-chat-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
            }}
          >
            
            <div className="editor-chat-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <h2 style={{ fontSize: '16.5px', fontWeight: 700, color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-heading)' }}>
                  <Sparkles size={17} style={{ color: '#D4AF37' }} /> Co-docente IA
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="editor-chat-online-badge">
                    <span className="editor-chat-online-dot" />
                    En línea
                  </span>
                  <button 
                    type="button" 
                    className="editor-chat-close-btn" 
                    onClick={toggleChat}
                    aria-label="Ocultar panel del co-docente didáctico"
                    title="Ocultar co-docente IA para ampliar el área del documento"
                  >
                    <PanelRightClose size={16} />
                  </button>
                </div>
              </div>

              {/* Selector de Modalidad Pedagógica: Directo vs Socrático Guiado (Caro 2015) */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '8px', backgroundColor: 'rgba(49, 91, 84, 0.08)', padding: '3px', borderRadius: '10px' }} role="tablist" aria-label="Modalidad del co-docente">
                <button
                  type="button"
                  role="tab"
                  aria-selected={chatMode === 'direct'}
                  onClick={() => setChatMode('direct')}
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    fontWeight: chatMode === 'direct' ? 700 : 500,
                    backgroundColor: chatMode === 'direct' ? '#FFFFFF' : 'transparent',
                    color: chatMode === 'direct' ? '#142B25' : '#477A72',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    boxShadow: chatMode === 'direct' ? '0 1px 3px rgba(16, 36, 32, 0.10)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Modo directo: reescribe el documento inmediatamente"
                >
                  <Zap size={12} color={chatMode === 'direct' ? '#315B54' : '#477A72'} />
                  <span>Directo</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={chatMode === 'socratic'}
                  onClick={() => setChatMode('socratic')}
                  style={{
                    flex: 1,
                    padding: '5px 8px',
                    fontSize: '11.5px',
                    fontWeight: chatMode === 'socratic' ? 700 : 500,
                    backgroundColor: chatMode === 'socratic' ? '#FFFFFF' : 'transparent',
                    color: chatMode === 'socratic' ? '#142B25' : '#477A72',
                    border: 'none',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                    boxShadow: chatMode === 'socratic' ? '0 1px 3px rgba(16, 36, 32, 0.10)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title="Modo socrático guiado: preguntas reflexivas y propuesta para validar (Caro 2015)"
                >
                  <Lightbulb size={12} color={chatMode === 'socratic' ? '#D97706' : '#477A72'} />
                  <span>Socrático</span>
                </button>
              </div>

              <p style={{ fontSize: '11.5px', color: '#477A72', margin: '6px 0 0 0', lineHeight: '1.4' }}>
                {chatMode === 'direct' 
                  ? '⚡ Aplica modificaciones inmediatas directamente al documento.' 
                  : '💡 Diálogo reflexivo con preguntas orientadoras y propuesta guiada.'}
              </p>
            </div>
            
            {/* Mensajes del Chat */}
            <div className="editor-chat-messages">
              {sesionChatIA.length === 0 && (
                <div className="editor-chat-welcome-bubble">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#142B25', marginBottom: '4px' }}>
                    <span>👋 Hola, soy tu co-docente didáctico.</span>
                  </div>
                  ¿Deseas reflexionar o ajustar algún momento de la clase?
                  <div style={{ marginTop: '6px', paddingLeft: '8px', borderLeft: '2px solid rgba(71, 122, 114, 0.4)', fontStyle: 'italic', fontSize: '12.5px' }}>
                    "¿Cómo podemos activar conocimientos previos con una rutina de pensamiento?" o "Propón una adaptación DUA para estudiantes visuales".
                  </div>
                </div>
              )}
              {sesionChatIA.map((msg, i) => (
                <div 
                  key={i} 
                  className={msg.role === 'user' ? 'editor-chat-msg-user' : 'editor-chat-msg-ia'}
                  style={msg.tipo === 'socratico' ? { borderLeft: '3px solid #D97706', backgroundColor: 'rgba(255, 251, 235, 0.90)' } : undefined}
                >
                  {msg.tipo === 'socratico' && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.04em' }}>
                      <Lightbulb size={11} color="#D97706" /> Diálogo Socrático
                    </div>
                  )}
                  <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>{msg.text}</div>

                  {msg.planSugerido && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(49, 91, 84, 0.16)' }}>
                      <button
                        type="button"
                        onClick={() => handleAplicarPropuestaSocratica(msg.planSugerido)}
                        className="btn btn-primary"
                        style={{ fontSize: '12px', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Check size={13} />
                        <span>Aplicar propuesta al plan</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {isModifying && (
                <div className="editor-chat-msg-ia" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#142B25', fontWeight: 500 }}>
                  <Loader2 size={16} className="spin" style={{ color: '#315B54' }} />
                  <span>{chatMode === 'socratic' ? 'Elaborando diálogo socrático reflexivo...' : 'Reescribiendo la secuencia pedagógica...'}</span>
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
      
      {/* Botón flotante accesible para reabrir el Co-docente IA cuando el panel esté cerrado */}
      {!isChatOpen && (
        <button 
          type="button" 
          className="editor-floating-chat-trigger"
          onClick={toggleChat}
          aria-label="Abrir panel del co-docente didáctico"
          title="Abrir panel del co-docente IA para conversar o ajustar"
        >
          <Sparkles size={16} style={{ color: '#D4AF37' }} />
          <span>Co-docente IA</span>
          {sesionChatIA.length > 0 && (
            <span className="editor-badge-chat-count">{sesionChatIA.length}</span>
          )}
        </button>
      )}
      
      {/* Modal para Material Complementario HTML montado en body con Portal para que los menús queden atrás con desenfoque */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          className="editor-modal-backdrop" 
          onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
          role="dialog" 
          aria-modal="true" 
          aria-labelledby="material-modal-title"
        >
          <div className="editor-modal-card">
            
            {/* Header del Modal */}
            <div className="modal-glass-header" style={{ padding: '18px 26px' }}>
              <h3 id="material-modal-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                <Sparkles size={18} style={{ color: '#D4AF37' }} /> {modalTitle}
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {!isGeneratingMaterial && (
                  <>
                    {!recursosAnexos.some(r => r.title === modalTitle) && (
                      <button onClick={handleAnexarAlPlan} className="editor-btn-pill" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', fontSize: '13px' }}>
                        <PlusCircle size={15} /> Anexar al Plan
                      </button>
                    )}
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
        </div>,
        document.body
      )}
    </div>
  );
}
