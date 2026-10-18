import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom';
import WizardPage from './pages/WizardPage';
import EditorPage from './pages/EditorPage';
import ConfigPage from './pages/ConfigPage';
import { initAuth } from './services/authService';
import { getMisPlanes } from './services/dbService';
import { useAppStore } from './store/useAppStore';
import { auth } from './firebase';

// Nuevas Páginas
import MisPlanesPage from './pages/MisPlanesPage';
import ExperienciasPage from './pages/ExperienciasPage';
import BibliotecaPage from './pages/BibliotecaPage';
import PlantillasPage from './pages/PlantillasPage';
import ForoPage from './pages/ForoPage';
import SoportePage from './pages/SoportePage';
import AyudaPage from './pages/AyudaPage';
import AdministracionPage from './pages/AdministracionPage';
import AboutPage from './pages/AboutPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import AdnPedagogicoPage from './pages/AdnPedagogicoPage';
import BienvenidaNarrativa from './components/BienvenidaNarrativa';
import ModalCalibracionDocente from './components/ModalCalibracionDocente';
import UserMenu from './components/UserMenu';
import FondoPixel from './components/FondoPixel';
import NetworkStatusBanner from './components/NetworkStatusBanner';
import { 
  Settings, 
  Lightbulb, 
  Menu, 
  X, 
  Home, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Shield, 
  Library, 
  Compass, 
  MessageSquare, 
  HelpCircle, 
  LifeBuoy, 
  Info,
  Dna,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

function AppContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('inspiratec_sidebar_collapsed') === 'true';
    }
    return false;
  });

  const [topUtilitiesCollapsed, setTopUtilitiesCollapsed] = useState(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('inspiratec_top_utilities_collapsed') === 'true';
    }
    return false;
  });

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

  const toggleTopUtilities = () => {
    setTopUtilitiesCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('inspiratec_top_utilities_collapsed', String(next));
      }
      return next;
    });
  };

  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);


  const { userId, userProfile, apiKey, planesCount, setPlanesCount, clearWizardFormOnly } = useAppStore();

  useEffect(() => {
    const targetUid = userId || auth.currentUser?.uid || 'anon';
    getMisPlanes(targetUid).then(planes => {
      setPlanesCount(planes.length);
    }).catch(e => console.error(e));
  }, [userId, setPlanesCount]);


  // Fondo ambiental unificado idéntico a Inicio para todo el recorrido
  const ambientBg = '/images/inicio-fondo.png';
  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');

  return (
    <FondoPixel dim={0} className="app-background">
      <div className="app-shell-layout has-ambient-backdrop">
        {/* Fondo Ambiental Dinámico Institucional según Módulo */}
        <div 
          className="home-ambient-backdrop" 
          style={{ backgroundImage: `linear-gradient(180deg, rgba(20, 42, 38, 0.22) 0%, rgba(20, 42, 38, 0.08) 32%, rgba(20, 42, 38, 0.26) 100%), url('${ambientBg}')` }}
          aria-hidden="true" 
        />

        {/* Experiencia Narrativa Inmersiva de Bienvenida (11 escenas) */}
        <BienvenidaNarrativa />

        {/* Modal de Onboarding y Calibración Curricular (Sin alterar la bienvenida) */}
        <ModalCalibracionDocente />

        {/* Indicador no invasivo de estado de conexión a internet */}
        <NetworkStatusBanner />

        {/* Barra superior compacta solo para vista móvil */}
        <header className="mobile-header-bar">
              <button
                type="button"
                className="mobile-nav-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú de navegación"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <NavLink to="/home" className="mobile-brand-title">
                <Lightbulb size={20} color="var(--color-brand-active)" /> INSPIRATEC
              </NavLink>

              <UserMenu />
            </header>

            {/* Overlay para móvil y escritorio al expandir */}
            <div
              className={`sidebar-backdrop ${mobileMenuOpen ? 'open' : ''} ${!sidebarCollapsed ? 'desktop-expanded' : ''}`}
              onClick={() => {
                setMobileMenuOpen(false);
                setSidebarCollapsed(true);
              }}
              aria-hidden="true"
            />

            {/* Menú Lateral Verde Petróleo Translúcido */}
            <aside 
              className={`app-sidebar-lateral ${mobileMenuOpen ? 'open' : ''} ${sidebarCollapsed ? 'collapsed' : ''}`} 
              aria-label="Menú principal INSPIRATEC"
            >
              {/* Encabezado con Marca */}
              <div className="sidebar-brand-header">
                <NavLink 
                  to="/home" 
                  className="sidebar-brand-link" 
                  onClick={() => setMobileMenuOpen(false)}
                  title="Ir al Inicio de INSPIRATEC"
                >
                  <div className="sidebar-brand-icon">
                    <Lightbulb size={22} color="#FFFDF9" />
                  </div>
                  <div className="sidebar-brand-texts">
                    <span className="sidebar-brand-title">INSPIRATEC</span>
                    <span className="sidebar-brand-subtitle">Plataforma Curricular</span>
                  </div>
                </NavLink>

                {/* Control compacto e intuitivo para contraer/expandir navegación lateral */}
                <button
                  type="button"
                  className="sidebar-collapse-toggle-btn"
                  onClick={toggleSidebar}
                  aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                  title={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
                >
                  {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>

                <button
                  type="button"
                  className="sidebar-close-btn-mobile"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Cerrar menú"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Área de Navegación Vertical */}
              <nav className="sidebar-scrollable-nav">
                
                {/* 1. Navegación Principal (Planeación) */}
                <div className="sidebar-nav-group">
                  <div className="sidebar-group-label">Planeación</div>

                  <NavLink
                    to="/home"
                    id="nav-inicio"
                    end
                    title="Inicio"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Home size={18} />
                    <span>Inicio</span>
                  </NavLink>

                  <NavLink
                    to="/"
                    id="nav-planificador"
                    end
                    title="Planificador de Clases"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Sparkles size={18} />
                    <span>Planificador</span>
                  </NavLink>

                  <NavLink
                    to="/mis-planes"
                    id="nav-mis-planes"
                    title="Mis Planes de Clase"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <FileText size={18} />
                    <span>Mis Planes</span>
                    {planesCount > 0 && <span className="sidebar-counter-badge">{planesCount}</span>}
                  </NavLink>

                  <NavLink
                    to="/adn-pedagogico"
                    id="nav-adn-pedagogico"
                    title="Mi ADN Pedagógico & Estudio Transversal"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Dna size={18} />
                    <span>Mi ADN Pedagógico</span>
                  </NavLink>

                  <NavLink
                    to="/plantillas"
                    id="nav-plantillas"
                    title="Plantillas Curriculares"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <BookOpen size={18} />
                    <span>Plantillas</span>
                  </NavLink>

                  {isAdmin && (
                    <NavLink
                      to="/administracion"
                      id="nav-administracion"
                      title="Panel de Administración"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                    >
                      <Shield size={18} />
                      <span>Administración</span>
                    </NavLink>
                  )}
                </div>

                {/* 2. Sección Comunidad & Recursos */}
                <div className="sidebar-nav-group" id="nav-mas-recursos">
                  <div className="sidebar-group-label">Comunidad</div>

                  <NavLink
                    to="/biblioteca"
                    title="Biblioteca Comunitaria"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Library size={18} />
                    <span>Biblioteca</span>
                  </NavLink>

                  <NavLink
                    to="/experiencias"
                    title="Experiencias Sistematizadas"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Compass size={18} />
                    <span>Experiencias</span>
                  </NavLink>

                  <NavLink
                    to="/foro"
                    title="Foro Docente"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <MessageSquare size={18} />
                    <span>Foro Docente</span>
                  </NavLink>
                </div>

                {/* 3. Sección Soporte y Guías */}
                <div className="sidebar-nav-group">
                  <div className="sidebar-group-label">Soporte</div>

                  <NavLink
                    to="/ayuda"
                    title="Ayuda y Guías"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <HelpCircle size={18} />
                    <span>Ayuda y Guías</span>
                  </NavLink>

                  <NavLink
                    to="/soporte"
                    title="Soporte Técnico"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <LifeBuoy size={18} />
                    <span>Soporte Técnico</span>
                  </NavLink>

                  <NavLink
                    to="/acerca"
                    title="Acerca de INSPIRATEC"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Info size={18} />
                    <span>Acerca de</span>
                  </NavLink>
                </div>

                {/* Sección exclusiva para Drawer Móvil con accesos directos */}
                <div className="sidebar-nav-group mobile-only-nav-group">
                  <div className="sidebar-group-label">Herramientas</div>
                  <NavLink
                    to="/config"
                    title="Configuración IA"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) => isActive ? 'sidebar-nav-item active' : 'sidebar-nav-item'}
                  >
                    <Settings size={18} />
                    <span>Configuración IA</span>
                  </NavLink>
                </div>
              </nav>

              {/* Pie Institucional del Menú Lateral */}
              <div className="sidebar-footer-institutional">
                <div className="sidebar-inst-badge">INSPIRATEC 2026</div>
                <p className="sidebar-inst-text">
                  Docencia con criterio, rigurosidad e innovación pedagógica.
                </p>
              </div>
            </aside>

        {/* Área de Contenido Principal */}
        <div className="app-shell-main">
          {/* Barra Superior Compacta de Utilidades (Esquina Superior Derecha en Escritorio) */}
          <header className="app-top-utilities-bar" aria-label="Utilidades y cuenta de usuario">
            <div className={`top-utilities-group ${topUtilitiesCollapsed ? 'is-collapsed' : ''}`}>
              {/* Botón para contraer / expandir el menú superior */}
              <button
                type="button"
                className="top-utility-collapse-trigger"
                onClick={toggleTopUtilities}
                aria-label={topUtilitiesCollapsed ? "Expandir menú de utilidades" : "Contraer menú de utilidades"}
                title={topUtilitiesCollapsed ? "Expandir menú de utilidades" : "Contraer menú de utilidades"}
              >
                {topUtilitiesCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>

              {!topUtilitiesCollapsed ? (
                <>
                  {/* 1. Configuración IA con indicador de estado */}
                  <NavLink 
                    to="/config" 
                    id="nav-config"
                    className={({ isActive }) => isActive ? 'top-utility-link top-utility-ai active' : 'top-utility-link top-utility-ai'}
                    title={apiKey && apiKey.length > 10 ? "IA Gemini configurada y activa" : "Configurar API Key de Gemini"}
                  >
                    <Settings size={15} />
                    <span>Configuración IA</span>
                    <span className={`ai-status-indicator ${apiKey && apiKey.length > 10 ? 'active' : 'pending'}`}>
                      <span className="ai-status-dot" />
                      <span className="ai-status-label">{apiKey && apiKey.length > 10 ? 'Lista' : 'Configurar'}</span>
                    </span>
                  </NavLink>

                  {/* Separador vertical */}
                  <div className="top-utilities-divider" />

                  {/* 3. Usuario y menú de cuenta */}
                  <div className="top-utility-user">
                    <UserMenu />
                  </div>
                </>
              ) : (
                /* Estado contraído: Iconos minimalistas rápidos */
                <button
                  type="button"
                  className="top-utilities-mini-pill"
                  onClick={toggleTopUtilities}
                  title="Expandir menú de cuenta e IA"
                  aria-label="Expandir menú de cuenta e IA"
                >
                  <span className={`ai-status-dot-mini ${apiKey && apiKey.length > 10 ? 'active' : 'pending'}`} />
                  <Settings size={14} style={{ color: '#142B25' }} />
                  <div className="top-user-avatar-mini">
                    {((userProfile?.rol || auth.currentUser?.displayName || 'D').charAt(0)).toUpperCase()}
                  </div>
                </button>
              )}
            </div>
          </header>

          <main className="app-main-content-scroll">
            <Routes>
              <Route path="/" element={<WizardPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/editor" element={<EditorPage />} />
              <Route path="/config" element={<ConfigPage />} />

              <Route path="/mis-planes" element={<MisPlanesPage />} />
              <Route path="/adn-pedagogico" element={<AdnPedagogicoPage />} />
              <Route path="/experiencias" element={<ExperienciasPage />} />
              <Route path="/biblioteca" element={<BibliotecaPage />} />
              <Route path="/plantillas" element={<PlantillasPage />} />
              <Route path="/foro" element={<ForoPage />} />
              <Route path="/soporte" element={<SoportePage />} />
              <Route path="/acerca" element={<AboutPage />} />
              <Route path="/ayuda" element={<AyudaPage />} />
              <Route path="/administracion" element={<AdministracionPage />} />
              <Route path="/animacion" element={<Navigate to="/home" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </FondoPixel>
  );
}

function App() {
  const { userId } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <BrowserRouter>
      {!userId ? <AuthPage /> : <AppContent />}
    </BrowserRouter>
  );
}

export default App;
