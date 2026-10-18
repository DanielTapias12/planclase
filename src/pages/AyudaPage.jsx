import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  Sparkles, 
  BookOpen, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  LifeBuoy, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function AyudaPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState(0);

  const preguntas = [
    { 
      q: "¿Cómo genero mi primer plan de clase?", 
      a: "Accede al Planificador de Clases desde el menú lateral. El asistente te guiará en 4 fases: información básica (tema y materia), metodología pedagógica, estándares curriculares del MEN y consideraciones DUA. Finalmente, pulsa 'Generar Clase' y el co-docente de IA estructurará la secuencia didáctica completa.",
      categoria: "Planificación",
      icon: <Sparkles size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Cómo guardo, descargo y comparto mis secuencias?", 
      a: "Desde el Editor interactivo puedes pulsar 'Guardar en la nube' en cualquier momento. Tu planeación quedará registrada en 'Mis Planes', donde tendrás opciones para descargarla en formato Word (.docx), PDF oficial o transferirla a la Biblioteca Comunitaria para inspirar a otros maestros.",
      categoria: "Almacenamiento",
      icon: <FileText size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Qué son las plantillas y para qué sirven?", 
      a: "Las plantillas te permiten estandarizar la estructura didáctica de tus clases (Momentos de Inicio, Desarrollo, Cierre, Criterios de Evaluación y DUA). Al seleccionar una plantilla en el planificador, la IA organizará la respuesta respetando estrictamente el formato institucional de tu colegio.",
      categoria: "Plantillas",
      icon: <BookOpen size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Qué son los ajustes razonables y el enfoque DUA?", 
      a: "El Diseño Universal para el Aprendizaje (DUA) garantiza que la enseñanza ofrezca múltiples formas de representación, expresión e implicación. INSPIRATEC incorpora sugerencias automáticas para estudiantes con barreras visuales, auditivas, motoras o requerimientos del PIAR institucional.",
      categoria: "Inclusión DUA",
      icon: <Compass size={16} color="var(--primary-sage)" />
    },
    { 
      q: "¿Cómo configuro mi propia clave de Inteligencia Artificial (BYOK)?", 
      a: "En la barra superior pulsa en 'Configuración IA' (o en la sección de Herramientas). Allí puedes pegar tu clave API de Google Gemini gratuita. Tu clave se almacena de forma segura y cifrada exclusivamente en tu navegador, garantizando total privacidad.",
      categoria: "Configuración",
      icon: <CheckCircle2 size={16} color="var(--primary-sage)" />
    }
  ];

  const filteredPreguntas = preguntas.filter(p => 
    p.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.a.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mgmt-container" style={{ maxWidth: '960px', width: '100%', margin: '0 auto', padding: '24px clamp(16px, 3.5vw, 28px) 52px', boxSizing: 'border-box' }}>
      
      {/* Cabecera Editorial Institucional (Mismo desenfoque y panel de cristal de Inicio) */}
      <header 
        className="mgmt-header"
        style={{
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          padding: '22px 28px',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div className="mgmt-header-info">
          <div className="mgmt-header-icon" style={{ backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630', borderRadius: '16px', width: '54px', height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HelpCircle size={28} />
          </div>
          <div>
            <div className="editorial-badge">
              <Sparkles size={13} color="#2B524A" />
              <span>Base de Conocimiento y Guías</span>
            </div>
            <h1 className="mgmt-title" style={{ fontSize: '34px', fontFamily: 'var(--font-heading)', color: '#142B25', margin: '0 0 12px 0', fontWeight: 700, letterSpacing: '-0.015em', lineHeight: '1.25' }}>
              Centro de Ayuda Pedagógica
            </h1>
            <p className="mgmt-subtitle" style={{ fontSize: '15.5px', color: '#243630', maxWidth: '720px', margin: 0, lineHeight: '1.65', fontWeight: 500 }}>
              Resuelve tus dudas sobre el asistente de secuencias didácticas, plantillas curriculares y adaptaciones de aula con IA.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{preguntas.length} Guías Oficiales</span>
          </div>
          <div className="mgmt-stat-pill">
            <LifeBuoy size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>Soporte Disponible</span>
          </div>
        </div>
      </header>

      {/* Barra de Búsqueda de Cristal (Mismo desenfoque) */}
      <div 
        className="mgmt-filter-bar" 
        style={{ 
          backgroundColor: 'rgba(255, 254, 250, 0.86)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '18px',
          padding: '12px 18px',
          marginBottom: '26px',
          boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
        }}
      >
        <div className="mgmt-search-box" style={{ maxWidth: '100%' }}>
          <Search size={16} color="var(--primary-sage)" />
          <input 
            type="text" 
            placeholder="Buscar por tema: DUA, plantillas, descargar Word, generar clase..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mgmt-search-input"
            aria-label="Buscar en las guías y preguntas"
          />
        </div>
      </div>

      {/* Lista de Preguntas Frecuentes en Tarjetas de Cristal */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
        {filteredPreguntas.length === 0 ? (
          <div 
            className="mgmt-empty-card"
            style={{
              backgroundColor: 'rgba(255, 254, 250, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.94)',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
            }}
          >
            <HelpCircle size={36} color="var(--primary-sage)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '17px', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700 }}>No se encontraron respuestas</h3>
            <p style={{ fontSize: '14px', color: '#2B453E', margin: 0 }}>
              Prueba con otro término de búsqueda o contacta directamente a nuestro soporte técnico.
            </p>
          </div>
        ) : (
          filteredPreguntas.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <div 
                key={index} 
                className="mgmt-card" 
                style={{ 
                  padding: '22px 26px',
                  cursor: 'pointer',
                  borderRadius: '20px',
                  border: isExpanded ? '1px solid #142B25' : '1px solid rgba(255, 255, 255, 0.94)',
                  backgroundColor: isExpanded ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 254, 250, 0.88)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  boxShadow: isExpanded ? '0 10px 30px rgba(16, 36, 32, 0.12)' : '0 6px 20px rgba(16, 36, 32, 0.06)',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(71, 122, 114, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#183630', backgroundColor: 'rgba(71, 122, 114, 0.14)', padding: '2px 8px', borderRadius: '999px', marginRight: '8px' }}>
                        {item.categoria}
                      </span>
                      <h3 style={{ fontSize: '16px', color: '#142B25', margin: '6px 0 0 0', fontWeight: 700 }}>
                        {item.q}
                      </h3>
                    </div>
                  </div>
                  <div style={{ color: '#183630', flexShrink: 0 }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(49, 91, 84, 0.14)', color: '#243B34', fontSize: '14.5px', lineHeight: '1.65' }}>
                    <p style={{ margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Tarjeta Flotante: Recorrido Explicativo de Bienvenida (Mismo desenfoque de cristal) */}
      <div 
        className="mgmt-card" 
        style={{ 
          padding: '32px 36px', 
          textAlign: 'center', 
          marginBottom: '20px',
          backgroundColor: 'rgba(255, 254, 250, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '24px',
          boxShadow: '0 12px 36px rgba(16, 36, 32, 0.10)'
        }}
      >
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
          <Sparkles size={24} />
        </div>
        <h3 style={{ color: '#142B25', fontSize: '19px', fontWeight: 700, margin: '0 0 8px 0' }}>
          Recorrido Explicativo de Bienvenida
        </h3>
        <p style={{ color: '#2B453E', fontSize: '14.5px', maxWidth: '580px', margin: '0 auto 20px', lineHeight: '1.6' }}>
          Revive la presentación visual e interactiva sobre la organización, herramientas curriculares y filosofía educativa de INSPIRATEC.
        </p>
        <button 
          type="button"
          className="btn btn-primary" 
          onClick={() => {
            navigate('/home');
            setTimeout(() => window.dispatchEvent(new Event('open-bienvenida')), 100);
          }}
          style={{ padding: '10px 24px', fontSize: '14px' }}
        >
          Ver Bienvenida Interactiva
        </button>
      </div>

      {/* Tarjeta Flotante: Contacto a Soporte (Mismo desenfoque de cristal) */}
      <div 
        className="mgmt-card" 
        style={{ 
          padding: '28px 32px', 
          textAlign: 'center', 
          backgroundColor: 'rgba(255, 254, 250, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.94)',
          borderRadius: '24px',
          boxShadow: '0 10px 30px rgba(16, 36, 32, 0.08)'
        }}
      >
        <h3 style={{ fontSize: '17px', color: '#142B25', margin: '0 0 6px 0', fontWeight: 700 }}>
          ¿Aún necesitas ayuda o reportar un caso?
        </h3>
        <p style={{ color: '#3A544C', fontSize: '14px', margin: '0 0 16px 0' }}>
          Nuestro equipo técnico docente está disponible para orientarte en la configuración y uso de la plataforma.
        </p>
        <button 
          type="button"
          className="btn-outline" 
          onClick={() => navigate('/soporte')}
          style={{ padding: '9px 22px', fontSize: '14px' }}
        >
          <LifeBuoy size={16} /> Contactar a Soporte Técnico
        </button>
      </div>

    </div>
  );
}
