import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { addTicket } from '../services/dbService';
import { auth } from '../firebase';

export default function SoportePage() {
  const [enviado, setEnviado] = useState(false);
  const [asunto, setAsunto] = useState('');
  const [desc, setDesc] = useState('');
  const { userId, userProfile } = useAppStore();

  if (enviado) {
    return (
      <div className="planificador-view" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '60px 20px' }}>
        <h2 style={{ color: 'var(--primary-sage)', marginBottom: '16px' }}>¡Ticket Enviado con Éxito!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Nuestro equipo técnico revisará tu solicitud y se pondrá en contacto pronto.</p>
        <button className="btn" onClick={() => { setEnviado(false); setAsunto(''); setDesc(''); }}>Enviar otro ticket</button>
      </div>
    );
  }

  return (
    <div className="planificador-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="planificador-header">
        <h2>Soporte Técnico</h2>
        <p>¿Tienes problemas técnicos con INSPIRATEC? Estamos aquí para ayudarte.</p>
      </div>
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Asunto</label>
          <input 
            type="text" 
            placeholder="Ej. Problema al generar un plan" 
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'inherit' }} 
          />
        </div>
        <div>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Descripción detallada</label>
          <textarea 
            placeholder="Describe el problema técnico que estás experimentando..." 
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            style={{ width: '100%', height: '120px', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'none', fontFamily: 'inherit' }}
          />
        </div>
        <button 
          className="btn" 
          onClick={async () => {
            if (asunto.trim() && desc.trim()) {
              try {
                const safeUserId = userId || 'anonymous';
                const safeNombre = userProfile?.nombre || 'Docente Anónimo';
                const safeEmail = auth.currentUser?.email || userProfile?.email || 'N/A';
                await addTicket(safeUserId, safeNombre, safeEmail, asunto, desc);
                setEnviado(true);
              } catch(e) {
                console.error("Error completo al enviar ticket:", e);
                alert("Error al enviar el ticket: " + e.message);
              }
            }
          }}
          style={{ alignSelf: 'flex-start', padding: '12px 24px' }}
          disabled={!asunto.trim() || !desc.trim()}
        >
          Enviar Ticket
        </button>
      </div>
    </div>
  );
}
