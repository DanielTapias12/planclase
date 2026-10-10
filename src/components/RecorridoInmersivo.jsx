import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import './RecorridoInmersivo.css';

const images = [
  { src: '/scroll-images/Entrada del campus al amanecer-7.png', text: 'Bienvenido a INSPIRATEC. Un campus diseñado para potenciar tu creatividad.' },
  { src: '/scroll-images/Viaje educativo en seis pasos-5.png', text: 'Tu viaje educativo en seis pasos fundamentales hacia el éxito.' },
  { src: '/scroll-images/Mapa visual de aprendizaje INSPIRATEC-2.png', text: 'Descubre nuestro mapa visual de aprendizaje, guiándote en cada etapa.' },
  { src: '/scroll-images/Inspiratec_ Ideas que transforman el aprendizaje-1.png', text: 'Ideas innovadoras que transforman la manera en que aprendemos y enseñamos.' },
  { src: '/scroll-images/INSPIRATEC_ Ideas que transforman la educación-3.png', text: 'Educación que inspira, impulsando el futuro de la enseñanza.' },
  { src: '/scroll-images/INSPIRATEC_ Educación que inspira-6.png', text: 'Conecta con otros educadores y comparte conocimientos.' },
  { src: '/scroll-images/Espacio creativo de planificación docente-9.png', text: 'Un espacio creativo diseñado específicamente para la planificación docente.' },
  { src: '/scroll-images/Planificación docente en un aula luminosa-8.png', text: 'Aulas luminosas y modernas que invitan a la concentración y al diseño.' },
  { src: '/scroll-images/Recorrido Inspiratec_ Aprende, Crea y Conecta-4.png', text: 'Aprende, Crea y Conecta. Únete a INSPIRATEC.' }
];

export default function RecorridoInmersivo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(nextSlide, 7000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, isHovered, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Prevent scroll locking when leaving the page
  useEffect(() => {
    document.body.classList.add('no-scroll');
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);

  return (
    <div 
      className="recorrido-slideshow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="recorrido-exit">
        <NavLink to="/" className="recorrido-back-btn">
          <ArrowLeft size={20} /> Regresar al Inicio
        </NavLink>
      </div>

      <AnimatePresence>
        <motion.div
          key={currentIndex}
          className="recorrido-slide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <img src={images[currentIndex].src} alt={`Escena ${currentIndex + 1}`} className="recorrido-image" />
          <div className="recorrido-overlay" />
          <div className="recorrido-text-container">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {images[currentIndex].text}
            </motion.h2>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="recorrido-nav-zone left" onClick={prevSlide}>
        <ChevronLeft size={48} className="nav-icon" />
      </div>
      <div className="recorrido-nav-zone right" onClick={nextSlide}>
        <ChevronRight size={48} className="nav-icon" />
      </div>

      <div className="recorrido-indicators">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`recorrido-indicator ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(idx)}
            aria-label={`Ir a la escena ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
