import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getMisPlanes, deletePlanFromDB, updatePlanStatus } from '../services/dbService';
import { Loader2 } from 'lucide-react';

export default function MisPlanesPage() {
  const navigate = useNavigate();
  const { loadPlan, userId } = useAppStore();
  
  const [planes, setPlanes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    
    const fetchPlanes = async () => {
      try {
        const fetchedPlanes = await getMisPlanes(userId);
        setPlanes(fetchedPlanes);
      } catch (error) {
        console.error("Error al cargar planes", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlanes();
  }, [userId]);

  const handleEdit = (plan) => {
    loadPlan(plan, plan.markdown, plan.id);
    navigate('/editor');
  };

  const handleAction = async (planId, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm("¿Seguro que deseas eliminar este plan?")) return;
        await deletePlanFromDB(planId);
        setPlanes(planes.filter(p => p.id !== planId));
      } else if (action === 'sistematizar') {
        await updatePlanStatus(planId, { estado: 'Sistematizado' });
        setPlanes(planes.map(p => p.id === planId ? { ...p, estado: 'Sistematizado' } : p));
        alert("El plan ahora hace parte de tus Experiencias Sistematizadas.");
      } else if (action === 'compartir') {
        await updatePlanStatus(planId, { estado: 'Biblioteca' });
        setPlanes(planes.map(p => p.id === planId ? { ...p, estado: 'Biblioteca' } : p));
        alert("El plan ha sido enviado a la Biblioteca Comunitaria Pública.");
      }
    } catch (e) {
      alert("Hubo un error al procesar tu solicitud.");
    }
  };

  return (
    <div className="planificador-view">
      <div className="planificador-header">
        <h2>Mis Planes</h2>
        <p>Gestiona tus planes de clase reales sincronizados en la nube.</p>
      </div>
      
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px', color: 'var(--text-secondary)' }}>
          <Loader2 size={24} className="spin" /> Cargando tus planes desde Firebase...
        </div>
      ) : planes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#F8FAFC' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--text-secondary)', marginBottom: '8px' }}>Aún no tienes planes guardados</h3>
          <p style={{ color: 'var(--text-main)', marginBottom: '24px' }}>Crea tu primer plan usando el planificador con IA.</p>
          <button className="btn" onClick={() => navigate('/')}>Crear Nuevo Plan</button>
        </div>
      ) : (
        <div className="grid-list">
          {planes.map(plan => {
            // Firestore date formatting
            const fecha = plan.createdAt?.toDate ? plan.createdAt.toDate().toLocaleDateString() : 'Desconocida';
            
            return (
              <div key={plan.id} className="example-card" onClick={() => handleEdit(plan)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span className="tag" style={{ backgroundColor: plan.estado === 'Guardado' ? 'var(--bg-sage-soft)' : '#fef9c3', color: plan.estado === 'Guardado' ? 'var(--primary-sage)' : '#ca8a04' }}>
                    {plan.estado || 'Guardado'}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{fecha}</span>
                </div>
                <h3>{plan.tema || 'Plan sin título'}</h3>
                <p><strong>Grado:</strong> {plan.grado}</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <button 
                    className="btn" 
                    style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px' }}
                    onClick={(e) => { e.stopPropagation(); handleEdit(plan); }}
                  >
                    Ver
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px', color: 'var(--primary-active)' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'sistematizar'); }}
                  >
                    Sistematizar
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ flex: 1, padding: '6px 12px', minHeight: '32px', fontSize: '13px' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'compartir'); }}
                  >
                    Compartir
                  </button>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '6px 12px', minHeight: '32px', fontSize: '13px', color: 'var(--error-color)' }}
                    onClick={(e) => { e.stopPropagation(); handleAction(plan.id, 'delete'); }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
