import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { getForoMessages, addForoMessage, addForoReply } from '../services/dbService';
import { 
  MessagesSquare, 
  Send, 
  Loader2, 
  CornerDownRight, 
  ShieldCheck, 
  User, 
  Clock, 
  MessageCircle,
  X
} from 'lucide-react';

export default function ForoPage() {
  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const { userId, userProfile } = useAppStore();
  const [replyText, setReplyText] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [isReplyingId, setIsReplyingId] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const msgs = await getForoMessages();
      setMensajes(msgs || []);
    } catch (err) {
      console.error("Error al cargar mensajes del foro:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handlePost = async (e) => {
    e?.preventDefault();
    if (!mensaje.trim()) return;
    
    setIsPosting(true);
    try {
      await addForoMessage(
        userId, 
        userProfile?.nombre || 'Docente Anónimo', 
        userProfile?.rol || 'Docente', 
        mensaje.trim()
      );
      setMensaje('');
      await fetchMessages();
    } catch (err) {
      console.error("Error al publicar mensaje:", err);
      alert("Hubo un error al publicar tu mensaje.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleReply = async (msgId) => {
    const text = replyText[msgId]?.trim();
    if (!text) return;

    setIsReplyingId(msgId);
    try {
      await addForoReply(
        msgId, 
        userId, 
        userProfile?.nombre || 'Docente Anónimo', 
        userProfile?.rol || 'Docente', 
        text
      );
      setReplyText(prev => ({ ...prev, [msgId]: '' }));
      setShowReplyInput(prev => ({ ...prev, [msgId]: false }));
      await fetchMessages();
    } catch (err) {
      console.error("Error al publicar respuesta:", err);
      alert("Hubo un error al enviar tu respuesta.");
    } finally {
      setIsReplyingId(null);
    }
  };

  return (
    <div className="mgmt-container" style={{ maxWidth: '920px' }}>
      
      {/* Cabecera Editorial del Módulo */}
      <header className="mgmt-header">
        <div className="mgmt-header-info">
          <div>
            <div className="editorial-badge">
              <MessagesSquare size={14} color="#2B524A" />
              <span>Comunidad y Diálogo Pedagógico</span>
            </div>
            <h1 className="mgmt-title">Foro de Diálogo Docente</h1>
            <p className="mgmt-subtitle">
              Comparte inquietudes, debate metodologías de aula e interactúa con otros educadores para enriquecer tu práctica formativa.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <MessageCircle size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>{mensajes.length} {mensajes.length === 1 ? 'Conversación activa' : 'Conversaciones activas'}</span>
          </div>
        </div>
      </header>

      {/* Editor para Publicar Nueva Discusión */}
      <section 
        className="plantilla-form-card" 
        style={{ marginBottom: '30px' }} 
        aria-labelledby="nueva-discusion-title"
      >
        <h2 id="nueva-discusion-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', color: '#142B25', margin: '0 0 14px 0', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700 }}>
          <Send size={16} color="var(--primary-active)" /> Iniciar una nueva conversación
        </h2>
        
        <form onSubmit={handlePost}>
          <textarea 
            placeholder="¿Qué reto pedagógico, reflexión o experiencia metodológica deseas compartir hoy?..." 
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="wizard-textarea"
            style={{ 
              minHeight: '110px', 
              marginBottom: '14px', 
              resize: 'vertical'
            }}
            disabled={isPosting}
            aria-label="Contenido del mensaje a publicar"
          />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '13px', color: '#2B453E' }}>
              Publicando como: <strong style={{ color: '#142B25' }}>{userProfile?.nombre || 'Docente'}</strong>
            </span>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={!mensaje.trim() || isPosting}
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                padding: '10px 22px', 
                minHeight: '40px'
              }}
            >
              {isPosting ? <Loader2 size={16} className="spin" /> : <Send size={15} />}
              <span>{isPosting ? 'Publicando...' : 'Publicar Mensaje'}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Lista de Mensajes */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: '14px', color: 'var(--text-secondary)' }}>
          <Loader2 size={32} className="spin" style={{ color: 'var(--primary-sage)' }} />
          <p style={{ fontSize: '14.5px' }}>Cargando conversaciones del foro...</p>
        </div>
      ) : mensajes.length === 0 ? (
        <div className="mgmt-empty-card">
          <div className="mgmt-empty-icon">
            <MessagesSquare size={30} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', color: 'var(--text-main)', marginBottom: '8px' }}>
            Aún no hay discusiones abiertas
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginBottom: '20px' }}>
            Sé el primer docente en plantear una pregunta o compartir una experiencia metodológica.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mensajes.map(msg => {
            const isAdmin = msg.rol === 'Admin';
            const isReplying = isReplyingId === msg.id;
            const tieneRespuestas = msg.respuestas && msg.respuestas.length > 0;
            const isOpenReply = !!showReplyInput[msg.id];
            return (
              <article 
                key={msg.id} 
                className="mgmt-card" 
                style={{ padding: '24px 28px' }}
              >
                {/* Cabecera del Mensaje */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: isAdmin ? 'var(--primary)' : 'rgba(71, 122, 114, 0.16)', color: isAdmin ? '#FFF' : '#142B25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '15px' }}>
                      {isAdmin ? <ShieldCheck size={20} /> : <User size={18} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '15px', color: '#142B25' }}>
                          {msg.nombre}
                        </span>
                        {isAdmin && (
                          <span className="editor-badge saved" style={{ fontSize: '11px', padding: '1px 7px' }}>
                            Administrador
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: '12px', color: '#3A544C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> {msg.rol || 'Docente de Aula'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contenido del Mensaje Principal */}
                <p style={{ margin: '0 0 16px 0', fontSize: '14.5px', lineHeight: '1.65', color: '#142B25', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontWeight: 450 }}>
                  {msg.texto}
                </p>
                
                {/* Botón de Responder */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(49, 91, 84, 0.14)' }}>
                  <button 
                    className="btn-outline" 
                    style={{ fontSize: '12.5px', padding: '5px 14px', minHeight: '32px', display: 'flex', alignItems: 'center', gap: '6px' }} 
                    onClick={() => setShowReplyInput(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))}
                    aria-expanded={isOpenReply}
                  >
                    {isOpenReply ? <X size={14} /> : <CornerDownRight size={14} />}
                    <span>{isOpenReply ? 'Cancelar' : 'Responder'}</span>
                  </button>

                  {tieneRespuestas && (
                    <span style={{ fontSize: '12.5px', color: '#2F4840', fontWeight: 500 }}>
                      {msg.respuestas.length} {msg.respuestas.length === 1 ? 'respuesta' : 'respuestas'}
                    </span>
                  )}
                </div>

                {/* Formulario de Respuesta Desplegable */}
                {isOpenReply && (
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: 'var(--glass-bg-group)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid var(--glass-border-light)' }}>
                    <textarea
                      placeholder="Escribe tu aporte o respuesta pedagógica..."
                      value={replyText[msg.id] || ''}
                      onChange={(e) => setReplyText({ ...replyText, [msg.id]: e.target.value })}
                      className="wizard-textarea"
                      style={{ minHeight: '80px', marginBottom: '10px', fontSize: '13.5px' }}
                      disabled={isReplying}
                      aria-label="Texto de respuesta"
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button 
                        type="button" 
                        className="btn-outline" 
                        onClick={() => setShowReplyInput(prev => ({ ...prev, [msg.id]: false }))}
                        style={{ padding: '6px 14px', fontSize: '13px' }}
                      >
                        Cancelar
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        onClick={() => handleReply(msg.id)} 
                        disabled={!replyText[msg.id]?.trim() || isReplying}
                        style={{ padding: '6px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        {isReplying ? <Loader2 size={14} className="spin" /> : <Send size={13} />}
                        <span>{isReplying ? 'Enviando...' : 'Enviar Respuesta'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Lista de Respuestas Anidadas */}
                {tieneRespuestas && (
                  <div style={{ marginTop: '18px', paddingLeft: '18px', borderLeft: '2px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {msg.respuestas.map((resp, i) => {
                      const isRespAdmin = resp.rol === 'Admin';

                      return (
                        <div key={i} style={{ backgroundColor: 'var(--bg-surface)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '13.5px', color: 'var(--text-main)' }}>
                              {resp.nombre}
                            </span>
                            {isRespAdmin && (
                              <span className="editor-badge saved" style={{ fontSize: '10px', padding: '1px 6px' }}>
                                Admin
                              </span>
                            )}
                            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                              • {resp.rol || 'Docente'}
                            </span>
                          </div>
                          <p style={{ fontSize: '13.5px', lineHeight: '1.55', color: 'var(--text-main)', margin: 0, whiteSpace: 'pre-wrap' }}>
                            {resp.texto}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
