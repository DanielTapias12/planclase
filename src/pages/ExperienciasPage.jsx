import { useState, useEffect } from 'react';
import { Archive, Loader2, CheckCircle2 } from 'lucide-react';
import { getMisPlanes, updatePlanStatus, deletePlanFromDB } from '../services/dbService';
import { useAppStore } from '../store/useAppStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function ExperienciasPage() {
  const [activeTab, setActiveTab] = useState('Mis Experiencias');
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const { userId, loadPlan } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExperiencias = async () => {
      setLoading(true);
      try {
        if (activeTab === 'Mis Experiencias') {
          if (!userId) return;
          const planes = await getMisPlanes(userId);
          setExperiencias(planes.filter(p => p.estado === 'Sistematizado' || p.estado === 'Biblioteca'));
        } else {
          // Traer todas las sistematizadas públicas de la comunidad
          const q = query(collection(db, "planes"), where("estado", "==", "Biblioteca"));
          const snapshot = await getDocs(q);
          const comunidad = [];
          snapshot.forEach(doc => comunidad.push({ id: doc.id, ...doc.data() }));
          setExperiencias(comunidad);
        }
      } catch(e) {
        console.error("Error", e);
      }
      setLoading(false);
    };
    fetchExperiencias();
  }, [activeTab, userId]);

  const handleAction = async (planId, action) => {
    try {
      if (action === 'delete') {
        if (!window.confirm("¿Seguro que deseas eliminar esta experiencia?")) return;
        await deletePlanFromDB(planId);
        setExperiencias(experiencias.filter(p => p.id !== planId));
      } else if (action === 'togglePrivacy') {
        const plan = experiencias.find(p => p.id === planId);
        const nuevoEstado = plan.estado === 'Biblioteca' ? 'Sistematizado' : 'Biblioteca';
        await updatePlanStatus(planId, { estado: nuevoEstado });
        setExperiencias(experiencias.map(p => p.id === planId ? { ...p, estado: nuevoEstado } : p));
        setToastMsg(`Privacidad actualizada: ahora es ${nuevoEstado === 'Biblioteca' ? 'Pública' : 'Privada'}`);
        setTimeout(() => setToastMsg(''), 3000);
      } else if (action === 'edit' || action === 'view') {
        const plan = experiencias.find(p => p.id === planId);
        loadPlan(plan, plan.markdown, plan.id);
        navigate('/editor');
      }
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="planificador-view">
      <div className="planificador-header">
        <h2>Experiencias Docentes</h2>
        <p>Consulta experiencias docentes documentadas y el impacto pedagógico de tus planes.</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('Mis Experiencias')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'Mis Experiencias' ? '2px solid var(--primary-active)' : '2px solid transparent',
            color: activeTab === 'Mis Experiencias' ? 'var(--primary-active)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'Mis Experiencias' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          Mis Experiencias
        </button>
        <button 
          onClick={() => setActiveTab('Comunidad')}
          style={{ 
            padding: '12px 24px', 
            background: 'none', 
            border: 'none', 
            borderBottom: activeTab === 'Comunidad' ? '2px solid var(--primary-active)' : '2px solid transparent',
            color: activeTab === 'Comunidad' ? 'var(--primary-active)' : 'var(--text-secondary)',
            fontWeight: activeTab === 'Comunidad' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          Comunidad
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px', color: 'var(--text-secondary)' }}>
          <Loader2 size={24} className="spin" /> Cargando experiencias...
        </div>
      ) : (
        <div className="grid-list">
          {experiencias.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No se encontraron experiencias.</p>}
          {experiencias.map(exp => (
            <div key={exp.id} className="example-card">
              <h3>{exp.tema || 'Experiencia sin título'}</h3>
              <p style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '12px' }}>Por: {exp.userId === userId ? 'Ti' : (exp.metadata?.autor || 'Docente')}</p>
              <p style={{ marginBottom: '16px', color: 'var(--text-secondary)' }}>Grado: {exp.grado} | Materia: {exp.materia}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="tag" style={{ backgroundColor: exp.estado === 'Biblioteca' ? '#dcfce7' : 'var(--bg-sage-soft)', color: exp.estado === 'Biblioteca' ? '#166534' : 'var(--primary-sage)' }}>
                  {exp.estado === 'Biblioteca' ? 'Pública' : 'Privada'}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--primary-sage)', fontWeight: 'bold' }}>❤️</span>
              </div>
            
              {activeTab === 'Mis Experiencias' && (
                <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', flexWrap: 'wrap' }}>
                  <button className="btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }} onClick={() => handleAction(exp.id, 'edit')}>Editar</button>
                  <button className="btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '13px', color: 'var(--primary-active)' }} onClick={() => handleAction(exp.id, 'togglePrivacy')}>
                    {exp.estado === 'Biblioteca' ? 'Hacer Privado' : 'Hacer Público'}
                  </button>
                  <button className="btn-outline" style={{ flex: 1, padding: '6px 12px', fontSize: '13px' }} onClick={() => alert('Para exportar a DOCX, presiona Editar y hazlo desde el Editor')}>DOCX</button>
                  <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '13px', color: 'var(--error-color)' }} onClick={() => handleAction(exp.id, 'delete')}>Eliminar</button>
                </div>
              )}
              
              {activeTab === 'Comunidad' && (
                 <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', textAlign: 'center' }}>
                   <button className="btn-outline" style={{ width: '100%' }} onClick={() => handleAction(exp.id, 'view')}>Ver Experiencia Completa</button>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
