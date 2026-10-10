import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div className="recorrido-container" ref={containerRef}>
      <div className="recorrido-sticky">
        {images.map((img, index) => {
          // Calculate opacity and scale for each image based on scroll progress
          const start = index / images.length;
          const end = (index + 1) / images.length;
          
          // Crossfade: asymmetric curve to prevent background bleed
          // The image fades in right before its 'start', stays solid until 'end', then fades out.
          // Because they stack in DOM order, an image fading in covers the previous solid one perfectly.
          const opacity = useTransform(
            scrollYProgress,
            [start - 0.05, start, end, end + 0.05],
            [0, 1, 1, 0]
          );

          // Subtle zoom in effect
          const scale = useTransform(
            scrollYProgress,
            [start, end],
            [1, 1.15]
          );

          return (
            <motion.div
              key={index}
              className="recorrido-scene"
              style={{ opacity }}
            >
              <motion.img 
                src={img.src} 
                alt={`Escena ${index + 1}`} 
                className="recorrido-image"
                style={{ scale }}
              />
              <div className="recorrido-overlay" />
              <div className="recorrido-text">
                <h2>{img.text}</h2>
              </div>
            </motion.div>
          );
        })}

        {/* Progress Indicator */}
        <div className="recorrido-progress-bar">
          <motion.div 
            className="recorrido-progress-fill"
            style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
          />
        </div>

        <div className="recorrido-exit">
          <NavLink to="/" className="recorrido-back-btn">
            <ArrowLeft size={20} /> Regresar al Inicio
          </NavLink>
        </div>
      </div>
    </div>
  );
}
