import { D } from "./constants";


// ─── SPARKLES for L4 cells ────────────────────────────────────────────────────
export function Sparkles({ color }: { color: string }) {
  const pts = [
    { x: 85, y: 8, d: 0, s: 2.8 }, { x: 91, y: 18, d: 0.55, s: 2.0 },
    { x: 78, y: 13, d: 1.1, s: 2.4 }, { x: 93, y: 27, d: 1.6, s: 1.7 },
    { x: 82, y: 22, d: 0.85, s: 2.2 }
  ];
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 12, zIndex: 1 }}>
      {pts.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`,
          width: p.s, height: p.s, borderRadius: "50%",
          background: color, boxShadow: `0 0 ${p.s * 2}px ${color}`,
          animation: `sparkle 2.4s ease-in-out ${p.d}s infinite`, opacity: 0,
        }} />
      ))}
    </div>
  );
}

// ─── CIRCULAR GAUGE ───────────────────────────────────────────────────────────
export function Gauge({ pct, color, size = 68, sub }: { pct: number; color: string; size?: number; sub?: string }) {
  const r = size / 2 - 7, circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0, transform: "rotate(-90deg)", filter: `drop-shadow(0 0 4px ${color}40)` }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={D.g200} strokeWidth={6} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }} />
      </svg>
      <div style={{ textAlign: "center", lineHeight: 1.2 }}>
        <div style={{ fontSize: 13, fontWeight: 900, color }}>{pct}%</div>
        {sub && <div style={{ fontSize: 9, color: D.g500, marginTop: 1, textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ─── TIMELINE ─────────────────────────────────────────────────────────────────
export function Timeline({ hrs, std, color }: { hrs: number; std: number; color: string }) {
  const pct = Math.min((hrs / std) * 100, 100);
  const over = hrs > std;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: D.g600, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Time on Station</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: over ? D.red : D.g800 }}>
          {hrs}h <span style={{ fontWeight: 500, color: D.g400 }}>/ {std}h std</span>
        </span>
      </div>
      <div style={{ height: 10, background: D.g200, borderRadius: 8, overflow: "hidden", border: `1px solid ${D.border}`, position: "relative" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: over ? `linear-gradient(90deg,${color},${D.red})` : color,
          borderRadius: 8, transition: "width 0.9s cubic-bezier(.4,0,.2,1)"
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
        <span style={{ fontSize: 10, color: D.g400, fontWeight: 600 }}>0h</span>
        <span style={{ fontSize: 10, color: D.g500, fontWeight: 700 }}>Standard: {std}h</span>
      </div>
    </div>
  );
}
