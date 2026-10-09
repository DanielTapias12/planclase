import React, { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   FondoAula: salón de clase animado. Docentes entran, caminan hasta
   el robot asistente, conversan y se van. Todo en SVG + CSS.

   Uso:
   <FondoAula dim={0.25}>  ...tu contenido...  </FondoAula>
   - dim: oscurece un poco el fondo (0 a 1) para que tu texto se lea.
------------------------------------------------------------------- */

/* Cada persona: lado de entrada (L/R), punto donde se detiene, profundidad y diálogo */
const CAST = [
  { skin: "#F2C4A0", hair: "#3B2A20", shirt: "#FFC857", pants: "#2F3E5C", long: false, side: "L", x1: 390, y: 505, s: 0.95,
    say: ["¡Hola, Robi! Buenos días 👋", "¡Buenos días! ¿Qué planeamos hoy?"] },
  { skin: "#8D5A3C", hair: "#17120F", shirt: "#6EC1FF", pants: "#3A3A4A", long: false, side: "R", x1: 612, y: 520, s: 1,
    say: ["Necesito un plan de fracciones", "Listo: 3 actividades y una evaluación ✓"] },
  { skin: "#E8B48C", hair: "#7A3B1E", shirt: "#FF7A66", pants: "#23405A", long: true, side: "L", x1: 318, y: 552, s: 1.08,
    say: ["¿Puedes crear una rúbrica?", "¡Claro! Ya está en la pizarra ✨"] },
  { skin: "#C98E64", hair: "#1E1E2A", shirt: "#5EE0B0", pants: "#4A3F3A", long: false, side: "R", x1: 690, y: 552, s: 1.08,
    say: ["Gracias por la ayuda, Robi", "¡Para eso estoy! Juntos mejor 🤝"] },
  { skin: "#F5D0B5", hair: "#C9A24B", shirt: "#B79CFF", pants: "#2F3E5C", long: true, side: "L", x1: 258, y: 522, s: 1,
    say: ["Hazlo más divertido, por favor", "Agregué un juego de roles 🎭"] },
  { skin: "#6B4430", hair: "#0E0B0A", shirt: "#FF8FC7", pants: "#2B2B3A", long: true, side: "R", x1: 748, y: 524, s: 1,
    say: ["¡Hola! ¿Armamos ciencias?", "¡Bienvenida! Empecemos 🔬"] },
];

const BOOKS = ["#E4572E", "#29A0B1", "#F3A712", "#6C5B7B", "#5EA85E", "#3B6BFF", "#E07BB5", "#A8C686"];

/* Divide un texto en líneas cortas para los globos */
const wrap = (t, n) => {
  const out = []; let cur = "";
  t.split(" ").forEach((w) => {
    if ((cur + " " + w).trim().length > n) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim();
  });
  if (cur) out.push(cur);
  return out;
};

function Bubble({ text, cls, dx = 0, fill = "#fff", n = 20 }) {
  const lines = wrap(text, n);
  const w = Math.max(...lines.map((l) => l.length)) * 6.9 + 22;
  const h = lines.length * 16 + 12;
  return (
    <g className={cls}>
      <rect x={dx - w / 2} y={-(h + 6)} width={w} height={h} rx="12" fill={fill} />
      <path d="M-7 -7.5 L0 3 L7 -7.5Z" fill={fill} />
      {lines.map((l, i) => (
        <text key={i} x={dx} y={-(h + 6) + 19 + i * 16} textAnchor="middle" className="fa-t">{l}</text>
      ))}
    </g>
  );
}

function Person({ p, k }) {
  const L = p.side === "L";
  const style = {
    "--x0": L ? "-90px" : "1090px", "--x1": `${p.x1}px`, "--y": `${p.y}px`, "--s": p.s,
    "--f0": L ? 1 : -1, "--f1": L ? -1 : 1, "--dl": `${-k * 4}s`,
  };
  return (
    <g className="pw" style={style}>
      <g className="pf">
        <ellipse cx="0" cy="0" rx="24" ry="5" fill="#000" opacity=".2" />
        {/* piernas quietas */}
        <g className="p-stand">
          <rect x="-12" y="-54" width="11" height="52" rx="5" fill={p.pants} />
          <rect x="1" y="-54" width="11" height="52" rx="5" fill={p.pants} />
          <rect x="-14" y="-6" width="16" height="6" rx="3" fill="#222" />
          <rect x="0" y="-6" width="16" height="6" rx="3" fill="#222" />
        </g>
        {/* piernas caminando */}
        <g className="p-walk">
          <g className="wl"><rect x="-11" y="-54" width="11" height="52" rx="5" fill={p.pants} /><rect x="-13" y="-6" width="16" height="6" rx="3" fill="#222" /></g>
          <g className="wr"><rect x="0" y="-54" width="11" height="52" rx="5" fill={p.pants} /><rect x="-2" y="-6" width="16" height="6" rx="3" fill="#222" /></g>
        </g>
        <g className="p-bob">
          <rect x="-24" y="-96" width="9" height="36" rx="4.5" fill={p.shirt} opacity=".85" />
          {p.long && <rect x="-15" y="-127" width="17" height="40" rx="8" fill={p.hair} />}
          <rect x="-17" y="-100" width="34" height="52" rx="14" fill={p.shirt} />
          <rect x="-6" y="-106" width="12" height="10" rx="5" fill={p.skin} />
          <circle cx="2" cy="-118" r="15" fill={p.skin} />
          <path d="M-13 -121a15 15 0 0 1 30 0q-7-9-15-7-8-2-15 7z" fill={p.hair} />
          <circle cx="9" cy="-117" r="2" fill="#1b1b1b" />
          <path d="M5 -110q5 4 9 0" stroke="#1b1b1b" strokeWidth="1.6" fill="none" strokeLinecap="round" className="p-mouth" />
          {/* brazo que saluda */}
          <g className="p-arm">
            <rect x="9" y="-96" width="10" height="36" rx="5" fill={p.shirt} />
            <circle cx="14" cy="-59" r="5.5" fill={p.skin} />
          </g>
        </g>
      </g>
      {/* globo de la persona */}
      <g transform="translate(0,-142)">
        <Bubble text={p.say[0]} cls="pb" dx={L ? 34 : -34} n={19} />
      </g>
    </g>
  );
}

function Student({ x, y, s, skin, hair, shirt, delay }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-20" y="-78" width="40" height="40" rx="8" fill="#B08A5A" />
      <rect x="-16" y="-88" width="32" height="46" rx="12" fill={shirt} />
      <circle cx="0" cy="-106" r="14" fill={skin} />
      <path d="M-14 -108a14 14 0 0 1 28 0q-7-8-14-7-7-1-14 7z" fill={hair} />
      <circle cx="-5" cy="-105" r="1.8" fill="#1b1b1b" /><circle cx="5" cy="-105" r="1.8" fill="#1b1b1b" />
      <g className="st-arm" style={{ animationDelay: `${delay}s` }}>
        <rect x="13" y="-84" width="9" height="30" rx="4.5" fill={shirt} />
        <circle cx="17.5" cy="-52" r="5" fill={skin} />
      </g>
      <rect x="-36" y="-50" width="72" height="8" rx="3" fill="#EAD7AE" />
      <rect x="-32" y="-42" width="64" height="42" rx="3" fill="#D9C08C" />
      <rect x="-12" y="-57" width="22" height="7" rx="1.5" fill="#fff" />
    </g>
  );
}

export default function FondoAula({ children, dim = 0.15, className = "", isSimulation = false }) {
  const [wide, setWide] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-aspect-ratio: 4/5)");
    const on = () => setWide(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return (
    <div className={`fa-root ${className}`}>
      <style>{CSS}</style>
      <svg className="fa-svg" aria-hidden="true"
        viewBox={wide ? "0 0 1000 600" : "230 0 540 600"}
        preserveAspectRatio={isSimulation ? "none" : (wide ? "xMidYMax slice" : "xMidYMax meet")}>
        <defs>
          <linearGradient id="fa-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CBE1E6" /><stop offset="1" stopColor="#B7D3DA" /></linearGradient>
          <linearGradient id="fa-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#CFA574" /><stop offset="1" stopColor="#A87C4F" /></linearGradient>
          <linearGradient id="fa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7CC8FF" /><stop offset="1" stopColor="#E3F4FF" /></linearGradient>
          <linearGradient id="fa-beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <radialGradient id="fa-vig" cx="50%" cy="55%" r="75%"><stop offset=".6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#0A1A24" stopOpacity=".35" /></radialGradient>
          <clipPath id="fa-win"><rect x="48" y="78" width="184" height="164" rx="3" /></clipPath>
        </defs>

        {/* ---------- Pared y piso ---------- */}
        <rect width="1000" height="400" fill="url(#fa-wall)" />
        <rect y="330" width="1000" height="64" fill="#A5C9D0" />
        <rect y="328" width="1000" height="4" fill="#fff" opacity=".6" />
        <rect y="392" width="1000" height="10" fill="#7C5E40" />
        <rect y="400" width="1000" height="200" fill="url(#fa-floor)" />
        {[424, 452, 486, 524, 568].map((y) => <line key={y} x1="0" x2="1000" y1={y} y2={y} stroke="#000" opacity=".08" />)}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => <line key={i} x1={i * 110 + 20} x2={i * 110 - 30 + (i - 4.5) * 40} y1="402" y2="600" stroke="#000" opacity=".05" />)}

        {/* ---------- Ventana ---------- */}
        <rect x="38" y="68" width="204" height="184" rx="8" fill="#F4F7F8" />
        <g clipPath="url(#fa-win)">
          <rect x="48" y="78" width="184" height="164" fill="url(#fa-sky)" />
          <circle cx="190" cy="112" r="20" fill="#FFE27A" className="fa-sun" />
          <g className="cloud c1"><ellipse cx="80" cy="120" rx="30" ry="11" fill="#fff" /><ellipse cx="102" cy="112" rx="20" ry="11" fill="#fff" /></g>
          <g className="cloud c2"><ellipse cx="40" cy="170" rx="24" ry="9" fill="#fff" opacity=".85" /><ellipse cx="58" cy="164" rx="15" ry="9" fill="#fff" opacity=".85" /></g>
          <path d="M48 242 L48 210 Q90 190 130 212 T232 205 L232 242Z" fill="#7FBF7A" />
        </g>
        <rect x="138" y="78" width="4" height="164" fill="#F4F7F8" /><rect x="48" y="158" width="184" height="4" fill="#F4F7F8" />
        <rect x="32" y="250" width="216" height="10" rx="3" fill="#fff" />
        <polygon points="70,402 230,402 360,596 120,596" fill="url(#fa-beam)" className="fa-beam" />

        {/* ---------- Pizarra inteligente ---------- */}
        <rect x="324" y="64" width="352" height="192" rx="12" fill="#2E3A42" />
        <rect x="334" y="74" width="332" height="172" rx="7" fill="#0F2A33" />
        <text x="350" y="102" className="fa-board-h">Plan de clase · Hoy</text>
        <text x="350" y="119" className="fa-board-s">Ciencias · 5.º primaria</text>
        <text x="640" y="102" className="fa-spark" fill="#6EE7F9" fontSize="20">✦</text>
        {["Inicio: pregunta detonante", "Desarrollo: experimento guiado", "Cierre: mapa conceptual", "Evaluación: rúbrica de 4 criterios"].map((t, i) => (
          <g key={t} className="brow" style={{ "--i": i }}>
            <rect x="350" y={134 + i * 25} width="16" height="16" rx="5" fill="#5EE0B0" />
            <path d={`M354 ${142 + i * 25}l3 3 6-6`} stroke="#0F2A33" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="376" y={147 + i * 25} className="fa-board-t">{t}</text>
          </g>
        ))}
        <rect x="350" y="234" width="300" height="5" rx="2.5" fill="#fff" opacity=".12" />
        <rect x="350" y="234" width="300" height="5" rx="2.5" fill="#6EE7F9" className="fa-prog" />
        <rect x="320" y="256" width="360" height="8" rx="3" fill="#5B4636" />

        {/* ---------- Reloj, afiches, estante ---------- */}
        <circle cx="500" cy="36" r="21" fill="#fff" stroke="#2E3A42" strokeWidth="4" />
        <line x1="500" y1="36" x2="500" y2="22" stroke="#2E3A42" strokeWidth="2.4" strokeLinecap="round" className="hand-m" />
        <line x1="500" y1="36" x2="510" y2="36" stroke="#2E3A42" strokeWidth="3" strokeLinecap="round" className="hand-h" />

        <rect x="262" y="96" width="46" height="62" rx="4" fill="#FFC857" /><circle cx="285" cy="122" r="12" fill="#FF7A66" /><rect x="270" y="142" width="30" height="5" rx="2" fill="#fff" />
        <rect x="696" y="92" width="50" height="40" rx="4" fill="#3B6BFF" /><circle cx="712" cy="112" r="7" fill="#FFE27A" /><circle cx="730" cy="106" r="4" fill="#fff" /><circle cx="728" cy="122" r="3" fill="#B79CFF" />
        <rect x="696" y="142" width="50" height="40" rx="4" fill="#5EE0B0" /><path d="M704 172l12-18 8 10 8-12 10 20z" fill="#0F2A33" opacity=".6" />

        <rect x="772" y="150" width="190" height="244" rx="4" fill="#8A6A4A" />
        {[0, 1, 2].map((r) => (
          <g key={r}>
            <rect x="780" y={158 + r * 78} width="174" height="68" fill="#6F5339" />
            {BOOKS.concat(BOOKS).slice(r * 2, r * 2 + 8).map((c, i) => (
              <rect key={i} x={786 + i * 20} y={166 + r * 78 + (i % 3) * 3} width="15" height={58 - (i % 3) * 3} rx="2" fill={c} />
            ))}
          </g>
        ))}
        <rect x="810" y="118" width="26" height="32" rx="4" fill="#C0643C" />
        <g className="leaf"><ellipse cx="823" cy="104" rx="9" ry="18" fill="#4EA05A" /><ellipse cx="810" cy="110" rx="8" ry="15" fill="#3C8A49" transform="rotate(-30 810 110)" /><ellipse cx="836" cy="110" rx="8" ry="15" fill="#5DB36A" transform="rotate(30 836 110)" /></g>

        {/* ---------- Estudiantes sentados ---------- */}
        <Student x={92} y={468} s={0.85} skin="#E8B48C" hair="#3B2A20" shirt="#6EC1FF" delay={0} />
        <Student x={182} y={452} s={0.78} skin="#8D5A3C" hair="#17120F" shirt="#FFC857" delay={4} />
        <Student x={812} y={470} s={0.85} skin="#F5D0B5" hair="#7A3B1E" shirt="#FF8FC7" delay={2} />
        <Student x={904} y={454} s={0.78} skin="#C98E64" hair="#1E1E2A" shirt="#5EE0B0" delay={6} />

        {/* ---------- Robot asistente ---------- */}
        <g transform="translate(500,528) scale(1.15)">
          <ellipse cx="0" cy="0" rx="52" ry="8" fill="#000" opacity=".22" />
          <ellipse cx="0" cy="-3" rx="44" ry="6" fill="#6EE7F9" opacity=".45" className="fa-glow" />
          <g className="r-float">
            <rect x="-30" y="-28" width="60" height="18" rx="9" fill="#9FB3C0" />
            <rect x="-50" y="-98" width="13" height="50" rx="6.5" fill="#D3E1EA" />
            <rect x="-36" y="-102" width="72" height="78" rx="24" fill="#EAF2F6" />
            <rect x="-22" y="-90" width="44" height="30" rx="9" fill="#12303A" />
            {[-14, -6, 2, 10].map((x, i) => <rect key={x} className="vbar" style={{ animationDelay: `${i * 0.18}s` }} x={x} y="-80" width="6" height="14" rx="3" fill="#6EE7F9" />)}
            <circle cx="0" cy="-44" r="5" fill="#6EE7F9" className="r-pulse" />
            <g className="r-arm">
              <rect x="37" y="-98" width="13" height="50" rx="6.5" fill="#D3E1EA" />
              <circle cx="43.5" cy="-46" r="7" fill="#EAF2F6" />
            </g>
            <rect x="-8" y="-110" width="16" height="10" fill="#9FB3C0" />
            <g className="r-head">
              <rect x="-40" y="-142" width="7" height="18" rx="3" fill="#9FB3C0" /><rect x="33" y="-142" width="7" height="18" rx="3" fill="#9FB3C0" />
              <line x1="0" y1="-162" x2="0" y2="-174" stroke="#9FB3C0" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-178" r="5" fill="#FF7A66" className="r-pulse" />
              <rect x="-34" y="-162" width="68" height="54" rx="20" fill="#EAF2F6" />
              <rect x="-26" y="-154" width="52" height="38" rx="14" fill="#0F2233" />
              <circle className="r-eye" cx="-11" cy="-138" r="5.5" fill="#6EE7F9" />
              <circle className="r-eye" cx="11" cy="-138" r="5.5" fill="#6EE7F9" />
              <path d="M-7 -127q7 6 14 0" stroke="#6EE7F9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="-19" cy="-128" r="3" fill="#FF8FC7" opacity=".5" /><circle cx="19" cy="-128" r="3" fill="#FF8FC7" opacity=".5" />
            </g>
          </g>
        </g>
        {/* globos del robot (uno por cada persona) */}
        {CAST.map((p, k) => (
          <g key={k} transform="translate(500,312)" style={{ "--dl": `${-k * 4}s` }}>
            <Bubble text={p.say[1]} cls="rb" fill="#6EE7F9" n={24} />
          </g>
        ))}

        {/* ---------- Personas caminando ---------- */}
        {[...CAST.map((p, k) => ({ p, k }))].sort((a, b) => a.p.y - b.p.y).map(({ p, k }) => <Person key={k} p={p} k={k} />)}

        <rect width="1000" height="600" fill="url(#fa-vig)" />
      </svg>
      <div className="fa-dim" style={{ background: `rgba(8,20,30,${dim})` }} />
      <div className="fa-content">{children}</div>
    </div>
  );
}

const CSS = `
.fa-root{position:relative;overflow:hidden;min-height:100vh;min-height:100dvh;background:#CBE1E6;isolation:isolate;font-family:system-ui,-apple-system,'Segoe UI',sans-serif}
.fa-root *{box-sizing:border-box}
.fa-svg{position:absolute;inset:0;width:100%;height:100%;z-index:-2;pointer-events:none}
.fa-dim{position:absolute;inset:0;z-index:-1;pointer-events:none}
.fa-content{position:relative;z-index:1;display:flex;flex-direction:column;min-height:100vh;}

.fa-t{font-size:12.5px;font-weight:600;fill:#10222F}
.fa-board-h{font-size:18px;font-weight:700;fill:#fff}
.fa-board-s{font-size:11px;fill:#8EC5CF}
.fa-board-t{font-size:13px;fill:#EAF6F8}

/* ----- Personas: entrar, hablar, salir (ciclo de 24 s) ----- */
.pw{--T:24s;transform:translate(var(--x1),var(--y)) scale(var(--s));animation:fa-walk var(--T) linear var(--dl) infinite}
@keyframes fa-walk{0%{transform:translate(var(--x0),var(--y)) scale(var(--s))}22%,78%{transform:translate(var(--x1),var(--y)) scale(var(--s))}100%{transform:translate(var(--x0),var(--y)) scale(var(--s))}}
.pf{transform-origin:0 0;animation:fa-flip var(--T) linear var(--dl) infinite}
@keyframes fa-flip{0%,77.9%{transform:scaleX(var(--f0))}78%,100%{transform:scaleX(var(--f1))}}

.p-walk{opacity:0;animation:fa-vw var(--T) steps(1,end) var(--dl) infinite}
.p-stand{animation:fa-vs var(--T) steps(1,end) var(--dl) infinite}
@keyframes fa-vw{0%{opacity:1}22%{opacity:0}78%{opacity:1}100%{opacity:1}}
@keyframes fa-vs{0%{opacity:0}22%{opacity:1}78%{opacity:0}100%{opacity:0}}
.wl{transform-origin:-5px -54px;animation:fa-sw .6s ease-in-out infinite alternate}
.wr{transform-origin:6px -54px;animation:fa-sw .6s ease-in-out infinite alternate-reverse}
@keyframes fa-sw{from{transform:rotate(28deg)}to{transform:rotate(-28deg)}}
.p-bob{animation:fa-pbob 2.6s ease-in-out infinite}
@keyframes fa-pbob{50%{transform:translateY(-1.5px)}}

.p-arm{transform-origin:14px -94px;animation:fa-parm var(--T) ease-in-out var(--dl) infinite}
@keyframes fa-parm{0%,28%{transform:rotate(0)}31%{transform:rotate(-125deg)}34%{transform:rotate(-100deg)}37%{transform:rotate(-125deg)}40%{transform:rotate(-100deg)}43%{transform:rotate(-125deg)}47%,100%{transform:rotate(0)}}
.p-mouth{transform-box:fill-box;transform-origin:center;animation:fa-talk var(--T) steps(1,end) var(--dl) infinite}
@keyframes fa-talk{0%,28%{transform:scaleY(1)}30%{transform:scaleY(-.6)}32%{transform:scaleY(1)}34%{transform:scaleY(-.6)}36%{transform:scaleY(1)}38%{transform:scaleY(-.6)}40%{transform:scaleY(1)}42%{transform:scaleY(-.6)}44%,100%{transform:scaleY(1)}}

.pb{opacity:0;transform-origin:0 0;animation:fa-pb var(--T) ease-out var(--dl) infinite}
@keyframes fa-pb{0%,27%{opacity:0;transform:scale(.6)}29%,45%{opacity:1;transform:scale(1)}47%,100%{opacity:0;transform:scale(.8)}}
.rb{opacity:0;transform-origin:0 0;animation:fa-rb 24s ease-out var(--dl) infinite}
@keyframes fa-rb{0%,45%{opacity:0;transform:scale(.6)}47.5%,61%{opacity:1;transform:scale(1)}63%,100%{opacity:0;transform:scale(.8)}}

/* ----- Robot ----- */
.r-float{animation:fa-rf 3.2s ease-in-out infinite}
@keyframes fa-rf{50%{transform:translateY(-5px)}}
.r-head{transform-origin:0 -108px;animation:fa-rh 5s ease-in-out infinite}
@keyframes fa-rh{0%,100%{transform:rotate(0)}25%{transform:rotate(-5deg)}70%{transform:rotate(5deg)}}
.r-arm{transform-origin:43px -94px;animation:fa-ra 6s ease-in-out infinite}
@keyframes fa-ra{0%,60%,100%{transform:rotate(0)}68%{transform:rotate(-110deg)}74%{transform:rotate(-80deg)}80%{transform:rotate(-110deg)}88%{transform:rotate(0)}}
.r-eye{transform-box:fill-box;transform-origin:center;animation:fa-blink 4.5s infinite}
@keyframes fa-blink{0%,93%,100%{transform:scaleY(1)}96.5%{transform:scaleY(.1)}}
.r-pulse{transform-box:fill-box;transform-origin:center;animation:fa-pulse 1.6s ease-in-out infinite}
@keyframes fa-pulse{50%{transform:scale(1.4);opacity:.6}}
.vbar{transform-box:fill-box;transform-origin:bottom;animation:fa-vb .8s ease-in-out infinite alternate}
@keyframes fa-vb{from{transform:scaleY(.25)}to{transform:scaleY(1.5)}}
.fa-glow{animation:fa-gl 3s ease-in-out infinite}
@keyframes fa-gl{50%{opacity:.8}}

/* ----- Pizarra y ambiente ----- */
.brow{opacity:0;animation:fa-row 12s ease infinite;animation-delay:calc(var(--i) * 1.3s)}
@keyframes fa-row{0%{opacity:0;transform:translateX(-12px)}8%,80%{opacity:1;transform:none}92%,100%{opacity:0}}
.fa-prog{transform-box:fill-box;transform-origin:left;animation:fa-pg 12s ease infinite}
@keyframes fa-pg{0%{transform:scaleX(0)}70%,90%{transform:scaleX(1)}100%{transform:scaleX(0)}}
.fa-spark{transform-box:fill-box;transform-origin:center;animation:fa-sp 3s linear infinite}
@keyframes fa-sp{to{transform:rotate(360deg)}}
.cloud{animation:fa-cl 46s linear infinite}.cloud.c2{animation-duration:70s;animation-delay:-30s}
@keyframes fa-cl{from{transform:translateX(-80px)}to{transform:translateX(290px)}}
.fa-sun{animation:fa-pulse 5s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
.fa-beam{animation:fa-bm 6s ease-in-out infinite}
@keyframes fa-bm{50%{opacity:.55}}
.hand-m{transform-origin:500px 36px;animation:fa-sp 30s linear infinite}
.hand-h{transform-origin:500px 36px;animation:fa-sp 360s linear infinite}
.leaf{transform-origin:823px 118px;animation:fa-leaf 5s ease-in-out infinite}
@keyframes fa-leaf{50%{transform:rotate(3deg)}}
.st-arm{transform-origin:13px -82px;animation:fa-st 14s ease-in-out infinite}
@keyframes fa-st{0%,40%{transform:rotate(0)}45%,60%{transform:rotate(-165deg)}66%,100%{transform:rotate(0)}}

@media(prefers-reduced-motion:reduce){
  .fa-root *{animation:none!important}
  .brow{opacity:1}
  .fa-prog{transform:scaleX(1)}
}
`;
