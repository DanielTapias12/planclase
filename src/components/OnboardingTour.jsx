import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import WelcomeModal from './WelcomeModal';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    const handleStartTourEvent = () => {
      localStorage.removeItem('tourCompletado');
      setRun(true);
    };

    window.addEventListener('start-tour', handleStartTourEvent);
    return () => {
      window.removeEventListener('start-tour', handleStartTourEvent);
    };
  }, []);

  const steps = [
    {
      target: '#nav-inicio',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🏠 Inicio (El Creador)</h3>
          <p style={{ margin: 0 }}>Bienvenido a INSPIRATEC. Aquí es donde comienza la magia: el planificador asistido por Inteligencia Artificial.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '#tour-wizard-progress',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📊 4 Fases Pedagógicas</h3>
          <p style={{ margin: 0 }}>El planificador está dividido en cuatro fases críticas: Información básica, Metodología, Estándares y DUA (Inclusión). ¡La IA te guiará en cada paso!</p>
        </div>
      ),
    },
    {
      target: '#tour-wizard-start',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>✍️ Tema de la Clase</h3>
          <p style={{ margin: 0 }}>Simplemente escribe el tema que deseas enseñar hoy. Puede ser algo general o muy específico.</p>
        </div>
      ),
    },
    {
      target: '#tour-wizard-format',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📋 Formato de Salida</h3>
          <p style={{ margin: 0 }}>Elige la estructura que tendrá el documento final. Puedes usar la predeterminada o crear una propia desde Plantillas.</p>
        </div>
      ),
    },
    {
      target: '#tour-wizard-resources',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🎒 Recursos Disponibles</h3>
          <p style={{ margin: 0 }}>¡Muy importante! Dile a la IA con qué recursos cuentas en tu aula. Así las actividades que diseñe serán 100% realistas y aplicables.</p>
        </div>
      ),
    },
    {
      target: '#tour-wizard-next',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>👉 Siguiente</h3>
          <p style={{ margin: 0 }}>Avanza por las fases. Al finalizar, generarás la clase y pasarás al Laboratorio Inteligente (Editor).</p>
        </div>
      ),
    },
    {
      target: '#nav-mis-planes',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🗂️ Tu Bóveda Personal</h3>
          <p style={{ margin: 0 }}>Todas las clases que guardes en el Laboratorio aparecerán aquí. Podrás exportarlas a PDF o Word en cualquier momento.</p>
        </div>
      ),
    },
    {
      target: '#nav-plantillas',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📝 Plantillas</h3>
          <p style={{ margin: 0 }}>Sube el formato oficial de tu colegio (en texto) para que la IA se adapte a tu estilo institucional exacto.</p>
        </div>
      ),
    },
    {
      target: '#nav-mas-recursos',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🌐 La Plaza Pública</h3>
          <p style={{ margin: 0 }}>Aquí encontrarás Experiencias de otros docentes, la Biblioteca comunitaria, el Foro de debate y la sección de Soporte.</p>
        </div>
      ),
    },
    {
      target: '#nav-config',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🔑 Configuración de IA</h3>
          <p style={{ margin: 0 }}>Finalmente, no olvides poner tu API Key de Google Gemini aquí para encender el motor de inteligencia artificial.</p>
        </div>
      ),
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status, action } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status) || action === 'close') {
      setRun(false);
      localStorage.setItem('tourCompletado', 'true');
    }
  };

  return (
    <>
      <WelcomeModal onStartTour={() => setRun(true)} />
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: 'var(--primary-active)',
            zIndex: 10000,
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: 'var(--primary-sage)',
          },
          buttonBack: {
            marginRight: 10,
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
    </>
  );
}
