import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import './BienvenidaNarrativa.css';
import { 
  Lightbulb, 
  X, 
  ChevronUp, 
  ChevronDown, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  FileText, 
  Layers, 
  Library, 
  MessageSquare, 
  HelpCircle, 
  LifeBuoy, 
  Info, 
  Settings 
} from 'lucide-react';

/* ==========================================================================
   CONFIGURACIÓN DE LAS 11 ESCENAS NARRATIVAS
   Correspondencia 1:1 con las imágenes reales de la carpeta Bienvenida
   ========================================================================== */
const SCENES = [
  {
    id: 'inicio',
    image: '/Bienvenida/INICIO.png',
    badge: 'Bienvenida · Visión Editorial',
    icon: <Sparkles size={16} />,
    title: 'Bienvenido a INSPIRATEC',
    description: 'Un ecosistema diseñado para potenciar tu labor docente con serenidad, rigor pedagógico y tecnología reflexiva. Aquí la Inteligencia Artificial actúa como un co-diseñador para ampliar tus ideas, mientras que el criterio educativo, la sensibilidad del aula y la toma de decisiones permanecen siempre en tus manos.',
    canDo: 'Conoce cómo está organizada la plataforma recorriendo este recorrido visual o accede directamente a tu espacio de trabajo.',
    actionLabel: 'Conocer INSPIRATEC',
    actionHint: 'Desplázate hacia abajo o pulsa continuar'
  },
  {
    id: 'planificador',
    image: '/Bienvenida/PLANIFICACION.png',
    badge: 'El Planificador · Creador de Secuencias',
    icon: <Compass size={16} />,
    title: 'Crea secuencias didácticas completas',
    description: 'El núcleo de creación pedagógica de INSPIRATEC. A través de un asistente por pasos, defines el área curricular, grado escolar, estándares MEN, metodologías activas y consideraciones de accesibilidad e inclusión (DUA) para generar una propuesta estructurada.',
    canDo: 'Configura las variables de tu clase y obtén un borrador didáctico detallado listo para revisar y perfeccionar en el editor.',
    actionLabel: 'Siguiente: Mis Planes',
    actionHint: 'Sección central del menú lateral'
  },
  {
    id: 'mis-planes',
    image: '/Bienvenida/MIS_PLANES.png',
    badge: 'Mis Planes · Bóveda Personal',
    icon: <FileText size={16} />,
    title: 'Tu repositorio seguro de planeaciones',
    description: 'Cada secuencia didáctica que diseñas y guardas queda organizada en tu espacio personal en la nube. Puedes retomar borradores, abrir el laboratorio de edición interactiva o compartir tu trabajo cuando lo consideres oportuno.',
    canDo: 'Consulta tus proyectos vigentes, descárgalos en formato Word (.docx) o PDF para tu colegio, o publícalos en la comunidad.',
    actionLabel: 'Siguiente: Plantillas',
    actionHint: 'Archivos disponibles en cualquier momento'
  },
  {
    id: 'plantillas',
    image: '/Bienvenida/PLANTILLAS.png',
    badge: 'Plantillas · Modelos Curriculares',
    icon: <Layers size={16} />,
    title: 'Adapta la estructura al formato de tu colegio',
    description: 'Sabemos que cada institución educativa tiene formatos específicos de planeación. En este apartado puedes explorar modelos pedagógicos probados o diseñar plantillas personalizadas con los campos y secciones que exige tu institución.',
    canDo: 'Transfiere cualquier plantilla directamente al planificador para que la IA organice el contenido según las pautas de tu colegio.',
    actionLabel: 'Siguiente: Biblioteca',
    actionHint: 'Flexibilidad curricular total'
  },
  {
    id: 'biblioteca',
    image: '/Bienvenida/BIBLIOTECA.png',
    badge: 'Biblioteca · Recursos Compartidos',
    icon: <Library size={16} />,
    title: 'Inspírate con la comunidad docente',
    description: 'Un espacio de intercambio abierto donde maestros de distintas instituciones comparten sus mejores propuestas didácticas. Explora proyectos por grado y asignatura para enriquecer tus clases con nuevas perspectivas pedagógicas.',
    canDo: 'Descubre prácticas destacadas, clona planes compartidos a tu cuenta para adaptarlos a tus alumnos o comparte tus propias creaciones.',
    actionLabel: 'Siguiente: Experiencias',
    actionHint: 'Conocimiento educativo abierto'
  },
  {
    id: 'experiencias',
    image: '/Bienvenida/EXPERIENCIA.png',
    badge: 'Experiencias · Bitácora de Aula',
    icon: <BookOpen size={16} />,
    title: 'Sistematiza lo que viviste en clase',
    description: 'La planeación cobra vida cuando entra al salón de clase. Este módulo te acompaña en la reflexión pedagógica posterior: registrar evidencias, documentar qué estrategias funcionaron y qué ajustes imprevistos demandó el grupo.',
    canDo: 'Escribe bitácoras reflexivas de tus secuencias didácticas aplicadas, construyendo memoria pedagógica sobre tu propia práctica docente.',
    actionLabel: 'Siguiente: Foro Docente',
    actionHint: 'Reflexión y mejora continua'
  },
  {
    id: 'foro',
    image: '/Bienvenida/FORO.png',
    badge: 'Foro Docente · Diálogo Colegiado',
    icon: <MessageSquare size={16} />,
    title: 'Pregunta, debate y construye en red',
    description: 'Un canal de comunicación horizontal entre educadores. Plantea preguntas sobre retos de evaluación formativa, metodologías activas, inclusión de estudiantes o recursos digitales y recibe aportes basados en la experiencia real de otros colegas.',
    canDo: 'Participa en debates pedagógicos, comparte dudas cotidianas y colabora activamente en la construcción de soluciones compartidas.',
    actionLabel: 'Siguiente: Ayuda y Guías',
    actionHint: 'Comunidad docente activa'
  },
  {
    id: 'ayuda',
    image: '/Bienvenida/AYUDA.png',
    badge: 'Ayuda y Guías · Orientación al Usuario',
    icon: <HelpCircle size={16} />,
    title: 'Respuestas claras para cada etapa',
    description: 'Si tienes dudas sobre cómo formular mejores indicaciones para la IA, cómo exportar documentos limpios o cómo gestionar tus plantillas, el Centro de Ayuda reúne respuestas concisas y guías directas sin tecnicismos.',
    canDo: 'Consulta preguntas frecuentes resueltas paso a paso y vuelve a abrir este recorrido de bienvenida cuando lo necesites.',
    actionLabel: 'Siguiente: Soporte Técnico',
    actionHint: 'Documentación al servicio del docente'
  },
  {
    id: 'soporte',
    image: '/Bienvenida/SOPORTE.png',
    badge: 'Soporte Técnico · Acompañamiento',
    icon: <LifeBuoy size={16} />,
    title: 'Asistencia ante cualquier inquietud',
    description: 'Si experimentas algún fallo técnico, requieres ayuda con tu cuenta o deseas sugerir una nueva funcionalidad para INSPIRATEC, nuestro equipo está a tu disposición para escucharte y resolver tus consultas con celeridad.',
    canDo: 'Envía solicitudes directas de soporte técnico y comparte tus comentarios para seguir perfeccionando la plataforma.',
    actionLabel: 'Siguiente: Acerca de',
    actionHint: 'Canal directo de contacto'
  },
  {
    id: 'acerca',
    image: '/Bienvenida/ACERCA.png',
    badge: 'Acerca de · Propósito Institucional',
    icon: <Info size={16} />,
    title: 'Compromiso con la docencia y la innovación',
    description: 'INSPIRATEC nace con la convicción de que la tecnología debe aligerar la carga operativa del maestro para devolverle tiempo al diseño pedagógico significativo. Creemos en una educación rigurosa, humanista, ética y con propósito social.',
    canDo: 'Conoce los fundamentos pedagógicos y el equipo detrás de la iniciativa, concebida para la realidad educativa actual.',
    actionLabel: 'Siguiente: Configuración IA',
    actionHint: 'Identidad y valores de INSPIRATEC'
  },
  {
    id: 'configuracion_ia',
    image: '/Bienvenida/CONFIGURACION_IA.png',
    badge: 'Configuración IA · Motor Gemini',
    icon: <Settings size={16} />,
    title: 'Tu motor inteligente, bajo tu control',
    description: 'La inteligencia artificial de INSPIRATEC opera mediante la API de Google Gemini (Gemini 1.5 Pro / Flash). Al utilizar tu propia clave de acceso, tus consultas son directas, privadas y seguras, guardándose de forma cifrada en tu cuenta.',
    canDo: 'Ingresa tu API Key de Gemini en Configuración para activar la generación inteligente de secuencias didácticas y recursos complementarios.',
    actionLabel: 'Ir a Inicio',
    actionHint: 'Configuración disponible en la barra superior'
  }
];

export default function BienvenidaNarrativa() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAppStore();

  const [isOpen, setIsOpen] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const containerRef = useRef(null);

  // Comprobar si la bienvenida debe mostrarse en la primera visita a /home
  useEffect(() => {
    if (!userId) return;

    const storageKey = `inspiratec_bienvenida_completada_${userId}`;
    const alreadyCompleted = localStorage.getItem(storageKey);

    // Si el usuario está en /home y aún no ha visto la bienvenida, abrirla automáticamente
    if (location.pathname === '/home' && !alreadyCompleted) {
      setIsOpen(true);
    }
  }, [userId, location.pathname]);

  // Manejar evento global para reapertura manual (desde Ayuda o Menú)
  useEffect(() => {
    const handleManualOpen = () => {
      setCurrentScene(0);
      setIsOpen(true);
      if (location.pathname !== '/home') {
        navigate('/home');
      }
    };

    window.addEventListener('open-bienvenida', handleManualOpen);
    return () => {
      window.removeEventListener('open-bienvenida', handleManualOpen);
    };
  }, [location.pathname, navigate]);

  // Si no está abierta o no estamos en /home, no renderizar nada
  const isVisible = isOpen && location.pathname === '/home';

  // Registrar finalización y cerrar la experiencia
  const handleCompleteAndClose = useCallback(() => {
    if (userId) {
      localStorage.setItem(`inspiratec_bienvenida_completada_${userId}`, 'true');
    }
    setIsOpen(false);
  }, [userId]);

  // Navegar a una escena específica con scroll suave
  const scrollToScene = useCallback((index) => {
    if (!containerRef.current) return;
    const targetIndex = Math.max(0, Math.min(index, SCENES.length - 1));
    const targetElement = containerRef.current.children[targetIndex];
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentScene(targetIndex);
    }
  }, []);

  // Detectar el índice de la escena activa según la posición de scroll
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    const height = containerRef.current.clientHeight || window.innerHeight;
    const newIndex = Math.round(scrollTop / height);
    if (newIndex !== currentScene && newIndex >= 0 && newIndex < SCENES.length) {
      setCurrentScene(newIndex);
    }
  }, [currentScene]);

  // Teclas de dirección (flecha arriba / flecha abajo)
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToScene(currentScene + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToScene(currentScene - 1);
      } else if (e.key === 'Escape') {
        handleCompleteAndClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, currentScene, scrollToScene, handleCompleteAndClose]);

  if (!isVisible) return null;

  return (
    <div 
      className="bienvenida-narrative-root" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Bienvenida explicativa INSPIRATEC"
    >
      {/* Barra superior fija y discreta */}
      <header className="bienvenida-top-header">
        <div className="bienvenida-top-brand">
          <Lightbulb size={18} color="#8ec3b7" />
          <span className="bienvenida-top-brand-title">INSPIRATEC</span>
          <span className="bienvenida-top-brand-sub">Guía de Bienvenida</span>
        </div>

        <button 
          type="button" 
          className="bienvenida-btn-close-top"
          onClick={handleCompleteAndClose}
          aria-label="Cerrar bienvenida e ir a Inicio"
          title="Cerrar e ir a Inicio"
        >
          <X size={18} />
        </button>
      </header>

      {/* Riel discreto de navegación lateral izquierda */}
      <nav className="bienvenida-rail-dots" aria-label="Progreso de escenas">
        {SCENES.map((scene, idx) => (
          <button
            key={scene.id}
            type="button"
            className={`bienvenida-rail-dot ${idx === currentScene ? 'active' : ''}`}
            onClick={() => scrollToScene(idx)}
            aria-label={`Ir a escena ${idx + 1}: ${scene.title}`}
            title={`Escena ${idx + 1}: ${scene.title}`}
          />
        ))}
      </nav>

      {/* Contenedor central con scroll vertical suave */}
      <main 
        ref={containerRef} 
        className="bienvenida-scroll-container" 
        onScroll={handleScroll}
      >
        {SCENES.map((scene, index) => {
          const isLast = index === SCENES.length - 1;

          return (
            <section 
              key={scene.id} 
              id={`bienvenida-scene-${scene.id}`}
              className="bienvenida-scene-section"
              aria-label={`Escena ${index + 1}: ${scene.title}`}
            >
              {/* Imagen de fondo a pantalla completa */}
              <div 
                className="bienvenida-scene-bg" 
                style={{ backgroundImage: `url("${scene.image}")` }}
                aria-hidden="true"
              />

              {/* Capa de contraste con degradado sutil */}
              <div className="bienvenida-scene-overlay" aria-hidden="true" />

              {/* Contenido editorial en tarjeta de cristal */}
              <div className="bienvenida-scene-content-wrapper">
                <article className="bienvenida-editorial-card">
                  {/* Encabezado con badge e índice */}
                  <div className="bienvenida-card-header">
                    <span className="bienvenida-badge">
                      {scene.icon}
                      <span>{scene.badge}</span>
                    </span>
                    <span className="bienvenida-scene-indicator-pill">
                      {String(index + 1).padStart(2, '0')} / {String(SCENES.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Título de la escena */}
                  <h2 className="bienvenida-card-title">
                    {scene.title}
                  </h2>

                  {/* Párrafo explicativo */}
                  <p className="bienvenida-card-description">
                    {scene.description}
                  </p>

                  {/* Qué puedes hacer aquí */}
                  <div className="bienvenida-action-box">
                    <CheckCircle2 size={18} className="bienvenida-action-box-icon" />
                    <p className="bienvenida-action-box-text">
                      <strong>Qué puedes hacer: </strong>
                      {scene.canDo}
                    </p>
                  </div>

                  {/* Acciones al pie de la tarjeta */}
                  <footer className="bienvenida-card-footer">
                    {isLast ? (
                      <button 
                        type="button" 
                        className="bienvenida-btn-final-primary"
                        onClick={handleCompleteAndClose}
                      >
                        <span>{scene.actionLabel}</span>
                        <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        type="button" 
                        className="bienvenida-btn-step"
                        onClick={() => scrollToScene(index + 1)}
                      >
                        <span>{scene.actionLabel}</span>
                        <ArrowRight size={16} />
                      </button>
                    )}

                    <span className="bienvenida-hint-scroll">
                      {scene.actionHint}
                    </span>
                  </footer>
                </article>
              </div>
            </section>
          );
        })}
      </main>

      {/* Cápsula de controles flotante en la esquina inferior derecha */}
      <aside className="bienvenida-floating-controls" aria-label="Controles de la presentación">
        {/* Flechas de navegación previa y siguiente */}
        <div className="bienvenida-nav-arrows">
          <button 
            type="button" 
            className="bienvenida-control-btn-icon"
            onClick={() => scrollToScene(currentScene - 1)}
            disabled={currentScene === 0}
            aria-label="Escena anterior"
            title="Escena anterior"
          >
            <ChevronUp size={18} />
          </button>

          <button 
            type="button" 
            className="bienvenida-control-btn-icon"
            onClick={() => scrollToScene(currentScene + 1)}
            disabled={currentScene === SCENES.length - 1}
            aria-label="Escena siguiente"
            title="Escena siguiente"
          >
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Indicador numérico de progreso */}
        <div className="bienvenida-controls-progress">
          <strong>{String(currentScene + 1).padStart(2, '0')}</strong>
          <span>/</span>
          <span>{String(SCENES.length).padStart(2, '0')}</span>
        </div>

        <div className="bienvenida-controls-divider" />

        {/* Botón «Explorar por mi cuenta» o «Ir a Inicio» */}
        {currentScene === SCENES.length - 1 ? (
          <button 
            type="button" 
            className="bienvenida-btn-finish-capsule"
            onClick={handleCompleteAndClose}
          >
            <span>Ir a Inicio</span>
            <CheckCircle2 size={15} />
          </button>
        ) : (
          <button 
            type="button" 
            className="bienvenida-btn-skip"
            onClick={handleCompleteAndClose}
            title="Cerrar la bienvenida y acceder al espacio de trabajo"
          >
            Explorar por mi cuenta
          </button>
        )}
      </aside>
    </div>
  );
}
