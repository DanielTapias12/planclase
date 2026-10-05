import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AyudaPage() {
  const navigate = useNavigate();
  const preguntas = [
    { q: "¿Cómo genero mi primer plan de clase?", a: "Ve a la pestaña 'Inicio', completa los datos del formulario (grado, tema, metodología) y presiona 'Generar Plan'. La Inteligencia Artificial redactará un plan completo en segundos." },
    { q: "¿Cómo guardo y comparto mi plan?", a: "Una vez generado, puedes guardarlo desde el editor. Aparecerá en 'Mis Planes', donde tendrás botones para Sistematizarlo o Compartirlo en la Biblioteca Pública." },
    { q: "¿Qué es una plantilla?", a: "Las plantillas te permiten definir una estructura personalizada (Títulos y secciones) que la IA seguirá estrictamente al generar tus planes futuros." }
  ];

  return (
    <div className="planificador-view" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="planificador-header">
        <h2>Centro de Ayuda</h2>
        <p>Encuentra respuestas a las preguntas más frecuentes sobre el uso de INSPIRATEC.</p>
      </div>
      <div className="grid-list" style={{ gridTemplateColumns: '1fr' }}>
        {preguntas.map((item, index) => (
          <div key={index} className="example-card">
            <h3 style={{ color: 'var(--primary-active)', marginBottom: '12px' }}>{item.q}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{item.a}</p>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '32px', textAlign: 'center' }}>
        <h3>¿Aún necesitas ayuda?</h3>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '16px' }}>Nuestro equipo de soporte técnico está disponible para ayudarte.</p>
        <button className="btn-outline" onClick={() => navigate('/soporte')}>Contactar a Soporte</button>
      </div>
    </div>
  );
}
