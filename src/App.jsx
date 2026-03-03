import React, { useState, useRef, useEffect, useCallback } from "react";

/* ============================================================
   SCRIVI CON ME! v6 - Capacitor Android Build
   ============================================================ */

/* ====== SOUND ENGINE ====== */
const AC = typeof window !== "undefined" ? (window.AudioContext || window.webkitAudioContext) : null;
let _ac = null;
function ga() { if (!_ac && AC) _ac = new AC(); return _ac; }
function pt(f, d, t = "sine", v = 0.3, dl = 0) {
  try { const c = ga(); if (!c) return; if (c.state === "suspended") c.resume(); const o = c.createOscillator(), g = c.createGain(); o.type = t; o.frequency.value = f; g.gain.setValueAtTime(v, c.currentTime + dl); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dl + d); o.connect(g); g.connect(c.destination); o.start(c.currentTime + dl); o.stop(c.currentTime + dl + d + 0.05); } catch (e) {}
}
function sOk() { pt(523,.2,"sine",.25,0); pt(659,.2,"sine",.25,.12); pt(784,.3,"sine",.3,.24); pt(1047,.4,"triangle",.2,.38); }
function sAlm() { pt(440,.25,"sine",.2,0); pt(523,.3,"triangle",.18,.18); }
function sNo() { pt(330,.3,"sine",.15,0); pt(294,.35,"triangle",.12,.15); }
function sCl() { pt(880,.06,"sine",.1,0); }
function sAdv() { pt(880,.1,"sine",.15,0); pt(1175,.15,"triangle",.12,.08); }
function sDone() { pt(523,.3,"sine",.2,0); pt(659,.3,"sine",.2,.1); pt(784,.3,"sine",.2,.2); pt(1047,.5,"triangle",.25,.35); pt(1319,.6,"sine",.2,.5); }

/* ====== LETTER PATHS ====== */
const LP = {
  A:[{type:"line",x1:.5,y1:.1,x2:.2,y2:.9},{type:"line",x1:.5,y1:.1,x2:.8,y2:.9},{type:"line",x1:.3,y1:.6,x2:.7,y2:.6}],
  B:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.9},{type:"arc",cx:.25,cy:.32,rx:.28,ry:.22,start:-Math.PI/2,end:Math.PI/2},{type:"arc",cx:.25,cy:.68,rx:.32,ry:.22,start:-Math.PI/2,end:Math.PI/2}],
  C:[{type:"arc",cx:.5,cy:.5,rx:.3,ry:.38,start:-Math.PI*0.7,end:Math.PI*0.7,ccw:true}],
  D:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.9},{type:"arc",cx:.25,cy:.5,rx:.38,ry:.4,start:-Math.PI/2,end:Math.PI/2}],
  E:[{type:"line",x1:.3,y1:.1,x2:.3,y2:.9},{type:"line",x1:.3,y1:.1,x2:.75,y2:.1},{type:"line",x1:.3,y1:.5,x2:.65,y2:.5},{type:"line",x1:.3,y1:.9,x2:.75,y2:.9}],
  F:[{type:"line",x1:.3,y1:.1,x2:.3,y2:.9},{type:"line",x1:.3,y1:.1,x2:.75,y2:.1},{type:"line",x1:.3,y1:.5,x2:.65,y2:.5}],
  G:[{type:"arc",cx:.5,cy:.5,rx:.3,ry:.38,start:-Math.PI*0.7,end:Math.PI*0.7,ccw:true},{type:"line",x1:.5,y1:.5,x2:.78,y2:.5}],
  H:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.9},{type:"line",x1:.75,y1:.1,x2:.75,y2:.9},{type:"line",x1:.25,y1:.5,x2:.75,y2:.5}],
  I:[{type:"line",x1:.5,y1:.1,x2:.5,y2:.9},{type:"line",x1:.35,y1:.1,x2:.65,y2:.1},{type:"line",x1:.35,y1:.9,x2:.65,y2:.9}],
  L:[{type:"line",x1:.3,y1:.1,x2:.3,y2:.9},{type:"line",x1:.3,y1:.9,x2:.75,y2:.9}],
  M:[{type:"line",x1:.15,y1:.9,x2:.15,y2:.1},{type:"line",x1:.15,y1:.1,x2:.5,y2:.55},{type:"line",x1:.5,y1:.55,x2:.85,y2:.1},{type:"line",x1:.85,y1:.1,x2:.85,y2:.9}],
  N:[{type:"line",x1:.25,y1:.9,x2:.25,y2:.1},{type:"line",x1:.25,y1:.1,x2:.75,y2:.9},{type:"line",x1:.75,y1:.9,x2:.75,y2:.1}],
  O:[{type:"ellipse",cx:.5,cy:.5,rx:.3,ry:.38}],
  P:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.9},{type:"arc",cx:.25,cy:.32,rx:.32,ry:.22,start:-Math.PI/2,end:Math.PI/2}],
  Q:[{type:"ellipse",cx:.5,cy:.45,rx:.28,ry:.33},{type:"line",x1:.58,y1:.65,x2:.78,y2:.88}],
  R:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.9},{type:"arc",cx:.25,cy:.32,rx:.32,ry:.22,start:-Math.PI/2,end:Math.PI/2},{type:"line",x1:.5,y1:.54,x2:.75,y2:.9}],
  S:[{type:"arc",cx:.5,cy:.32,rx:.22,ry:.2,start:-Math.PI*0.8,end:Math.PI*0.1},{type:"arc",cx:.5,cy:.68,rx:.22,ry:.2,start:Math.PI*0.2,end:-Math.PI*0.9,ccw:true}],
  T:[{type:"line",x1:.2,y1:.1,x2:.8,y2:.1},{type:"line",x1:.5,y1:.1,x2:.5,y2:.9}],
  U:[{type:"line",x1:.25,y1:.1,x2:.25,y2:.6},{type:"arc",cx:.5,cy:.6,rx:.25,ry:.28,start:Math.PI,end:0},{type:"line",x1:.75,y1:.6,x2:.75,y2:.1}],
  V:[{type:"line",x1:.2,y1:.1,x2:.5,y2:.9},{type:"line",x1:.5,y1:.9,x2:.8,y2:.1}],
  Z:[{type:"line",x1:.2,y1:.1,x2:.8,y2:.1},{type:"line",x1:.8,y1:.1,x2:.2,y2:.9},{type:"line",x1:.2,y1:.9,x2:.8,y2:.9}],
};
const NP = {
  1:[{type:"line",x1:.38,y1:.25,x2:.5,y2:.1},{type:"line",x1:.5,y1:.1,x2:.5,y2:.9},{type:"line",x1:.32,y1:.9,x2:.68,y2:.9}],
  2:[{type:"arc",cx:.5,cy:.3,rx:.22,ry:.2,start:-Math.PI*.85,end:Math.PI*.15},{type:"line",x1:.7,y1:.42,x2:.25,y2:.9},{type:"line",x1:.25,y1:.9,x2:.78,y2:.9}],
  3:[{type:"arc",cx:.48,cy:.3,rx:.22,ry:.2,start:-Math.PI*.8,end:Math.PI*.3},{type:"arc",cx:.48,cy:.68,rx:.24,ry:.22,start:-Math.PI*.3,end:Math.PI*.8}],
  4:[{type:"line",x1:.62,y1:.1,x2:.2,y2:.6},{type:"line",x1:.2,y1:.6,x2:.78,y2:.6},{type:"line",x1:.62,y1:.1,x2:.62,y2:.9}],
  5:[{type:"line",x1:.7,y1:.1,x2:.3,y2:.1},{type:"line",x1:.3,y1:.1,x2:.28,y2:.45},{type:"arc",cx:.48,cy:.65,rx:.26,ry:.23,start:-Math.PI*.55,end:Math.PI*.8}],
  6:[{type:"arc",cx:.5,cy:.38,rx:.14,ry:.3,start:-Math.PI*.2,end:-Math.PI*.8,ccw:true},{type:"ellipse",cx:.48,cy:.66,rx:.22,ry:.2}],
  7:[{type:"line",x1:.24,y1:.1,x2:.76,y2:.1},{type:"line",x1:.76,y1:.1,x2:.4,y2:.9}],
  8:[{type:"ellipse",cx:.5,cy:.3,rx:.2,ry:.18},{type:"ellipse",cx:.5,cy:.68,rx:.22,ry:.2}],
  9:[{type:"ellipse",cx:.5,cy:.32,rx:.22,ry:.2},{type:"arc",cx:.5,cy:.6,rx:.14,ry:.3,start:Math.PI*.2,end:Math.PI*.8}],
  0:[{type:"ellipse",cx:.5,cy:.5,rx:.24,ry:.36}],
};
const PW = [
  {n:"Linea",ic:"\u2193",p:[{type:"line",x1:.5,y1:.15,x2:.5,y2:.85}]},
  {n:"Linea",ic:"\u2192",p:[{type:"line",x1:.15,y1:.5,x2:.85,y2:.5}]},
  {n:"Diag.",ic:"\u27CB",p:[{type:"line",x1:.15,y1:.15,x2:.85,y2:.85}]},
  {n:"Cerchio",ic:"\u25CB",p:[{type:"ellipse",cx:.5,cy:.5,rx:.32,ry:.32}]},
  {n:"Onda",ic:"\u223F",p:[{type:"arc",cx:.32,cy:.5,rx:.16,ry:.2,start:Math.PI,end:0},{type:"arc",cx:.64,cy:.5,rx:.16,ry:.2,start:0,end:Math.PI}]},
  {n:"Zigzag",ic:"\u26A1",p:[{type:"line",x1:.15,y1:.2,x2:.38,y2:.8},{type:"line",x1:.38,y1:.8,x2:.62,y2:.2},{type:"line",x1:.62,y1:.2,x2:.85,y2:.8}]},
  {n:"Spirale",ic:"\uD83C\uDF00",p:[{type:"arc",cx:.5,cy:.5,rx:.12,ry:.12,start:0,end:Math.PI*2},{type:"arc",cx:.5,cy:.5,rx:.22,ry:.22,start:0,end:Math.PI*2},{type:"arc",cx:.5,cy:.5,rx:.34,ry:.34,start:0,end:Math.PI*2}]},
  {n:"Quadr.",ic:"\u25A1",p:[{type:"line",x1:.25,y1:.2,x2:.75,y2:.2},{type:"line",x1:.75,y1:.2,x2:.75,y2:.8},{type:"line",x1:.75,y1:.8,x2:.25,y2:.8},{type:"line",x1:.25,y1:.8,x2:.25,y2:.2}]},
];
const LW={A:{w:"APE",e:"\uD83D\uDC1D"},B:{w:"BARCA",e:"\u26F5"},C:{w:"CASA",e:"\uD83C\uDFE0"},D:{w:"DADO",e:"\uD83C\uDFB2"},E:{w:"ELEFANTE",e:"\uD83D\uDC18"},F:{w:"FIORE",e:"\uD83C\uDF38"},G:{w:"GATTO",e:"\uD83D\uDC31"},H:{w:"HOTEL",e:"\uD83C\uDFE8"},I:{w:"ISOLA",e:"\uD83C\uDFDD"},L:{w:"LUNA",e:"\uD83C\uDF19"},M:{w:"MELA",e:"\uD83C\uDF4E"},N:{w:"NUVOLA",e:"\u2601"},O:{w:"ORSO",e:"\uD83D\uDC3B"},P:{w:"PALLA",e:"\u26BD"},Q:{w:"QUADRO",e:"\uD83D\uDDBC"},R:{w:"RANA",e:"\uD83D\uDC38"},S:{w:"SOLE",e:"\u2600"},T:{w:"TRENO",e:"\uD83D\uDE82"},U:{w:"UVA",e:"\uD83C\uDF47"},V:{w:"VOLPE",e:"\uD83E\uDD8A"},Z:{w:"ZEBRA",e:"\uD83E\uDD93"}};
const PENS=["#2D3436","#2196F3","#F44336","#4CAF50","#9C27B0","#FF9800"];
const GREAT=["BRAVO!","BRAVISSIMO!","FANTASTICO!","PERFETTO!","GRANDE!","SUPER!","MAGNIFICO!","CAMPIONE!"];
const ALMOST=["Quasi!","Ci sei quasi!","Bene, riprova!","Ancora un po'!","Quasi perfetto!"];
const RETRY=["Segui le linee!","Prova piano piano!","Guarda il tratteggio!","Segui i puntini!","Riprova con calma!"];
const pick=(a)=>a[Math.floor(Math.random()*a.length)];

/* ====== STROKE VALIDATION ====== */
function sampleG(gp, W) {
  const pts = []; if (!gp) return pts; const N = 28;
  gp.forEach(p => {
    if (p.type === "line") { for (let i = 0; i <= N; i++) { const t = i / N; pts.push({ x: (p.x1 + (p.x2 - p.x1) * t) * W, y: (p.y1 + (p.y2 - p.y1) * t) * W }); } }
    else if (p.type === "ellipse") { for (let i = 0; i <= N * 2; i++) { const a = (i / (N * 2)) * Math.PI * 2; pts.push({ x: (p.cx + p.rx * Math.cos(a)) * W, y: (p.cy + p.ry * Math.sin(a)) * W }); } }
    else if (p.type === "arc") { let s = p.start, e = p.end, ccw = p.ccw || false, r; if (ccw) { r = s - e; if (r < 0) r += Math.PI * 2; } else { r = e - s; if (r < 0) r += Math.PI * 2; } for (let i = 0; i <= N; i++) { const t = i / N, a = ccw ? s - r * t : s + r * t; pts.push({ x: (p.cx + (p.rx || 0) * Math.cos(a)) * W, y: (p.cy + (p.ry || 0) * Math.sin(a)) * W }); } }
  });
  return pts;
}
function evalS(drawn, gp, W) {
  const guide = sampleG(gp, W);
  if (guide.length === 0 || drawn.length < 8) return { score: 0, short: drawn.length < 8 };
  const tol = W * 0.13; let near = 0;
  drawn.forEach(d => { if (Math.min(...guide.map(g => Math.hypot(d.x - g.x, d.y - g.y))) < tol) near++; });
  const prec = near / drawn.length;
  const ct = W * 0.15; let cv = 0;
  guide.forEach(g => { if (Math.min(...drawn.map(d => Math.hypot(d.x - g.x, d.y - g.y))) < ct) cv++; });
  const cov = cv / guide.length;
  let len = 0; for (let i = 1; i < drawn.length; i++) len += Math.hypot(drawn[i].x - drawn[i - 1].x, drawn[i].y - drawn[i - 1].y);
  if (len < W * 0.25) return { score: 0, short: true };
  return { score: Math.round((prec * 0.4 + cov * 0.6) * 100), short: false };
}

/* ====== CANVAS ====== */
function Cvs({ gp, pc, pw, locked, clrSig, ptsRef }) {
  const cR = useRef(null), gR = useRef(null), dr = useRef(false), lp = useRef(null);
  const drawG = useCallback(() => {
    const cv = gR.current; if (!cv) return;
    const x = cv.getContext("2d"), w = cv.width, h = cv.height;
    x.clearRect(0, 0, w, h);
    x.strokeStyle = "#E8DCC8"; x.lineWidth = 1.5; x.setLineDash([]);
    [.1, .5, .9].forEach(y => { x.beginPath(); x.moveTo(0, y * h); x.lineTo(w, y * h); x.stroke(); });
    x.strokeStyle = "#D4C5A9"; x.setLineDash([8, 8]); x.beginPath(); x.moveTo(0, .5 * h); x.lineTo(w, .5 * h); x.stroke(); x.setLineDash([]);
    if (!gp?.length) return;
    x.strokeStyle = "#C4A8E8"; x.lineWidth = 5; x.setLineDash([6, 10]); x.lineCap = "round";
    gp.forEach(p => {
      x.beginPath();
      if (p.type === "line") { x.moveTo(p.x1 * w, p.y1 * h); x.lineTo(p.x2 * w, p.y2 * h); }
      else if (p.type === "ellipse") { x.ellipse(p.cx * w, p.cy * h, p.rx * w, p.ry * h, 0, 0, Math.PI * 2); }
      else if (p.type === "arc") { x.ellipse(p.cx * w, p.cy * h, p.rx * w, p.ry * h, 0, p.start, p.end, p.ccw || false); }
      x.stroke();
    });
    x.setLineDash([]);
  }, [gp]);
  useEffect(() => { drawG(); }, [drawG]);
  const clr = useCallback(() => { const cv = cR.current; if (cv) cv.getContext("2d").clearRect(0, 0, cv.width, cv.height); ptsRef.current = []; }, [ptsRef]);
  useEffect(() => { clr(); drawG(); }, [gp, clr, drawG, clrSig]);
  useEffect(() => { ptsRef.current = []; }, [ptsRef]);
  const pos = (e) => { const cv = cR.current, r = cv.getBoundingClientRect(), t = e.touches ? e.touches[0] : e; return { x: (t.clientX - r.left) * (cv.width / r.width), y: (t.clientY - r.top) * (cv.height / r.height) }; };
  const st = (e) => { e.preventDefault(); if (locked) return; dr.current = true; const p = pos(e); lp.current = p; ptsRef.current.push(p); };
  const mv = (e) => { e.preventDefault(); if (!dr.current || locked) return; const cv = cR.current, x = cv.getContext("2d"), p = pos(e); x.strokeStyle = pc; x.lineWidth = pw; x.lineCap = "round"; x.lineJoin = "round"; x.beginPath(); x.moveTo(lp.current.x, lp.current.y); x.lineTo(p.x, p.y); x.stroke(); lp.current = p; ptsRef.current.push(p); };
  const en = (e) => { if (e) e.preventDefault(); dr.current = false; };
  const S = { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 14 };
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <canvas ref={gR} width={500} height={500} style={{ ...S, background: "#FFFDF5", border: "2px solid #E8DCC8" }} />
      <canvas ref={cR} width={500} height={500} style={{ ...S, touchAction: "none", cursor: locked ? "default" : "crosshair" }}
        onMouseDown={st} onMouseMove={mv} onMouseUp={en} onMouseLeave={en}
        onTouchStart={st} onTouchMove={mv} onTouchEnd={en} />
      {locked && <div style={{ ...S, background: "rgba(255,255,255,0.1)", pointerEvents: "all", cursor: "default", zIndex: 5 }} />}
    </div>
  );
}

/* ====== FEEDBACK OVERLAY ====== */
function Fb({ show, type, text, sub, isLast }) {
  if (!show) return null;
  const em = type === "great" ? "\u2B50" : type === "almost" ? "\uD83D\uDCAA" : "\uD83D\uDC46";
  const tc = type === "great" ? "#FF6B35" : type === "almost" ? "#4ECDC4" : "#A06CD5";
  const bg = type === "great" ? "radial-gradient(circle,rgba(255,230,109,0.5) 0%,transparent 70%)" : type === "almost" ? "radial-gradient(circle,rgba(78,205,196,0.35) 0%,transparent 70%)" : "radial-gradient(circle,rgba(160,108,213,0.25) 0%,transparent 70%)";
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
      {type === "great" && Array.from({ length: 8 }, (_, i) => (
        <div key={i} style={{ position: "absolute", fontSize: 16, animation: `fly 1s ease-out ${i * 50}ms forwards`, opacity: 0 }}>{"\u2B50"}</div>
      ))}
      <div style={{ fontSize: 52, animation: "pop .6s cubic-bezier(.34,1.56,.64,1)" }}>{em}</div>
      <div style={{ fontFamily: "var(--ff)", fontSize: type === "great" ? 26 : 20, color: tc, animation: "pop .5s cubic-bezier(.34,1.56,.64,1) .15s both", textShadow: "0 2px 6px rgba(0,0,0,0.08)", marginTop: 6, textAlign: "center", padding: "0 16px" }}>{text}</div>
      {sub && <div style={{ fontFamily: "var(--fn)", fontSize: 12, color: "#8B7355", animation: "fi .4s ease-out .5s both", marginTop: 6, fontWeight: 600, background: "rgba(255,255,255,0.85)", borderRadius: 10, padding: "3px 12px" }}>{sub}</div>}
      {type === "great" && isLast && <div style={{ fontFamily: "var(--ff)", fontSize: 14, color: "#4ECDC4", animation: "fi .4s ease-out .8s both", marginTop: 8, background: "rgba(255,255,255,0.9)", borderRadius: 10, padding: "4px 14px" }}>Hai completato tutto! {"\uD83C\uDFC6"}</div>}
    </div>
  );
}

/* ====== CSS ====== */
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');
:root{--ff:'Fredoka One',sans-serif;--fn:'Nunito',system-ui,sans-serif;}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent;-webkit-text-size-adjust:none!important;text-size-adjust:none!important;}
html,body{font-size:16px!important;margin:0;padding:0;}
@keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
@keyframes wg{0%,100%{transform:rotate(0)}25%{transform:rotate(-3deg)}75%{transform:rotate(3deg)}}
@keyframes pop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.2);opacity:1}100%{transform:scale(1)}}
@keyframes fly{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(60px,-60px) scale(.2)}}
@keyframes fi{0%{opacity:0;transform:translateY(6px)}100%{opacity:1;transform:translateY(0)}}
@keyframes su{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
.mb{transition:all .1s;cursor:pointer;user-select:none;-webkit-user-select:none;}.mb:active{transform:scale(.94)!important;}`;

const TG = 36, TA = 18;

/* ====== MAIN APP ====== */
export default function App() {
  const [scr, setScr] = useState("home");
  const [mode, setMode] = useState(null);
  const [idx, setIdx] = useState(0);
  const [pc, setPc] = useState("#2D3436");
  const [pw, setPw] = useState(5);
  const [stars, setSt] = useState(0);
  const [done, setDo] = useState(new Set());
  const [locked, setLk] = useState(false);
  const [clrS, setClrS] = useState(0);
  const [fbS, setFbS] = useState(false);
  const [fbT, setFbT] = useState("great");
  const [fbX, setFbX] = useState("");
  const [fbU, setFbU] = useState("");
  const [fbL, setFbL] = useState(false);
  const [att, setAtt] = useState(0);
  const tmr = useRef(null);
  const ptsRef = useRef([]);

  const ls = Object.keys(LP), ns = Object.keys(NP);
  const items = mode === "letters" ? ls : mode === "numbers" ? ns : mode === "prewriting" ? PW.map((_, i) => i) : [];
  const paths = mode === "letters" ? LP[ls[idx]] : mode === "numbers" ? NP[ns[idx]] : mode === "prewriting" ? PW[idx]?.p : [];
  const label = mode === "letters" ? ls[idx] : mode === "numbers" ? ns[idx] : mode === "prewriting" ? PW[idx]?.n : "";
  const emj = mode === "letters" ? (LW[ls[idx]]?.e || "") : "";
  const hint = mode === "letters" ? (() => { const l = ls[idx], w = LW[l]; return w ? w.e + " " + l + " come " + w.w : ""; })() : mode === "prewriting" ? "Segui il tratteggio!" : mode === "numbers" ? "Traccia il " + ns[idx] : "";
  const cP = idx > 0, cN = idx < items.length - 1;
  const hasPaths = paths && paths.length > 0;

  useEffect(() => () => { if (tmr.current) clearTimeout(tmr.current); }, []);
  useEffect(() => { setLk(false); setFbS(false); setAtt(0); }, [idx, mode]);

  const doClear = () => { sCl(); setClrS(s => s + 1); };
  const doCheck = () => {
    if (locked || !hasPaths || mode === "free") return;
    sCl();
    const pts = [...ptsRef.current];
    const r = evalS(pts, paths, 500);
    const isLast = idx >= items.length - 1;
    const tg = att >= 3 ? Math.max(TG - 12, 12) : TG;
    const ta = att >= 3 ? Math.max(TA - 8, 6) : TA;
    if (r.short) {
      sNo(); setFbT("retry"); setFbX(att === 0 ? "Scrivi di pi\u00F9!" : "Scrivi pi\u00F9 grande!"); setFbU("Segui tutta la linea tratteggiata"); setFbS(true);
      if (tmr.current) clearTimeout(tmr.current);
      tmr.current = setTimeout(() => { setFbS(false); setClrS(s => s + 1); setAtt(a => a + 1); }, 2500);
    } else if (r.score >= tg) {
      const k = mode + "-" + idx;
      if (!done.has(k)) { setDo(new Set([...done, k])); setSt(s => s + 1); }
      isLast ? sDone() : sOk();
      setLk(true); setFbT("great"); setFbX(pick(GREAT)); setFbU(isLast ? "" : "Prossima in arrivo..."); setFbL(isLast); setFbS(true);
      if (tmr.current) clearTimeout(tmr.current);
      tmr.current = setTimeout(() => { setFbS(false); if (!isLast) { sAdv(); setIdx(p => p + 1); } else { setLk(false); } }, isLast ? 4000 : 3500);
    } else if (r.score >= ta) {
      sAlm(); setFbT("almost"); setFbX(pick(ALMOST)); setFbU("Prova a seguire meglio i puntini!"); setFbS(true);
      if (tmr.current) clearTimeout(tmr.current);
      tmr.current = setTimeout(() => { setFbS(false); setClrS(s => s + 1); setAtt(a => a + 1); }, 2800);
    } else {
      sNo(); setFbT("retry"); setFbX(pick(RETRY)); setFbU(att >= 2 ? "Piano piano, segui i puntini viola!" : "Tocca i puntini viola con la penna!"); setFbS(true);
      if (tmr.current) clearTimeout(tmr.current);
      tmr.current = setTimeout(() => { setFbS(false); setClrS(s => s + 1); setAtt(a => a + 1); }, 2800);
    }
  };

  if (scr === "home") {
    return (
      <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "linear-gradient(170deg,#FFF8E7,#FFF0D4 50%,#E8F8F5)", fontFamily: "var(--fn)", overflow: "auto" }}>
        <style>{CSS}</style>
        <div style={{ textAlign: "center", padding: "14px 8px 2px", flexShrink: 0 }}>
          <div style={{ fontSize: 38, animation: "fl 3s ease-in-out infinite", lineHeight: 1 }}>{"\u270F\uFE0F"}</div>
          <h1 style={{ fontFamily: "var(--ff)", fontSize: 26, margin: "2px 0 0", background: "linear-gradient(135deg,#FF6B35,#A06CD5,#4ECDC4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1.15 }}>Scrivi con Me!</h1>
          <p style={{ color: "#8B7355", fontSize: 10, margin: "2px 0 0", fontWeight: 600 }}>Impara a scrivere divertendoti</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "6px 0 8px", flexShrink: 0 }}>
          <div style={{ background: "linear-gradient(135deg,#FFE66D,#FFD93D)", borderRadius: 20, padding: "3px 14px", display: "flex", alignItems: "center", gap: 4, border: "2px solid #F0C419" }}>
            <span style={{ fontSize: 18 }}>{"\u2B50"}</span>
            <span style={{ fontFamily: "var(--ff)", fontSize: 18, color: "#8B6914" }}>{stars}</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 10px", maxWidth: 380, margin: "0 auto", flex: 1, alignContent: "start" }}>
          {[
            { id: "prewriting", lb: "Pregrafismo", em: "\u3030\uFE0F", co: "#4ECDC4", ds: "Linee e forme" },
            { id: "letters", lb: "Lettere", em: "\uD83D\uDD24", co: "#FF6B35", ds: "A B C D ..." },
            { id: "numbers", lb: "Numeri", em: "\uD83D\uDD22", co: "#A06CD5", ds: "0 1 2 3 ..." },
            { id: "free", lb: "Disegno", em: "\uD83C\uDFA8", co: "#FF69B4", ds: "Scrivi e disegna!" },
          ].map((m, i) => (
            <div key={m.id} className="mb" onClick={() => { sCl(); setMode(m.id); setIdx(0); setScr("play"); }} style={{ background: "#fff", borderRadius: 14, padding: "12px 6px", textAlign: "center", boxShadow: "0 3px 10px " + m.co + "28", border: "2px solid " + m.co + "18", animation: "su .3s ease-out " + i * 50 + "ms both" }}>
              <div style={{ fontSize: 30, marginBottom: 3, animation: "wg 2s ease-in-out " + i * 100 + "ms infinite", lineHeight: 1 }}>{m.em}</div>
              <div style={{ fontFamily: "var(--ff)", fontSize: 13, color: m.co }}>{m.lb}</div>
              <div style={{ fontSize: 9, color: "#9B8E7E", fontWeight: 600 }}>{m.ds}</div>
            </div>
          ))}
        </div>
        <div style={{ margin: "8px 10px 12px", maxWidth: 380, marginLeft: "auto", marginRight: "auto", background: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "5px 8px", border: "1px solid #E8DCC8", flexShrink: 0 }}>
          <div style={{ fontSize: 8.5, color: "#8B7355", lineHeight: 1.5 }}>
            <b>Per i genitori:</b> Traccia e premi "Fatto!". L'app valuta il tratto e d{"\u00E0"} feedback sonoro. Dopo 3 tentativi la soglia si abbassa.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "linear-gradient(170deg,#FFF8E7,#FFF0D4 50%,#E8F8F5)", fontFamily: "var(--fn)", overflow: "hidden" }}>
      <style>{CSS}</style>
      <Fb show={fbS} type={fbT} text={fbX} sub={fbU} isLast={fbL} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px", flexShrink: 0 }}>
        <button className="mb" onClick={() => { sCl(); if (tmr.current) clearTimeout(tmr.current); setScr("home"); setMode(null); setIdx(0); setLk(false); setFbS(false); }} style={{ background: "#fff", border: "1.5px solid #E8DCC8", borderRadius: 8, padding: "2px 8px", fontSize: 11, fontWeight: 700, color: "#2D3436", cursor: "pointer" }}>{"\uD83C\uDFE0"} Menu</button>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {att > 0 && mode !== "free" && <div style={{ fontSize: 9, color: "#A06CD5", fontWeight: 700, fontFamily: "var(--ff)" }}>#{att + 1}</div>}
          <div style={{ background: "linear-gradient(135deg,#FFE66D,#FFD93D)", borderRadius: 14, padding: "2px 10px", display: "flex", alignItems: "center", gap: 3, border: "1.5px solid #F0C419" }}>
            <span style={{ fontSize: 13 }}>{"\u2B50"}</span>
            <span style={{ fontFamily: "var(--ff)", fontSize: 13, color: "#8B6914" }}>{stars}</span>
          </div>
        </div>
      </div>
      {mode !== "free" ? (
        <div style={{ textAlign: "center", padding: "0 8px", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span style={{ fontSize: 20, animation: "fl 3s ease-in-out infinite", lineHeight: 1 }}>{emj}</span>
            <span style={{ fontFamily: "var(--ff)", fontSize: 32, lineHeight: 1, color: mode === "letters" ? "#FF6B35" : mode === "numbers" ? "#A06CD5" : "#4ECDC4" }}>{label}</span>
          </div>
          <p style={{ fontSize: 10, color: "#8B7355", fontWeight: 600, margin: "0" }}>{hint}</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2px 8px", flexShrink: 0 }}>
          <span style={{ fontFamily: "var(--ff)", fontSize: 16, color: "#FF69B4" }}>{"\uD83C\uDFA8"} Disegno Libero</span>
        </div>
      )}
      <div style={{ flex: 1, padding: "3px 8px 0", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0, overflow: "hidden" }}>
        <div style={{ width: "min(100%, 370px)", height: "min(100%, 370px)", aspectRatio: "1/1" }}>
          <Cvs gp={paths} pc={pc} pw={pw} locked={locked} clrSig={clrS} ptsRef={ptsRef} />
        </div>
      </div>
      {mode !== "free" ? (
        <div style={{ display: "flex", justifyContent: "center", gap: 10, padding: "4px 8px 2px", flexShrink: 0, opacity: locked ? .3 : 1, pointerEvents: locked ? "none" : "auto", transition: "opacity .3s" }}>
          <button className="mb" onClick={doClear} style={{ background: "#FF69B4", border: "none", borderRadius: 10, padding: "6px 18px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{"\uD83D\uDDD1"} Cancella</button>
          <button className="mb" onClick={doCheck} style={{ background: "linear-gradient(135deg,#4ECDC4,#45B7AA)", border: "none", borderRadius: 10, padding: "6px 20px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer", boxShadow: "0 2px 8px rgba(78,205,196,0.4)" }}>Fatto! {"\u2713"}</button>
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "center", padding: "4px 8px 2px", flexShrink: 0 }}>
          <button className="mb" onClick={doClear} style={{ background: "#FF69B4", border: "none", borderRadius: 10, padding: "6px 18px", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>{"\uD83D\uDDD1"} Cancella</button>
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, padding: "2px 8px", flexShrink: 0, opacity: locked ? .3 : 1, pointerEvents: locked ? "none" : "auto", transition: "opacity .3s" }}>
        {PENS.map(c => (
          <div key={c} className="mb" onClick={() => { sCl(); setPc(c); }} style={{ width: 22, height: 22, borderRadius: "50%", background: c, flexShrink: 0, border: pc === c ? "2.5px solid #FFE66D" : "2px solid #fff8", transform: pc === c ? "scale(1.1)" : "scale(1)" }} />
        ))}
        <div style={{ width: 1, height: 14, background: "#E0D5C1", margin: "0 1px" }} />
        {[3, 5, 8].map(w => (
          <div key={w} className="mb" onClick={() => { sCl(); setPw(w); }} style={{ width: w * 3 + 8, height: w * 3 + 8, borderRadius: "50%", flexShrink: 0, background: pw === w ? pc : "#E0D5C1", border: pw === w ? "2px solid #FFE66D" : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: w * 1.2, height: w * 1.2, borderRadius: "50%", background: pw === w ? "#fff" : "#B8A88A" }} />
          </div>
        ))}
      </div>
      {mode !== "free" && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "1px 8px", flexShrink: 0, opacity: locked ? .3 : 1, pointerEvents: locked ? "none" : "auto" }}>
          <button className="mb" onClick={() => { if (cP) { sCl(); setIdx(i => i - 1); } }} disabled={!cP || locked} style={{ background: cP ? "#4ECDC4" : "#E0D5C1", border: "none", borderRadius: 10, padding: "4px 12px", fontSize: 12, fontWeight: 800, color: "#fff", cursor: cP ? "pointer" : "default", opacity: cP ? 1 : .4 }}>{"\u25C0"}</button>
          <div style={{ fontSize: 10, color: "#8B7355", fontWeight: 700, fontFamily: "var(--ff)" }}>{idx + 1}/{items.length}</div>
          <button className="mb" onClick={() => { if (cN) { sCl(); setIdx(i => i + 1); } }} disabled={!cN || locked} style={{ background: cN ? "#FF6B35" : "#E0D5C1", border: "none", borderRadius: 10, padding: "4px 12px", fontSize: 12, fontWeight: 800, color: "#fff", cursor: cN ? "pointer" : "default", opacity: cN ? 1 : .4 }}>{"\u25B6"}</button>
        </div>
      )}
      {mode !== "free" && (
        <div style={{ display: "flex", overflowX: "auto", gap: 3, padding: "1px 8px 6px", WebkitOverflowScrolling: "touch", flexShrink: 0 }}>
          {items.map((_, i) => {
            const k = mode + "-" + i, act = i === idx, dn = done.has(k);
            const lb = mode === "letters" ? ls[i] : mode === "numbers" ? ns[i] : PW[i]?.ic;
            return (
              <button key={i} className="mb" onClick={() => { if (!locked) { sCl(); setIdx(i); } }} style={{
                minWidth: 28, height: 28, borderRadius: 7, padding: 0, flexShrink: 0,
                border: act ? "2px solid #FFE66D" : "1px solid transparent",
                background: dn ? "linear-gradient(135deg,#7BC67E,#4ECDC4)" : act ? "#fff" : "#F5EEE0",
                color: dn ? "#fff" : act ? "#2D3436" : "#8B7355",
                fontFamily: "var(--ff)", fontSize: 11, fontWeight: 700,
                cursor: locked ? "default" : "pointer", position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: locked && !act ? .45 : 1,
              }}>
                {lb}{dn && <span style={{ position: "absolute", top: -3, right: -3, fontSize: 7 }}>{"\u2B50"}</span>}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
