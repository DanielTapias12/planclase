import React, { useState } from 'react';
import { Sparkles, Eye, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * MaterialesGenerablesSection
 * Apartado pedagógico dentro del plan generado que sugiere materiales didácticos adicionales
 * que el docente puede generar bajo demanda.
 * 
 * Regla fundamental:
 * La IA recomienda los materiales; el docente decide cuáles generar. Ningún material se genera automáticamente.
 */
export default function MaterialesGenerablesSection({
  recomendaciones = [],
  onGenerarMaterial,
  isGenerating = false,
  generatingId = null
}) {
  const [descartadas, setDescartadas] = useState([]);

  const recomendacionesActivas = recomendaciones.filter(r => !descartadas.includes(r.id));

  if (!recomendaciones || recomendaciones.length === 0 || recomendacionesActivas.length === 0) {
    return null;
  }

  const handleDescartar = (id, e) => {
    e.stopPropagation();
    setDescartadas(prev => [...prev, id]);
  };

  return (
    <section 
      className="materiales-generables-section"
      style={{
        marginTop: '36px',
        marginBottom: '28px',
        padding: '24px 28px',
        borderRadius: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        border: '1.5px solid rgba(49, 91, 84, 0.22)',
        boxShadow: '0 8px 24px rgba(16, 36, 32, 0.05)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)'
      }}
      aria-labelledby="titulo-materiales-generables"
    >
      {/* Encabezado y descripción oficial requerida */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div 
            style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              backgroundColor: 'rgba(71, 122, 114, 0.16)', 
              color: '#142B25', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Sparkles size={18} />
          </div>
          <h3 
            id="titulo-materiales-generables"
            style={{ 
              margin: 0, 
              fontSize: '19px', 
              fontWeight: 700, 
              color: '#142B25', 
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.01em'
            }}
          >
            Materiales que puedes generar
          </h3>
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#3D5A53' }}>
          A partir de tu plan de clase, puedes crear materiales adicionales para explicar los contenidos, desarrollar las actividades o evaluar los aprendizajes. Selecciona el material que te interese y decide si deseas generarlo.
        </p>
      </div>

      {/* Grid de tarjetas compactas de recomendaciones */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px' 
        }}
      >
        {recomendacionesActivas.map((rec) => {
          const estaGenerando = isGenerating && generatingId === rec.id;

          return (
            <div 
              key={rec.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '18px 20px',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid rgba(49, 91, 84, 0.16)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Cabecera de la tarjeta: Tipo y botón descartar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span 
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '4px 9px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(71, 122, 114, 0.12)',
                      color: '#234B43'
                    }}
                  >
                    {rec.tipo}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDescartar(rec.id, e)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9CA3AF',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#4B5563'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9CA3AF'}
                    title="Descartar sugerencia"
                    aria-label={`Descartar sugerencia ${rec.nombre}`}
                  >
                    <X size={15} />
                  </button>
                </div>

                {/* Nombre del material */}
                <h4 
                  style={{ 
                    margin: '0 0 10px 0', 
                    fontSize: '15px', 
                    fontWeight: 700, 
                    color: '#142B25', 
                    lineHeight: '1.4' 
                  }}
                >
                  {rec.nombre}
                </h4>

                {/* Propósito pedagógico */}
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#315B54', display: 'block', marginBottom: '2px' }}>
                    Propósito pedagógico:
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#4B5563' }}>
                    {rec.proposito}
                  </p>
                </div>

                {/* Relación con el plan */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#315B54', display: 'block', marginBottom: '2px' }}>
                    Relación con el plan:
                  </span>
                  <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.5', color: '#4B5563' }}>
                    {rec.relacionPlan}
                  </p>
                </div>
              </div>

              {/* Acción: Botón Generar material bajo demanda */}
              <div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => onGenerarMaterial(rec)}
                  disabled={isGenerating}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {estaGenerando ? (
                    <>
                      <Loader2 size={14} className="spin" />
                      <span>Generando material...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      <span>Generar material</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
