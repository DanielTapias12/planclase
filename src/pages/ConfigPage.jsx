import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { testApiConnection } from '../services/aiService';
import { updateUserProfile } from '../services/authService';
import { 
  Key, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfigPage() {
  const { apiKey, setApiKey, userId } = useAppStore();
  const [inputKey, setInputKey] = useState(apiKey);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveAndTest = async (e) => {
    e?.preventDefault();
    if (!inputKey.trim()) return;

    setStatus('loading');
    const isValid = await testApiConnection(inputKey.trim());
    if (isValid) {
      setApiKey(inputKey.trim());
      setStatus('success');
      if (userId) {
        try {
          await updateUserProfile(userId, { apiKey: inputKey.trim() });
        } catch (err) {
          console.error("Error guardando API Key en perfil:", err);
        }
      }
    } else {
      setStatus('error');
    }
  };

  return (
    <div className="mgmt-container" style={{ maxWidth: '780px' }}>
      
      {/* Cabecera del Módulo */}
      <header className="mgmt-header">
        <div className="mgmt-header-info">
          <div className="mgmt-header-icon">
            <Key size={28} />
          </div>
          <div>
            <h1 className="mgmt-title">Configuración de Inteligencia Artificial</h1>
            <p className="mgmt-subtitle">
              Administra tu clave privada BYOK (Bring Your Own Key) para conectar los servicios de Gemini.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className={`mgmt-stat-pill ${apiKey ? 'saved' : 'draft'}`}>
            <ShieldCheck size={14} style={{ color: apiKey ? 'var(--primary-sage)' : '#ca8a04' }} />
            <span>{apiKey ? 'API Key Configurada' : 'Sin Clave Activa'}</span>
          </div>
        </div>
      </header>

      {/* Tarjeta de Formulario Principal */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="mgmt-card" 
        style={{ padding: '36px 32px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Sparkles size={18} style={{ color: 'var(--primary-active)' }} />
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', color: 'var(--primary-active)', margin: 0 }}>
            Google Gemini API Key
          </h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '28px' }}>
          Para que el planificador pedagógico, las sugerencias DUA y el co-docente interactivo funcionen con la máxima velocidad y autonomía, ingresa tu clave API personal de Google AI Studio.
        </p>
        
        <form onSubmit={handleSaveAndTest}>
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label 
              htmlFor="gemini-api-key"
              style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: 600, marginBottom: '8px', display: 'block' }}
            >
              Clave de API de Gemini *
            </label>
            
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                id="gemini-api-key"
                type={showPassword ? 'text' : 'password'} 
                value={inputKey}
                onChange={(e) => { setInputKey(e.target.value); setStatus('idle'); }}
                placeholder="AIzaSy..."
                className="wizard-input"
                style={{ width: '100%', paddingRight: '48px', fontFamily: 'monospace', fontSize: '14.5px' }}
                disabled={status === 'loading'}
                autoComplete="off"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '4px' }}
                title={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            <p className="form-helper-text">
              Tu clave se almacena de forma segura en tu navegador y en tu perfil docente. Nunca se comparte con terceros.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '28px' }}>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={status === 'loading' || !inputKey.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '42px', padding: '8px 22px' }}
            >
              {status === 'loading' ? <Loader2 size={16} className="spin" /> : <ShieldCheck size={16} />}
              <span>{status === 'loading' ? 'Validando conexión...' : 'Guardar y Probar Conexión'}</span>
            </button>
          </div>
        </form>

        {/* Notificaciones de Estado de Validación */}
        {status === 'success' && (
          <div style={{ padding: '14px 18px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '24px' }}>
            <CheckCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '14px' }}>¡Conexión verificada exitosamente!</strong>
              <span style={{ fontSize: '13px' }}>Tu clave es válida y todos los servicios pedagógicos con IA están listos para utilizarse.</span>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '14px 18px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid rgba(239, 68, 68, 0.25)', marginBottom: '24px' }}>
            <XCircle size={22} style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ display: 'block', fontSize: '14px' }}>No se pudo validar la clave</strong>
              <span style={{ fontSize: '13px' }}>Verifica que la clave comience por "AIzaSy..." y tenga habilitada la cuota en Google AI Studio.</span>
            </div>
          </div>
        )}

        {/* Ayuda y Enlace a AI Studio */}
        <div style={{ paddingTop: '20px', borderTop: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
            ¿Aún no tienes una clave de API gratuita?
          </span>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noreferrer" 
            className="btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '6px 14px' }}
          >
            <span>Obtener en Google AI Studio</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
