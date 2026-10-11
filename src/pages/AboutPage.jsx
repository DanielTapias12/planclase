import React from 'react';
import { Target, Heart, Lightbulb, Users, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import miniyo from '../assets/miniyo.png';

export default function AboutPage() {
  const teamMembers = [
    { id: 1, name: "Zoe Peñata", role: "Scrum Master", github: "https://github.com", avatar: "https://ui-avatars.com/api/?name=Zoe+Peñata&background=315B54&color=fff&size=128" },
    { id: 2, name: "María Soto", role: "Product Owner", github: "https://github.com", avatar: "https://ui-avatars.com/api/?name=María+Soto&background=477A72&color=fff&size=128" },
    { id: 3, name: "María Ubarne", role: "Product Owner", github: "https://github.com", avatar: "https://ui-avatars.com/api/?name=María+Ubarne&background=183630&color=fff&size=128" },
    { id: 4, name: "Luis Caldera", role: "Development Team", github: "https://github.com", avatar: "https://ui-avatars.com/api/?name=Luis+Caldera&background=2B524A&color=fff&size=128" },
    { id: 5, name: "Daniel Tapias", role: "Development Team", github: "https://github.com/DanielTapias12", avatar: miniyo },
    { id: 6, name: "Maira Ortega", role: "Development Team", github: "https://github.com", avatar: "https://ui-avatars.com/api/?name=Maira+Ortega&background=3C6760&color=fff&size=128" },
  ];

  return (
    <div className="mgmt-container" style={{ maxWidth: '1060px', width: '100%', boxSizing: 'border-box' }}>
      
      {/* Cabecera Editorial Institucional */}
      <header className="mgmt-header">
        <div className="mgmt-header-info">
          <div className="mgmt-header-icon">
            <Users size={26} />
          </div>
          <div>
            <div className="editorial-badge">
              <Sparkles size={13} color="#2B524A" />
              <span>Identidad, Enfoque y Propósito</span>
            </div>
            <h1 className="mgmt-title">Transformando la Educación Colombiana</h1>
            <p className="mgmt-subtitle">
              INSPIRATEC es un ecosistema pedagógico potenciado por Inteligencia Artificial diseñado por y para docentes, con rigurosidad metodológica, accesibilidad universal y respeto por el contexto escolar.
            </p>
          </div>
        </div>

        <div className="mgmt-stats-bar">
          <div className="mgmt-stat-pill">
            <BookOpen size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>Enfoque MEN & DUA</span>
          </div>
          <div className="mgmt-stat-pill">
            <Users size={14} style={{ color: 'var(--primary-sage)' }} />
            <span>6 Creadores</span>
          </div>
        </div>
      </header>

      {/* Valores del Proyecto (Tarjetas Translúcidas de Cristal) */}
      <section style={{ marginBottom: '44px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          
          <div className="mgmt-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(71, 122, 114, 0.16)', color: '#183630', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Target size={28} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#142B25', marginBottom: '10px', fontWeight: 700 }}>
              Nuestra Misión
            </h3>
            <p style={{ color: '#2B453E', lineHeight: '1.6', fontSize: '14.5px', margin: 0 }}>
              Empoderar a los docentes de instituciones públicas y privadas de Colombia brindando una herramienta que une rigor curricular con la eficiencia de co-pilotos pedagógicos avanzados.
            </p>
          </div>

          <div className="mgmt-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(22, 163, 74, 0.14)', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Heart size={28} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#142B25', marginBottom: '10px', fontWeight: 700 }}>
              Inclusión Total (DUA)
            </h3>
            <p style={{ color: '#2B453E', lineHeight: '1.6', fontSize: '14.5px', margin: 0 }}>
              Diseñamos con el Diseño Universal para el Aprendizaje en mente, anticipando ajustes razonables y garantizando que ningún estudiante se quede atrás independientemente de sus capacidades.
            </p>
          </div>

          <div className="mgmt-card" style={{ padding: '30px 26px', textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(109, 40, 217, 0.14)', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Lightbulb size={28} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#142B25', marginBottom: '10px', fontWeight: 700 }}>
              Innovación Pedagógica
            </h3>
            <p style={{ color: '#2B453E', lineHeight: '1.6', fontSize: '14.5px', margin: 0 }}>
              La Inteligencia Artificial nunca reemplaza al maestro: lo acompaña. Actúa como un co-piloto pedagógico que acelera el trabajo operativo para permitirle concentrarse en la inspiración humana.
            </p>
          </div>

        </div>
      </section>

      {/* Sección del Equipo Desarrollador con Panel de Cristal de Alto Contraste */}
      <section style={{ marginBottom: '40px' }}>
        <div 
          className="mgmt-card" 
          style={{ 
            textAlign: 'center', 
            marginBottom: '26px',
            padding: '28px 32px',
            background: 'rgba(255, 253, 249, 0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.95)',
            boxShadow: '0 10px 30px rgba(20, 42, 38, 0.08)'
          }}
        >
          <div className="editorial-badge" style={{ margin: '0 auto 12px auto', display: 'inline-flex' }}>
            <Users size={13} color="#2B524A" />
            <span>Talento Unicordobés</span>
          </div>
          <h2 style={{ fontSize: '26px', color: '#142B25', margin: '0 0 10px 0', fontFamily: 'var(--font-heading)', fontWeight: 700 }}>
            El Equipo Creador
          </h2>
          <p style={{ fontSize: '15px', color: '#24423A', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6', fontWeight: 500 }}>
            Estudiantes e investigadores de la Universidad de Córdoba comprometidos con el desarrollo de software educativo de alta calidad.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '22px' }}>
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="mgmt-card" 
              style={{
                padding: '24px 20px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: '88px',
                    height: '88px',
                    borderRadius: '50%',
                    border: '3px solid rgba(255, 255, 255, 0.90)',
                    boxShadow: '0 6px 18px rgba(20, 42, 38, 0.12)',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <h3 style={{ fontSize: '17px', color: '#142B25', margin: '0 0 4px 0', fontWeight: 700 }}>
                {member.name}
              </h3>
              
              <span style={{ 
                fontSize: '12px', 
                fontWeight: 700, 
                color: '#183630', 
                backgroundColor: 'rgba(71, 122, 114, 0.14)', 
                padding: '3px 10px', 
                borderRadius: '999px',
                marginBottom: '16px'
              }}>
                {member.role}
              </span>

              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline"
                style={{
                  fontSize: '12.5px',
                  padding: '6px 16px',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  textDecoration: 'none'
                }}
              >
                <span>Ver Perfil</span>
                <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
