import React, { useState, useEffect } from 'react';
import { getAllUsers, getGlobalStats, getTickets, respondTicket } from '../services/dbService';

export default function AdministracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0 });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Analiticas');
  const [replyText, setReplyText] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

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

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Cargando panel...</div>;

  return (
    <div className="planificador-view">
      <div className="planificador-header">
        <h2>Panel de Administración</h2>
        <p>Métricas globales, impacto educativo y control de plataforma.</p>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <button 
          onClick={() => setActiveTab('Analiticas')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'Analiticas' ? '2px solid var(--primary-active)' : '2px solid transparent', color: activeTab === 'Analiticas' ? 'var(--primary-active)' : 'var(--text-secondary)', fontWeight: activeTab === 'Analiticas' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '15px' }}
        >
          Analíticas y Usuarios
        </button>
        <button 
          onClick={() => setActiveTab('Tickets')}
          style={{ padding: '12px 24px', background: 'none', border: 'none', borderBottom: activeTab === 'Tickets' ? '2px solid var(--primary-active)' : '2px solid transparent', color: activeTab === 'Tickets' ? 'var(--primary-active)' : 'var(--text-secondary)', fontWeight: activeTab === 'Tickets' ? 'bold' : 'normal', cursor: 'pointer', fontSize: '15px' }}
        >
          Tickets de Soporte {tickets.filter(t => t.estado === 'Pendiente').length > 0 && <span style={{ background: '#EF4444', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', marginLeft: '4px' }}>{tickets.filter(t => t.estado === 'Pendiente').length}</span>}
        </button>
      </div>

      {activeTab === 'Analiticas' && (
        <>
          <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Métricas Globales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Usuarios Registrados</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)' }}>{stats.totalUsers}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Planes Creados</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)' }}>{stats.totalPlanes}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Experiencias Compartidas</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-active)' }}>{stats.totalExperiencias}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Estudiantes Impactados</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--primary-sage)' }}>{stats.estudiantesImpactados}</p>
        </div>
      </div>

      {/* Impacto por Nivel y Top Creados */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Impacto por Nivel</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Primaria</span> <strong>35%</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Bachillerato (6to-9no)</span> <strong>45%</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Media (10mo-11mo)</span> <strong>20%</strong></li>
          </ul>
        </div>
        <div className="card">
          <h3 style={{ fontSize: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>Top Temas Creados</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Pensamiento Computacional</span> <strong>420 planes</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Uso Ético de IA</span> <strong>315 planes</strong></li>
            <li style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}><span>Robótica Básica</span> <strong>280 planes</strong></li>
          </ul>
        </div>
      </div>

      {/* Directorio de Usuarios */}
      <h3 style={{ marginBottom: '16px', color: 'var(--text-main)' }}>Directorio de Usuarios y Actividad</h3>
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-sage-soft)', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '16px', color: 'var(--primary-sage)' }}>Usuario / Correo</th>
              <th style={{ padding: '16px', color: 'var(--primary-sage)' }}>Rol</th>
              <th style={{ padding: '16px', color: 'var(--primary-sage)' }}>Última Conexión</th>
              <th style={{ padding: '16px', color: 'var(--primary-sage)' }}>Planes</th>
              <th style={{ padding: '16px', color: 'var(--primary-sage)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>{u.nombre}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '16px' }}>{u.rol || 'Docente'}</td>
                <td style={{ padding: '16px' }}>{u.lastLogin ? new Date(u.lastLogin?.seconds ? u.lastLogin.seconds * 1000 : u.lastLogin).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ fontWeight: 'bold' }}>{u.planesCount !== undefined ? u.planesCount : '--'}</div>
                </td>
                <td style={{ padding: '16px' }}>
                  <button className="btn-outline" style={{ padding: '4px 8px', fontSize: '12px' }} onClick={() => setSelectedUser(u)}>Ver Detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--bg-main)', padding: '32px', borderRadius: '12px', width: '90%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '16px', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>Detalle de Usuario</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <p><strong>Nombre:</strong> {selectedUser.nombre}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Rol:</strong> {selectedUser.rol || 'Docente'}</p>
              <p><strong>Institución:</strong> {selectedUser.institucion || 'N/A'}</p>
              <p><strong>Nivel:</strong> {selectedUser.nivel || 'N/A'}</p>
              <p><strong>Última Conexión:</strong> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin?.seconds ? selectedUser.lastLogin.seconds * 1000 : selectedUser.lastLogin).toLocaleString() : 'N/A'}</p>
              <p><strong>Planes Creados:</strong> <span style={{ color: 'var(--primary-active)', fontWeight: 'bold' }}>{selectedUser.planesCount}</span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <button className="btn" onClick={() => setSelectedUser(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {activeTab === 'Tickets' && (
        <div className="grid-list">
          {tickets.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>No hay tickets de soporte.</p>}
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
