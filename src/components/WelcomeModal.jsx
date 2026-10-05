import React, { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit, Network, BookOpen, X, ArrowRight } from 'lucide-react';

export default function WelcomeModal({ onStartTour, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleStartTour = () => {
    setIsOpen(false);
    if (onStartTour) onStartTour();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '900px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Botón Cerrar */}
        <button 
          onClick={handleClose}
          style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255,255,255,0.2)', border: 'none', cursor: 'pointer', borderRadius: '50%', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', zIndex: 10 }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.4)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        >
          <X size={24} color="#FFFFFF" />
        </button>

        {/* Header Visual Impactante */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-active) 0%, var(--primary-sage) 100%)',
          padding: '60px 40px',
          textAlign: 'center',
          color: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Elementos decorativos */}
          <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(20px)' }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', filter: 'blur(30px)' }}></div>
          
          <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '16px', letterSpacing: '-0.5px', position: 'relative', zIndex: 2 }}>
            ¡Bienvenido a INSPIRATEC!
          </h1>
          <p style={{ fontSize: '20px', fontWeight: '400', maxWidth: '600px', margin: '0 auto', opacity: 0.9, position: 'relative', zIndex: 2, lineHeight: '1.5', marginBottom: '16px' }}>
            Tu Ecosistema Inteligente para el diseño de experiencias de aprendizaje y material educativo avanzado.
          </p>
          <div style={{ display: 'inline-block', backgroundColor: '#FFFFFF', color: 'var(--primary-active)', padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', position: 'relative', zIndex: 2 }}>
            🎉 ¡Ahora soporta 4 áreas: Informática, Matemáticas, Lenguaje e Inglés!
          </div>
        </div>

        {/* Contenido / Features */}
        <div style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', color: 'var(--text-main)', marginBottom: '8px' }}>¿Qué puedes lograr aquí?</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Descubre las herramientas de inteligencia artificial a tu disposición.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
            
            {/* Feature 1 */}
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#EFF6FF', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Sparkles size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Planificador Asistido (DUA)</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Crea secuencias didácticas completas alineadas a los estándares del MEN, con adaptaciones de inclusión automáticas basadas en el Diseño Universal para el Aprendizaje.
              </p>
            </div>

            {/* Feature 2 */}
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Network size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>El Tejedor ROCA</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Genera material interconectado al instante. ¿Necesitas Rúbricas, Diapositivas o Sopas de letras? La IA los crea con base en tu plan usando la metodología ROCA (Razón, Objetivo, Contexto, Actividad).
              </p>
            </div>

            {/* Feature 3 */}
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FAF5FF', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Co-Docente Proactivo</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                En el Laboratorio (Editor), tendrás un chatbot dispuesto a reescribir párrafos, cambiar metodologías o afinar tu texto en tiempo real con solo pedírselo.
              </p>
            </div>

            {/* Feature 4 */}
            <div style={{ padding: '24px', borderRadius: '16px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <BookOpen size={24} />
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>Plaza y Sistematización</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Toda tu gestión queda en la Bóveda. Puedes sistematizar tus mejores prácticas y compartirlas en la Biblioteca Pública con docentes de todo el país.
              </p>
            </div>

          </div>

          {/* Botones de acción */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <button 
              onClick={handleClose}
              style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', color: '#475569', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#0F172A'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#475569'; }}
            >
              Explorar por mi cuenta
            </button>
            
            <button 
              onClick={handleStartTour}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 28px', borderRadius: '12px', border: 'none', backgroundColor: 'var(--primary-active)', color: '#FFFFFF', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px rgba(49, 91, 84, 0.3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-sage)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(49, 91, 84, 0.4)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-active)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(49, 91, 84, 0.3)'; }}
            >
              Iniciar Tour Rápido <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
