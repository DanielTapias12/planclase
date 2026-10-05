import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { modifyPlan } from '../services/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate } from 'react-router-dom';
import { Save, Edit, FileText, FileCode, PlusCircle, 
  ListChecks, MonitorPlay, HelpCircle, Puzzle, Send, Loader2, X, Download
} from 'lucide-react';

import { savePlanToDB, updatePlanInDB } from '../services/dbService';
import { generateComplementaryMaterial } from '../services/aiService';

export default function EditorPage() {
  const { planGenerado, setPlanGenerado, apiKey, sesionChatIA, addMensajeChatIA, wizardData, planStatus, setPlanStatus, resetWizard, userId, planId, setPlanId } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editablePlan, setEditablePlan] = useState(planGenerado);
  
  // Modal states for complementary materials
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContentHtml, setModalContentHtml] = useState('');
  const [isGeneratingMaterial, setIsGeneratingMaterial] = useState(false);
  
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sesionChatIA]);

  useEffect(() => {
    setEditablePlan(planGenerado);
  }, [planGenerado]);

  const handleModify = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !apiKey || !planGenerado) return;

    const userMsg = prompt;
    addMensajeChatIA({ role: 'user', text: userMsg });
    setPrompt('');
    setIsModifying(true);

    try {
      const newPlan = await modifyPlan(apiKey, planGenerado, userMsg);
      setPlanGenerado(newPlan);
      addMensajeChatIA({ role: 'ia', text: "He actualizado el plan según tus instrucciones. Revisa los cambios." });
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
        await updatePlanInDB(planId, planGenerado);
        setPlanStatus('guardado');
      } else {
        const newPlanId = await savePlanToDB(userId, wizardData, planGenerado);
        setPlanId(newPlanId);
        setPlanStatus('guardado');
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
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Plan de Clase</title></head><body>
      <div style="font-family: Arial, sans-serif; white-space: pre-wrap;">${planGenerado}</div>
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
      setModalContentHtml(`<div style="color:red; text-align:center;">Error: ${e.message}</div>`);
    } finally {
      setIsGeneratingMaterial(false);
    }
  };

  const downloadMaterialHtml = () => {
    const fullHtml = `<!DOCTYPE html><html><head><title>${modalTitle}</title><style>body{font-family:sans-serif; margin:40px;} table{border-collapse:collapse;width:100%;} th,td{border:1px solid #ccc;padding:8px;}</style></head><body>${modalContentHtml}</body></html>`;
    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${modalTitle.replace(/ /g, '_')}.html`;
    a.click();
  };

  const handleAnexarAlPlan = () => {
    // Se anexa el material como un bloque de código HTML y una instrucción clara
    const anexo = `\n\n---\n\n### 📎 Anexo: ${modalTitle}\n\nA continuación se adjunta el código fuente del material generado. Puedes copiar este bloque y guardarlo como un archivo \`.html\` para visualizarlo en cualquier navegador, o utilizar la plataforma Inspiratec para exportarlo.\n\n\`\`\`html\n${modalContentHtml}\n\`\`\`\n`;
    setPlanGenerado(planGenerado + anexo);
    setPlanStatus('borrador');
    setIsModalOpen(false);
  };

  if (!planGenerado) {
    return (
      <div className="plan-generado-view" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h3 style={{ marginBottom: '16px' }}>No hay un plan activo</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Dirígete al Creador para generar una nueva secuencia didáctica.</p>
        <button className="btn" onClick={() => navigate('/')}><PlusCircle size={18} /> Crear nuevo plan</button>
      </div>
    );
  }

  const renderGeneradorInteligente = () => {
    const match = planGenerado.match(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/);
    if (!match) return null;
    
    const typeMap = {
      'RUBRICA': { id: 'rubrica', icon: <ListChecks size={18} style={{color: '#fff'}}/>, text: 'Generar Rúbrica recomendada' },
      'DIAPOSITIVAS': { id: 'diapositivas', icon: <MonitorPlay size={18} style={{color: '#fff'}}/>, text: 'Generar Diapositivas recomendadas' },
      'PREGUNTAS': { id: 'preguntas', icon: <HelpCircle size={18} style={{color: '#fff'}}/>, text: 'Generar Preguntas recomendadas' },
      'JUEGO': { id: 'juegos', icon: <Puzzle size={18} style={{color: '#fff'}}/>, text: 'Generar Juego recomendado' }
    };
    
    const action = typeMap[match[1]];
    
    return (
      <div style={{ marginTop: '30px', padding: '24px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px dashed var(--primary-sage)', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
          <span style={{ fontSize: '20px' }}>✨</span>
          <h4 style={{ color: 'var(--primary-active)', margin: 0 }}>Sugerencia del Tejedor Inteligente</h4>
        </div>
        <p style={{ fontSize: '14px', marginBottom: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto 20px auto' }}>
          El Agente recomienda crear este material interconectado usando los parámetros ROCA que acaba de definir en el plan para garantizar la máxima coherencia pedagógica.
        </p>
        <button className="btn" style={{ backgroundColor: 'var(--primary-sage)', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }} onClick={() => handleGenerateMaterial(action.id, action.text)}>
          {action.icon} <span style={{color: '#fff'}}>{action.text}</span>
        </button>
      </div>
    );
  };

  return (
    <div className="plan-generado-view" style={{ padding: '20px 40px', maxWidth: '1400px', position: 'relative' }}>
      
      {/* Barra de acciones adaptada a la captura de pantalla */}
      <div style={{ backgroundColor: '#F7F3ED', padding: '24px 32px', marginBottom: '32px', borderRadius: '12px' }}>
        
        {/* Fila 1: Acciones principales */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'center' }}>
          <button 
            className="btn" 
            onClick={handleSaveToBackend}
            disabled={isSaving}
            style={{ backgroundColor: planStatus === 'guardado' ? 'var(--primary-sage)' : '#315B54', padding: '10px 24px', fontSize: '15px' }}
          >
            {isSaving ? <Loader2 size={18} className="spin" /> : <Save size={18} />} {planStatus === 'guardado' ? 'Guardado' : 'Guardar'}
          </button>
          
          <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => setIsEditMode(!isEditMode)}>
            <Edit size={16} style={{ color: '#475569' }} /> Editar manualmente
          </button>
          <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={handlePrintPdf}>
            <FileText size={16} style={{ color: '#475569' }} /> PDF
          </button>
          <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={handleDownloadWord}>
            <FileCode size={16} style={{ color: '#475569' }} /> Word
          </button>
          <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => { resetWizard(); navigate('/'); }}>
            <PlusCircle size={16} style={{ color: '#475569' }} /> Nuevo
          </button>
        </div>
        
        {/* Fila 2: Materiales Complementarios IA */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {wizardData?.materia === 'Matemáticas' ? (
            <>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('taller_contexto', 'Taller de Contexto Real')}>
                <ListChecks size={16} style={{ color: '#475569' }} /> Taller de Contexto Real
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('guia_modelacion', 'Guía de Modelación')}>
                <MonitorPlay size={16} style={{ color: '#475569' }} /> Guía de Modelación
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('preguntas', 'Quiz')}>
                <HelpCircle size={16} style={{ color: '#475569' }} /> Quiz
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('rubrica', 'Rúbrica de Evaluación')}>
                <ListChecks size={16} style={{ color: '#475569' }} /> Rúbrica
              </button>
            </>
          ) : wizardData?.materia === 'Inglés' ? (
            <>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('reading', 'Reading Comprehension')}>
                <FileText size={16} style={{ color: '#475569' }} /> Reading Comprehension
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('roleplay_en', 'Role-Play Scripts')}>
                <FileCode size={16} style={{ color: '#475569' }} /> Role-Play Scripts
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('flashcards', 'Flashcards de Vocabulario')}>
                <MonitorPlay size={16} style={{ color: '#475569' }} /> Flashcards
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('juegos', 'Sopa de Letras (EN)')}>
                <Puzzle size={16} style={{ color: '#475569' }} /> Sopa de Letras (EN)
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('rubrica', 'Rúbrica de Evaluación')}>
                <ListChecks size={16} style={{ color: '#475569' }} /> Rúbrica
              </button>
            </>
          ) : wizardData?.materia === 'Lenguaje (Español)' ? (
            <>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('taller_lectura', 'Taller de Comprensión')}>
                <FileText size={16} style={{ color: '#475569' }} /> Taller de Comprensión
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('produccion_textual', 'Pautas de Producción Textual')}>
                <Edit size={16} style={{ color: '#475569' }} /> Producción Textual
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('roleplay_lit', 'Juego de Roles Literario')}>
                <FileCode size={16} style={{ color: '#475569' }} /> Juego de Roles Literario
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('rubrica', 'Rúbrica de Evaluación')}>
                <ListChecks size={16} style={{ color: '#475569' }} /> Rúbrica
              </button>
            </>
          ) : (
            <>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('reto_lab', 'Reto de Laboratorio')}>
                <MonitorPlay size={16} style={{ color: '#475569' }} /> Reto de Laboratorio
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('estudio_caso', 'Estudio de Caso Tecnológico')}>
                <FileText size={16} style={{ color: '#475569' }} /> Estudio de Caso
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('diapositivas', 'Presentación (Diapositivas)')}>
                <MonitorPlay size={16} style={{ color: '#475569' }} /> Diapositivas
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('preguntas', 'Banco de Preguntas')}>
                <HelpCircle size={16} style={{ color: '#475569' }} /> Banco de Preguntas
              </button>
              <button className="btn-outline" style={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', padding: '10px 20px', color: '#334155' }} onClick={() => handleGenerateMaterial('juegos', 'Juegos y Recursos Lúdicos')}>
                <Puzzle size={16} style={{ color: '#475569' }} /> Juegos y Recursos
              </button>
            </>
          )}
        </div>
      </div>

      {/* Layout Editor/Chat */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Documento Principal */}
        <div className="plan-document" style={{ flex: 7, padding: '48px 56px', backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          {isEditMode ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <textarea 
                value={editablePlan} 
                onChange={(e) => setEditablePlan(e.target.value)} 
                style={{ width: '100%', minHeight: '600px', padding: '16px', fontFamily: 'monospace', fontSize: '14px', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button className="btn-outline" onClick={() => setIsEditMode(false)}>Cancelar</button>
                <button className="btn" onClick={handleManualSave}>Guardar cambios</button>
              </div>
            </div>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => <table className="plan-sequence-table" {...props} />,
                  h3: ({node, ...props}) => <h3 style={{ color: 'var(--primary-active)', fontSize: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginTop: '32px', marginBottom: '16px', fontFamily: 'var(--font-heading)' }} {...props} />
                }}
              >
                {planGenerado.replace(/\[GENERAR_(RUBRICA|DIAPOSITIVAS|PREGUNTAS|JUEGO)\]/g, '')}
              </ReactMarkdown>
              {renderGeneradorInteligente()}
            </div>
          )}
        </div>

        {/* Panel IA Lateral */}
        <div className="card" style={{ flex: 3, position: 'sticky', top: '24px', padding: '24px', display: 'flex', flexDirection: 'column', maxHeight: 'calc(100vh - 48px)', backgroundColor: '#FFFFFF' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--primary-active)', marginBottom: '16px' }}>Asistente de edición IA</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Pídele a la IA que modifique, acorte o ajuste partes específicas del plan.</p>
          
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', paddingRight: '8px' }}>
            {sesionChatIA.length === 0 && (
              <div style={{ backgroundColor: 'var(--bg-sage-soft)', padding: '12px', borderRadius: '8px', fontSize: '14px' }}>
                Hola, soy tu co-docente. ¿Qué te gustaría cambiar del documento a la izquierda? (Ej: "Haz la actividad de desarrollo más lúdica")
              </div>
            )}
            {sesionChatIA.map((msg, i) => (
              <div key={i} style={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.role === 'user' ? 'var(--primary-sage)' : 'var(--bg-sage-soft)',
                color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                padding: '10px 14px', borderRadius: '8px', fontSize: '14px', maxWidth: '85%'
              }}>
                {msg.text}
              </div>
            ))}
            {isModifying && (
              <div style={{ backgroundColor: 'var(--bg-sage-soft)', padding: '12px', borderRadius: '8px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Loader2 size={16} className="spin" /> Escribiendo cambios en el documento...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          
          <form onSubmit={handleModify} style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
            <input 
              type="text" 
              value={prompt} 
              onChange={(e) => setPrompt(e.target.value)} 
              placeholder="Escribe tu instrucción..." 
              style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '14px', backgroundColor: '#F8FAFC' }}
              disabled={isModifying || isEditMode}
            />
            <button type="submit" className="btn" style={{ padding: '0 16px', minHeight: 'auto' }} disabled={isModifying || isEditMode || !prompt.trim()}>
              <Send size={16} />
            </button>
          </form>
          {isEditMode && <div style={{ fontSize: '12px', color: 'var(--error-color)', marginTop: '8px' }}>Desactiva el modo de edición manual para usar la IA.</div>}
        </div>

      </div>
      
      {/* Modal para Material Complementario HTML */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', width: '90%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            
            {/* Header del Modal */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                ✨ {modalTitle}
              </h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                {!isGeneratingMaterial && (
                  <>
                    <button onClick={handleAnexarAlPlan} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1' }}>
                      <PlusCircle size={16} /> Anexar al Plan
                    </button>
                    <button onClick={downloadMaterialHtml} className="btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', backgroundColor: '#315B54' }}>
                      <Download size={16} /> Descargar HTML
                    </button>
                  </>
                )}
                <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', marginLeft: '8px' }}>
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Contenido HTML */}
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1, backgroundColor: '#F8FAFC' }}>
              {isGeneratingMaterial ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', gap: '16px' }}>
                  <Loader2 size={40} className="spin" style={{ color: 'var(--primary-sage)' }} />
                  <p>La Inteligencia Artificial está diseñando tu material en HTML...</p>
                </div>
              ) : (
                <div 
                  style={{ backgroundColor: '#FFF', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                  dangerouslySetInnerHTML={{ __html: modalContentHtml }} 
                />
              )}
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}
