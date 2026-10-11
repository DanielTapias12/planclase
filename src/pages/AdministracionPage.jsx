import React, { useState, useEffect } from 'react';
import { getAllUsers, getGlobalStats, getTickets, respondTicket } from '../services/dbService';
import { decryptSensitiveField, maskPhoneNumber } from '../utils/security';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Users, 
  BookOpen, 
  Sparkles, 
  Award, 
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  X,
  Send,
  MessageSquare,
  ShieldAlert,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function AdministracionPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalPlanes: 0, totalExperiencias: 0, estudiantesImpactados: 0 });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Analiticas');
  const [replyText, setReplyText] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [revealedPhones, setRevealedPhones] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterNivel, setFilterNivel] = useState('Todos');

  useEffect(() => {
    if (!selectedUser) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedUser(null);
    };
    document.addEventListener('keydown', handleKeyDown);
    const orig = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = orig;
    };
  }, [selectedUser]);

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

  if (loading) {
    return (
      <div className="mgmt-container" style={{ textAlign: 'center', padding: '100px 20px', color: '#142B25' }}>
        <p style={{ fontSize: '16px', fontWeight: 600 }}>Cargando panel de administración y analíticas...</p>
      </div>
    );
  }

  // Cálculos estadísticos y manejo preciso de porcentajes flotantes
  const totalDocentes = Math.max(usuarios.length, 1);
  const primariaCount = usuarios.filter(u => u.nivel === 'Primaria').length;
  const secundariaCount = usuarios.filter(u => u.nivel === 'Secundaria').length;
  const mediaCount = usuarios.filter(u => u.nivel === 'Media').length;
  const otrosCount = Math.max(0, usuarios.length - (primariaCount + secundariaCount + mediaCount));

  const pctPrimaria = Number((primariaCount / totalDocentes) * 100);
  const pctSecundaria = Number((secundariaCount / totalDocentes) * 100);
  const pctMedia = Number((mediaCount / totalDocentes) * 100);
  const pctOtros = Number((otrosCount / totalDocentes) * 100);

  const promedioPlanesPorDocente = Number(stats.totalPlanes / totalDocentes).toFixed(1);
  const pendientesCount = tickets.filter(t => t.estado === 'Pendiente').length;
  const resueltosCount = tickets.filter(t => t.estado === 'Resuelto').length;
  const totalTickets = Math.max(tickets.length, 1);
  const tasaResolucion = tickets.length > 0 ? Math.round((resueltosCount / totalTickets) * 100) : 100;

  // Filtrado de usuarios
  const filteredUsers = usuarios.filter(u => {
    const matchSearch = (u.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (u.institucion || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchNivel = filterNivel === 'Todos' || u.nivel === filterNivel;
    return matchSearch && matchNivel;
  });

  // Cálculo SVG Donut Chart
  // Circunferencia = 2 * PI * r = 2 * 3.14159 * 42 ~= 263.89
  const circ = 263.89;
  const strokePrimaria = (pctPrimaria / 100) * circ;
  const strokeSecundaria = (pctSecundaria / 100) * circ;
  const strokeMedia = (pctMedia / 100) * circ;
  const strokeOtros = (pctOtros / 100) * circ;

  const offsetPrimaria = 0;
  const offsetSecundaria = -strokePrimaria;
  const offsetMedia = -(strokePrimaria + strokeSecundaria);
  const offsetOtros = -(strokePrimaria + strokeSecundaria + strokeMedia);

  return (
    <div 
      className="mgmt-container" 
      style={{ 
        maxWidth: '1060px', 
        width: '100%', 
        margin: '0 auto',
        boxSizing: 'border-box', 
        overflowX: 'hidden',
        padding: '36px 32px 64px'
      }}
    >
      
      {/* 1. Cabecera Institucional Translúcida (Mismo desenfoque y panel de cristal de Inicio) */}
      <header 
        className="mgmt-header" 
        style={{ 
          width: '100%', 
          boxSizing: 'border-box',
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
          <div className="mgmt-header-icon" style={{ backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="editorial-badge" style={{ marginBottom: '8px' }}>
              <ShieldCheck size={13} color="#2B524A" />
              <span>Gobernanza y Supervisión Curricular</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '34px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Panel de Administración y Control
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '15.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.65', fontWeight: 500 }}>
              Métricas de impacto pedagógico en tiempo real, trazabilidad de datos docentes protegidos bajo Ley 1581 de 2012 y soporte activo.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <Users size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{stats.totalUsers} Docentes</span>
          </div>
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{stats.totalPlanes} Planes</span>
          </div>
          <div className="mgmt-stat-pill">
            <Activity size={14} style={{ color: '#16A34A' }} />
            <span>{tasaResolucion}% Soporte</span>
          </div>
        </div>
      </header>

      {/* 2. Selector de Pestañas con Píldoras de Cristal */}
      <div className="mgmt-filter-bar" style={{ marginBottom: '24px', padding: '10px 14px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%' }}>
          <button 
            type="button"
            onClick={() => setActiveTab('Analiticas')}
            className={`btn-outline ${activeTab === 'Analiticas' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Analiticas' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Analiticas' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Analiticas' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Analiticas' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <BarChart3 size={16} /> Analíticas y Métricas Gráficas
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Directorio')}
            className={`btn-outline ${activeTab === 'Directorio' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Directorio' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Directorio' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Directorio' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Directorio' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <Users size={16} /> Directorio de Docentes ({usuarios.length})
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('Tickets')}
            className={`btn-outline ${activeTab === 'Tickets' ? 'active' : ''}`}
            style={{ 
              padding: '9px 20px', 
              fontSize: '14px', 
              borderRadius: '12px',
              backgroundColor: activeTab === 'Tickets' ? '#142B25' : 'rgba(255, 255, 255, 0.92)',
              color: activeTab === 'Tickets' ? '#FFFFFF' : '#142B25',
              borderColor: activeTab === 'Tickets' ? '#142B25' : 'rgba(255, 255, 255, 0.95)',
              fontWeight: activeTab === 'Tickets' ? 700 : 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(16, 36, 32, 0.04)'
            }}
          >
            <MessageSquare size={16} /> Tickets de Soporte
            {pendientesCount > 0 && (
              <span style={{ backgroundColor: '#DC2626', color: '#FFFFFF', borderRadius: '999px', padding: '1px 8px', fontSize: '11px', fontWeight: 700 }}>
                {pendientesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          PESTAÑA 1: ANALÍTICAS Y GRÁFICOS INTERACTIVOS
          ======================================================== */}
      {activeTab === 'Analiticas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', boxSizing: 'border-box' }}>
          
          {/* Tarjetas KPI con mini-gráficos visuales de tendencia */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', width: '100%' }}>
            
            {/* KPI 1: Docentes */}
            <div className="mgmt-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Docentes Activos
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Users size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalUsers}
              </p>
              {/* Mini Sparkline SVG */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                  <TrendingUp size={14} /> +100% Cuentas
                </span>
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path d="M2 20L18 16L34 18L50 8L68 4" stroke="#315B54" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* KPI 2: Planes */}
            <div className="mgmt-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Planes de Clase
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <BookOpen size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalPlanes}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 500 }}>
                  Promedio: <strong>{promedioPlanesPorDocente}</strong>/docente
                </span>
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path d="M2 18L20 14L38 12L54 6L68 2" stroke="#477A72" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* KPI 3: Experiencias */}
            <div className="mgmt-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Experiencias Abiertas
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(71, 122, 114, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#183630' }}>
                  <Sparkles size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#142B25', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.totalExperiencias}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 500 }}>
                  Comunidad activa
                </span>
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path d="M2 22L20 18L36 10L52 14L68 6" stroke="#2B524A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

            {/* KPI 4: Estudiantes Impactados */}
            <div className="mgmt-card" style={{ padding: '22px 24px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '11.5px', color: '#3A544C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Impacto Escolar
                </span>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'rgba(22, 163, 74, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#166534' }}>
                  <Award size={18} />
                </div>
              </div>
              <p style={{ fontSize: '32px', fontWeight: 700, color: '#166534', margin: '0 0 6px 0', fontFamily: 'var(--font-heading)' }}>
                {stats.estudiantesImpactados.toLocaleString()}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                  Estudiantes en aula
                </span>
                <svg width="70" height="24" viewBox="0 0 70 24" fill="none">
                  <path d="M2 20L18 12L34 14L50 6L68 2" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>

          </div>

          {/* ==================== SECCIÓN DE GRÁFICOS VISUALES ==================== */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', width: '100%' }}>
            
            {/* GRÁFICO 1: GRÁFICO DONUT SVG DE DISTRIBUCIÓN POR NIVEL */}
            <div className="mgmt-card" style={{ padding: '26px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16.5px', color: '#142B25', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PieChart size={18} color="#183630" /> Gráfico de Distribución por Nivel
                </h2>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 600 }}>{totalDocentes} Docentes</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
                {/* Visualizador Donut SVG */}
                <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Fondo base */}
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(49, 91, 84, 0.12)" strokeWidth="12" />
                    {/* Arco Primaria */}
                    {pctPrimaria > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#477A72" strokeWidth="12"
                        strokeDasharray={`${strokePrimaria} ${circ}`}
                        strokeDashoffset={offsetPrimaria}
                      />
                    )}
                    {/* Arco Secundaria */}
                    {pctSecundaria > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#315B54" strokeWidth="12"
                        strokeDasharray={`${strokeSecundaria} ${circ}`}
                        strokeDashoffset={offsetSecundaria}
                      />
                    )}
                    {/* Arco Media */}
                    {pctMedia > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#183630" strokeWidth="12"
                        strokeDasharray={`${strokeMedia} ${circ}`}
                        strokeDashoffset={offsetMedia}
                      />
                    )}
                    {/* Arco Otros */}
                    {pctOtros > 0 && (
                      <circle 
                        cx="50" cy="50" r="42" fill="none" stroke="#A7C4BC" strokeWidth="12"
                        strokeDasharray={`${strokeOtros} ${circ}`}
                        strokeDashoffset={offsetOtros}
                      />
                    )}
                  </svg>
                  {/* Centro del Donut */}
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: '#142B25', display: 'block', lineHeight: 1 }}>{totalDocentes}</span>
                    <span style={{ fontSize: '10.5px', color: '#4A635B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Total</span>
                  </div>
                </div>

                {/* Leyenda y barras complementarias */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '170px', flex: 1 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#477A72' }} />
                        Primaria ({primariaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctPrimaria.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctPrimaria}%`, backgroundColor: '#477A72' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#315B54' }} />
                        Secundaria ({secundariaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctSecundaria.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctSecundaria}%`, backgroundColor: '#315B54' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#142B25', fontWeight: 600 }}>
                        <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#183630' }} />
                        Media ({mediaCount})
                      </span>
                      <strong style={{ color: '#183630' }}>{pctMedia.toFixed(1)}%</strong>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctMedia}%`, backgroundColor: '#183630' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GRÁFICO 2: MEDIDORES DE ÁREAS CURRICULARES */}
            <div className="mgmt-card" style={{ padding: '26px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(49, 91, 84, 0.14)', paddingBottom: '12px' }}>
                <h2 style={{ fontSize: '16.5px', color: '#142B25', margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#183630" /> Producción Curricular por Área
                </h2>
                <span style={{ fontSize: '12px', color: '#2B453E', fontWeight: 600 }}>Enfoque STEAM</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Tecnología */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Tecnología e Informática</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Algoritmos y pensamiento computacional</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      42% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '42%', backgroundColor: '#183630', borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Matemáticas */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Matemáticas</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Modelación y problemas reales</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      34% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '34%', backgroundColor: '#315B54', borderRadius: '999px' }} />
                  </div>
                </div>

                {/* Lenguaje e Idiomas */}
                <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255, 255, 255, 0.72)', borderRadius: '14px', border: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <strong style={{ fontSize: '13.5px', color: '#142B25', display: 'block' }}>Lenguaje e Inglés</strong>
                      <span style={{ fontSize: '11.5px', color: '#4A635B' }}>Comprensión y expresión comunicativa</span>
                    </div>
                    <span style={{ padding: '3px 10px', borderRadius: '999px', backgroundColor: 'rgba(71, 122, 114, 0.18)', color: '#183630', fontSize: '11.5px', fontWeight: 700 }}>
                      24% del total
                    </span>
                  </div>
                  <div style={{ height: '8px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.12)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '24%', backgroundColor: '#477A72', borderRadius: '999px' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* GRÁFICO 3: TASA DE RESOLUCIÓN DE SOPORTE */}
          <div className="mgmt-card" style={{ padding: '24px 28px', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '16.5px', color: '#142B25', margin: '0 0 4px 0', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#183630" /> Estado de Solicitudes y Atención a Docentes
                </h3>
                <p style={{ fontSize: '13px', color: '#3A544C', margin: 0 }}>
                  Eficiencia de soporte técnico institucional y resolución de dudas sobre el planificador.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: '#DCFCE7', color: '#166534', fontSize: '12px', fontWeight: 700 }}>
                  {resueltosCount} Resueltos
                </span>
                <span style={{ padding: '4px 12px', borderRadius: '999px', backgroundColor: pendientesCount > 0 ? '#FEF3C7' : '#E7EDE7', color: pendientesCount > 0 ? '#92400E' : '#315B54', fontSize: '12px', fontWeight: 700 }}>
                  {pendientesCount} Pendientes
                </span>
              </div>
            </div>

            <div style={{ height: '12px', width: '100%', backgroundColor: 'rgba(49, 91, 84, 0.14)', borderRadius: '999px', overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: '100%', width: `${tasaResolucion}%`, backgroundColor: '#16A34A', transition: 'width 0.4s ease' }} title={`Resueltos: ${tasaResolucion}%`} />
              <div style={{ height: '100%', width: `${100 - tasaResolucion}%`, backgroundColor: '#F59E0B', transition: 'width 0.4s ease' }} title={`Pendientes: ${100 - tasaResolucion}%`} />
            </div>
          </div>

        </div>
      )}

      {/* ========================================================
          PESTAÑA 2: DIRECTORIO DE DOCENTES CON CONTENCIÓN ESTRICTA
          ======================================================== */}
      {activeTab === 'Directorio' && (
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          
          {/* Barra de Filtros y Búsqueda */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px', maxWidth: '420px' }}>
              <div className="mgmt-search-box" style={{ width: '100%', minWidth: 'auto' }}>
                <Search size={16} color="var(--primary-sage)" />
                <input 
                  type="text" 
                  placeholder="Buscar docente por nombre, email o colegio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mgmt-search-input"
                />
              </div>
            </div>

            {/* Chips de filtro por nivel */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Todos', 'Primaria', 'Secundaria', 'Media'].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFilterNivel(n)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    border: '1px solid rgba(49, 91, 84, 0.22)',
                    backgroundColor: filterNivel === n ? '#183630' : 'rgba(255, 255, 255, 0.72)',
                    color: filterNivel === n ? '#FFFFFF' : '#142B25',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: '#2B433B', fontWeight: 600 }}>
              Mostrando {filteredUsers.length} de {usuarios.length} docentes registrados
            </span>
            <span style={{ fontSize: '11.5px', color: '#166534', background: '#DCFCE7', padding: '4px 12px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
              <ShieldCheck size={13} /> Cifrado Habeas Data (Ley 1581 de 2012)
            </span>
          </div>

          {/* Tabla Contenida con Scroll Horizontal Interno (Nunca se desborda) */}
          <div className="mgmt-card" style={{ padding: '0', overflow: 'hidden', width: '100%', boxSizing: 'border-box', marginBottom: '32px' }}>
            <div style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '640px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(71, 122, 114, 0.12)', borderBottom: '1px solid rgba(49, 91, 84, 0.18)' }}>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Docente</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Celular Cifrado</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Nivel / Rol</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Institución</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Planes</th>
                    <th style={{ padding: '14px 18px', color: '#142B25', fontSize: '12.5px', fontWeight: 700 }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '36px', textAlign: 'center', color: '#4B635B' }}>
                        No se encontraron docentes con los criterios de búsqueda seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(u => {
                      const plainPhone = decryptSensitiveField(u.celular);
                      const isRevealed = Boolean(revealedPhones[u.id]);
                      const displayPhone = plainPhone ? (isRevealed ? plainPhone : maskPhoneNumber(plainPhone)) : 'No registrado';

                      return (
                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(49, 91, 84, 0.10)', transition: 'background-color 0.15s ease' }}>
                          <td style={{ padding: '14px 18px' }}>
                            <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#142B25' }}>{u.nombre}</div>
                            <div style={{ fontSize: '12px', color: '#3A544C' }}>{u.email}</div>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '12.5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#142B25' }}>{displayPhone}</span>
                              {plainPhone && (
                                <button
                                  type="button"
                                  onClick={() => togglePhoneReveal(u.id)}
                                  title={isRevealed ? "Ocultar teléfono" : "Descifrar teléfono para contacto"}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '3px', color: '#315B54', display: 'flex', alignItems: 'center' }}
                                >
                                  {isRevealed ? <Lock size={13} color="#183630" /> : <Unlock size={13} />}
                                </button>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ 
                              background: u.nivel === 'Primaria' ? 'rgba(71, 122, 114, 0.14)' : u.nivel === 'Secundaria' ? 'rgba(49, 91, 84, 0.18)' : 'rgba(24, 54, 48, 0.18)', 
                              color: '#183630', 
                              padding: '3px 10px', 
                              borderRadius: '999px', 
                              fontSize: '11.5px', 
                              fontWeight: 700 
                            }}>
                              {u.nivel || u.rol || 'Docente'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '13px', color: '#2B433B' }}>
                            {u.institucion || 'Institución Educativa'}
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{ fontWeight: 700, color: '#183630', fontSize: '13.5px' }}>
                              {u.planesCount !== undefined ? u.planesCount : 0}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px' }}>
                            <button className="btn-outline" style={{ padding: '5px 12px', fontSize: '12px' }} onClick={() => setSelectedUser(u)}>
                              Ver Detalle
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Detalle de Usuario con Diseño de Cristal */}
          {selectedUser && (
            <div 
              className="modal-glass-backdrop" 
              onClick={(e) => { if (e.target === e.currentTarget) setSelectedUser(null); }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="user-detail-title"
            >
              <div className="modal-glass-card" style={{ maxWidth: '520px' }}>
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
                      color: '#1C3D36',
                      fontWeight: 700
                    }}>
                      {(selectedUser.nombre || 'U').charAt(0).toUpperCase()}
                    </div>
                    <h3 id="user-detail-title" className="modal-glass-title" style={{ fontSize: '18px' }}>
                      Detalle de Cuenta Docente
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedUser(null)} 
                    className="modal-glass-close-btn"
                    aria-label="Cerrar detalle docente"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="modal-glass-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#142B25' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Nombre:</strong> {selectedUser.nombre}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Email:</strong> {selectedUser.email}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Celular de Contacto:</strong>{' '}
                    <span style={{ fontFamily: 'monospace' }}>
                      {decryptSensitiveField(selectedUser.celular) || 'No registrado'}
                    </span>
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Rol:</strong> {selectedUser.rol || 'Docente'}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Institución:</strong> {selectedUser.institucion || 'N/A'}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Nivel Pedagógico:</strong> {selectedUser.nivel || 'N/A'}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '10px', border: '1px solid rgba(49, 91, 84, 0.12)' }}>
                    <strong>Consentimiento Habeas Data:</strong> {selectedUser.termsAccepted ? 'Aceptado (Ley 1581 de 2012)' : 'Pre-existente'}
                  </div>
                  <div style={{ padding: '8px 12px', backgroundColor: 'rgba(71, 122, 114, 0.08)', borderRadius: '10px', border: '1px solid rgba(71, 122, 114, 0.2)' }}>
                    <strong>Planes Creados en Plataforma:</strong> <strong style={{ color: '#183630', fontSize: '15px' }}>{selectedUser.planesCount}</strong>
                  </div>
                </div>

                <div className="modal-glass-footer">
                  <button className="btn btn-primary" onClick={() => setSelectedUser(null)} style={{ padding: '8px 22px' }}>
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================
          PESTAÑA 3: TICKETS DE SOPORTE TÉCNICO
          ======================================================== */}
      {activeTab === 'Tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', boxSizing: 'border-box', marginBottom: '40px' }}>
          {tickets.length === 0 ? (
            <div className="mgmt-empty-card" style={{ width: '100%', boxSizing: 'border-box' }}>
              <ShieldAlert size={36} color="var(--primary-sage)" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#142B25', margin: '0 0 8px 0' }}>
                No hay tickets de soporte pendientes
              </h3>
              <p style={{ color: '#2B453E', fontSize: '14px', margin: 0 }}>
                Todas las solicitudes técnicas docentes han sido atendidas exitosamente.
              </p>
            </div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className="mgmt-card" style={{ padding: '24px 28px', width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', color: '#142B25', margin: 0, fontWeight: 700 }}>{t.asunto}</h3>
                  <span style={{ 
                    backgroundColor: t.estado === 'Pendiente' ? '#FEF3C7' : '#DCFCE7', 
                    color: t.estado === 'Pendiente' ? '#92400E' : '#166534',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}>
                    {t.estado}
                  </span>
                </div>

                <p style={{ fontSize: '13px', color: '#2F4840', margin: '0 0 10px 0' }}>
                  De: <strong>{t.nombre}</strong> ({t.email})
                </p>

                <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', padding: '14px 18px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', color: '#142B25', border: '1px solid rgba(49, 91, 84, 0.16)', lineHeight: '1.5' }}>
                  {t.descripcion}
                </div>
                
                {t.estado === 'Pendiente' ? (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input 
                      type="text" 
                      placeholder="Escribir respuesta al docente..." 
                      value={replyText[t.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [t.id]: e.target.value })}
                      className="wizard-input"
                      style={{ flex: 1, minWidth: '240px' }}
                      aria-label="Respuesta al ticket"
                    />
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleRespond(t.id)} 
                      style={{ padding: '8px 20px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                      <Send size={15} /> Responder
                    </button>
                  </div>
                ) : (
                  <div style={{ borderLeft: '3px solid #183630', paddingLeft: '14px', marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <CheckCircle2 size={16} color="#16A34A" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '12px', color: '#183630', margin: '0 0 4px 0' }}>Respuesta de Administración:</p>
                      <p style={{ fontSize: '14px', color: '#142B25', margin: 0 }}>{t.respuestaAdmin}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
