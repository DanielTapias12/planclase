import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getPlantillas } from '../services/dbService';
import { GENERIC_TEMPLATES, getTemplateStructureSummary } from '../services/templates/genericTemplates';
import { 
  Sparkles, 
  PlusCircle, 
  ArrowRight, 
  BookOpen, 
  Settings, 
  FileText, 
  AlertTriangle,
  Layers,
  Dna
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { 
    userProfile, 
    apiKey, 
    planesCount, 
    userId, 
    misPlantillas, 
    setMisPlantillas, 
    updateWizardData,
    clearWizardFormOnly
  } = useAppStore();

  useEffect(() => {
    if (!userId) return;
    const getOfficialDefaults = () => GENERIC_TEMPLATES.map((gt) => ({
      id: gt.id,
      titulo: gt.titulo,
      formato: gt.formato || 'Estructura predeterminada',
      publico: true,
      area: gt.area,
      subtitulo: gt.subtitulo,
      instrucciones: getTemplateStructureSummary(gt)
    }));

    if (misPlantillas && misPlantillas.length > 0) return;

    getPlantillas(userId)
      .then((fetched) => {
        setMisPlantillas([...getOfficialDefaults(), ...fetched]);
      })
      .catch((e) => console.error('Error cargando plantillas en HomePage:', e));
  }, [userId, misPlantillas, setMisPlantillas]);

  const plantillasDisponibles = (misPlantillas && misPlantillas.length > 0)
    ? misPlantillas
    : GENERIC_TEMPLATES.map((gt) => ({
        id: gt.id,
        titulo: gt.titulo,
        formato: gt.formato || 'Estructura predeterminada',
        publico: true,
        area: gt.area,
        subtitulo: gt.subtitulo,
        instrucciones: getTemplateStructureSummary(gt)
      }));

  const handleUsarPlantilla = (tpl) => {
    clearWizardFormOnly();
    const isGeneric = GENERIC_TEMPLATES.some(gt => gt.titulo === tpl.titulo || gt.id === tpl.id);
    const updates = { 
      formato: tpl.titulo,
      formatoInstrucciones: isGeneric ? '' : (tpl.instrucciones || '')
    };
    if (tpl.area) {
      updates.materia = tpl.area;
      updates.recursos = '';
    }
    updateWizardData(updates);
    navigate('/');
  };

  return (
    <div className="home-full-immersive-view">
      <div className="home-content-container" style={{ maxWidth: '1060px', margin: '0 auto', padding: '16px clamp(16px, 2.5vw, 24px) 36px' }}>
        
        {/* 1 y 2. Panel Editorial de Bienvenida y Acciones Principales */}
        <section 
          className="home-editorial-welcome-panel"
          style={{
            backgroundColor: 'rgba(255, 254, 250, 0.86)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '18px',
            padding: '18px 24px',
            marginBottom: '12px',
            boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
          }}
        >
          {/* Badge institucional */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '4px 12px', 
            backgroundColor: 'rgba(71, 122, 114, 0.14)', 
            borderRadius: '999px', 
            color: '#1C3A34', 
            fontSize: '11px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: '10px'
          }}>
            <Sparkles size={13} color="#2B524A" />
            Espacio Curricular Docente
          </div>

          {/* Título de bienvenida */}
          <h1 style={{ 
            fontSize: '28px', 
            fontFamily: 'var(--font-heading)', 
            color: '#142B25', 
            margin: '0 0 8px 0',
            fontWeight: 700,
            letterSpacing: '-0.015em',
            lineHeight: '1.25'
          }}>
            Bienvenido, {userProfile?.nombre || 'Docente'}
          </h1>

          {/* Descripción editorial */}
          <p style={{ 
            color: '#243630', 
            fontSize: '14.5px', 
            maxWidth: '720px', 
            margin: '0 0 16px 0',
            lineHeight: '1.55',
            fontWeight: 500
          }}>
            Diseña secuencias didácticas fundamentadas, rigurosas y adaptadas a tu contexto escolar con el soporte de inteligencia artificial pedagógica y principios DUA.
          </p>

          {/* Acciones principales */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              type="button"
              className="btn btn-primary"
              style={{ 
                fontSize: '14.5px', 
                padding: '12px 24px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '9px',
                fontWeight: 600,
                backgroundColor: '#183630',
                color: '#FFFFFF',
                borderRadius: '10px',
                border: 'none',
                boxShadow: '0 4px 14px rgba(20, 42, 38, 0.22)',
                cursor: 'pointer'
              }}
              onClick={() => {
                clearWizardFormOnly();
                navigate('/');
              }}
            >
              <PlusCircle size={18} /> Iniciar Planificador de Clases
            </button>

            <button 
              type="button"
              className="btn btn-secondary"
              style={{ 
                fontSize: '14.5px', 
                padding: '12px 22px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                fontWeight: 600,
                backgroundColor: 'rgba(255, 255, 255, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                color: '#183630',
                border: '1px solid rgba(49, 91, 84, 0.35)',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/plantillas')}
            >
              <BookOpen size={16} /> Ver Plantillas Curriculares
            </button>
          </div>

          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 12px', borderRadius: '999px', backgroundColor: 'rgba(22, 163, 74, 0.12)', border: '1px solid rgba(22, 163, 74, 0.25)', fontSize: '11.5px', color: '#166534', fontWeight: 600 }}>
              <Dna size={13} style={{ color: '#16A34A' }} />
              <span>
                Metodología Institucional:{' '}
                <strong style={{ color: '#142B25' }}>{userProfile?.metodologiaInstitucional || 'Aprendizaje Basado en Proyectos (ABP)'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event('open-calibracion-docente'))}
              style={{
                background: 'none',
                border: 'none',
                color: '#166534',
                fontSize: '11.5px',
                fontWeight: 700,
                textDecoration: 'underline',
                cursor: 'pointer',
                padding: '2px 4px'
              }}
              title="Actualizar la metodología institucional o proyecto transversal de tu colegio"
            >
              Calibrar / Cambiar
            </button>
          </div>

          {!apiKey && (
            <div style={{ 
              marginTop: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '12px', 
              color: 'var(--color-state-warning)', 
              backgroundColor: 'rgba(234, 88, 12, 0.08)', 
              padding: '7px 12px', 
              borderRadius: '8px',
              border: '1px solid rgba(234, 88, 12, 0.2)'
            }}>
              <AlertTriangle size={14} style={{ flexShrink: 0 }} />
              <span>
                Para activar la asistencia automatizada de IA, registra tu clave en{' '}
                <button 
                  type="button" 
                  onClick={() => navigate('/config')} 
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit', 
                    fontWeight: '700', 
                    textDecoration: 'underline', 
                    cursor: 'pointer', 
                    padding: 0 
                  }}
                >
                  Configuración de IA
                </button>.
              </span>
            </div>
          )}
        </section>

        {/* 3. Indicadores semitransparentes de estado */}
        <section 
          className="home-metrics-grid"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '12px', 
            marginBottom: '12px' 
          }}
        >
          {/* Métrica: Planes Guardados */}
          <div 
            onClick={() => navigate('/mis-planes')}
            style={{ 
              backgroundColor: 'rgba(255, 254, 250, 0.88)', 
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              padding: '14px 20px', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.94)', 
              boxShadow: '0 6px 18px rgba(16, 36, 32, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            title="Ver todos mis planes guardados"
          >
            <div>
              <p style={{ 
                margin: '0 0 4px 0', 
                fontSize: '11px', 
                fontWeight: '700', 
                color: '#435750', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em' 
              }}>
                Mis Planes Guardados
              </p>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#142B25', 
                fontFamily: 'var(--font-heading)',
                lineHeight: 1
              }}>
                {planesCount || 0}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#275249', fontWeight: 600 }}>
                Explorar historial curricular &rarr;
              </p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(71, 122, 114, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#275249'
            }}>
              <FileText size={18} />
            </div>
          </div>

          {/* Estado: Servicio de IA */}
          <div 
            onClick={() => navigate('/config')}
            style={{ 
              backgroundColor: 'rgba(255, 254, 250, 0.88)', 
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              padding: '14px 20px', 
              borderRadius: '16px', 
              border: '1px solid rgba(255, 255, 255, 0.94)', 
              boxShadow: '0 6px 18px rgba(16, 36, 32, 0.06)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
            title="Gestionar configuración del modelo de lenguaje"
          >
            <div>
              <p style={{ 
                margin: '0 0 4px 0', 
                fontSize: '11px', 
                fontWeight: '700', 
                color: '#435750', 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em' 
              }}>
                Asistente Pedagógico (Gemini)
              </p>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: apiKey ? 'var(--color-state-success)' : 'var(--color-state-warning)', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  borderRadius: '50%', 
                  backgroundColor: apiKey ? 'var(--color-state-success)' : 'var(--color-state-warning)',
                  display: 'inline-block' 
                }} />
                {apiKey ? 'Servicio activo y verificado' : 'Configuración de clave requerida'}
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '12.5px', color: '#275249', fontWeight: 600 }}>
                Administrar credenciales y modelo &rarr;
              </p>
            </div>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '10px', 
              backgroundColor: 'rgba(71, 122, 114, 0.12)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#275249'
            }}>
              <Settings size={18} />
            </div>
          </div>
        </section>

        {/* 4. Modelos de Secuencia Curricular */}
        <section 
          className="home-models-container"
          style={{
            backgroundColor: 'rgba(255, 254, 250, 0.86)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.94)',
            borderRadius: '20px',
            padding: '20px 24px',
            boxShadow: '0 8px 24px rgba(16, 36, 32, 0.08)'
          }}
        >
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-end', 
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <h2 style={{ 
                fontSize: '20px', 
                fontFamily: 'var(--font-heading)', 
                color: 'var(--color-brand-active)', 
                margin: '0 0 4px 0',
                fontWeight: 700
              }}>
                Modelos de Secuencia Curricular
              </h2>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: 0 }}>
                Estructuras pedagógicas reales listas para transferir al planificador.
              </p>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary" 
              style={{ 
                padding: '7px 14px', 
                fontSize: '13px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '6px' 
              }}
              onClick={() => navigate('/plantillas')}
            >
              Gestionar plantillas <ArrowRight size={14} />
            </button>
          </div>

          {plantillasDisponibles.length === 0 ? (
            <div style={{ 
              backgroundColor: 'var(--color-surface-base)',
              border: '1px dashed var(--color-border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '28px 20px',
              textAlign: 'center'
            }}>
              <Layers size={28} style={{ color: 'var(--color-text-muted)', marginBottom: '8px' }} />
              <h3 style={{ fontSize: '15px', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                No hay plantillas curriculares adicionales
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', margin: '0 0 12px 0', maxWidth: '460px', marginLeft: 'auto', marginRight: 'auto' }}>
                Puedes crear estructuras personalizadas o importar modelos en la sección de Plantillas.
              </p>
              <button 
                type="button" 
                className="btn btn-primary"
                style={{ fontSize: '13px', padding: '7px 14px' }}
                onClick={() => navigate('/plantillas')}
              >
                Ir a Plantillas
              </button>
            </div>
          ) : (
            <div 
              className="home-models-grid"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                gap: '12px' 
              }}
            >
              {plantillasDisponibles.slice(0, 6).map((tpl) => (
                <div 
                  key={tpl.id || tpl.titulo} 
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '22px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(16, 36, 32, 0.06)'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.80)';
                    e.currentTarget.style.boxShadow = '0 6px 18px rgba(20, 42, 38, 0.07)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.58)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(20, 42, 38, 0.04)';
                  }}
                  onClick={() => handleUsarPlantilla(tpl)}
                  className="editorial-model-card"
                  title={`Usar estructura: ${tpl.titulo}`}
                >
                  <div>
                    <span style={{ 
                      display: 'inline-block', 
                      fontSize: '11px', 
                      fontWeight: '700', 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.06em', 
                      color: 'var(--color-brand-primary)', 
                      backgroundColor: 'var(--color-brand-soft)', 
                      padding: '3px 8px', 
                      borderRadius: '4px', 
                      marginBottom: '12px' 
                    }}>
                      {tpl.formato || (tpl.publico ? 'Pública' : 'Personalizada')}
                    </span>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '700', 
                      color: 'var(--color-text-primary)', 
                      margin: '0 0 8px 0', 
                      lineHeight: '1.4' 
                    }}>
                      {tpl.titulo}
                    </h3>
                    {tpl.instrucciones ? (
                      <p style={{ 
                        color: 'var(--color-text-secondary)', 
                        fontSize: '13px', 
                        lineHeight: '1.5', 
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {tpl.instrucciones}
                      </p>
                    ) : (
                      <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', margin: 0, fontStyle: 'italic' }}>
                        Estructura estándar oficial con fases didácticas completas y adaptaciones DUA.
                      </p>
                    )}
                  </div>
                  <div style={{ 
                    marginTop: '18px', 
                    paddingTop: '12px', 
                    borderTop: '1px solid var(--color-border-subtle)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    fontSize: '13px', 
                    color: 'var(--color-brand-active)', 
                    fontWeight: '600' 
                  }}>
                    <span>Transferir al planificador</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}


