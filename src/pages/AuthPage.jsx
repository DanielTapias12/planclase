import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/authService';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    institucion: '',
    nivel: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await loginUser(formData.email, formData.password);
      } else {
        if (formData.password.length < 6) {
          throw new Error('La contraseña debe tener mínimo 6 caracteres.');
        }
        await registerUser(formData.nombre, formData.institucion, formData.nivel, formData.email, formData.password);
      }
    } catch (err) {
      setError(err.message || 'Error en la autenticación.');
    } finally {
      setLoading(false);
    }
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "🪄 El Creador de Secuencias",
      explanation: "El motor principal donde nace la magia pedagógica.",
      functionality: "Ingresa el contexto de tu clase y la IA generará un plan estructurado, sugiriendo objetivos y detectando necesidades de inclusión (DUA).",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "🧠 El Laboratorio Inteligente",
      explanation: "Tu mesa de trabajo interactiva y editor Markdown.",
      functionality: "Edita el plan manualmente o utiliza el Chatbot Co-Docente para reescribir párrafos. Además, genera diapositivas, rúbricas y juegos en formato ROCA automáticamente.",
      image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "🗂️ Tu Bóveda Personal",
      explanation: "Organiza tu año escolar en la nube segura.",
      functionality: "Guarda tus clases en 'Mis Planes' para descargarlas en PDF/Word. Crea plantillas personalizadas para que la IA se adapte exactamente al formato de tu colegio.",
      image: "https://images.unsplash.com/photo-1497032208257-9e1eb2460146?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "🌐 La Plaza Pública",
      explanation: "La red social del conocimiento docente.",
      functionality: "Publica tus mejores clases y sistematiza tus experiencias para que otros docentes en Colombia puedan inspirarse y utilizarlas en sus aulas.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      {/* Lado Izquierdo: Formulario de Login */}
      <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', padding: '40px', zIndex: 2, boxShadow: '10px 0 30px rgba(0,0,0,0.04)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ color: 'var(--primary-active)', fontSize: '32px', marginBottom: '12px', fontFamily: 'Georgia, serif', letterSpacing: '1px' }}>
              INSPIRATEC
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              {isLogin ? 'Inicia sesión para continuar' : 'Crea tu cuenta docente'}
            </p>
          </div>

          {error && (
            <div style={{ backgroundColor: '#FEE2E2', color: '#B91C1C', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>Institución Educativa</label>
                  <input type="text" name="institucion" value={formData.institucion} onChange={handleChange} required placeholder="Ej. Colegio San José" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px' }} />
                </div>
                <div className="input-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>Nivel Educativo</label>
                  <select name="nivel" value={formData.nivel} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px' }}>
                    <option value="">Selecciona un nivel...</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                    <option value="Media">Media</option>
                  </select>
                </div>
              </>
            )}

            <div className="input-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>Correo Electrónico</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', width: '100%', boxSizing: 'border-box' }} />
            </div>
            
            <div className="input-group" style={{ margin: 0, position: 'relative' }}>
              <label style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>Contraseña</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  minLength="6" 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '15px', width: '100%', boxSizing: 'border-box', paddingRight: '40px' }} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: 0, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {!isLogin && <small style={{ color: 'var(--text-secondary)', marginTop: '6px', display: 'block' }}>Mínimo 6 caracteres</small>}
            </div>

            <button 
              type="submit" 
              style={{ marginTop: '16px', width: '100%', padding: '14px', backgroundColor: 'var(--primary-active)', color: '#FFFFFF', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center' }} 
              disabled={loading}
            >
              {loading ? 'Cargando...' : isLogin ? 'Ingresar' : 'Registrarse'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              style={{ background: 'none', border: 'none', color: 'var(--primary-active)', fontWeight: '700', cursor: 'pointer', fontSize: '14px', textDecoration: 'none' }}
            >
              {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>

      {/* Lado Derecho: Onboarding / Carrusel Interactivo */}
      <div style={{ flex: '1.4', backgroundColor: 'var(--bg-sage-soft)', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        
        <div style={{ position: 'absolute', top: '40px', left: '40px' }}>
          <span style={{ backgroundColor: 'var(--primary-active)', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>
            Guía Interactiva
          </span>
        </div>

        {/* Imagen del pantallazo (Placeholder) */}
        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          height: '350px', 
          backgroundColor: '#E2E8F0', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          marginBottom: '40px',
          backgroundImage: `url(${slides[currentSlide].image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.5s ease-in-out'
        }}>
        </div>

        {/* Textos descriptivos del Slide */}
        <div style={{ maxWidth: '600px', textAlign: 'center', minHeight: '160px' }}>
          <h3 style={{ fontSize: '28px', color: 'var(--primary-active)', marginBottom: '16px', transition: 'all 0.3s' }}>
            {slides[currentSlide].title}
          </h3>
          <p style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '12px', fontWeight: '500' }}>
            {slides[currentSlide].explanation}
          </p>
          <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {slides[currentSlide].functionality}
          </p>
        </div>

        {/* Controles del Carrusel */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? '32px' : '10px',
                height: '10px',
                borderRadius: '5px',
                backgroundColor: currentSlide === index ? 'var(--primary-active)' : '#CBD5E1',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
