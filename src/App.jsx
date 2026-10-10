import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import WizardPage from './pages/WizardPage';
import EditorPage from './pages/EditorPage';
import ConfigPage from './pages/ConfigPage';
import { initAuth, logoutUser } from './services/authService';
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
import WelcomeModal from './components/WelcomeModal';
import UserMenu from './components/UserMenu';
import FondoPixel from './components/FondoPixel';
import RecorridoInmersivo from './components/RecorridoInmersivo';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { Settings, MoreHorizontal, Lightbulb, PlayCircle, MonitorPlay, ArrowLeft } from 'lucide-react';

function AppContent() {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef(null);
  const location = useLocation();
  const isSimulation = location.pathname === '/animacion';
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setShowMoreMenu(false);
      }
    };
    
    const handleStartTutorial = () => {
      const driverObj = driver({
        showProgress: true,
        nextBtnText: 'Siguiente',
        prevBtnText: 'Atrás',
        doneBtnText: 'Finalizar',
        steps: [
          { popover: { title: '¡Bienvenido a INSPIRATEC!', description: 'Te daremos un breve recorrido por nuestra plataforma. Puedes saltarlo si prefieres explorar por tu cuenta.' } },
          { element: '#nav-inicio', popover: { title: 'Inicio', description: 'Aquí es donde comienza la magia. Utiliza el Creador de Secuencias para planear tus clases con ayuda de IA.' } },
          { element: '#nav-mis-planes', popover: { title: 'Mis Planes', description: 'Encuentra todos los planes que has guardado. Puedes exportarlos a PDF o Word en cualquier momento.' } },
          { element: '#nav-plantillas', popover: { title: 'Plantillas', description: 'Crea plantillas personalizadas adaptadas a los formatos que te pide tu colegio.' } },
          { element: '#nav-mas-recursos', popover: { title: 'Más Recursos', description: 'Descubre más herramientas, el foro de la comunidad y nuestra biblioteca de recursos compartidos.' } },
          { element: '#nav-config', popover: { title: 'Configuración', description: 'Configura tu propia clave de API aquí para desbloquear todo el potencial de la Inteligencia Artificial.' } },
        ],
        onDestroyStarted: () => {
          localStorage.setItem('tourCompletado', 'true');
          driverObj.destroy();
        }
      });
      driverObj.drive();
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('start-tutorial', handleStartTutorial);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('start-tutorial', handleStartTutorial);
    };
  }, []);
  const { userId, userProfile, apiKey, planesCount, setPlanesCount } = useAppStore();

  useEffect(() => {
    if (userId) {
      getMisPlanes(userId).then(planes => {
        setPlanesCount(planes.length);
      }).catch(e => console.error(e));
    } else {
      setPlanesCount(0);
    }
  }, [userId]);

  const primaryNavItems = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/mis-planes', label: 'Mis Planes', badge: planesCount > 0 ? planesCount : null },
    { path: '/plantillas', label: 'Plantillas' },
    { path: '/administracion', label: 'Administración' }
  ];

  const secondaryNavItems = [
    { path: '/experiencias', label: 'Experiencias' },
    { path: '/biblioteca', label: 'Biblioteca' },
    { path: '/foro', label: 'Foro' },
    { path: '/soporte', label: 'Soporte' },
    { path: '/acerca', label: 'Acerca del Proyecto' },
    { path: '/ayuda', label: 'Ayuda' }
  ];

  return (
    <FondoPixel dim={0} className="app-background" isSimulation={isSimulation}>
      <div className="app-container top-layout">
        {!isSimulation && <WelcomeModal onStartTour={() => window.dispatchEvent(new Event('start-tutorial'))} />}
        {!isSimulation && (
          <div className="header-container" style={{ width: '100%', boxSizing: 'border-box', backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 50 }}>
            <div className="brand-logo"><Lightbulb size={24} color="var(--primary-sage)" /> INSPIRATEC</div>

            <header className="top-nav" style={{ border: 'none', background: 'transparent' }}>
              <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                {primaryNavItems.map((item) => {
                  const isAdmin = userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com');
                  if (item.path === '/administracion' && !isAdmin) return null;

                  // Add specific ID for joyride targets
                  const id = item.path === '/' ? 'nav-inicio' : 'nav-' + item.path.replace('/', '');

                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.exact}
                      id={id}
                      className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                    >
                      {item.label}
                      {item.badge && <span className="badge">{item.badge}</span>}
                    </NavLink>
                  );
                })}

                <div ref={moreMenuRef} style={{ position: 'relative' }}>
                  <button
                    id="nav-mas-recursos"
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`nav-link ${showMoreMenu ? 'active' : ''}`}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Más Recursos <MoreHorizontal size={16} />
                  </button>

                  {showMoreMenu && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '16px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #E2E8F0', width: '220px', zIndex: 1000, overflow: 'hidden' }}>
                      {secondaryNavItems.map((item) => (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setShowMoreMenu(false)}
                          className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
                          style={{ display: 'block', padding: '12px 16px', width: '100%', boxSizing: 'border-box' }}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px', borderLeft: '1px solid #CBD5E1', paddingLeft: '24px' }}>
                  <NavLink to="/animacion" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MonitorPlay size={16} />
                    Animación
                  </NavLink>
                  <NavLink id="nav-config" to="/config" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Settings size={16} />
                    Config IA
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: (apiKey && apiKey.length > 10 ? '#10B981' : '#F59E0B') }} title="Estado API"></span>
                  </NavLink>
                  <UserMenu />
                </div>
              </nav>
            </header>
          </div>
        )}
        <main className="main-content" style={{
          backgroundColor: 'transparent',
          backdropFilter: 'none',
          transition: 'all 0.3s ease'
        }}>
          <Routes>
            <Route path="/" element={<WizardPage />} />
            <Route path="/editor" element={<EditorPage />} />
            <Route path="/config" element={<ConfigPage />} />

            <Route path="/mis-planes" element={<MisPlanesPage />} />
            <Route path="/experiencias" element={<ExperienciasPage />} />
            <Route path="/biblioteca" element={<BibliotecaPage />} />
            <Route path="/plantillas" element={<PlantillasPage />} />
            <Route path="/foro" element={<ForoPage />} />
            <Route path="/soporte" element={<SoportePage />} />
            <Route path="/acerca" element={<AboutPage />} />
            <Route path="/ayuda" element={<AyudaPage />} />
            <Route path="/administracion" element={<AdministracionPage />} />
            <Route path="/animacion" element={<RecorridoInmersivo />} />
          </Routes>
        </main>
      </div>
    </FondoPixel>
  );
}

function App() {
  const { userId } = useAppStore();

  useEffect(() => {
    initAuth();
  }, []);

  if (!userId) {
    return <AuthPage />;
  }
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
