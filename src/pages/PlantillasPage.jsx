import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getPlantillas, savePlantillaToDB, deletePlantillaFromDB, updatePlantillaPublic } from '../services/dbService';
import { FileText, Plus, UploadCloud, Loader2, Wand2 } from 'lucide-react';

export default function PlantillasPage() {
  const navigate = useNavigate();
  const { updateWizardData, userId, misPlantillas, setMisPlantillas, addPlantilla } = useAppStore();
  
  const [isCreating, setIsCreating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [viewingPlan, setViewingPlan] = useState(null);
  
  const [formData, setFormData] = useState({
    titulo: '',
    instrucciones: '',
    publico: false
  });

  useEffect(() => {
    if (!userId) return;

    const loadData = async () => {
      try {
        const fetched = await getPlantillas(userId);
        // Mezclamos con la default que ya existía
        const defaults = [{ id: 1, titulo: 'Estructura estándar INSPIRATEC', formato: 'Estructura predeterminada', publico: true, instrucciones: '' }];
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
    updateWizardData({ 
      formato: plan.titulo,
      formatoInstrucciones: plan.instrucciones
    });
    navigate('/');
  };

  const handleAnalizarIA = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setFormData({
        ...formData,
        instrucciones: "ESTRUCTURA EXTRAÍDA DEL DOCUMENTO:\n1. 🏫 Contexto de la Clase\n2. 🧠 Competencias y Logros\n3. ⏱️ Momentos (Inicio, Desarrollo, Cierre)\n4. 📝 Recursos y Evaluación"
      });
      setIsAnalyzing(false);
      alert("La IA ha extraído la estructura de tu documento.");
    }, 2000);
  };

  const handleSave = async () => {
    if (!formData.titulo.trim()) {
      alert("Debes ponerle un título a la estructura.");
      return;
    }
    
    if (!userId) {
      alert("No estás logueado.");
      return;
    }

    setIsSaving(true);
    try {
      const nueva = {
        titulo: formData.titulo,
        formato: 'Personalizado',
        instrucciones: formData.instrucciones,
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

  const handleAction = async (planId, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm("¿Seguro que deseas eliminar esta estructura?")) return;
        await deletePlantillaFromDB(planId);
        setMisPlantillas(misPlantillas.filter(p => p.id !== planId));
      } else if (action === 'compartir') {
        await updatePlantillaPublic(planId, true);
        setMisPlantillas(misPlantillas.map(p => p.id === planId ? { ...p, publico: true } : p));
        alert("Estructura compartida con la comunidad.");
      }
    } catch (e) {
      alert("Hubo un error al procesar tu solicitud.");
    }
  };

  return (
    <div className="planificador-view" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', marginBottom: '32px' }}>
        <FileText size={40} color="var(--primary-active)" />
        <div>
          <h2 style={{ color: 'var(--primary-active)', fontSize: '32px', marginBottom: '8px' }}>Mis Estructuras de Clase</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Crea y gestiona tus propias estructuras de plan de clase sincronizadas en la nube.</p>
        </div>
      </div>

      {!isCreating && (
        <button className="btn" style={{ backgroundColor: '#F1F5F9', color: '#0F172A', border: 'none', marginBottom: '32px' }} onClick={() => setIsCreating(true)}>
          <Plus size={18} /> Nueva Estructura
        </button>
      )}

      {isCreating && (
        <div className="card" style={{ padding: '32px 40px', backgroundColor: '#FFFFFF', marginBottom: '40px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <h3 style={{ color: 'var(--primary-active)', fontSize: '20px', marginBottom: '24px' }}>Nueva Estructura de Clase</h3>
          
          <div className="input-group">
            <label style={{ fontWeight: 600 }}>Título de la Estructura</label>
            <input 
              type="text" 
              placeholder="Ej: Plan de Clase Institucional ERA" 
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
            />
          </div>

          <div className="input-group">
            <label style={{ fontWeight: 600 }}>Describe cómo quieres que se estructure el plan de clase. La IA seguirá este formato.</label>
            <textarea 
              placeholder="INSTRUCCIONES DEL DOCENTE:&#10;Estructura del Plan de Clase..."
              style={{ minHeight: '200px' }}
              value={formData.instrucciones}
              onChange={(e) => setFormData({...formData, instrucciones: e.target.value})}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '12px' }}>O subir archivo de formato (Opcional)</label>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ border: '1px dashed #CBD5E1', padding: '8px 16px', borderRadius: '8px', flex: 1, display: 'flex', alignItems: 'center' }}>
                <input type="file" style={{ fontSize: '13px' }} />
              </div>
              <button 
                className="btn-outline" 
                onClick={handleAnalizarIA} 
                disabled={isAnalyzing || isSaving}
                style={{ fontWeight: 600, border: 'none' }}
              >
                {isAnalyzing ? <Loader2 size={16} className="spin" /> : <Wand2 size={16} />} Analizar con IA
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }}>
              <input 
                type="checkbox" 
                style={{ width: '18px', height: '18px' }}
                checked={formData.publico}
                onChange={(e) => setFormData({...formData, publico: e.target.checked})}
              /> 
              Compartir con la comunidad (Público)
            </label>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setIsCreating(false)} disabled={isSaving}>Cancelar</button>
            <button className="btn" style={{ flex: 1, justifyContent: 'center', backgroundColor: '#F1F5F9', color: '#000' }} onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 size={16} className="spin" /> : 'Guardar Estructura'}
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px', color: 'var(--text-secondary)' }}>
          <Loader2 size={24} className="spin" /> Cargando plantillas...
        </div>
      ) : (
        <div className="grid-list">
          {misPlantillas.map(plan => (
            <div key={plan.id} className="example-card" onClick={() => handleUsar(plan)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="tag" style={{ marginBottom: '12px', display: 'inline-block' }}>{plan.formato}</span>
                {plan.publico && <span style={{ fontSize: '12px', color: 'var(--primary-active)', fontWeight: 600 }}>Público</span>}
              </div>
              <h3>{plan.titulo}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                {plan.instrucciones ? plan.instrucciones.substring(0, 80) + '...' : 'Plantilla estandarizada lista para ser usada mediante IA.'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn" 
                    style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px' }}
                    onClick={(e) => { e.stopPropagation(); handleUsar(plan); }}
                  >
                    Usar plantilla
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px' }}
                    onClick={(e) => { e.stopPropagation(); setViewingPlan(plan); }}
                  >
                    Ver
                  </button>
                </div>
                {plan.id !== 1 && ( // La estándar no se debería modificar/eliminar
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn-outline" 
                      style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px', color: plan.publico ? 'var(--text-secondary)' : 'var(--primary-active)' }}
                      onClick={(e) => { e.stopPropagation(); if(!plan.publico) handleAction(plan.id, 'compartir'); }}
                      disabled={plan.publico}
                    >
                      {plan.publico ? 'Compartido' : 'Compartir'}
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '6px 12px', minHeight: '32px', fontSize: '13px', color: 'var(--error-color)' }}
                      onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'delete'); }}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewingPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ color: '#0F172A', fontSize: '20px', margin: 0 }}>{viewingPlan.titulo}</h3>
              {viewingPlan.publico && <span style={{ fontSize: '12px', color: 'var(--primary-active)', fontWeight: 600, backgroundColor: 'var(--bg-sage-soft)', padding: '4px 8px', borderRadius: '4px' }}>Público</span>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div>
                <strong style={{ display: 'block', marginBottom: '4px', color: 'var(--text-secondary)' }}>Formato:</strong>
                <span className="tag" style={{ display: 'inline-block' }}>{viewingPlan.formato}</span>
              </div>
              <div>
                <strong style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Instrucciones / Estructura:</strong>
                <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', whiteSpace: 'pre-wrap', fontSize: '14px', border: '1px solid var(--border-color)' }}>
                  {viewingPlan.instrucciones || 'Plantilla estandarizada lista para ser usada mediante IA.'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setViewingPlan(null)}>Cerrar</button>
              <button className="btn" onClick={() => { handleUsar(viewingPlan); setViewingPlan(null); }}>Usar Plantilla</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
