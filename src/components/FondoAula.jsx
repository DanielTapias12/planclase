import { useEffect, useState } from "react";

/* ------------------------------------------------------------------
   FondoAula: salón de clase animado. Cuatro personas del equipo entran, caminan hasta
   el robot asistente, conversan y se van. Todo en SVG + CSS.

   Uso:
   <FondoAula dim={0.25}>  ...tu contenido...  </FondoAula>
   - dim: oscurece un poco el fondo (0 a 1) para que tu texto se lea.
------------------------------------------------------------------- */

/* Elenco: 4 personajes inspirados en las fotos del equipo.
   act = acción: both (manos arriba), camera (toma una foto), pocket (manos en bolsillos), wave (saluda) */
const STEP = 6;
const CAST = [
  {
    id: "bob", act: "both", sleeve: "short", bracelet: true, skin: "#EFC1A2", hair: "#221A1C", shirt: "#F6D9DC", pants: "#5B7FB0", side: "L", x1: 385, y: 512, s: 0.98,
    say: ["¡Hola, Robi! ¿Creamos un plan?", "¡Hola! Cuéntame el tema y el grado ✨"]
  },
  {
    id: "cam", act: "camera", sleeve: "long", skin: "#C99068", hair: "#16141A", shirt: "#1E1B22", pants: "#2B2D3A", side: "R", x1: 615, y: 518, s: 1,
    say: ["¿Te tomo una foto, Robi?", "¡Claro! ¡Sonrío! 📸"]
  },
  {
    id: "curly", act: "pocket", sleeve: "none", skin: "#B9805C", hair: "#1A1210", shirt: "#EBDDBE", pants: "#EADFC9", side: "L", x1: 310, y: 552, s: 1.08,
    say: ["¿Me ayudas con una rúbrica?", "¡Listo! Ya está en la pizarra ✓"]
  },
  {
    id: "white", act: "wave", sleeve: "short", skin: "#C58D66", hair: "#15110F", shirt: "#F7F8FA", pants: "#2F3E5C", side: "R", x1: 695, y: 552, s: 1.08,
    say: ["¡Buenos días! Quiero actividades", "Te preparé 3 con juegos 🎲"]
  },
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

/* ---------- Utilidades de color para sombreado ---------- */
const hx = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (h, t) => {
  const tgt = t > 0 ? 255 : 0;
  return "#" + hx(h).map((v) => Math.round(v + (tgt - v) * Math.abs(t)).toString(16).padStart(2, "0")).join("");
};

/* Degradados de piel, pelo, camisa y pantalón por personaje (efecto volumen 3D) */
function CastDefs() {
  return CAST.map((p) => (
    <g key={p.id}>
      <radialGradient id={`sk-${p.id}`} cx=".38" cy=".3" r=".85">
        <stop offset="0" stopColor={mix(p.skin, 0.22)} /><stop offset=".55" stopColor={p.skin} /><stop offset="1" stopColor={mix(p.skin, -0.28)} />
      </radialGradient>
      <linearGradient id={`hr-${p.id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={mix(p.hair, 0.3)} /><stop offset=".55" stopColor={p.hair} /><stop offset="1" stopColor={mix(p.hair, -0.35)} />
      </linearGradient>
      <linearGradient id={`sh-${p.id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={mix(p.shirt, 0.22)} /><stop offset="1" stopColor={mix(p.shirt, -0.22)} />
      </linearGradient>
      <linearGradient id={`pn-${p.id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={mix(p.pants, 0.18)} /><stop offset="1" stopColor={mix(p.pants, -0.25)} />
      </linearGradient>
    </g>
  ));
}

function HairBack({ p }) {
  const hr = `url(#hr-${p.id})`;
  if (p.id === "bob") return <path d="M-21 -124 C-22 -152 26 -152 25 -124 L25 -101 Q25 -96 20 -97 L-16 -97 Q-21 -97 -21 -102Z" fill={hr} />;
  if (p.id === "curly") return (
    <g fill={hr}>
      <path d="M-25 -126 C-26 -156 29 -156 27 -124 C31 -108 29 -80 23 -72 C16 -66 -8 -66 -19 -72 C-29 -80 -29 -110 -25 -126Z" />
      {[[-24, -102], [-25, -90], [-21, -77], [-10, -69], [26, -102], [27, -90], [22, -77]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6.5" />)}
    </g>
  );
  if (p.id === "cam") return (
    <g>
      <rect x="-32" y="-99" width="15" height="46" rx="7" fill="#34528A" />
      <rect x="-30" y="-97" width="4" height="40" rx="2" fill="#fff" opacity=".18" />
    </g>
  );
  return null;
}

const TORSO = "M-19 -100 C-19 -106 -12 -106 -6 -104 L10 -104 C16 -106 22 -102 21 -94 L19 -52 C19 -48 16 -46 12 -46 L-12 -46 C-16 -46 -19 -48 -19 -52Z";

function Torso({ p }) {
  const id = p.id, base = `url(#sh-${id})`;
  const rim = <path d="M17 -98 Q21 -76 18 -54" stroke="#fff" strokeOpacity=".28" strokeWidth="3" fill="none" strokeLinecap="round" />;
  const folds = <path d="M-8 -80 Q-4 -66 -9 -52 M6 -84 Q10 -70 6 -52" stroke="#000" strokeOpacity=".09" strokeWidth="2.6" fill="none" strokeLinecap="round" />;

  if (id === "curly") {
    const C = "M-18 -100 C-18 -106 -11 -106 -6 -104 L10 -104 C16 -106 21 -102 20 -94 L18 -68 L-17 -68Z";
    return (
      <g>
        <rect x="-16" y="-72" width="32" height="18" rx="6" fill={`url(#sk-${id})`} />
        <rect x="-20" y="-58" width="40" height="16" rx="7" fill={`url(#pn-${id})`} />
        <path d="M1 -55v17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        <path d={C} fill={base} /><path d={C} fill="url(#fa-croch)" />
        {[[-9, -92, "#D94F4F"], [6, -88, "#4A7BD0"], [-3, -79, "#D94F4F"], [11, -76, "#E8A33D"], [-11, -73, "#4A7BD0"]].map(([x, y, c], i) => <circle key={i} cx={x} cy={y} r="2.6" fill={c} />)}
        {[-13, -7, -1, 5, 11, 17].map((x) => <circle key={x} cx={x} cy="-68" r="3.4" fill={mix(p.shirt, -0.06)} />)}
        <path d="M-5 -104 Q2 -87 9 -104" stroke="#D9B65C" strokeWidth="1" fill="none" />
        {rim}
      </g>
    );
  }
  return (
    <g>
      <path d={TORSO} fill={base} />
      {id === "bob" && <>
        <path d={TORSO} fill="url(#fa-ging)" />
        <path d="M-6 -104 L2 -90 L10 -104z" fill="#1e1e1e" />
        <path d="M-5 -104 L2 -76 L9 -104" stroke="#3a3030" strokeWidth="1" fill="none" /><circle cx="2" cy="-76" r="2.4" fill="#6b5a5a" />
        <path d="M-4 -104 Q2 -88 8 -104" stroke="#d6d6d6" strokeWidth=".9" fill="none" /><circle cx="2" cy="-91" r="1.7" fill="#d6d6d6" />
      </>}
      {id === "white" && <>
        <path d="M-9 -104 L2 -92 L-13 -90z M13 -104 L2 -92 L17 -90z" fill="#E4E9EE" stroke="#cfd6dc" strokeWidth=".6" />
        <path d="M2 -92v44" stroke="#D3D9DE" strokeWidth="1.3" />
        {[-78, -64].map((y) => <circle key={y} cx="2" cy={y} r="1.4" fill="#B9C1C8" />)}
      </>}
      {id === "cam" && <>
        <path d="M-13 -104 Q2 -90 17 -104 Q2 -111 -13 -104Z" fill={mix(p.shirt, 0.14)} />
        <path d="M-1 -97v15M7 -97v15" stroke="#ddd" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="3" cy="-72" r="6" fill="none" stroke="#6EC1FF" strokeWidth="1.8" /><circle cx="3" cy="-72" r="2.2" fill="#6EC1FF" opacity=".7" />
        <rect x="-9" y="-58" width="24" height="4" rx="2" fill="#FF4FA3" />
        <path d="M-15 -103 L-13 -58" stroke="#34528A" strokeWidth="6" strokeLinecap="round" />
        <path d="M-9 -104 L12 -52" stroke="#2b2b2b" strokeWidth="5" /><path d="M-9 -104 L12 -52" stroke="#C0392B" strokeWidth="1" />
        <circle cx="2" cy="-93" r="2.2" fill="#6EC1FF" />
      </>}
      {folds}{rim}
    </g>
  );
}

function Head({ p }) {
  const id = p.id, sk = `url(#sk-${id})`, hr = `url(#hr-${id})`;
  const fem = id === "bob" || id === "curly";
  const HEAD = "M-17 -122 C-17 -150 21 -150 21 -122 C21 -108 12 -99 2 -99 C-8 -99 -17 -108 -17 -122Z";
  const brow = mix(p.hair, 0.05);
  return (
    <g>
      <rect x="-5" y="-106" width="15" height="14" rx="6" fill={sk} />
      <ellipse cx="2" cy="-97" rx="11" ry="4" fill="#000" opacity=".2" />
      <ellipse cx="-17" cy="-120" rx="3.6" ry="5.4" fill={sk} /><ellipse cx="-17" cy="-120" rx="1.5" ry="3" fill="#000" opacity=".13" />
      <path d={HEAD} fill={sk} />
      <path d="M18 -132 Q22 -118 17 -106" stroke="#fff" strokeOpacity=".28" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="-8" cy="-109" rx="5" ry="3.2" fill="#ff7a8a" opacity=".24" /><ellipse cx="15" cy="-109" rx="4.5" ry="3" fill="#ff7a8a" opacity=".24" />

      {/* barba (solo personaje con gafas) */}
      {id === "cam" && <>
        <path d="M-14 -108 Q-14 -99 2 -98 Q18 -99 20 -110 Q13 -102 2 -102 Q-8 -102 -14 -108Z" fill={hr} opacity=".75" />
        <path d="M-1 -108 Q6 -104 14 -108 Q6 -110 -1 -108Z" fill={hr} opacity=".7" />
      </>}

      {/* pelo frontal */}
      {id === "bob" && <g fill={hr}>
        <path d="M-19 -124 C-20 -152 24 -152 22 -126 C16 -139 6 -137 -1 -133 C-8 -130 -15 -129 -19 -124Z" />
        <path d="M-19 -124 C-21 -112 -20 -103 -16 -98 L-12 -100 C-14 -108 -14 -118 -13 -128Z" />
        <path d="M21 -126 C24 -114 23 -105 20 -100 L16 -103 C18 -110 18 -118 17 -128Z" />
      </g>}
      {id === "curly" && <g fill={hr}>
        <path d="M-20 -124 C-21 -153 25 -153 23 -126 C12 -140 0 -136 -8 -129 C-12 -126 -17 -125 -20 -124Z" />
        {[[-19, -110, 5.5], [-21, -98, 5.5], [23, -112, 5], [24, -100, 5]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} />)}
      </g>}
      {id === "white" && <g fill={hr}>
        <path d="M-18 -124 C-18 -151 22 -151 22 -126 C14 -136 4 -134 -2 -131 C-8 -129 -14 -128 -18 -124Z" />
        {[[-12, -139], [-5, -145], [4, -147], [13, -143], [19, -135], [-17, -130]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5.2" />)}
      </g>}
      {id === "cam" && <g fill={hr}>
        <path d="M-18 -124 C-18 -151 22 -151 22 -126 C14 -138 4 -137 -3 -133 C-9 -130 -14 -128 -18 -124Z" />
        {[[-7, -145], [3, -148], [13, -144]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" />)}
      </g>}
      <path d="M-8 -143 Q4 -149 15 -142" stroke="#fff" strokeOpacity=".3" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {id === "curly" && <path d="M-14 -108q-3 6 0 12M-10 -140q8-5 16-2" stroke="#9A6544" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".7" />}

      {/* ojos grandes y expresivos */}
      <g className="p-eyes">
        {[[-5, 5.4, 6.4], [11, 4.7, 6]].map(([cx, rx, ry], i) => (
          <g key={i}>
            <ellipse cx={cx} cy="-121" rx={rx} ry={ry} fill="#fff" />
            <circle cx={cx + 1.3} cy="-120.5" r={rx * 0.74} fill="url(#fa-iris)" />
            <circle cx={cx + 1.5} cy="-120.5" r={rx * 0.36} fill="#0b0805" />
            <circle cx={cx - 0.2} cy="-122.6" r={rx * 0.3} fill="#fff" />
            <circle cx={cx + 3} cy="-118.6" r={rx * 0.14} fill="#fff" opacity=".8" />
            <path d={`M${cx - rx} -122 Q${cx} ${-121 - ry * 1.4} ${cx + rx} -122`} stroke="#1a1010" strokeWidth="1.7" fill="none" strokeLinecap="round" />
            {fem && <path d={`M${cx + rx} -122 l3 -2.5 M${cx + rx - 1} -124.5 l2.6 -3`} stroke="#1a1010" strokeWidth="1.2" strokeLinecap="round" />}
          </g>
        ))}
      </g>
      <g className="p-brows" fill="none" stroke={brow} strokeWidth={fem ? 1.8 : 2.6} strokeLinecap="round">
        <path d="M-10 -131 Q-5 -134 0 -131.5" /><path d="M6.5 -131.5 Q11 -134 16 -131" />
      </g>
      <path d="M5 -118 Q9 -110 5 -108" stroke={mix(p.skin, -0.38)} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="7" cy="-113" rx="1.4" ry="2" fill="#fff" opacity=".25" />

      {/* boca: sonrisa y boca abierta cuando habla */}
      {fem && <path d="M0 -105 Q6 -102 13 -105 Q6 -100 0 -105Z" fill="#D26B7A" />}
      <path d="M-1 -105 Q6 -99 14 -105" stroke="#8A3B3B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <g className="p-open">
        <path d="M-1 -105 Q6 -95 14 -105 Q6 -103 -1 -105Z" fill="#5b1d28" />
        <path d="M1 -104.4 Q6 -103 12 -104.4 L11 -102.6 Q6 -101.6 2 -102.6Z" fill="#fff" />
        <ellipse cx="6.5" cy="-99.6" rx="3.4" ry="1.4" fill="#E0707A" />
      </g>

      {/* accesorios */}
      {id === "cam" && (
        <g fill="#bfe3ff" fillOpacity=".16" stroke="#1f2742" strokeWidth="2">
          <rect x="-12" y="-128" width="15" height="13" rx="5.5" /><rect x="4" y="-128" width="14" height="13" rx="5.5" />
          <path d="M3 -122q.5-2 1 0M-12 -122L-17 -123" fill="none" />
        </g>
      )}
      {id === "curly" && (
        <g>
          <rect x="-7" y="-155" width="26" height="6" rx="3" fill="#1b1b1b" />
          <ellipse cx="0" cy="-152" rx="5" ry="3" fill="#2b2b2b" /><ellipse cx="13" cy="-152" rx="5" ry="3" fill="#2b2b2b" />
          <path d="M-3 -153.5q3-1.5 6 0" stroke="#fff" strokeOpacity=".5" strokeWidth="1" fill="none" />
        </g>
      )}
    </g>
  );
}

function Limb({ p, x, cls, hand = true, extra }) {
  const cx = x + 5, sk = `url(#sk-${p.id})`, sh = `url(#sh-${p.id})`;
  return (
    <g className={cls}>
      <rect x={x} y="-97" width="10" height="38" rx="5" fill={p.sleeve === "long" ? sh : sk} />
      {p.sleeve === "short" && <path d={`M${x - 2} -97 q7 -4 14 0 l0 17 q-7 3 -14 0z`} fill={sh} />}
      {p.sleeve === "long" && <rect x={x - 0.5} y="-67" width="11" height="6" rx="3" fill={mix(p.shirt, -0.25)} />}
      {p.bracelet && <rect x={x} y="-68" width="10" height="4" rx="2" fill="#1b1b1b" />}
      {hand && <><circle cx={cx} cy="-58" r="6" fill={sk} /><ellipse cx={cx + 4} cy="-62" rx="2.2" ry="3.6" fill={sk} /></>}
      {extra}
    </g>
  );
}

const Camera = () => (
  <g>
    <rect x="10" y="-66" width="22" height="14" rx="3" fill="#1d1d1d" />
    <rect x="14" y="-70" width="8" height="4" rx="1" fill="#333" />
    <circle cx="25" cy="-59" r="5" fill="#0d0d0d" stroke="#888" strokeWidth="1.2" />
    <circle cx="23.6" cy="-60.4" r="1.3" fill="#fff" opacity=".7" />
    <circle className="p-flash" cx="25" cy="-59" r="12" fill="#fff" />
  </g>
);

const Shoe = ({ x }) => (
  <g>
    <rect x={x} y="-8" width="17" height="8" rx="4" fill="#2a2a33" />
    <rect x={x} y="-2.5" width="17" height="2.5" rx="1.2" fill="#f2f2f2" />
  </g>
);

function Person({ p, k }) {
  const L = p.side === "L";
  const wide = p.id === "curly";
  const lw = wide ? 15 : 11, xl = wide ? -18 : -12, xr = wide ? 3 : 1;
  const style = {
    "--x0": L ? "-90px" : "1090px", "--x1": `${p.x1}px`, "--y": `${p.y}px`, "--s": p.s,
    "--f0": L ? 1 : -1, "--f1": L ? -1 : 1, "--dl": `${-k * STEP}s`,
  };
  const hand = p.act !== "pocket";
  const pn = `url(#pn-${p.id})`;
  return (
    <g className={`pw act-${p.act}`} style={style}>
      <g className="pf">
        <ellipse cx="0" cy="0" rx="32" ry="7" fill="url(#fa-shadow)" />
        <g className="p-stand">
          <rect x={xl} y="-58" width={lw} height="52" rx="5" fill={pn} />
          <rect x={xr} y="-58" width={lw} height="52" rx="5" fill={pn} />
          <Shoe x={xl - 2} /><Shoe x={xr} />
        </g>
        <g className="p-walk">
          <g className="wl"><rect x={xl} y="-58" width={lw} height="52" rx="5" fill={pn} /><Shoe x={xl - 2} /></g>
          <g className="wr"><rect x={xr} y="-58" width={lw} height="52" rx="5" fill={pn} /><Shoe x={xr - 2} /></g>
        </g>
        <g className="p-bob">
          <HairBack p={p} />
          <Limb p={p} x={-27} cls="a-b" hand={hand} />
          <Torso p={p} />
          <Head p={p} />
          <Limb p={p} x={16} cls="a-f" hand={hand} extra={p.act === "camera" ? <Camera /> : null} />
        </g>
      </g>
      <g transform="translate(0,-164)">
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
          <CastDefs />
          <radialGradient id="fa-iris" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#9A6338" /><stop offset="1" stopColor="#2B1609" /></radialGradient>
          <radialGradient id="fa-shadow"><stop offset="0" stopColor="#000" stopOpacity=".42" /><stop offset="1" stopColor="#000" stopOpacity="0" /></radialGradient>
          <pattern id="fa-ging" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="4" height="8" fill="#E39AAA" opacity=".35" /><rect width="8" height="4" fill="#E39AAA" opacity=".35" /></pattern>
          <pattern id="fa-croch" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="#fff" opacity=".6" /></pattern>
          <linearGradient id="fa-rbody" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFFFFF" /><stop offset=".55" stopColor="#D5E4EE" /><stop offset="1" stopColor="#A9BDCC" /></linearGradient>
          <linearGradient id="fa-rmetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9D8E2" /><stop offset="1" stopColor="#7F95A5" /></linearGradient>
          <radialGradient id="fa-rscreen" cx=".5" cy=".4" r=".8"><stop offset="0" stopColor="#1B3F57" /><stop offset="1" stopColor="#081520" /></radialGradient>
          <radialGradient id="fa-reye" cx=".4" cy=".35" r=".8"><stop offset="0" stopColor="#CFFCFF" /><stop offset=".5" stopColor="#3DD0EC" /><stop offset="1" stopColor="#0E7FA3" /></radialGradient>
          <filter id="fa-dof"><feGaussianBlur stdDeviation=".9" /></filter>
          <radialGradient id="fa-warm" cx=".15" cy=".2" r=".7"><stop offset="0" stopColor="#FFE9B0" stopOpacity=".22" /><stop offset="1" stopColor="#FFE9B0" stopOpacity="0" /></radialGradient>

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
        <g filter="url(#fa-dof)">
          <Student x={92} y={468} s={0.85} skin="#E8B48C" hair="#3B2A20" shirt="#6EC1FF" delay={0} />
          <Student x={182} y={452} s={0.78} skin="#8D5A3C" hair="#17120F" shirt="#FFC857" delay={4} />
          <Student x={812} y={470} s={0.85} skin="#F5D0B5" hair="#7A3B1E" shirt="#FF8FC7" delay={2} />
          <Student x={904} y={454} s={0.78} skin="#C98E64" hair="#1E1E2A" shirt="#5EE0B0" delay={6} />
        </g>

        {/* ---------- Robot asistente ---------- */}
        <g transform="translate(500,528) scale(1.15)">
          <ellipse cx="0" cy="0" rx="56" ry="9" fill="url(#fa-shadow)" />
          <ellipse cx="0" cy="-3" rx="44" ry="6" fill="#6EE7F9" opacity=".45" className="fa-glow" />
          <g className="r-float">
            <rect x="-30" y="-28" width="60" height="18" rx="9" fill="url(#fa-rmetal)" />
            <rect x="-52" y="-98" width="14" height="50" rx="7" fill="url(#fa-rbody)" />
            <rect x="-37" y="-103" width="74" height="80" rx="28" fill="url(#fa-rbody)" />
            <path d="M-27 -90 Q-31 -70 -27 -48" stroke="#fff" strokeOpacity=".65" strokeWidth="5" fill="none" strokeLinecap="round" />
            <rect x="-22" y="-90" width="44" height="30" rx="9" fill="url(#fa-rscreen)" />
            {[-14, -6, 2, 10].map((x, i) => <rect key={x} className="vbar" style={{ animationDelay: `${i * 0.18}s` }} x={x} y="-80" width="6" height="14" rx="3" fill="#6EE7F9" />)}
            <circle cx="0" cy="-44" r="5" fill="#6EE7F9" className="r-pulse" />
            <g className="r-arm">
              <rect x="37" y="-98" width="14" height="50" rx="7" fill="url(#fa-rbody)" />
              <circle cx="44" cy="-46" r="8" fill="url(#fa-rbody)" />
            </g>
            <rect x="-8" y="-112" width="16" height="12" fill="url(#fa-rmetal)" />
            <g className="r-head">
              <rect x="-42" y="-144" width="8" height="20" rx="4" fill="url(#fa-rmetal)" /><rect x="34" y="-144" width="8" height="20" rx="4" fill="url(#fa-rmetal)" />
              <line x1="0" y1="-166" x2="0" y2="-178" stroke="#9FB3C0" strokeWidth="3" strokeLinecap="round" />
              <circle cx="0" cy="-182" r="5.5" fill="#FF7A66" className="r-pulse" />
              <rect x="-36" y="-166" width="72" height="58" rx="24" fill="url(#fa-rbody)" />
              <ellipse cx="-17" cy="-155" rx="14" ry="5" fill="#fff" opacity=".6" transform="rotate(-18 -17 -155)" />
              <rect x="-28" y="-158" width="56" height="42" rx="16" fill="url(#fa-rscreen)" />
              {[-12, 12].map((dx) => (
                <g key={dx} className="r-eye">
                  <ellipse cx={dx} cy="-138" rx="6.4" ry="7.6" fill="url(#fa-reye)" />
                  <circle cx={dx - 2} cy="-141" r="2.2" fill="#fff" /><circle cx={dx + 2.2} cy="-134.5" r="1" fill="#fff" opacity=".75" />
                </g>
              ))}
              <g className="r-brow" fill="none" stroke="#6EE7F9" strokeWidth="2.4" strokeLinecap="round">
                <path d="M-19 -149 Q-12 -153 -5 -149" /><path d="M5 -149 Q12 -153 19 -149" />
              </g>
              <path d="M-7 -126q7 6 14 0" stroke="#6EE7F9" strokeWidth="2.4" fill="none" strokeLinecap="round" />
              <circle cx="-20" cy="-128" r="3" fill="#FF8FC7" opacity=".5" /><circle cx="20" cy="-128" r="3" fill="#FF8FC7" opacity=".5" />
            </g>
          </g>
        </g>
        {/* globos del robot (uno por cada persona) */}
        {CAST.map((p, k) => (
          <g key={k} transform="translate(500,312)" style={{ "--dl": `${-k * STEP}s` }}>
            <Bubble text={p.say[1]} cls="rb" fill="#6EE7F9" n={24} />
          </g>
        ))}

        {/* ---------- Personas caminando ---------- */}
        {[...CAST.map((p, k) => ({ p, k }))].sort((a, b) => a.p.y - b.p.y).map(({ p, k }) => <Person key={k} p={p} k={k} />)}

        <rect width="1000" height="600" fill="url(#fa-warm)" />
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
.fa-content{position:relative;z-index:1}

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

/* ----- Acciones según personaje ----- */
.a-f{transform-origin:21px -96px}.a-b{transform-origin:-22px -96px}
.act-wave .a-f,.act-both .a-f{animation:fa-parm var(--T) ease-in-out var(--dl) infinite}
.act-both .a-b{animation:fa-parm2 var(--T) ease-in-out var(--dl) infinite}
@keyframes fa-parm2{0%,28%{transform:rotate(0)}31%{transform:rotate(-115deg)}34%{transform:rotate(-140deg)}37%{transform:rotate(-115deg)}40%{transform:rotate(-140deg)}43%{transform:rotate(-115deg)}47%,100%{transform:rotate(0)}}
.act-camera .a-f{animation:fa-cam var(--T) ease-in-out var(--dl) infinite}
@keyframes fa-cam{0%,44%{transform:rotate(0)}48%,62%{transform:rotate(-85deg)}67%,100%{transform:rotate(0)}}
.p-flash{opacity:0;transform-box:fill-box;transform-origin:center;animation:fa-flash var(--T) ease-out var(--dl) infinite}
@keyframes fa-flash{0%,51%{opacity:0;transform:scale(.3)}52.5%{opacity:.95;transform:scale(1.5)}56%,100%{opacity:0;transform:scale(1.8)}}
.act-pocket .p-bob{animation:fa-sway var(--T) ease-in-out var(--dl) infinite}
@keyframes fa-sway{0%,26%{transform:rotate(0)}34%,42%{transform:rotate(-2.5deg)}50%,100%{transform:rotate(0)}}

/* ----- Rostro: parpadeo, cejas y boca ----- */
.p-eyes{transform-origin:0 -121px;animation:fa-pe 5s infinite;animation-delay:calc(var(--dl) * .37)}
@keyframes fa-pe{0%,92%,100%{transform:scaleY(1)}95%{transform:scaleY(.08)}}
.p-brows{animation:fa-brow var(--T) ease-in-out var(--dl) infinite}
@keyframes fa-brow{0%,27%{transform:translateY(0)}30%,35%{transform:translateY(-2.2px)}38%{transform:translateY(0)}41%,44%{transform:translateY(-2.2px)}47%,100%{transform:translateY(0)}}
.p-open{opacity:0;transform-box:fill-box;transform-origin:center 20%;animation:fa-open var(--T) linear var(--dl) infinite}
@keyframes fa-open{0%,28%{opacity:0;transform:scaleY(.2)}29%{opacity:1;transform:scaleY(1)}31%{transform:scaleY(.35)}33%{transform:scaleY(1)}35%{transform:scaleY(.3)}37%{transform:scaleY(.95)}39%{transform:scaleY(.4)}41%{transform:scaleY(1)}43%{transform:scaleY(.3)}45%{transform:scaleY(.8)}46%{opacity:1;transform:scaleY(.3)}47%,100%{opacity:0}}
.r-brow{animation:fa-rbrow 4.6s ease-in-out infinite}
@keyframes fa-rbrow{0%,60%,100%{transform:translateY(0)}70%,80%{transform:translateY(-3px)}}

@media(prefers-reduced-motion:reduce){
  .fa-root *{animation:none!important}
  .brow{opacity:1}
  .fa-prog{transform:scaleX(1)}
}
`;
