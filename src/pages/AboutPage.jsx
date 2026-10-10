import React from 'react';
import { Target, Heart, Lightbulb, Users } from 'lucide-react';
import miniyo from '../assets/miniyo.png';

export default function AboutPage() {
  const teamMembers = [
    { id: 1, name: "Daniel Tapias", role: "Desarrollador / Creador", github: "https://github.com/DanielTapias12", avatar: miniyo },
    { id: 2, name: "Integrante 2", role: "Desarrollador / Creador", github: "#", avatar: "https://ui-avatars.com/api/?name=I+2&background=random&color=fff&size=128" },
    { id: 3, name: "Integrante 3", role: "Desarrollador / Creador", github: "#", avatar: "https://ui-avatars.com/api/?name=I+3&background=random&color=fff&size=128" },
    { id: 4, name: "Integrante 4", role: "Desarrollador / Creador", github: "#", avatar: "https://ui-avatars.com/api/?name=I+4&background=random&color=fff&size=128" },
    { id: 5, name: "Integrante 5", role: "Desarrollador / Creador", github: "#", avatar: "https://ui-avatars.com/api/?name=I+5&background=random&color=fff&size=128" },
    { id: 6, name: "Integrante 6", role: "Desarrollador / Creador", github: "#", avatar: "https://ui-avatars.com/api/?name=I+6&background=random&color=fff&size=128" },
  ];

  return (
    <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', minHeight: '100vh', paddingBottom: '80px', margin: '24px', borderRadius: '16px' }}>

      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-active) 0%, var(--primary-sage) 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        color: 'white',
        borderBottomLeftRadius: '40px',
        borderBottomRightRadius: '40px',
        marginBottom: '60px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-20px', left: '-20px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(20px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-40px', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(30px)' }}></div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '46px', fontWeight: '800', marginBottom: '24px', letterSpacing: '-1px', color: '#FFFFFF' }}>
            Transformando la Educación
          </h1>
          <p style={{ fontSize: '20px', lineHeight: '1.6', opacity: 0.9, fontWeight: '400' }}>
            Inspiratec es un ecosistema pedagógico potenciado por Inteligencia Artificial diseñado por y para docentes. Nuestro propósito es democratizar el acceso a herramientas de planificación avanzadas, ahorrando tiempo invaluable y permitiendo que los maestros se enfoquen en lo más importante: inspirar a sus estudiantes.
          </p>
        </div>
      </div>

      {/* Valores del Proyecto */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

          <div className="card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: 'var(--bg-sage-soft)', color: 'var(--primary-active)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-active)', marginBottom: '12px' }}>Nuestra Misión</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
              Empoderar a las instituciones educativas de Colombia brindando una plataforma integral que une tecnología de punta con las mejores metodologías pedagógicas.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#F0FDF4', color: '#22C55E', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Heart size={32} />
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-active)', marginBottom: '12px' }}>Inclusión Total</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
              Diseñamos con el Diseño Universal para el Aprendizaje (DUA) en mente, asegurando que ningún estudiante se quede atrás sin importar sus necesidades.
            </p>
          </div>

          <div className="card" style={{ padding: '32px', textAlign: 'center', backgroundColor: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '24px', transition: 'transform 0.3s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#FAF5FF', color: '#A855F7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Lightbulb size={32} />
            </div>
            <h3 style={{ fontSize: '20px', color: 'var(--primary-active)', marginBottom: '12px' }}>Innovación</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '15px' }}>
              La Inteligencia Artificial no reemplaza al docente, lo potencia. Actuamos como un co-piloto pedagógico que te acompaña en todo el proceso.
            </p>
          </div>

        </div>
      </div>

      {/* Team Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
            <Users size={28} color="var(--primary-active)" />
            <h2 style={{ fontSize: '32px', color: 'var(--primary-active)', margin: 0 }}>El Equipo Creador</h2>
          </div>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
            Un grupo multidisciplinario de mentes brillantes, apasionados por el desarrollo de software y la educación en Colombia.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          {teamMembers.map((member) => (
            <div key={member.id} className="card" style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.3s'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05)';
              }}
            >
              <div style={{ height: '100px', backgroundColor: 'var(--bg-sage-soft)', borderBottom: '1px solid #E2E8F0' }}></div>

              <div style={{ marginTop: '-50px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '4px solid #FFFFFF',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '16px' }}>{member.role}</p>

                <a href={member.github} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--primary-active)'; e.currentTarget.style.color = '#FFFFFF'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                >
                  Ver Perfil en GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
