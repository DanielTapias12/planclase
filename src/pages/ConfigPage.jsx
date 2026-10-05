import { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { testApiConnection } from '../services/aiService';
import { CheckCircle, XCircle, Key, Loader } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ConfigPage() {
  const { apiKey, setApiKey } = useAppStore();
  const [inputKey, setInputKey] = useState(apiKey);
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleSaveAndTest = async () => {
    setStatus('loading');
    setApiKey(inputKey);
    const isValid = await testApiConnection(inputKey);
    setStatus(isValid ? 'success' : 'error');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ maxWidth: '600px', margin: '40px auto', padding: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '32px', fontSize: '24px', color: '#1E293B' }}>Configura tu API Key de Gemini</h2>
      
      <p style={{ color: '#475569', marginBottom: '32px', fontSize: '15px', lineHeight: '1.5' }}>
        Para utilizar Inspiratec, necesitas proporcionar tu propia clave de API de Google AI Studio.
      </p>
      
      <div className="input-group" style={{ marginBottom: '32px' }}>
        <label style={{ fontSize: '14px', color: '#475569', fontWeight: 500, marginBottom: '8px', display: 'block' }}>Tu API Key</label>
        <input 
          type="password" 
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
          placeholder=".........................................."
          style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '16px' }}
        />
      </div>

      <button className="btn-outline" onClick={handleSaveAndTest} disabled={status === 'loading'} style={{ marginBottom: '32px', color: '#0F172A', border: '1px solid #CBD5E1', padding: '8px 16px', fontSize: '14px', borderRadius: '4px' }}>
        {status === 'loading' ? <Loader size={16} className="spin" style={{ marginRight: '8px' }} /> : null}
        Guardar y Continuar
      </button>

      <p style={{ color: '#475569', fontSize: '15px' }}>
        Puedes obtener tu clave en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#6366F1', textDecoration: 'underline' }}>Google AI Studio</a>.
      </p>

      {status === 'success' && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <CheckCircle size={20} /> Guardada correctamente.
        </div>
      )}
      {status === 'error' && (
        <div style={{ padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
          <XCircle size={20} /> Clave inválida.
        </div>
      )}
    </motion.div>
  );
}
