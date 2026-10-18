import React, { useState } from 'react';
import { Sparkles, Eye, X, Loader2, CheckCircle2, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { isMaterialAnexado, getAnexadoMatch } from '../utils/materialRecommender';

/**
 * MaterialesGenerablesSection
 * Apartado pedagógico dentro del plan generado que presenta el catálogo integral de
 * materiales didácticos adaptados al plan que el docente puede generar bajo demanda.
 * 
 * Reglas esenciales:
 * 1. Todos los materiales se presentan en general y se adaptan al contexto del plan.
 * 2. Si un material ya fue generado y anexado, NO se puede volver a generar en el mismo plan.
 * 3. Permite abrir y consultar directamente los recursos que ya están anexados.
 */
export default function MaterialesGenerablesSection({
  recomendaciones = [],
  onGenerarMaterial,
  isGenerating = false,
  generatingId = null,
  recursosAnexos = [],
  onVerMaterial
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
      {/* Encabezado y descripción pedagógica */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              Materiales didácticos para tu clase
            </h3>
          </div>

          {recursosAnexos && recursosAnexos.length > 0 && (
            <span 
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#03543F',
                backgroundColor: '#DEF7EC',
                border: '1px solid #31C48D',
                padding: '3px 10px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <CheckCircle2 size={13} />
              {recursosAnexos.length} {recursosAnexos.length === 1 ? 'material anexado' : 'materiales anexados'}
            </span>
          )}
        </div>
        <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: '#3D5A53' }}>
          A partir de tu plan de clase, puedes crear materiales didácticos interactivos adaptados a los momentos de la sesión. Una vez generado y anexado un material a este plan, queda guardado y no se volverá a duplicar.
        </p>
      </div>

      {/* Grid de tarjetas de materiales didácticos */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', 
          gap: '16px' 
        }}
      >
        {recomendacionesActivas.map((rec) => {
          const estaGenerando = isGenerating && generatingId === rec.id;
          const yaAnexado = isMaterialAnexado(rec, recursosAnexos);
          const recursoAnexado = yaAnexado ? getAnexadoMatch(rec, recursosAnexos) : null;

          return (
            <div 
              key={rec.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: yaAnexado ? 'rgba(240, 246, 243, 0.95)' : '#FFFFFF',
                border: yaAnexado ? '1.5px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(49, 91, 84, 0.16)',
                boxShadow: yaAnexado ? '0 2px 10px rgba(16, 185, 129, 0.08)' : '0 2px 8px rgba(0, 0, 0, 0.03)',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              <div>
                {/* Cabecera de la tarjeta: Tipo, estado de anexo y botón descartar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span 
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        backgroundColor: yaAnexado ? 'rgba(16, 185, 129, 0.14)' : 'rgba(71, 122, 114, 0.12)',
                        color: yaAnexado ? '#065F46' : '#234B43'
                      }}
                    >
                      {rec.tipo}
                    </span>

                    {yaAnexado && (
                      <span 
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 7px',
                          borderRadius: '6px',
                          backgroundColor: '#DEF7EC',
                          color: '#03543F',
                          border: '1px solid #31C48D',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <CheckCircle2 size={11} />
                        Anexado
                      </span>
                    )}
                  </div>

                  {!yaAnexado && (
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
                      title="Descartar esta sugerencia"
                      aria-label={`Descartar sugerencia ${rec.nombre}`}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {/* Nombre del material adaptado */}
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
                  <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.5', color: '#4B5563' }}>
                    {rec.proposito}
                  </p>
                </div>

                {/* Relación con el plan */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#315B54', display: 'block', marginBottom: '2px' }}>
                    Momento de aplicación:
                  </span>
                  <p style={{ margin: 0, fontSize: '12.5px', lineHeight: '1.5', color: '#4B5563' }}>
                    {rec.relacionPlan}
                  </p>
                </div>
              </div>

              {/* Acciones: Generar o Abrir recurso si ya fue anexado */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {yaAnexado ? (
                  <>
                    <button
                      type="button"
                      disabled
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        borderRadius: '10px',
                        backgroundColor: '#E2E8F0',
                        color: '#4A5568',
                        border: '1px solid #CBD5E0',
                        cursor: 'not-allowed',
                        opacity: 0.8
                      }}
                      title="Este material ya ha sido generado y se encuentra anexado al plan. No se puede volver a duplicar."
                    >
                      <CheckCircle2 size={14} color="#059669" />
                      <span>Ya generado y anexado al plan</span>
                    </button>

                    {onVerMaterial && recursoAnexado && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={() => onVerMaterial(recursoAnexado)}
                        style={{
                          width: '100%',
                          padding: '7px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          borderRadius: '10px',
                          color: '#183630',
                          borderColor: 'rgba(49, 91, 84, 0.4)'
                        }}
                        title="Abrir este material para consultar, interactuar, compartir o descargar"
                      >
                        <Eye size={13} />
                        <span>Abrir recurso interactivo</span>
                      </button>
                    )}
                  </>
                ) : (
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
                      gap: '6px',
                      borderRadius: '10px'
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
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
