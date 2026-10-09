import React, { useState, useEffect } from 'react';
import { Dialog, Button } from './ui';
import { Sparkles, Key, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export default function Onboarding() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { apiKey } = useAppStore();

  useEffect(() => {
    const tourCompleted = localStorage.getItem('onboardingCompletado');
    if (!tourCompleted) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('onboardingCompletado', 'true');
    setIsOpen(false);
  };

  const nextStep = () => {
    if (step === 3) {
      handleClose();
    } else {
      setStep(step + 1);
    }
  };

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={32} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>¡Bienvenido a Inspiratec!</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '16px', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
              Tu Ecosistema Inteligente para el diseño de experiencias de aprendizaje y material educativo avanzado.
            </p>
          </div>
        );
      case 2:
        return (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--info)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Key size={32} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Personaliza tu IA</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '16px', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto 24px' }}>
              Para que la magia funcione, necesitas configurar tu propia llave de acceso (API Key) a los servicios de Inteligencia Artificial.
            </p>
            {!apiKey && (
              <Button variant="outline" onClick={() => { handleClose(); navigate('/config'); }}>
                Ir a Mi clave de IA
              </Button>
            )}
          </div>
        );
      case 3:
        return (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--success)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Rocket size={32} />
            </div>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>¡Explora y Crea!</h2>
            <p style={{ color: 'var(--text-2)', fontSize: '16px', lineHeight: '1.5', maxWidth: '400px', margin: '0 auto' }}>
              Ya estás listo. Comienza a generar planes de clase, rúbricas y actividades en segundos.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog isOpen={isOpen} onClose={handleClose} className="onboarding-dialog">
      <div style={{ padding: '32px' }}>
        {/* Indicador de Pasos */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2, 3].map(i => (
            <div 
              key={i} 
              style={{ 
                width: i === step ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                backgroundColor: i === step ? 'var(--primary)' : 'var(--text-2)',
                transition: 'all 0.3s'
              }} 
            />
          ))}
        </div>

        {renderContent()}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--text-2)' }}>
          <Button variant="outline" onClick={handleClose}>Saltar tour</Button>
          <Button variant="primary" onClick={nextStep}>
            {step === 3 ? 'Comenzar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
