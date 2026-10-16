import React from 'react';
import { Accessibility, HelpCircle } from 'lucide-react';

export default function WizardStep4Inclusion({
  wizardData,
  handleChange,
  inclusionOptions = []
}) {
  return (
    <div>
      <div className="wizard-group">
        <div className="wizard-group-title">
          <Accessibility size={16} /> Condiciones para Ajustes Razonables (DUA)
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Selecciona si en tu grupo hay estudiantes con condiciones que requieran ajustes de representación, expresión o compromiso:
        </p>

        <div className="wizard-choice-grid">
          {inclusionOptions.map((opt) => {
            const isSelected = Array.isArray(wizardData.inclusion) && wizardData.inclusion.includes(opt.value);
            return (
              <label 
                key={opt.value}
                className={`wizard-choice-card ${isSelected ? 'selected' : ''}`}
              >
                <input 
                  type="checkbox" 
                  name="inclusion" 
                  value={opt.value} 
                  checked={isSelected} 
                  onChange={handleChange} 
                />
                <div className="wizard-choice-card-content">
                  <span className="wizard-choice-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {opt.icon} {opt.label}
                  </span>
                  <span className="wizard-choice-card-desc">
                    {opt.desc}
                  </span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="wizard-group">
        <div className="wizard-group-title">
          <HelpCircle size={16} /> Necesidades Específicas Adicionales
        </div>
        <div className="input-group" style={{ margin: 0 }}>
          <label htmlFor="wizard-otras-necesidades">Otra condición particular o necesidad pedagógica (Opcional)</label>
          <input 
            id="wizard-otras-necesidades"
            type="text" 
            name="otrasNecesidades" 
            value={wizardData.otrasNecesidades || ''} 
            onChange={handleChange} 
            placeholder="Ej.: Trastorno del Espectro Autista (TEA), TDAH, o baja conectividad domiciliaria" 
          />
          <div className="planificador-help">
            La Inteligencia Artificial incorporará adaptaciones DUA y apoyos pertinentes directamente en el plan generado.
          </div>
        </div>
      </div>
    </div>
  );
}
