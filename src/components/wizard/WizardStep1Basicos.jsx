import React from 'react';
import { BookOpen, Users, Layers, AlertCircle } from 'lucide-react';
import { GENERIC_TEMPLATES } from '../../services/templates/genericTemplates';

export default function WizardStep1Basicos({
  wizardData,
  fieldErrors = {},
  handleChange,
  misPlantillas = []
}) {
  return (
    <div>
      {/* Grupo 1: Tema y Formato */}
      <div className="wizard-group">
        <div className="wizard-group-title">
          <BookOpen size={16} /> Tema y Estructura
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label htmlFor="wizard-tema">
              Nombre de la clase o tema <span style={{ color: 'var(--error-color)' }}>*</span>
            </label>
            <input 
              id="wizard-tema" 
              type="text" 
              name="tema" 
              value={wizardData.tema} 
              onChange={handleChange} 
              className={fieldErrors.tema ? 'input-error' : ''}
              aria-invalid={fieldErrors.tema ? 'true' : 'false'}
              aria-describedby={fieldErrors.tema ? 'error-tema' : 'help-tema'}
              placeholder={
                wizardData.materia === 'Matemáticas' 
                  ? "Ej.: Suma de fracciones con distinto denominador y reparto equitativo" 
                  : wizardData.materia === 'Ciencias Naturales'
                  ? "Ej.: Fotosíntesis, respiración celular y transferencia de energía en ecosistemas"
                  : wizardData.materia === 'Ciencias Sociales'
                  ? "Ej.: Civilizaciones prehispánicas: organización social y manejo del territorio muisca"
                  : (wizardData.materia === 'Lengua Castellana' || wizardData.materia === 'Lenguaje (Español)')
                  ? "Ej.: El cuento de misterio: estructura narrativa y creación de atmósfera" 
                  : wizardData.materia === 'Inglés' 
                  ? "Ej.: Verb To Be (Present Simple in Context)" 
                  : "Ej.: Introducción a la programación por bloques con Scratch"
              } 
            />
            {fieldErrors.tema ? (
              <div id="error-tema" className="field-error-message" role="alert">
                <AlertCircle size={14} /> {fieldErrors.tema}
              </div>
            ) : (
              <div id="help-tema" className="planificador-help">
                El tema orienta las actividades, los objetivos y los recursos generados.
              </div>
            )}
          </div>

          <div className="input-group" style={{ margin: 0 }}>
            <label htmlFor="tour-wizard-format">Formato de plan de clase</label>
            <select 
              id="tour-wizard-format" 
              name="formato" 
              value={wizardData.formato} 
              onChange={handleChange}
            >
              <optgroup label="Formatos genéricos oficiales por área">
                {GENERIC_TEMPLATES.map(gt => (
                  <option key={gt.id} value={gt.titulo}>
                    {gt.titulo === 'Estructura estándar INSPIRATEC' 
                      ? 'Estructura estándar INSPIRATEC (Tecnología e Informática)' 
                      : gt.titulo}
                  </option>
                ))}
              </optgroup>
              {misPlantillas && misPlantillas.filter(p => !p.publico).length > 0 && (
                <optgroup label="Tus formatos personalizados guardados">
                  {misPlantillas.filter(p => 
                    !p.publico && 
                    !GENERIC_TEMPLATES.some(gt => gt.titulo === p.titulo)
                  ).map((p) => (
                    <option key={p.id} value={p.titulo}>
                      {p.titulo} (Personalizado)
                    </option>
                  ))}
                </optgroup>
              )}
              {wizardData.formato && 
                !GENERIC_TEMPLATES.some(gt => gt.titulo === wizardData.formato) && 
                !misPlantillas?.some(p => p.titulo === wizardData.formato) && (
                <option value={wizardData.formato}>{wizardData.formato}</option>
              )}
            </select>
            {wizardData.formatoInstrucciones ? (
              <div className="planificador-help" style={{ color: 'var(--primary-active)', fontWeight: 600 }}>
                ✓ Formato propio cargado por el docente activo (prevalece estructuralmente sobre el genérico).
              </div>
            ) : (
              <div className="planificador-help">
                Estructura curricular alineada con las orientaciones didácticas del MEN.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grupo 2: Audiencia y Tiempo */}
      <div className="wizard-group">
        <div className="wizard-group-title">
          <Users size={16} /> Audiencia y Temporalidad
        </div>
        <div className="planificador-row" style={{ gap: '20px' }}>
          <div className="input-group" style={{ margin: 0 }}>
            <label htmlFor="wizard-grado">Grado escolar</label>
            <select id="wizard-grado" name="grado" value={wizardData.grado} onChange={handleChange}>
              <option value="">Seleccione un grado</option>
              <option value="1ro">1ro Primaria</option>
              <option value="2do">2do Primaria</option>
              <option value="3ro">3ro Primaria</option>
              <option value="4to">4to Primaria</option>
              <option value="5to">5to Primaria</option>
              <option value="6to">6to Bachillerato</option>
              <option value="7mo">7mo Bachillerato</option>
              <option value="8vo">8vo Bachillerato</option>
              <option value="9no">9no Bachillerato</option>
              <option value="10mo">10mo Media</option>
              <option value="11mo">11mo Media</option>
            </select>
          </div>
          <div className="input-group" style={{ margin: 0 }}>
            <label htmlFor="wizard-duracion">Duración y sesiones</label>
            <input 
              id="wizard-duracion"
              type="text" 
              name="duracion" 
              value={wizardData.duracion} 
              onChange={handleChange} 
              placeholder="Ej.: 90 minutos, 2 sesiones" 
            />
          </div>
        </div>

        <div className="input-group" style={{ margin: '20px 0 0 0' }}>
          <label htmlFor="wizard-num-estudiantes">Cantidad de estudiantes</label>
          <input 
            id="wizard-num-estudiantes"
            type="number" 
            name="numEstudiantes" 
            inputMode="numeric"
            pattern="[0-9]*"
            value={wizardData.numEstudiantes} 
            onChange={handleChange} 
            placeholder="Ej.: 30" 
            min="1" 
          />
          <div className="planificador-help">
            Permite ajustar la viabilidad de actividades grupales y dinámicas cooperativas.
          </div>
        </div>
      </div>

      {/* Grupo 3: Área Curricular y Recursos */}
      <div className="wizard-group">
        <div className="wizard-group-title">
          <Layers size={16} /> Área Curricular y Recursos
        </div>
        <div className="input-group">
          <label htmlFor="wizard-materia">Área curricular</label>
          <select id="wizard-materia" name="materia" value={wizardData.materia} onChange={handleChange}>
            <option value="Tecnología e Informática">Tecnología e Informática</option>
            <option value="Matemáticas">Matemáticas</option>
            <option value="Ciencias Naturales">Ciencias Naturales</option>
            <option value="Ciencias Sociales">Ciencias Sociales</option>
            <option value="Lengua Castellana">Lengua Castellana</option>
            <option value="Inglés">Inglés</option>
          </select>
        </div>

        <div className="input-group" style={{ margin: 0 }}>
          <label htmlFor="wizard-recursos">
            Recursos didácticos y ambiente de aprendizaje <span style={{ color: 'var(--error-color)' }}>*</span>
          </label>
          <select 
            id="wizard-recursos-presets"
            onChange={(e) => {
              if (e.target.value) {
                const current = wizardData.recursos ? wizardData.recursos + "\n" : "";
                handleChange({ target: { name: 'recursos', value: current + e.target.value } });
              }
            }}
            style={{ marginBottom: '8px' }}
          >
            <option value="">Seleccionar un perfil de aula o recursos frecuentes...</option>
            {wizardData.materia === 'Matemáticas' ? (
              <>
                <option value="A. Aula Tradicional: Tablero, marcadores, cuadernos, regla y compás.">A. Aula Tradicional: Tablero, marcadores, cuadernos, regla y compás.</option>
                <option value="B. Aula con Material Concreto: Bloques lógicos, regletas de Cuisenaire, ábacos o tangram.">B. Aula con Material Concreto: Bloques lógicos, regletas de Cuisenaire, ábacos o tangram.</option>
                <option value="C. Aula Tecnológicamente Integrada: Computadoras/Tablets con GeoGebra o simuladores.">C. Aula Tecnológicamente Integrada: Computadoras/Tablets con GeoGebra o simuladores.</option>
                <option value="D. Espacio Abierto/Canchas: Medir distancias, calcular áreas reales o estadística en campo.">D. Espacio Abierto/Canchas: Medir distancias, calcular áreas reales o estadística en campo.</option>
              </>
            ) : wizardData.materia === 'Ciencias Naturales' ? (
              <>
                <option value="A. Aula Tradicional sin Laboratorio: Materiales cotidianos, láminas y guías impresas.">A. Aula Tradicional sin Laboratorio: Materiales cotidianos, láminas y guías impresas.</option>
                <option value="B. Aula con Apoyo Tecnológico/Audiovisual: Proyector, simuladores PhET y videos.">B. Aula con Apoyo Tecnológico/Audiovisual: Proyector, simuladores PhET y videos.</option>
                <option value="C. Laboratorio Escolar de Ciencias: Microscopios, instrumental básico y muestras.">C. Laboratorio Escolar de Ciencias: Microscopios, instrumental básico y muestras.</option>
                <option value="D. Entorno Natural / Huerto Escolar: Trabajo de campo y observación de flora/fauna.">D. Entorno Natural / Huerto Escolar: Trabajo de campo y observación de flora/fauna.</option>
              </>
            ) : wizardData.materia === 'Ciencias Sociales' ? (
              <>
                <option value="A. Aula Tradicional: Tablero, mapas murales físicos, atlas y fuentes impresas.">A. Aula Tradicional: Tablero, mapas murales físicos, atlas y fuentes impresas.</option>
                <option value="B. Aula con Archivo/Biblioteca Histórica: Periódicos históricos, constitución política, testimonios y biografías.">B. Aula con Archivo/Biblioteca Histórica: Periódicos históricos, constitución política, testimonios y biografías.</option>
                <option value="C. Aula Tecnológicamente Integrada: Proyector/Dispositivos con Google Earth, SIG escolares, documentales y museos virtuales.">C. Aula Tecnológicamente Integrada: Proyector/Dispositivos con Google Earth, SIG escolares, documentales y museos virtuales.</option>
                <option value="D. Espacio Comunitario / Trabajo de Campo: Visita a sitios patrimoniales, memoria local y entrevistas ciudadanas.">D. Espacio Comunitario / Trabajo de Campo: Visita a sitios patrimoniales, memoria local y entrevistas ciudadanas.</option>
              </>
            ) : wizardData.materia === 'Lengua Castellana' ? (
              <>
                <option value="A. Aula Tradicional: Tablero, marcadores, biblioteca de aula, textos impresos y diccionarios.">A. Aula Tradicional: Tablero, marcadores, biblioteca de aula, textos impresos y diccionarios.</option>
                <option value="B. Aula con Rincón de Lectura: Libros ilustrados, fichas de redacción y periódicos escolares.">B. Aula con Rincón de Lectura: Libros ilustrados, fichas de redacción y periódicos escolares.</option>
                <option value="C. Aula Digital/Audiovisual: Proyector, audiolibros, grabadora de voz para expresión oral.">C. Aula Digital/Audiovisual: Proyector, audiolibros, grabadora de voz para expresión oral.</option>
                <option value="D. Espacio de Debate/Dramatización: Disposición en círculo o herradura para oratoria.">D. Espacio de Debate/Dramatización: Disposición en círculo o herradura para oratoria.</option>
              </>
            ) : wizardData.materia === 'Inglés' ? (
              <>
                <option value="A. Aula Tradicional: Tablero, flashcards físicas, guías impresas y diccionarios bilingües.">A. Aula Tradicional: Tablero, flashcards físicas, guías impresas y diccionarios bilingües.</option>
                <option value="B. Aula con Apoyo Multimedia: Reproductor de audio, canciones, videos en inglés y proyector.">B. Aula con Apoyo Multimedia: Reproductor de audio, canciones, videos en inglés y proyector.</option>
                <option value="C. Laboratorio de Idiomas / Dispositivos: Auriculares con micrófono y apps de listening/speaking.">C. Laboratorio de Idiomas / Dispositivos: Auriculares con micrófono y apps de listening/speaking.</option>
                <option value="D. Entorno Inmersivo / Role-Play: Estaciones simuladas de conversación e interacción funcional.">D. Entorno Inmersivo / Role-Play: Estaciones simuladas de conversación e interacción funcional.</option>
              </>
            ) : (
              <>
                <option value="A. Aula Tradicional: Pizarrón, marcadores, papel, reciclados. Acceso nulo a tecnología.">A. Aula Tradicional: Pizarrón, marcadores, papel, reciclados. Acceso nulo a tecnología.</option>
                <option value="B. Aula con Apoyo Tecnológico Básico: Acceso ocasional a computadoras/internet.">B. Aula con Apoyo Tecnológico Básico: Acceso ocasional a computadoras/internet.</option>
                <option value="C. Aula Tecnológicamente Integrada: Buena conectividad, acceso regular a dispositivos.">C. Aula Tecnológicamente Integrada: Buena conectividad, acceso regular a dispositivos.</option>
                <option value="D. Acceso a Laboratorio/Taller Básico: Herramientas manuales, equipamiento estándar.">D. Acceso a Laboratorio/Taller Básico: Herramientas manuales, equipamiento estándar.</option>
                <option value="E. Acceso a Espacio Maker/STEM Avanzado: Impresoras 3D, robótica, sensores.">E. Acceso a Espacio Maker/STEM Avanzado: Impresoras 3D, robótica, sensores.</option>
                <option value="F. Entorno Exterior/Comunitario: Proyectos en patios, huertas, comunidad.">F. Entorno Exterior/Comunitario: Proyectos en patios, huertas, comunidad.</option>
              </>
            )}
          </select>

          <textarea 
            id="wizard-recursos"
            name="recursos" 
            value={wizardData.recursos} 
            onChange={handleChange} 
            className={fieldErrors.recursos ? 'input-error' : ''}
            aria-invalid={fieldErrors.recursos ? 'true' : 'false'}
            aria-describedby={fieldErrors.recursos ? 'error-recursos' : 'help-recursos'}
            placeholder="Describe o complementa los recursos disponibles (ej.: 15 computadores, proyector, guías impresas, kit robótico o material reciclable)..."
            style={{ minHeight: '85px' }}
          />
          {fieldErrors.recursos ? (
            <div id="error-recursos" className="field-error-message" role="alert">
              <AlertCircle size={14} /> {fieldErrors.recursos}
            </div>
          ) : (
            <div id="help-recursos" className="planificador-help">
              La IA adaptará las dinámicas según si el entorno cuenta con conectividad alta, media o es desconectado (unplugged).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
