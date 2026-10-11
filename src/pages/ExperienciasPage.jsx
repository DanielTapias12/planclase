import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Loader2, 
  Globe, 
  Lock, 
  Trash2, 
  Edit3, 
  Search, 
  Heart, 
  Calendar, 
  GraduationCap, 
  BookOpen,
  FileCheck
} from 'lucide-react';
import { getMisPlanes, updatePlanStatus, deletePlanFromDB } from '../services/dbService';
import { useAppStore } from '../store/useAppStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

export default function ExperienciasPage() {
  const [activeTab, setActiveTab] = useState('Mis Experiencias');
  const [experiencias, setExperiencias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expToDelete, setExpToDelete] = useState(null);
  const [isDeletingExp, setIsDeletingExp] = useState(false);
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
      } catch (err) {
        console.error("Error al cargar experiencias:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiencias();
  }, [activeTab, userId]);

  const handleAction = async (plan, action) => {
    const planId = typeof plan === 'object' ? plan.id : plan;
    try {
      if (action === 'delete') {
        const target = typeof plan === 'object' ? plan : experiencias.find(p => p.id === planId);
        setExpToDelete(target || { id: planId, tema: 'Experiencia' });
      } else if (action === 'togglePrivacy') {
        const targetPlan = experiencias.find(p => p.id === planId);
        const nuevoEstado = targetPlan.estado === 'Biblioteca' ? 'Sistematizado' : 'Biblioteca';
        await updatePlanStatus(planId, { estado: nuevoEstado });
        setExperiencias(experiencias.map(p => p.id === planId ? { ...p, estado: nuevoEstado } : p));
      } else if (action === 'edit' || action === 'view') {
        const targetPlan = experiencias.find(p => p.id === planId);
        loadPlan(targetPlan, targetPlan.markdown, targetPlan.id);
        navigate('/editor');
      }
    } catch (err) {
      console.error("Error al ejecutar acción:", err);
    }
  };

  const handleConfirmDeleteExp = async () => {
    if (!expToDelete) return;
    setIsDeletingExp(true);
    try {
      await deletePlanFromDB(expToDelete.id);
      setExperiencias(experiencias.filter(p => p.id !== expToDelete.id));
      setExpToDelete(null);
    } catch (err) {
      console.error("Error al eliminar experiencia:", err);
    } finally {
      setIsDeletingExp(false);
    }
  };

  const filteredExperiencias = experiencias.filter(exp => {
    const titulo = exp.tema || '';
    const autor = exp.metadata?.autor || '';
    const materia = exp.materia || '';
    const term = searchTerm.toLowerCase();
    return titulo.toLowerCase().includes(term) || autor.toLowerCase().includes(term) || materia.toLowerCase().includes(term);
  });

  return (
    <div className="mgmt-container">
      
      {/* Cabecera Editorial del Módulo */}
      <header className="mgmt-header">
        <div className="mgmt-header-info">
          <div>
            <div className="editorial-badge">
              <Sparkles size={14} color="#2B524A" />
              <span>Sistematización de Práctica Docente</span>
            </div>
            <h1 className="mgmt-title">Experiencias Pedagógicas</h1>
            <p className="mgmt-subtitle">
              Sistematiza el impacto didáctico de tus clases en el aula y descubre prácticas transformadoras compartidas por otros educadores de la comunidad.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <FileCheck size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{experiencias.length} {experiencias.length === 1 ? 'Experiencia registrada' : 'Experiencias registradas'}</span>
          </div>
        </div>
      </header>

      {/* Selector Editorial de Pestañas */}
      <div style={{ 
        display: 'inline-flex', 
        backgroundColor: 'rgba(255, 254, 250, 0.86)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.95)',
        borderRadius: '14px',
        padding: '5px',
        marginBottom: '24px',
        gap: '6px',
        boxShadow: '0 6px 20px rgba(16, 36, 32, 0.08)',
        flexWrap: 'wrap'
      }}>
        <button 
          onClick={() => { setActiveTab('Mis Experiencias'); setSearchTerm(''); }}
          style={{ 
            padding: '9px 18px', 
            borderRadius: '10px',
            border: 'none', 
            backgroundColor: activeTab === 'Mis Experiencias' ? '#183630' : 'transparent',
            color: activeTab === 'Mis Experiencias' ? '#FFFFFF' : '#243630',
            fontWeight: activeTab === 'Mis Experiencias' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.18s ease',
            boxShadow: activeTab === 'Mis Experiencias' ? '0 4px 12px rgba(20, 42, 38, 0.18)' : 'none'
          }}
        >
          <Sparkles size={15} /> Mis Experiencias Sistematizadas
        </button>
        <button 
          onClick={() => { setActiveTab('Comunidad'); setSearchTerm(''); }}
          style={{ 
            padding: '9px 18px', 
            borderRadius: '10px',
            border: 'none', 
            backgroundColor: activeTab === 'Comunidad' ? '#183630' : 'transparent',
            color: activeTab === 'Comunidad' ? '#FFFFFF' : '#243630',
            fontWeight: activeTab === 'Comunidad' ? 700 : 500,
            cursor: 'pointer',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.18s ease',
            boxShadow: activeTab === 'Comunidad' ? '0 4px 12px rgba(20, 42, 38, 0.18)' : 'none'
          }}
        >
          <Globe size={15} /> Experiencias de la Comunidad
        </button>
      </div>

      {/* Buscador */}
      {!loading && experiencias.length > 0 && (
        <div className="mgmt-filter-bar">
          <div className="mgmt-search-box">
            <Search size={16} style={{ color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder="Buscar por tema, materia o autor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mgmt-search-input"
              aria-label="Buscar experiencias"
            />
          </div>
        </div>
      )}

      {/* Estado de Carga */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '14px', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--primary-sage)' }} />
          <p style={{ fontSize: '14.5px' }}>Cargando experiencias docentes...</p>
        </div>
      ) : filteredExperiencias.length === 0 ? (
        /* Estado Vacío */
        <div className="mgmt-empty-card">
          <div className="mgmt-empty-icon">
            <Sparkles size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '8px' }}>
            No se encontraron experiencias
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '22px' }}>
            {activeTab === 'Mis Experiencias'
              ? 'Aún no has sistematizado planes de clase. Ve a "Mis Planes" y haz clic en Sistematizar en cualquiera de tus secuencias.'
              : 'No hay experiencias públicas de la comunidad que coincidan con la búsqueda.'}
          </p>
          {activeTab === 'Mis Experiencias' && (
            <button className="btn btn-primary" onClick={() => navigate('/mis-planes')}>
              Ir a Mis Planes
            </button>
          )}
        </div>
      ) : (
        /* Cuadrícula de Experiencias */
        <div className="mgmt-grid">
          {filteredExperiencias.map(exp => {
            const isPublic = exp.estado === 'Biblioteca';
            const isMine = exp.userId === userId;
            const autor = isMine ? 'Tú (Docente)' : (exp.metadata?.autor || 'Docente');
            const fecha = exp.createdAt?.toDate ? exp.createdAt.toDate().toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Reciente';

            return (
              <article 
                key={exp.id} 
                className="mgmt-card" 
                onClick={() => handleAction(exp.id, 'view')}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => { if (e.key === 'Enter') handleAction(exp.id, 'view'); }}
                aria-label={`Ver experiencia ${exp.tema || 'Sin título'}`}
              >
                <div className="mgmt-card-header">
                  <span className={`editor-badge ${isPublic ? 'saved' : 'draft'}`} style={{ fontSize: '11.5px', padding: '2px 8px' }}>
                    {isPublic ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Globe size={12} /> Pública en Comunidad
                      </span>
                    ) : (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Lock size={12} /> Sistematización Privada
                      </span>
                    )}
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <Calendar size={13} />
                    <span>{fecha}</span>
                  </div>
                </div>

                <h2 className="mgmt-card-title">{exp.tema || 'Experiencia sin título'}</h2>
                
                <p style={{ fontSize: '13px', color: 'var(--text-main)', margin: '0 0 14px 0', fontWeight: 600 }}>
                  Por: {autor}
                </p>

                <div className="mgmt-card-meta">
                  {exp.materia && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <BookOpen size={13} style={{ color: 'var(--primary-sage)' }} /> {exp.materia}
                    </span>
                  )}
                  {exp.grado && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <GraduationCap size={13} style={{ color: 'var(--primary-sage)' }} /> {exp.grado}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-sage)', fontWeight: 600 }}>
                    <Heart size={13} /> Destacada
                  </span>
                </div>

                {/* Acciones para Mis Experiencias */}
                {activeTab === 'Mis Experiencias' && (
                  <div className="mgmt-card-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '7px 12px', fontSize: '13px', minHeight: '36px' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'edit'); }}
                      title="Editar esta experiencia en el editor"
                    >
                      <Edit3 size={14} /> <span>Editar</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--primary-active)' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'togglePrivacy'); }}
                      title={isPublic ? 'Hacer privada' : 'Hacer pública'}
                    >
                      {isPublic ? <Lock size={14} /> : <Globe size={14} />}
                      <span className="hide-mobile">{isPublic ? 'Hacer Privada' : 'Publicar'}</span>
                    </button>
                    <button 
                      className="btn-outline" 
                      style={{ padding: '7px 10px', fontSize: '13px', minHeight: '36px', color: 'var(--error-color)', borderColor: '#FECACA' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp, 'delete'); }}
                      title="Eliminar experiencia"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                
                {/* Acciones para Comunidad */}
                {activeTab === 'Comunidad' && (
                  <div className="mgmt-card-actions">
                    <button 
                      className="btn btn-primary" 
                      style={{ width: '100%', padding: '7px 14px', fontSize: '13px', minHeight: '36px' }} 
                      onClick={(e) => { e.stopPropagation(); handleAction(exp.id, 'view'); }}
                    >
                      <span>Ver Experiencia Completa</span>
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Modal de confirmación de eliminación con diseño de cristal */}
      <ConfirmModal
        isOpen={Boolean(expToDelete)}
        onClose={() => setExpToDelete(null)}
        onConfirm={handleConfirmDeleteExp}
        title="¿Eliminar esta experiencia pedagógica?"
        message={`¿Estás seguro de que deseas eliminar permanentemente "${expToDelete?.tema || expToDelete?.metadata?.tema || 'esta experiencia'}"?`}
        confirmText="Eliminar Experiencia"
        cancelText="Conservar"
        isDestructive={true}
        confirmLoading={isDeletingExp}
      />
    </div>
  );
}
