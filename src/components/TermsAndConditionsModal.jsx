import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function TermsAndConditionsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: '20px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--bg-sage-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-active)'
              }}>
                <ShieldCheck size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#1E293B', fontWeight: 'bold' }}>
                  Términos y Política de Tratamiento de Datos Personales
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748B' }}>
                  Conforme a la Ley 1581 de 2012 y Normativa de Habeas Data en Colombia
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#94A3B8',
                padding: '4px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Body Scrollable */}
          <div style={{
            padding: '24px 28px',
            overflowY: 'auto',
            fontSize: '14px',
            lineHeight: '1.65',
            color: '#334155',
            flex: 1
          }}>
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#166534',
              fontSize: '13px'
            }}>
              <Lock size={18} style={{ flexShrink: 0 }} />
              <span>
                <strong>Privacidad y Seguridad Garantizada:</strong> Tus datos de contacto (número celular y correo) se almacenan protegidos mediante cifrado criptográfico y tokens de autenticación JWT.
              </span>
            </div>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              1. Identificación del Responsable del Tratamiento
            </h4>
            <p style={{ marginBottom: '16px' }}>
              La plataforma <strong>INSPIRATEC</strong> actúa como responsable del tratamiento de los datos personales recolectados a través de su sitio web y aplicativo de planeación docente con Inteligencia Artificial.
            </p>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              2. Marco Normativo Aplicable
            </h4>
            <p style={{ marginBottom: '8px' }}>
              La recolección, almacenamiento, uso y protección de datos se rigen de acuerdo con el marco legal colombiano:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Artículo 15 de la Constitución Política de Colombia:</strong> Derecho fundamental a la intimidad personal y familiar, buen nombre y Habeas Data.</li>
              <li><strong>Ley Estatutaria 1581 de 2012:</strong> Régimen General de Protección de Datos Personales en Colombia.</li>
              <li><strong>Decreto Reglamentario 1377 de 2013:</strong> Reglamentación de la autorización previa, expresa e informada del titular.</li>
              <li><strong>Ley 1273 de 2009:</strong> De la protección de la información y de los datos (Delitos Informáticos).</li>
            </ul>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              3. Datos Recolectados y Finalidades Específicas
            </h4>
            <p style={{ marginBottom: '8px' }}>
              Recolectamos datos como: <em>Nombre completo, Correo electrónico, Número Celular / WhatsApp, Institución Educativa, Nivel Académico</em> y preferencias pedagógicas. Estos datos serán utilizados estrictamente para:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li><strong>Personalización Pedagógica:</strong> Adecuar las respuestas y planes generados por los modelos de Inteligencia Artificial (Google Gemini) al contexto real de tu aula.</li>
              <li><strong>Canal de Comunicación y Soporte:</strong> Brindar asistencia técnica, notificaciones de novedades del sistema y recuperación de acceso mediante correo y número celular registrado.</li>
              <li><strong>Seguridad e Integridad de la Cuenta:</strong> Emisión de tokens de sesión autenticados (JWT - JSON Web Tokens) para validar la identidad y prevenir suplantaciones.</li>
              <li><strong>Estadísticas Agregadas Anónimas:</strong> Medir el impacto pedagógico global sin revelar en ningún momento la identidad particular del docente ni de sus estudiantes.</li>
            </ul>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              4. Mecanismos de Encriptación y Seguridad
            </h4>
            <p style={{ marginBottom: '16px' }}>
              En cumplimiento del principio de seguridad, los datos sensibles —en particular el <strong>número celular</strong>— son procesados con <strong>encriptación simétrica en reposo</strong> y transmitidos bajo protocolos seguros HTTPS/TLS. Toda sesión y ejecución de pruebas dentro de la plataforma cuenta con firma criptográfica <strong>JWT</strong> para garantizar la autenticidad del emisor.
            </p>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              5. Derechos del Titular (Derechos de Habeas Data)
            </h4>
            <p style={{ marginBottom: '8px' }}>
              Como titular de los datos, te asisten los siguientes derechos contemplados en el Artículo 8 de la Ley 1581 de 2012:
            </p>
            <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
              <li>Conocer, actualizar y rectificar tus datos personales en cualquier momento desde tu perfil.</li>
              <li>Solicitar prueba de la autorización otorgada para el tratamiento.</li>
              <li>Ser informado sobre el uso que se le ha dado a tus datos personales.</li>
              <li>Revocar la autorización o solicitar la supresión del dato cuando no se respeten los principios legales.</li>
              <li>Acceder en forma gratuita a tus datos personales tratados por el sistema.</li>
            </ul>

            <h4 style={{ color: 'var(--primary-active)', fontSize: '15px', marginBottom: '8px' }}>
              6. Canales para Ejercer tus Derechos
            </h4>
            <p style={{ marginBottom: '16px' }}>
              Puedes actualizar tus datos o solicitar la supresión de tu cuenta en el menú <em>"Mi Perfil"</em>, enviando un ticket desde la sección <em>"Soporte"</em> o comunicándote al canal institucional de privacidad: <strong>habeasdata@inspiratec.edu.co</strong>.
            </p>
          </div>

          {/* Footer Actions */}
          <div style={{
            padding: '16px 28px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px', color: '#64748B' }}>
              Última actualización: Febrero 2026
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn-outline"
                onClick={onClose}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cerrar
              </button>
              {onAccept && (
                <button
                  type="button"
                  className="btn"
                  onClick={() => { onAccept(); onClose(); }}
                  style={{
                    padding: '8px 20px',
                    fontSize: '13px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <CheckCircle2 size={16} /> Aceptar Términos
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
