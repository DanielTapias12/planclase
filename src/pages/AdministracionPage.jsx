import React, { useState, useEffect } from 'react';
import { getAllUsers, getGlobalStats, getTickets, respondTicket } from '../services/dbService';
import { decryptSensitiveField, maskPhoneNumber } from '../utils/security';
import { ShieldCheck, Lock, Unlock, Users, BookOpen, Sparkles, Award } from 'lucide-react';

export default function AdministracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0 });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Analiticas');
  const [replyText, setReplyText] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [revealedPhones, setRevealedPhones] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const dbUsers = await getAllUsers();
      const dbStats = await getGlobalStats();
      const dbTickets = await getTickets();
      
      const usersWithStats = dbUsers.map(u => ({
        ...u,
        planesCount: dbStats.planesPorUsuario?.[u.id] || 0
      }));

      setUsuarios(usersWithStats);
      setStats(dbStats);
      setTickets(dbTickets);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleRespond = async (ticketId) => {
    if (replyText[ticketId]?.trim()) {
      await respondTicket(ticketId, replyText[ticketId]);
      setTickets(tickets.map(t => t.id === ticketId ? { ...t, estado: 'Resuelto', respuestaAdmin: replyText[ticketId] } : t));
      alert("Respuesta enviada al docente.");
    }
  };

  const togglePhoneReveal = (userId) => {
    setRevealedPhones(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel de administración...</div>;

  // Manejo preciso de flotantes (cálculo de porcentajes con toFixed(1))
  const totalDocentes = Math.max(usuarios.length, 1);
  const primariaCount = usuarios.filter(u => u.nivel === 'Primaria').length;
  const secundariaCount = usuarios.filter(u => u.nivel === 'Secundaria').length;
  const mediaCount = usuarios.filter(u => u.nivel === 'Media').length;

  const pctPrimaria = Number((primariaCount / totalDocentes) * 100).toFixed(1);
  const pctSecundaria = Number((secundariaCount / totalDocentes) * 100).toFixed(1);
  const pctMedia = Number((mediaCount / totalDocentes) * 100).toFixed(1);

  const promedioPlanesPorDocente = Number(stats.totalPlanes / totalDocentes).toFixed(1);

  return (
    <div className="planificador-view" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 60px 20px' }}>
      <div className="planificador-header" style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '32px', color: 'var(--primary-active)', marginBottom: '8px' }}>Panel de Administración y Control</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
          Métricas de impacto pedagógico, trazabilidad de datos docentes protegidos (Ley 1581 de 2012) y soporte.
        </p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('Analiticas')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'Analiticas' ? '2px solid var(--primary-active)' : '2px solid transparent', color: activeTab === 'Analiticas' ? 'var(--primary-active)' : 'var(--text-secondary)', fontWeight: activeTab === 'Analiticas' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '15px' }}
        >
          Analíticas y Directorio de Docentes
        </button>
        <button 
          onClick={() => setActiveTab('Tickets')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'Tickets' ? '2px solid var(--primary-active)' : '2px solid transparent', color: activeTab === 'Tickets' ? 'var(--primary-active)' : 'var(--text-secondary)', fontWeight: activeTab === 'Tickets' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '15px' }}
        >
          Tickets de Soporte {tickets.filter(t => t.estado === 'Pendiente').length > 0 && <span style={{ background: '#EF4444', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', marginLeft: '6px' }}>{tickets.filter(t => t.estado === 'Pendiente').length}</span>}
        </button>
      </div>

      {activeTab === 'Analiticas' && (
        <>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', fontSize: '18px' }}>Métricas Globales de Plataforma</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Docentes Registrados</span>
                <Users size={18} color="var(--primary-sage)" />
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)', margin: 0 }}>{stats.totalUsers}</p>
              <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>{totalDocentes} cuentas activas</small>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Planes Didácticos</span>
                <BookOpen size={18} color="var(--primary-sage)" />
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)', margin: 0 }}>{stats.totalPlanes}</p>
              <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Promedio: {promedioPlanesPorDocente} planes / docente</small>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Experiencias Compartidas</span>
                <Sparkles size={18} color="var(--primary-sage)" />
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)', margin: 0 }}>{stats.totalExperiencias}</p>
              <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>En biblioteca pública</small>
            </div>

            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 'bold' }}>Estudiantes Impactados</span>
                <Award size={18} color="var(--primary-sage)" />
              </div>
              <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-sage)', margin: 0 }}>{stats.estudiantesImpactados.toLocaleString()}</p>
              <small style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>Estimado 25 estudiantes por aula</small>
            </div>
          </div>

          {/* Distribución precisa por Nivel Educativo */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            <div className="card">
              <h3 style={{ fontSize: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                Distribución por Nivel Educativo (Cálculo Flotante Preciso)
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Primaria ({primariaCount} docentes)</span>
                  <strong style={{ color: 'var(--primary-active)' }}>{pctPrimaria}%</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Secundaria (6to-9no, {secundariaCount} docentes)</span>
                  <strong style={{ color: 'var(--primary-active)' }}>{pctSecundaria}%</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span>Media (10mo-11mo, {mediaCount} docentes)</span>
                  <strong style={{ color: 'var(--primary-active)' }}>{pctMedia}%</strong>
                </li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
                Top Áreas Curriculares Creadas
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Tecnología e Informática</span>
                  <strong>Pensamiento Computacional</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed #E2E8F0' }}>
                  <span>Matemáticas</span>
                  <strong>Modelación y Contexto Real</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span>Lenguaje e Inglés</span>
                  <strong>Comprensión y Role-Play</strong>
                </li>
              </ul>
            </div>
          </div>

          {/* Directorio de Usuarios con Protección de Datos */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: 'var(--text-main)', fontSize: '18px', margin: 0 }}>
              Directorio de Docentes y Datos Protegidos
            </h3>
            <span style={{ fontSize: '12px', color: '#166534', background: '#DCFCE7', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> Cifrado Habeas Data (Ley 1581)
            </span>
          </div>

          <div className="card" style={{ padding: '0', overflowX: 'auto', marginBottom: '40px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-sage-soft)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Docente</th>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Celular (Cifrado)</th>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Rol</th>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Institución</th>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Planes</th>
                  <th style={{ padding: '14px 16px', color: 'var(--primary-sage)', fontSize: '13px' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map(u => {
                  const plainPhone = decryptSensitiveField(u.celular);
                  const isRevealed = Boolean(revealedPhones[u.id]);
                  const displayPhone = plainPhone ? (isRevealed ? plainPhone : maskPhoneNumber(plainPhone)) : 'No registrado';

                  return (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#1E293B' }}>{u.nombre}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{displayPhone}</span>
                          {plainPhone && (
                            <button
                              type="button"
                              onClick={() => togglePhoneReveal(u.id)}
                              title={isRevealed ? "Ocultar teléfono" : "Descifrar teléfono para contacto"}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#64748B', display: 'flex', alignItems: 'center' }}
                            >
                              {isRevealed ? <Lock size={14} color="#315B54" /> : <Unlock size={14} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ background: u.rol === 'Admin' ? '#EDE9FE' : '#F1F5F9', color: u.rol === 'Admin' ? '#6D28D9' : '#475569', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                          {u.rol || 'Docente'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: '13px', color: '#334155' }}>
                        {u.institucion || 'N/A'}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ fontWeight: 'bold', color: 'var(--primary-active)' }}>
                          {u.planesCount !== undefined ? u.planesCount : 0}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button className="btn-outline" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => setSelectedUser(u)}>
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Detalle de Usuario */}
          {selectedUser && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '14px', width: '90%', maxWidth: '520px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '18px' }}>Detalle de Cuenta Docente</h3>
                  <span style={{ background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldCheck size={13} /> Token JWT Activo
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '14px' }}>
                  <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p>
                    <strong>Celular de Contacto:</strong>{' '}
                    <span style={{ fontFamily: 'monospace' }}>
                      {decryptSensitiveField(selectedUser.celular) || 'No registrado'}
                    </span>
                  </p>
                  <p><strong>Rol:</strong> {selectedUser.rol || 'Docente'}</p>
                  <p><strong>Institución:</strong> {selectedUser.institucion || 'N/A'}</p>
                  <p><strong>Nivel Pedagógico:</strong> {selectedUser.nivel || 'N/A'}</p>
                  <p><strong>Consentimiento Habeas Data:</strong> {selectedUser.termsAccepted ? 'Aceptado (Ley 1581 de 2012)' : 'Pre-existente'}</p>
                  <p><strong>Planes Creados en Plataforma:</strong> <span style={{ color: 'var(--primary-active)', fontWeight: 'bold' }}>{selectedUser.planesCount}</span></p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <button className="btn" onClick={() => setSelectedUser(null)} style={{ padding: '8px 20px' }}>Cerrar</button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'Tickets' && (
        <div className="grid-list">
          {tickets.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No hay tickets de soporte pendientes.</p>}
          {tickets.map(t => (
            <div key={t.id} className="example-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px' }}>{t.asunto}</h3>
                <span className="tag" style={{ backgroundColor: t.estado === 'Pendiente' ? '#FEF3C7' : '#D1FAE5', color: t.estado === 'Pendiente' ? '#92400E' : '#065F46' }}>
                  {t.estado}
                </span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>De: {t.nombre} ({t.email})</p>
              <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
                {t.descripcion}
              </div>
              
              {t.estado === 'Pendiente' ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Escribir respuesta..." 
                    value={replyText[t.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                    style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '13px' }}
                  />
                  <button className="btn" onClick={() => handleRespond(t.id)} style={{ padding: '8px 16px', fontSize: '13px' }}>Responder</button>
                </div>
              ) : (
                <div style={{ borderLeft: '3px solid var(--primary-active)', paddingLeft: '12px', marginTop: '16px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '12px', color: 'var(--primary-active)', marginBottom: '4px' }}>Respuesta del Administrador:</p>
                  <p style={{ fontSize: '14px', color: 'var(--text-main)' }}>{t.respuestaAdmin}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
