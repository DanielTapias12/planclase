import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Loader2 } from 'lucide-react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export default function BibliotecaPage() {
  const navigate = useNavigate();
  const { loadPlan } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('Todos los grados');
  const [previewPlan, setPreviewPlan] = useState(null);

  const gradosOptions = [
    'Todos los grados', '1ro', '2do', '3ro', '4to', 
    '5to', '6to', '7mo', '8vo', '9no', '10mo', '11mo'
  ];

  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecursos = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "planes"), where("estado", "==", "Biblioteca"));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setRecursos(data);
      } catch (e) {
        console.error("Error fetching library", e);
      }
      setLoading(false);
    };
    fetchRecursos();
  }, []);

  const handleClonar = (rec) => {
    loadPlan(rec.metadata, rec.markdown);
    navigate('/editor');
  };

  const filteredRecursos = recursos.filter(rec => {
    const titulo = rec.tema || rec.metadata?.tema || '';
    const autor = rec.metadata?.autor || 'Docente';
    const grado = rec.grado || rec.metadata?.grado || '';
    
    const matchesSearch = titulo.toLowerCase().includes(searchTerm.toLowerCase()) || autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = selectedGrade === 'Todos los grados' || grado === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="planificador-view">
      <div className="planificador-header">
        <h2>Biblioteca de Planes</h2>
        <p>Explora y utiliza planes de clase compartidos por otros docentes.</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
        <input 
          type="text" 
          placeholder="Buscar por tema o autor..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        />
        <select 
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          style={{ width: '200px', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
        >
          {gradosOptions.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px', color: 'var(--text-secondary)' }}>
          <Loader2 size={24} className="spin" /> Cargando biblioteca comunitaria...
        </div>
      ) : (
        <div className="grid-list">
          {filteredRecursos.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No se encontraron recursos en la biblioteca.</p>}
          {filteredRecursos.map(rec => (
            <div key={rec.id} className="example-card" onClick={() => handleClonar(rec)} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <span className="tag" style={{ marginBottom: '12px', display: 'inline-block', alignSelf: 'flex-start', backgroundColor: '#e0f2fe', color: '#0369a1' }}>Plan Compartido</span>
              <h3 style={{ marginBottom: '8px' }}>{rec.tema || rec.metadata?.tema || 'Plan de Clase'}</h3>
              <p style={{ fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px' }}>Por: {rec.metadata?.autor || 'Docente'}</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', flex: 1 }}>Grado sugerido: {rec.grado || rec.metadata?.grado}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button 
                className="btn-outline" 
                style={{ flex: 1, padding: '6px 16px', fontSize: '13px' }}
                onClick={(e) => { e.stopPropagation(); setPreviewPlan(rec); }}
              >
                Ver
              </button>
              <button 
                className="btn" 
                style={{ flex: 1, padding: '6px 16px', fontSize: '13px' }}
                onClick={(e) => { e.stopPropagation(); handleClonar(rec); }}
              >
                Usar
              </button>
            </div>
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rec.descargas} descargas</span>
            </div>
          </div>
        ))}
        {filteredRecursos.length === 0 && (
          <p style={{ color: 'var(--text-secondary)' }}>No se encontraron planes que coincidan con la búsqueda.</p>
        )}
      </div>
      )}

      {previewPlan && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', width: '90%', maxWidth: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', color: '#0F172A', margin: 0 }}>Vista General: {previewPlan.tema || previewPlan.metadata?.tema}</h3>
              <button onClick={() => setPreviewPlan(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '24px', color: '#64748B' }}>&times;</button>
            </div>
            <div style={{ padding: '32px', overflowY: 'auto', flex: 1 }} className="markdown-content">
              <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: 'var(--bg-sage-soft)', borderRadius: '8px' }}>
                <p><strong>Autor:</strong> {previewPlan.metadata?.autor || 'Docente'}</p>
                <p><strong>Materia:</strong> {previewPlan.metadata?.materia || previewPlan.materia}</p>
                <p><strong>Grado:</strong> {previewPlan.metadata?.grado || previewPlan.grado}</p>
              </div>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {previewPlan.markdown}
              </ReactMarkdown>
            </div>
            <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button className="btn-outline" onClick={() => setPreviewPlan(null)}>Cerrar</button>
              <button className="btn" onClick={() => handleClonar(previewPlan)}>Usar este plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
