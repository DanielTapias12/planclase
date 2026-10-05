import React, { useState } from 'react';
import { Joyride, STATUS } from 'react-joyride';
import WelcomeModal from './WelcomeModal';

export default function OnboardingTour() {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: '#nav-inicio',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🏠 Inicio (Creador)</h3>
          <p style={{ margin: 0 }}>Vuelve aquí siempre que quieras crear una nueva secuencia didáctica desde cero con el planificador de IA.</p>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: '#nav-mis-planes',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🗂️ Mis Planes</h3>
          <p style={{ margin: 0 }}>Tu bóveda personal. Aquí puedes ver, organizar y exportar todas las clases que hayas generado a PDF o Word.</p>
        </div>
      ),
    },
    {
      target: '#nav-experiencias',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🌐 Experiencias</h3>
          <p style={{ margin: 0 }}>Una plaza pública donde puedes compartir tus prácticas exitosas y descubrir las de otros docentes del país.</p>
        </div>
      ),
    },
    {
      target: '#nav-biblioteca',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📚 Biblioteca</h3>
          <p style={{ margin: 0 }}>Un repositorio donde encontrarás materiales complementarios, rúbricas y juegos educativos adicionales.</p>
        </div>
      ),
    },
    {
      target: '#nav-plantillas',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>📝 Plantillas</h3>
          <p style={{ margin: 0 }}>¿Tu colegio usa un formato específico? Configúralo aquí para que la IA adapte siempre sus respuestas a tu medida.</p>
        </div>
      ),
    },
    {
      target: '#nav-foro',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>💬 Foro</h3>
          <p style={{ margin: 0 }}>Espacio de debate, colaboración y resolución de dudas con toda la comunidad docente de Inspiratec.</p>
        </div>
      ),
    },
    {
      target: '#nav-soporte',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🎧 Soporte</h3>
          <p style={{ margin: 0 }}>¿Problemas técnicos? Escríbenos aquí y te ayudaremos directamente.</p>
        </div>
      ),
    },
    {
      target: '#nav-ayuda',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>❓ Ayuda</h3>
          <p style={{ margin: 0 }}>Consulta manuales, tutoriales en video y guías detalladas sobre cómo exprimir la plataforma.</p>
        </div>
      ),
    },
    {
      target: '#nav-config',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🔑 API / Config</h3>
          <p style={{ margin: 0 }}>Conecta aquí tu llave de Google Gemini para darle inteligencia a la plataforma. ¡Sin esto, la IA no funcionará!</p>
        </div>
      ),
    },
    {
      target: '#tour-wizard-start',
      content: (
        <div>
          <h3 style={{ margin: '0 0 8px 0', color: 'var(--primary-active)' }}>🪄 Comienza la Magia</h3>
          <p style={{ margin: 0 }}>Selecciona tu Área Curricular, ingresa el tema de tu clase aquí, dale a Siguiente y deja que la IA construya los objetivos, metodologías y materiales. ¡Feliz diseño!</p>
        </div>
      ),
    }
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];
    
    if (finishedStatuses.includes(status)) {
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
