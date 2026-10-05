import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import WizardPage from './pages/WizardPage';
import EditorPage from './pages/EditorPage';
import ConfigPage from './pages/ConfigPage';
import { initAuth, initAdminAccount, logoutUser } from './services/authService';
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
import AuthPage from './pages/AuthPage';
import OnboardingTour from './components/OnboardingTour';

function App() {
  const { userId, userProfile } = useAppStore();
  const [planesCount, setPlanesCount] = React.useState(0);

  useEffect(() => {
    initAuth();
    // Inicializar el admin en segundo plano
    initAdminAccount();
  }, []);

  useEffect(() => {
    if (userId) {
      getMisPlanes(userId).then(planes => {
        setPlanesCount(planes.length);
      }).catch(e => console.error(e));
    } else {
      setPlanesCount(0);
    }
  }, [userId]);

  const navItems = [
    { path: '/', label: 'Inicio', exact: true },
    { path: '/mis-planes', label: 'Mis Planes', badge: planesCount > 0 ? planesCount : null },
    { path: '/experiencias', label: 'Experiencias' },
    { path: '/biblioteca', label: 'Biblioteca' },
    { path: '/plantillas', label: 'Plantillas' },
    { path: '/foro', label: 'Foro' },
    { path: '/soporte', label: 'Soporte' },
    { path: '/ayuda', label: 'Ayuda' },
    { path: '/administracion', label: 'Administración' },
    { path: '/config', label: 'API' }
  ];

  if (!userId) {
    return <AuthPage />;
  }

  return (
    <BrowserRouter>
      <div className="app-container top-layout">
        <OnboardingTour />
        <div className="header-container" style={{ display: 'flex', alignItems: 'center', padding: '0 40px', width: '100%', boxSizing: 'border-box' }}>
          <div className="brand-logo" style={{ marginRight: 'auto' }}>INSPIRATEC</div>
          
          <header className="top-nav" style={{ border: 'none', background: 'transparent' }}>
            <nav style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {navItems.map((item) => {
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
                    className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}
                  >
                    {item.label}
                    {item.badge && <span className="badge">{item.badge}</span>}
                  </NavLink>
                );
              })}

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px', borderLeft: '1px solid #CBD5E1', paddingLeft: '24px' }}>
                <span style={{ fontSize: '15px', color: 'var(--text-main)', fontWeight: '600' }}>
                  {(userProfile?.rol === 'Admin' || (auth.currentUser?.email && auth.currentUser.email.toLowerCase().trim() === 'danieltapiasacosta39@gmail.com')) ? 'Admin' : (userProfile?.rol || 'Docente')}
                </span>
                <button 
                  onClick={() => logoutUser()} 
                  className="nav-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    color: 'var(--text-secondary)', 
                    cursor: 'pointer',
                    fontSize: '15px',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#EF4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  Cerrar Sesión
                </button>
              </div>
            </nav>
          </header>
        </div>
        <main className="main-content">
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
            <Route path="/ayuda" element={<AyudaPage />} />
            <Route path="/administracion" element={<AdministracionPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
