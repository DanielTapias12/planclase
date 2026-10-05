import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getForoMessages, addForoMessage, addForoReply } from '../services/dbService';
import { Loader2 } from 'lucide-react';

export default function ForoPage() {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, userProfile } = useAppStore();
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    const msgs = await getForoMessages();
    setMensajes(msgs);
    setLoading(false);
  };

  const handlePost = async () => {
    if (mensaje.trim() !== '') {
      await addForoMessage(userId, userProfile?.nombre || 'Docente Anónimo', userProfile?.rol || 'Docente', mensaje);
      setMensaje('');
      fetchMessages(); // refresh
    }
  };

  const handleReply = async (msgId) => {
    if (replyText[msgId]?.trim()) {
      await addForoReply(msgId, userId, userProfile?.nombre || 'Docente Anónimo', userProfile?.rol || 'Docente', replyText[msgId]);
      setReplyText({ ...replyText, [msgId]: '' });
      setShowReplyInput({ ...showReplyInput, [msgId]: false });
      fetchMessages(); // refresh
    }
  };

  return (
    <div className="planificador-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="planificador-header">
        <h2>Foro de Discusión</h2>
        <p>Espacio para compartir ideas y debatir con la comunidad.</p>
      </div>
      <div className="card" style={{ marginBottom: '24px' }}>
        <textarea 
          placeholder="Escribe tu mensaje aquí..." 
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          style={{ width: '100%', height: '100px', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '16px', resize: 'none', fontFamily: 'inherit' }}
        />
        <button className="btn" onClick={handlePost} disabled={!mensaje.trim()}>
          Publicar Mensaje
        </button>
      </div>
      
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', gap: '8px', color: 'var(--text-secondary)' }}>
          <Loader2 size={24} className="spin" /> Cargando foro...
        </div>
      ) : (
        <div className="grid-list">
          {mensajes.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No hay mensajes aún. ¡Sé el primero en participar!</p>}
          {mensajes.map(msg => (
            <div key={msg.id} className="example-card" style={{ position: 'relative' }}>
              <p style={{ fontWeight: 'bold' }}>
                {msg.nombre} 
                {msg.rol === 'Admin' && <span style={{ marginLeft: '8px', padding: '2px 6px', backgroundColor: 'var(--primary-sage)', color: 'white', borderRadius: '4px', fontSize: '11px' }}>Admin</span>}
              </p>
              <p style={{ marginTop: '8px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.texto}</p>
              
              <div style={{ marginTop: '16px' }}>
                <button 
                  className="btn-outline" 
                  style={{ fontSize: '12px', padding: '4px 12px' }} 
                  onClick={() => setShowReplyInput({ ...showReplyInput, [msg.id]: !showReplyInput[msg.id] })}
                >
                  {showReplyInput[msg.id] ? 'Cancelar' : 'Responder'}
                </button>
              </div>

              {showReplyInput[msg.id] && (
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <textarea
                    placeholder="Tu respuesta..."
                    value={replyText[msg.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                    style={{ flex: 1, height: '60px', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', resize: 'none', fontFamily: 'inherit' }}
                  />
                  <button className="btn" onClick={() => handleReply(msg.id)} style={{ padding: '8px 16px' }}>Enviar</button>
                </div>
              )}

              {/* Mostrar respuestas */}
              {msg.respuestas && msg.respuestas.length > 0 && (
                <div style={{ marginTop: '16px', paddingLeft: '16px', borderLeft: '2px solid var(--border-color)' }}>
                  {msg.respuestas.map((resp, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <p style={{ fontWeight: 'bold', fontSize: '13px' }}>
                        {resp.nombre}
                        {resp.rol === 'Admin' && <span style={{ marginLeft: '8px', padding: '2px 4px', backgroundColor: 'var(--primary-sage)', color: 'white', borderRadius: '4px', fontSize: '10px' }}>Admin</span>}
                      </p>
                      <p style={{ fontSize: '13px', lineHeight: '1.4', marginTop: '4px' }}>{resp.texto}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
