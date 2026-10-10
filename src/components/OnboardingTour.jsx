import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import WelcomeModal from './WelcomeModal';

export default function OnboardingTour() {
  const steps = [
    {
      target: '#nav-inicio',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🏠 Inicio (El Creador)</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Bienvenido a INSPIRATEC. Aquí es donde comienza la magia: el planificador asistido por Inteligencia Artificial.</p>
        </div>
      ),
      disableBeacon: true,
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#tour-wizard-progress',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📊 4 Fases Pedagógicas</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>El planificador está dividido en cuatro fases críticas: Información básica, Metodología, Estándares y DUA (Inclusión). ¡La IA te guiará en cada paso!</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#tour-wizard-start',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>✍️ Tema de la Clase</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Simplemente escribe el tema que deseas enseñar hoy. Puede ser algo general o muy específico.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#tour-wizard-format',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📋 Formato de Salida</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Elige la estructura que tendrá el documento final. Puedes usar la predeterminada o crear una propia desde Plantillas.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#tour-wizard-resources',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🎒 Recursos Disponibles</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>¡Muy importante! Dile a la IA con qué recursos cuentas en tu aula. Así las actividades que diseñe serán 100% realistas y aplicables.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#tour-wizard-next',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>👉 Siguiente</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Avanza por las fases. Al finalizar, generarás la clase y pasarás al Laboratorio Inteligente (Editor).</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#nav-mis-planes',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🗂️ Tu Bóveda Personal</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Todas las clases que guardes en el Laboratorio aparecerán aquí. Podrás exportarlas a PDF o Word en cualquier momento.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#nav-plantillas',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📝 Plantillas</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Sube el formato oficial de tu colegio (en texto) para que la IA se adapte a tu estilo institucional exacto.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#nav-mas-recursos',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🌐 La Plaza Pública</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Aquí encontrarás Experiencias de otros docentes, la Biblioteca comunitaria, el Foro de debate y la sección de Soporte.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    },
    {
      target: '#nav-config',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🔑 Configuración de IA</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Finalmente, no olvides poner tu API Key de Google Gemini aquí para encender el motor de inteligencia artificial.</p>
        </div>
      ),
      disableOverlay: true,
      spotlightClicks: true
    }
  ];

  const [run, setRun] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const handleStartTourEvent = () => {
      localStorage.removeItem('tourCompletado');
      setStepIndex(0);
      setRun(true);
    };

    window.addEventListener('start-tour', handleStartTourEvent);
    return () => {
      window.removeEventListener('start-tour', handleStartTourEvent);
    };
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, action, index, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status) || action === 'close' || type === 'tour:end') {
      setRun(false);
      setStepIndex(0);
      localStorage.setItem('tourCompletado', 'true');
    } else if (type === 'step:after' || type === 'error') {
      setStepIndex(index + (action === 'prev' ? -1 : 1));
    }
  };

  return (
    <>
      <WelcomeModal onStartTour={() => { setStepIndex(0); setRun(true); }} />
      {run && (
        <Joyride
          steps={steps}
          run={run}
          stepIndex={stepIndex}
          continuous={true}
          scrollToFirstStep={true}
          showProgress={true}
          showSkipButton={true}
          showCloseButton={true}
          disableOverlayClose={true}
          disableScrolling={true}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: 'var(--primary-active)',
              textColor: 'var(--text-main)',
              backgroundColor: '#ffffff',
              zIndex: 10000,
              arrowColor: '#ffffff',
              overlayColor: 'rgba(0, 0, 0, 0)',
            },
            tooltip: {
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              padding: '20px',
            },
            tooltipContainer: {
              textAlign: 'left',
            },
            buttonNext: {
              backgroundColor: 'var(--primary-sage)',
              borderRadius: '8px',
              padding: '10px 16px',
              fontWeight: '600',
            },
            buttonBack: {
              marginRight: 10,
              color: 'var(--text-secondary)',
            },
            buttonSkip: {
              color: 'var(--text-secondary)',
              fontWeight: '500',
            }
          }}
          locale={{
            back: 'Atrás',
            close: 'Cerrar',
            last: 'Finalizar',
            next: 'Siguiente',
            skip: 'Saltar tour'
          }}
        />
      )}
    </>
  );
}
