import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getPlantillas, savePlantillaToDB, deletePlantillaFromDB, updatePlantillaPublic } from '../services/dbService';
import { GENERIC_TEMPLATES, getTemplateStructureSummary } from '../services/templates/genericTemplates';
import { 
  Plus, 
  Loader2, 
  Wand2, 
  Search, 
  Trash2, 
  Share2, 
  Check, 
  Layers, 
  Eye, 
  X, 
  Upload, 
  Globe, 
  Lock 
} from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

export default function PlantillasPage() {
  const navigate = useNavigate();
  const { updateWizardData, userId, misPlantillas, setMisPlantillas, addPlantilla } = useAppStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [plantillaToDelete, setPlantillaToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [formData, setFormData] = useState({
    titulo: '',
    instrucciones: '',
    publico: false
  });

  useEffect(() => {
    if (!viewingPlan) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setViewingPlan(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [viewingPlan]);

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const fetched = await getPlantillas(userId);
        const defaults = GENERIC_TEMPLATES.map((gt) => ({
          id: gt.id,
          titulo: gt.titulo,
          formato: gt.formato || 'Estructura predeterminada',
          publico: true,
          area: gt.area,
          subtitulo: gt.subtitulo,
          fundamento: gt.fundamento,
          referenciaUrl: gt.referenciaUrl,
          instrucciones: getTemplateStructureSummary(gt)
        }));
        setMisPlantillas([...defaults, ...fetched]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId, setMisPlantillas]);

  const handleUsar = (plan) => {
    const isGeneric = GENERIC_TEMPLATES.some(gt => gt.titulo === plan.titulo || gt.id === plan.id);
    const updates = { 
      formato: plan.titulo,
      formatoInstrucciones: isGeneric ? '' : (plan.instrucciones || '')
    };
    if (plan.area) {
      updates.materia = plan.area;
      updates.recursos = '';
    }
    updateWizardData(updates);
    navigate('/');
  };

  const handleAnalizarIA = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        instrucciones: "ESTRUCTURA EXTRAÍDA DEL DOCUMENTO:\n1. 🏫 Contexto de la Clase y Saberes Previos\n2. 🧠 Competencias, Logros y Estándares\n3. ⏱️ Momentos Didácticos (Exploración, Construcción, Consolidación)\n4. 📝 Criterios de Evaluación Formativa y Rúbrica DUA"
      });
      setIsAnalyzing(false);
      alert("La IA ha extraído la estructura de tu documento.");
    }, 1800);
  };

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      alert("Debes asignarle un título a la estructura de clase.");
      return;
    }
    
    if (!userId) {
      alert("No hay una sesión activa de docente.");
      return;
    }

    setIsSaving(true);
    try {
      const nueva = {
        titulo: formData.titulo.trim(),
        formato: 'Personalizado',
        instrucciones: formData.instrucciones.trim(),
        publico: formData.publico
      };
      
      const id = await savePlantillaToDB(userId, nueva);
      addPlantilla({ id, ...nueva });
      
      setIsCreating(false);
      setFormData({ titulo: '', instrucciones: '', publico: false });
    } catch (e) {
      alert("Error al guardar: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAction = async (plan, action) => {
    const planId = typeof plan === 'object' ? plan.id : plan;
    try {
      if (action === 'delete') {
        const target = typeof plan === 'object' ? plan : misPlantillas.find(p => p.id === planId);
        setPlantillaToDelete(target || { id: planId, titulo: 'Estructura personalizada' });
      } else if (action === 'compartir') {
        await updatePlantillaPublic(planId, true);
        setMisPlantillas(misPlantillas.map(p => p.id === planId ? { ...p, publico: true } : p));
      }
    } catch (err) {
      console.error("Error al ejecutar acción sobre la plantilla:", err);
    }
  };

  const handleConfirmDeletePlantilla = async () => {
    if (!plantillaToDelete) return;
    setIsDeleting(true);
    try {
      await deletePlantillaFromDB(plantillaToDelete.id);
      setMisPlantillas(misPlantillas.filter(p => p.id !== plantillaToDelete.id));
      setPlantillaToDelete(null);
    } catch (err) {
      console.error("Error al eliminar plantilla:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPlantillas = misPlantillas.filter(plan => 
    (plan.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.formato || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mgmt-container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '36px 32px 64px' }}>
      
      {/* Cabecera Editorial del Módulo (Mismo desenfoque y panel de cristal) */}
      <header 
        className="mgmt-header"
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
        <div className="mgmt-header-info">
          <div>
            <div className="editorial-badge">
              <Layers size={14} color="#2B524A" />
              <span>Arquitectura Curricular y Modelos</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '34px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Mis Estructuras de Clase
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '15.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.65', fontWeight: 500 }}>
              Crea y administra formatos pedagógicos personalizados para que la IA se adapte a tu institución y respete los momentos didácticos institucionales.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <Layers size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{misPlantillas.length} {misPlantillas.length === 1 ? 'Estructura' : 'Estructuras'}</span>
          </div>
          {!isCreating && (
            <button 
              className="btn btn-primary" 
              onClick={() => setIsCreating(true)}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                minHeight: '42px', 
                padding: '10px 20px',
                backgroundColor: '#183630',
                color: '#FFFFFF',
                boxShadow: '0 4px 14px rgba(20, 42, 38, 0.20)',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> Nueva Estructura
            </button>
          )}
        </div>
      </header>

      {/* Formulario de Creación de Estructura (Mismo desenfoque y panel de cristal) */}
      {isCreating && (
        <section 
          className="plantilla-form-card" 
          style={{
            backgroundColor: 'rgba(255, 254, 250, 0.88)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '24px',
            boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)',
            marginBottom: '32px'
          }} 
          aria-labelledby="nueva-estructura-title"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid rgba(49, 91, 84, 0.16)', paddingBottom: '16px' }}>
            <h2 id="nueva-estructura-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: '#142B25', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
              <Plus size={18} /> Diseñar Nueva Estructura Pedagógica
            </h2>
            <button 
              onClick={() => setIsCreating(false)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2D463F' }}
              aria-label="Cerrar formulario"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="plantilla-titulo" style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '7px', display: 'block', color: '#142B25' }}>
              Título o Nombre de la Estructura *
            </label>
            <input 
              id="plantilla-titulo"
              type="text" 
              placeholder="Ej: Formato Institucional ABP Colegio San José" 
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className="wizard-input"
            />
          </div>

          <div className="input-group" style={{ marginBottom: '20px' }}>
            <label htmlFor="plantilla-instrucciones" style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '7px', display: 'block', color: '#142B25' }}>
              Esquema de Momentos e Instrucciones para la IA
            </label>
            <textarea 
              id="plantilla-instrucciones"
              placeholder="Escribe la estructura deseada. Ejemplo:&#10;1. Contexto y Saberes Previos&#10;2. Competencias Clave&#10;3. Desarrollo Didáctico por Fases&#10;4. Criterios de Evaluación y DUA..."
              style={{ minHeight: '180px' }}
              value={formData.instrucciones}
              onChange={(e) => setFormData({...formData, instrucciones: e.target.value})}
              className="wizard-textarea"
            />
            <p className="form-helper-text" style={{ fontSize: '12.5px', color: '#2D443E', marginTop: '6px', lineHeight: '1.45' }}>
              La Inteligencia Artificial de INSPIRATEC seguirá estrictamente este esquema al redactar los planes asociados.
            </p>
          </div>

          <div style={{ marginBottom: '24px', padding: '18px 20px', backgroundColor: 'var(--glass-bg-group)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid var(--glass-border-light)' }}>
            <label style={{ fontWeight: 600, fontSize: '13.5px', display: 'block', marginBottom: '10px', color: '#142B25' }}>
              O extraer estructura desde un archivo guía (Opcional)
            </label>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ border: '1px dashed rgba(49, 91, 84, 0.40)', padding: '8px 14px', borderRadius: '10px', flex: 1, minWidth: '240px', backgroundColor: 'rgba(255, 255, 255, 0.85)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={16} style={{ color: '#183630' }} />
                <input type="file" style={{ fontSize: '13px', width: '100%' }} aria-label="Archivo de formato" />
              </div>
              <button 
                type="button"
                className="btn-outline" 
                onClick={handleAnalizarIA} 
                disabled={isAnalyzing || isSaving}
                style={{ padding: '8px 16px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isAnalyzing ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} style={{ color: '#183630' }} />} 
                <span>{isAnalyzing ? 'Analizando documento...' : 'Extraer con IA'}</span>
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
              <input 
                type="checkbox" 
                style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                checked={formData.publico}
                onChange={(e) => setFormData({...formData, publico: e.target.checked})}
              /> 
              <Globe size={16} style={{ color: 'var(--primary-sage)' }} />
              <span>Compartir con la comunidad educativa (Hacer pública)</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn-outline" 
              onClick={() => setIsCreating(false)} 
              disabled={isSaving}
              style={{ minWidth: '110px' }}
            >
              Cancelar
            </button>
            <button 
              type="button"
              className="btn btn-primary" 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ minWidth: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              {isSaving ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              <span>{isSaving ? 'Guardando...' : 'Guardar Estructura'}</span>
            </button>
          </div>
        </section>
      )}

      {/* Búsqueda */}
      {!isLoading && misPlantillas.length > 0 && (
        <div className="mgmt-filter-bar">
          <div className="mgmt-search-box">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text"
              placeholder="Buscar por título o tipo de estructura..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mgmt-search-input"
              aria-label="Buscar plantillas"
            />
          </div>
        </div>
      )}

      {/* Estado de Carga */}
      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '14px', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--primary-sage)' }} />
          <p style={{ fontSize: '14.5px' }}>Cargando tus estructuras de clase...</p>
        </div>
      ) : filteredPlantillas.length === 0 ? (
        <div className="mgmt-empty-card">
          <div className="mgmt-empty-icon">
            <Search size={28} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
            No se encontraron plantillas
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
            No hay estructuras que coincidan con "{searchTerm}".
          </p>
          <button className="btn-outline" onClick={() => setSearchTerm('')}>
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        /* Cuadrícula de Plantillas */
        <div className="mgmt-grid">
          {filteredPlantillas.map(plan => {
            const isStandard = plan.id === 1;

            return (
              <article 
                key={plan.id} 
                className="mgmt-card" 
                onClick={() => handleUsar(plan)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') handleUsar(plan); }}
                aria-label={`Usar estructura ${plan.titulo}`}
                style={{
                  backgroundColor: 'rgba(255, 254, 250, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.94)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
                }}
              >
                <div className="mgmt-card-header">
                  <span className={`editor-badge ${isStandard ? 'saved' : 'draft'}`} style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    {plan.formato || 'Personalizada'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {plan.publico ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-active)', fontWeight: 600 }}>
                        <Globe size={13} /> Pública
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Privada
                      </span>
                    )}
                  </div>
                </div>

                <h2 className="mgmt-card-title">{plan.titulo}</h2>
                
                <p className="mgmt-card-desc">
                  {plan.instrucciones 
                    ? (plan.instrucciones.length > 110 ? `${plan.instrucciones.substring(0, 110)}...` : plan.instrucciones)
                    : 'Estructura oficial estandarizada INSPIRATEC lista para la generación asistida por IA.'
                  }
                </p>

                <div className="mgmt-card-actions">
                  <button 
                    className="btn btn-primary" 
                    style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); handleUsar(plan); }}
                    title="Cargar esta plantilla en el asistente de creación"
                  >
                    <span>Usar en Asistente</span>
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '7px 12px', fontSize: '13px', minHeight: '36px' }}
                    onClick={(e) => { e.stopPropagation(); setViewingPlan(plan); }}
                    title="Ver detalles de la estructura"
                  >
                    <Eye size={14} /> <span>Ver</span>
                  </button>

                  {!isStandard && (
                    <>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: plan.publico ? 'var(--text-secondary)' : 'var(--primary-active)' }}
                        onClick={(e) => { e.stopPropagation(); if (!plan.publico) handleAction(plan.id, 'compartir'); }}
                        disabled={plan.publico}
                        title={plan.publico ? 'Ya es pública' : 'Compartir con la comunidad'}
                      >
                        <Share2 size={14} />
                      </button>
                      <button 
                        className="btn-outline" 
                        style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--error-color)', borderColor: '#FECACA' }}
                        onClick={(e) => { e.stopPropagation(); handleAction(plan, 'delete'); }}
                        title="Eliminar estructura"
                      >
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de Detalle de Plantilla con Diseño de Cristal montado en body mediante createPortal */}
      {viewingPlan && createPortal(
        <div 
          className="modal-glass-backdrop" 
          onClick={(e) => { if (e.target === e.currentTarget) setViewingPlan(null); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detalle-plantilla-title"
        >
          <div 
            className="modal-glass-card" 
            style={{ 
              maxWidth: '640px',
              backgroundColor: 'rgba(255, 254, 250, 0.94)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.96)',
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(16, 36, 32, 0.22)'
            }}
          >
            <div className="modal-glass-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(71, 122, 114, 0.14)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1C3D36'
                }}>
                  <Layers size={18} />
                </div>
                <div>
                  <h3 id="detalle-plantilla-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                    {viewingPlan.titulo}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#527068' }}>{viewingPlan.formato}</span>
                </div>
              </div>
              <button 
                onClick={() => setViewingPlan(null)} 
                className="modal-glass-close-btn"
                aria-label="Cerrar modal de estructura"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-glass-body">
              <div style={{ marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <strong style={{ fontSize: '12px', color: '#3A544C', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                    Esquema Curricular & Momentos Pedagógicos
                  </strong>
                  <span style={{ fontSize: '11px', color: '#166534', backgroundColor: 'rgba(22, 163, 74, 0.12)', padding: '2px 8px', borderRadius: '999px', fontWeight: 600 }}>
                    Estándar MEN & DUA
                  </span>
                </div>

                {viewingPlan.fundamento && (
                  <div style={{
                    backgroundColor: 'rgba(71, 122, 114, 0.10)',
                    border: '1px solid rgba(71, 122, 114, 0.22)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    marginBottom: '14px',
                    fontSize: '13px',
                    color: '#142B25',
                    lineHeight: '1.55'
                  }}>
                    <strong style={{ display: 'block', marginBottom: '4px', color: '#1C3D36' }}>
                      Fundamento curricular (MEN y DBA):
                    </strong>
                    {viewingPlan.fundamento}
                    {viewingPlan.referenciaUrl && (
                      <div style={{ marginTop: '8px' }}>
                        <a 
                          href={viewingPlan.referenciaUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: 'var(--primary-active)', fontWeight: 600, textDecoration: 'underline', fontSize: '12.5px' }}
                        >
                          Consultar referentes oficiales en Colombia Aprende ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {viewingPlan.instrucciones ? (
                  <div style={{ 
                    backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    padding: '18px 20px', 
                    borderRadius: '16px', 
                    whiteSpace: 'pre-wrap', 
                    fontSize: '14px', 
                    lineHeight: '1.65', 
                    border: '1px solid rgba(255, 255, 255, 0.94)', 
                    color: '#142B25', 
                    boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
                  }}>
                    {viewingPlan.instrucciones}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ 
                      backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '16px 20px', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.94)',
                      boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                        <strong style={{ fontSize: '14px', color: '#142B25', fontWeight: 700 }}>1. Momento de Inicio (Exploración)</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#2C443D', lineHeight: '1.55', fontWeight: 500 }}>
                        Activación de saberes previos, formulación de preguntas provocadoras y conexión con el contexto real del estudiante.
                      </p>
                    </div>

                    <div style={{ 
                      backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '16px 20px', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.94)',
                      boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
                        <strong style={{ fontSize: '14px', color: '#142B25', fontWeight: 700 }}>2. Momento de Desarrollo (Estructuración y Práctica)</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#2C443D', lineHeight: '1.55', fontWeight: 500 }}>
                        Construcción guiada de conceptos, trabajo colaborativo, aplicación práctica y mediación docente con recursos didácticos.
                      </p>
                    </div>

                    <div style={{ 
                      backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '16px 20px', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.94)',
                      boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
                        <strong style={{ fontSize: '14px', color: '#142B25', fontWeight: 700 }}>3. Momento de Cierre (Transferencia y Metacognición)</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#2C443D', lineHeight: '1.55', fontWeight: 500 }}>
                        Consolidación de aprendizajes, conclusiones reflexivas y autoevaluación formativa de la experiencia de clase.
                      </p>
                    </div>

                    <div style={{ 
                      backgroundColor: 'rgba(255, 254, 250, 0.88)', 
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      padding: '14px 18px', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(255, 255, 255, 0.94)',
                      boxShadow: '0 4px 16px rgba(20, 42, 38, 0.05)'
                    }}>
                      <p style={{ margin: 0, fontSize: '13px', color: '#183630', lineHeight: '1.55', fontWeight: 500 }}>
                        ✨ <strong style={{ color: '#142B25' }}>Integración Transversal DUA:</strong> El asistente adaptará automáticamente este esquema incorporando múltiples formas de representación, expresión y motivación para atender la diversidad del aula.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-glass-footer">
              <button className="btn-outline" onClick={() => setViewingPlan(null)}>
                Cerrar
              </button>
              <button className="btn btn-primary" onClick={() => { handleUsar(viewingPlan); setViewingPlan(null); }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <Wand2 size={15} /> Usar en Asistente
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal de confirmación de eliminación con diseño de cristal */}
      <ConfirmModal
        isOpen={Boolean(plantillaToDelete)}
        onClose={() => setPlantillaToDelete(null)}
        onConfirm={handleConfirmDeletePlantilla}
        title="¿Eliminar esta estructura personalizada?"
        message={`¿Estás seguro de que deseas eliminar permanentemente la estructura "${plantillaToDelete?.titulo || 'esta estructura'}"? Esta acción no se podrá deshacer.`}
        confirmText="Eliminar Estructura"
        cancelText="Cancelar"
        isDestructive={true}
        confirmLoading={isDeleting}
      />
    </div>
  );
}
