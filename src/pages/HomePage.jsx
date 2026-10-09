import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Sparkles, PlusCircle, LayoutTemplate, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import HairlineFigure from '../components/HairlineFigure';

export default function HomePage() {
  const navigate = useNavigate();
  const { userProfile, apiKey } = useAppStore();
  
  // Dummy data for "Descubre" templates
  const templates = [
    { id: 1, title: 'Laboratorio de Ciencias', desc: 'Plantilla para experimentos', tag: 'Ciencias' },
    { id: 2, title: 'Debate Crítico', desc: 'Estructura para foros de discusión', tag: 'Sociales' },
    { id: 3, title: 'Proyecto Maker', desc: 'Construcción paso a paso', tag: 'Tecnología' }
  ];

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px' }}>
      {/* Header Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>¡Hola, {userProfile?.nombre || 'Docente'}! 👋</h1>
          <p style={{ color: 'var(--text-2)' }}>¿Qué vamos a enseñar hoy?</p>
        </div>
        <div style={{ textAlign: 'right', backgroundColor: 'var(--surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--text-2)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: 'var(--text-2)' }}>Planes generados este mes</p>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)' }}>0<span style={{ fontSize: '16px', color: 'var(--text-2)' }}>/5</span></div>
        </div>
      </div>

      {/* Main Action */}
      <div style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '48px', borderRadius: 'var(--radius-lg)', textAlign: 'center', marginBottom: '48px', position: 'relative', overflow: 'hidden' }}>
        {/* Elementos interactivos decorativos */}
        <div style={{ position: 'absolute', top: '-60px', left: '-20px', opacity: 0.2, pointerEvents: 'auto' }}>
          <HairlineFigure name="laptop" style={{ width: '300px', height: '300px' }} />
        </div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '-20px', opacity: 0.2, pointerEvents: 'auto' }}>
          <HairlineFigure name="cube" style={{ width: '250px', height: '250px' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <Sparkles size={48} style={{ marginBottom: '24px', opacity: 0.9 }} />
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Tu asistente de planeación te espera</h2>
          <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '500px', margin: '0 auto 32px' }}>
            Genera secuencias didácticas completas, adaptadas a tu contexto y con estrategias de inclusión, en menos de un minuto.
          </p>
          <Button 
            variant="surface" 
            style={{ fontSize: '18px', padding: '16px 32px' }}
            onClick={() => navigate('/creador')}
          >
            <PlusCircle style={{ marginRight: '8px' }} /> Crear mi primer plan
          </Button>
          {!apiKey && (
            <p style={{ marginTop: '16px', fontSize: '13px', opacity: 0.8 }}>
              ⚠️ Necesitas configurar tu IA en "Mi cuenta" primero.
            </p>
          )}
        </div>
      </div>

      {/* Descubre Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px' }}>Descubre</h2>
          <button className="auth-link-btn" onClick={() => navigate('/plantillas')}>Ver todas <ArrowRight size={16} style={{ verticalAlign: 'middle' }}/></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {templates.map(tpl => (
            <Card key={tpl.id} style={{ cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/creador')}>
              <Badge variant="ia" style={{ marginBottom: '12px' }}>{tpl.tag}</Badge>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}><LayoutTemplate size={18} style={{ verticalAlign: 'middle', marginRight: '8px', color: 'var(--primary)' }}/>{tpl.title}</h3>
              <p style={{ color: 'var(--text-2)', fontSize: '14px', margin: 0 }}>{tpl.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
