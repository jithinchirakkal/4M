// import { useEffect } from "react";
// import type { Process, CellData } from "./types";
// import { D, SK, hasGap, sl, STD, MACHINE_IMAGES } from "./constants";
// import { Gauge, Timeline } from "./Widgets";



// // ─── MODAL ─────────────────────────────────────────────────────────────────────
// export function Modal({ cell, process, onClose }: { cell: CellData; process: Process; onClose: () => void }) {
//   const cfg = cell.skill ? SK[cell.skill] : null;
//   const g = hasGap(cell.skill, process.minSkill);
//   const skillPct = cell.skill ? Math.round((sl(cell.skill) / 4) * 100) : 0;
//   const matchPct = g ? Math.round(skillPct * 0.6) : skillPct;
//   const timePct = cell.hrs ? Math.min(Math.round((cell.hrs / STD) * 100), 100) : 0;

//   useEffect(() => {
//     const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", h);
//     return () => window.removeEventListener("keydown", h);
//   }, [onClose]);

//   return (
//     <div onClick={onClose} style={{
//       position: "fixed", inset: 0, zIndex: 9999,
//       background: "rgba(10,20,35,0.75)",
//       backdropFilter: "blur(16px)",
//       display: "flex", alignItems: "center", justifyContent: "center",
//       animation: "mFade .2s ease",
//     }}>
//       <div onClick={e => e.stopPropagation()} style={{
//         background: D.white, borderRadius: 28, width: "95%", maxWidth: 800, maxHeight: "90vh", overflowY: "auto",
//         boxShadow: "0 40px 100px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.5)",
//         overflow: "hidden",
//         animation: "fadeUp .4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
//         display: "flex", flexDirection: "column"
//       }}>
//         {/* Header */}
//         <div style={{
//           background: g ? `linear-gradient(135deg, ${D.redDark}, ${D.red})` : `linear-gradient(135deg, ${D.purple}, ${D.purpleMid})`,
//           padding: "24px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
//           position: "relative", overflow: "hidden", borderBottom: `1px solid rgba(255,255,255,0.1)`
//         }}>
//           <div style={{ position: "absolute", right: -50, top: -50, width: 200, height: 200, background: "rgba(255,255,255,0.05)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none" }} />
//           <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
//             <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
//               {g ? "⚠️" : "🏭"}
//             </div>
//             <div>
//               <div style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: "-0.02em", textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>{process.full}</div>
//               <div style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, marginTop: 4, fontWeight: 600, letterSpacing: "0.02em" }}>
//                 {g ? "Substitute Assigned — Required Worker Absent" : "Live Station Telemetry · Shift Operations"}
//               </div>
//             </div>
//           </div>
//           <button onClick={onClose}
//             onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.3)", e.currentTarget.style.transform = "scale(1.05)")}
//             onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)", e.currentTarget.style.transform = "none")}
//             style={{ position: "relative", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "#fff", cursor: "pointer", width: 40, height: 40, borderRadius: 12, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s", flexShrink: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>✕</button>
//         </div>

//         {/* Split Body */}
//         <div className="resp-modal-split">
          
//           {/* Left Panel: Cinematic Framed Machine Render */}
//           <div className="resp-modal-left" style={{ background: D.g100, position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
            
//             <div style={{
//               flex: 1, width: "100%", minHeight: 400, position: "relative",
//               border: "1.5px solid rgba(15, 39, 68, 0.4)", borderRadius: 24, padding: 10,
//               background: D.white, boxShadow: "0 8px 32px rgba(15,39,68,0.08)",
//               display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden"
//             }}>
//               {MACHINE_IMAGES[process.id] ? (
//                 <img src={MACHINE_IMAGES[process.id]} alt={process.full} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 16 }} />
//               ) : (
//                 <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.02)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", color: D.g400, fontWeight: 700, fontSize: 13, flexDirection: "column", gap: 12 }}>
//                   <span style={{ fontSize: 32 }}>🚧</span>
//                   <span>Render Unavailable</span>
//                 </div>
//               )}
//             </div>
            
//             <div style={{ zIndex: 1, position: "absolute", bottom: 24, padding: "8px 16px", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 12, border: `1px solid rgba(255,255,255,0.5)`, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
//               <div style={{ width: 8, height: 8, borderRadius: "50%", background: D.green, boxShadow: `0 0 10px ${D.green}` }} />
//               <span style={{ fontSize: 12, fontWeight: 800, color: D.g800, letterSpacing: "0.05em", textTransform: "uppercase" }}>Hardware Online</span>
//             </div>
//           </div>

//           {/* Right Panel: Employee Telemetry */}
//           <div style={{ padding: 32, background: D.white }}>
//             <div style={{ fontSize: 11, fontWeight: 800, color: D.g400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Assigned Operator</div>
            
//             {cell.emp ? (
//               <>
//                 <div style={{
//                   background: `linear-gradient(135deg, ${cfg?.gfrom ?? "#f8fafc"}, ${cfg?.gto ?? "#f1f5f9"})`,
//                   borderRadius: 20, padding: 20, display: "flex", alignItems: "center", gap: 20, marginBottom: 28,
//                   border: `1.5px solid ${cfg?.bdr ?? D.border}`,
//                   boxShadow: `0 12px 24px -6px ${cfg?.glow ?? "rgba(0,0,0,0.05)"}, inset 0 2px 4px rgba(255,255,255,0.7)`,
//                   position: "relative", overflow: "hidden",
//                 }}>
//                   {cell.skill === "L4" && <div className="shimmer-effect" />}
                  
//                   <div style={{ position: "relative", flexShrink: 0, zIndex: 2 }}>
//                     <div style={{ width: 68, height: 68, borderRadius: 18, background: cfg ? cfg.bg : D.g100, border: `3px solid ${cfg?.bdr ?? D.border}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: `inset 0 0 16px ${cfg?.glow ?? "transparent"}` }}>
//                       <img src={`https://ui-avatars.com/api/?name=${cell.name}&background=transparent&color=0f172a&bold=true&size=128`} alt="Operator" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
//                     </div>
//                     {cell.skill === "L4" && (
//                       <div style={{ position: "absolute", top: -6, right: -6, width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#f97316,#fb923c)", border: "2.5px solid white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, boxShadow: "0 4px 8px rgba(249,115,22,0.4)" }}>⭐</div>
//                     )}
//                   </div>

//                   <div style={{ flex: 1, zIndex: 2 }}>
//                     <div style={{ fontWeight: 900, fontSize: 19, color: cfg?.text ?? D.g800, letterSpacing: "-0.01em" }}>{cell.name}</div>
//                     <div style={{ color: cfg && (cfg.text === "#fff7ed" || cfg.text === "#fef2f2") ? "rgba(255,255,255,0.85)" : D.g500, fontSize: 13, marginTop: 4, fontWeight: 600 }}>
//                       Badge ID: <strong style={{ color: cfg?.text ?? D.g800 }}>{cell.emp}</strong>
//                     </div>
//                     <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
//                       <span style={{ background: cfg?.badge, color: cfg?.btext, fontSize: 12, fontWeight: 900, padding: "4px 12px", borderRadius: 8, border: `1px solid ${cfg?.bdr}`, letterSpacing: "0.04em" }}>
//                         {cell.skill}
//                       </span>
//                       <span style={{ fontSize: 13, color: cfg?.text, fontWeight: 800, opacity: 0.9 }}>{cfg?.lbl}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ fontSize: 11, fontWeight: 800, color: D.g400, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>Performance Metrics</div>
//                 {/* Three gauges */}
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
//                   {[
//                     { label: "Skill Match", pct: matchPct, color: g ? D.red : D.green },
//                     { label: "Time Eff.", pct: timePct, color: timePct > 100 ? D.red : D.blue, sub: `${cell.hrs || 0}h` },
//                     { label: "Level Score", pct: sl(cell.skill) * 25, color: cfg?.btext ?? D.g500 },
//                   ].map((kp, i) => (
//                   <div key={i} style={{ background: D.g100, borderRadius: 16, padding: "16px 10px", border: `1px solid ${D.border}`, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
//                     <div style={{ fontSize: 11, color: D.g500, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>
//                       {kp.label}
//                     </div>
//                     <Gauge pct={kp.pct} color={kp.color} size={68} sub={kp.sub} />
//                   </div>
//                 ))}
//               </div>

//               {/* Timeline */}
//               <div style={{ background: D.g100, borderRadius: 16, padding: "16px 20px", border: `1px solid ${D.border}`, marginBottom: process.minSkill ? 20 : 0 }}>
//                 <Timeline hrs={cell.hrs || 0} std={STD} color={cfg?.btext ?? D.g400} />
//               </div>

//               {/* Min skill banner */}
//               {process.minSkill && (
//                 <div style={{ borderRadius: 16, padding: "16px 20px", background: g ? D.redL : D.greenL, border: `1.5px solid ${g ? "#fca5a5" : "#86efac"}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//                   <div>
//                     <div style={{ fontSize: 11, color: D.g600, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>Min Required</div>
//                     <div style={{ fontSize: 22, fontWeight: 900, color: g ? D.red : D.green, marginTop: 2 }}>{process.minSkill}</div>
//                   </div>
//                   <div style={{ fontSize: 32, filter: `drop-shadow(0 2px 4px ${g ? D.red : D.green}40)` }}>{g ? "⚠️" : "✅"}</div>
//                   <div style={{ textAlign: "right" }}>
//                     <div style={{ fontSize: 14, fontWeight: 900, color: g ? D.red : D.green }}>
//                       {g ? `Substitute Assigned (-${sl(process.minSkill) - sl(cell.skill)} Lvl)` : "Correctly Assigned"}
//                     </div>
//                     <div style={{ fontSize: 12, color: D.g500, marginTop: 2, fontWeight: 500 }}>Current: {cell.skill} · Req: {process.minSkill}</div>
//                   </div>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div style={{ textAlign: "center", padding: "40px 0" }}>
//               <div style={{ fontSize: 56, marginBottom: 16, opacity: 0.5 }}>🪑</div>
//               <div style={{ fontSize: 18, fontWeight: 800, color: D.g800 }}>No Operator Assigned</div>
//               <div style={{ fontSize: 14, color: D.g500, marginTop: 8, fontWeight: 500 }}>Station vacant for this shift</div>
//             </div>
//           )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import type { Process, CellData } from "./types";
import { D, SK, hasGap, sl, STD, MACHINE_IMAGES } from "./constants";
import { Gauge, Timeline } from "./Widgets";

// ─── MODAL ─────────────────────────────────────────────────────────────────────
export function Modal({ cell, process, onClose }: { cell: CellData; process: Process; onClose: () => void }) {
  const cfg = cell.skill ? SK[cell.skill] : null;
  const g = hasGap(cell.skill, process.minSkill);
  const skillPct = cell.skill ? Math.round((sl(cell.skill) / 4) * 100) : 0;
  const matchPct = g ? Math.round(skillPct * 0.6) : skillPct;
  const timePct = cell.hrs ? Math.min(Math.round((cell.hrs / STD) * 100), 100) : 0;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(10,20,35,0.72)",
        backdropFilter: "blur(14px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "mFade .18s ease",
        padding: "16px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: D.white,
          borderRadius: 22,
          width: "100%",
          maxWidth: 680,           // ← tighter max-width (was 800)
          maxHeight: "88vh",       // ← slightly less tall
          overflowY: "auto",
          overflowX: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.36), inset 0 1px 1px rgba(255,255,255,0.45)",
          animation: "fadeUp .35s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ── Header ── */}
        <div style={{
          background: g
            ? `linear-gradient(135deg, ${D.redDark}, ${D.red})`
            : `linear-gradient(135deg, ${D.purple}, ${D.purpleMid})`,
          padding: "18px 24px",             // was 24px 32px
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{
            position: "absolute", right: -40, top: -40,
            width: 160, height: 160,
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%", filter: "blur(36px)", pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, position: "relative" }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11,
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20,
              boxShadow: "0 4px 10px rgba(0,0,0,0.18)",
            }}>
              {g ? "⚠️" : "🏭"}
            </div>
            <div>
              <div style={{
                color: "#fff", fontWeight: 900, fontSize: 18,   // was 22
                letterSpacing: "-0.02em", textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}>
                {process.full}
              </div>
              <div style={{
                color: "rgba(255,255,255,0.82)", fontSize: 11.5,  // was 13
                marginTop: 3, fontWeight: 600, letterSpacing: "0.02em",
              }}>
                {g ? "Substitute Assigned — Required Worker Absent" : "Live Station Telemetry · Shift Operations"}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.28)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.14)";
              e.currentTarget.style.transform = "none";
            }}
            style={{
              position: "relative",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              color: "#fff", cursor: "pointer",
              width: 34, height: 34,             // was 40×40
              borderRadius: 10, fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all .18s", flexShrink: 0,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >✕</button>
        </div>

        {/* ── Split Body ── */}
        <div className="resp-modal-split">

          {/* Left: Machine render */}
          <div
            className="resp-modal-left"
            style={{
              background: D.g100,
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              padding: 20,                  // was 32
            }}
          >
            <div style={{
              flex: 1, width: "100%",
              minHeight: 300,               // was 400 — key size reduction
              position: "relative",
              border: "1.5px solid rgba(15,39,68,0.35)",
              borderRadius: 18,
              padding: 8,
              background: D.white,
              boxShadow: "0 6px 24px rgba(15,39,68,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {MACHINE_IMAGES[process.id] ? (
                <img
                  src={MACHINE_IMAGES[process.id]}
                  alt={process.full}
                  style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
                />
              ) : (
                <div style={{
                  width: "100%", height: "100%",
                  background: "rgba(0,0,0,0.02)", borderRadius: 12,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: D.g400, fontWeight: 700, fontSize: 12,
                  flexDirection: "column", gap: 10,
                }}>
                  <span style={{ fontSize: 28 }}>🚧</span>
                  <span>Render Unavailable</span>
                </div>
              )}
            </div>

            <div style={{
              zIndex: 1, position: "absolute", bottom: 18,
              padding: "6px 13px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(8px)",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.5)",
              display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 6px 24px rgba(0,0,0,0.16)",
            }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: D.green, boxShadow: `0 0 8px ${D.green}` }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: D.g800, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Hardware Online
              </span>
            </div>
          </div>

          {/* Right: Employee Telemetry */}
          <div style={{ padding: "22px 24px", background: D.white }}>  {/* was 32px */}

            <div style={{
              fontSize: 10, fontWeight: 800, color: D.g400,
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
            }}>
              Assigned Operator
            </div>

            {cell.emp ? (
              <>
                {/* Operator card */}
                <div style={{
                  background: `linear-gradient(135deg, ${cfg?.gfrom ?? "#f8fafc"}, ${cfg?.gto ?? "#f1f5f9"})`,
                  borderRadius: 16,          // was 20
                  padding: "14px 16px",      // was 20px
                  display: "flex", alignItems: "center", gap: 14,  // was gap:20
                  marginBottom: 20,          // was 28
                  border: `1.5px solid ${cfg?.bdr ?? D.border}`,
                  boxShadow: `0 10px 20px -6px ${cfg?.glow ?? "rgba(0,0,0,0.05)"}, inset 0 2px 4px rgba(255,255,255,0.7)`,
                  position: "relative", overflow: "hidden",
                }}>
                  {cell.skill === "L4" && <div className="shimmer-effect" />}

                  {/* Avatar */}
                  <div style={{ position: "relative", flexShrink: 0, zIndex: 2 }}>
                    <div style={{
                      width: 56, height: 56,   // was 68×68
                      borderRadius: 14,
                      background: cfg ? cfg.bg : D.g100,
                      border: `3px solid ${cfg?.bdr ?? D.border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                      boxShadow: `inset 0 0 14px ${cfg?.glow ?? "transparent"}`,
                    }}>
                      <img
                        src={`https://ui-avatars.com/api/?name=${cell.name}&background=transparent&color=0f172a&bold=true&size=128`}
                        alt="Operator"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    </div>
                    {cell.skill === "L4" && (
                      <div style={{
                        position: "absolute", top: -5, right: -5,
                        width: 20, height: 20, borderRadius: "50%",
                        background: "linear-gradient(135deg,#f97316,#fb923c)",
                        border: "2px solid white",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, boxShadow: "0 3px 7px rgba(249,115,22,0.4)",
                      }}>⭐</div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, zIndex: 2 }}>
                    <div style={{ fontWeight: 900, fontSize: 16, color: cfg?.text ?? D.g800, letterSpacing: "-0.01em" }}>{cell.name}</div>
                    <div style={{ color: cfg && (cfg.text === "#fff7ed" || cfg.text === "#fef2f2") ? "rgba(255,255,255,0.82)" : D.g500, fontSize: 12, marginTop: 3, fontWeight: 600 }}>
                      Badge ID: <strong style={{ color: cfg?.text ?? D.g800 }}>{cell.emp}</strong>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                      <span style={{
                        background: cfg?.badge, color: cfg?.btext,
                        fontSize: 11, fontWeight: 900, padding: "3px 10px",
                        borderRadius: 7, border: `1px solid ${cfg?.bdr}`, letterSpacing: "0.04em",
                      }}>
                        {cell.skill}
                      </span>
                      <span style={{ fontSize: 12, color: cfg?.text, fontWeight: 800, opacity: 0.9 }}>{cfg?.lbl}</span>
                    </div>
                  </div>
                </div>

                {/* Metrics label */}
                <div style={{
                  fontSize: 10, fontWeight: 800, color: D.g400,
                  textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12,
                }}>
                  Performance Metrics
                </div>

                {/* Gauges */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14, alignItems: "stretch" }}>
                  {[
                    { label: "Skill Match", pct: matchPct, color: g ? D.red : D.green },
                    { label: "Time Eff.", pct: timePct, color: timePct > 100 ? D.red : D.blue, sub: `${cell.hrs || 0}h` },
                    { label: "Level Score", pct: sl(cell.skill) * 25, color: cfg?.btext ?? D.g500 },
                  ].map((kp, i) => (
                    <div key={i} style={{
                      background: D.g100, borderRadius: 12,
                      padding: "12px 8px",
                      border: `1px solid ${D.border}`,
                      textAlign: "center",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 8,
                    }}>
                      {/* Fixed-height label row — prevents wrap from breaking card alignment */}
                      <div style={{
                        fontSize: 10, color: D.g500, fontWeight: 800,
                        letterSpacing: "0.06em", textTransform: "uppercase",
                        whiteSpace: "nowrap",          // ← never wraps
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                        minHeight: 14,                 // ← fixed label height, all cards match
                      }}>
                        {kp.label}
                      </div>
                      <Gauge pct={kp.pct} color={kp.color} size={58} sub={kp.sub} />
                    </div>
                  ))}
                </div>

                {/* Timeline */}
                <div style={{
                  background: D.g100, borderRadius: 12, padding: "12px 16px",
                  border: `1px solid ${D.border}`,
                  marginBottom: process.minSkill ? 14 : 0,
                }}>
                  <Timeline hrs={cell.hrs || 0} std={STD} color={cfg?.btext ?? D.g400} />
                </div>

                {/* Min skill banner */}
                {process.minSkill && (
                  <div style={{
                    borderRadius: 12,
                    padding: "12px 16px",       // was 16px 20px
                    background: g ? D.redL : D.greenL,
                    border: `1.5px solid ${g ? "#fca5a5" : "#86efac"}`,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div>
                      <div style={{ fontSize: 10, color: D.g600, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em" }}>Min Required</div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: g ? D.red : D.green, marginTop: 2 }}>{process.minSkill}</div>
                    </div>
                    <div style={{ fontSize: 26, filter: `drop-shadow(0 2px 4px ${g ? D.red : D.green}40)` }}>{g ? "⚠️" : "✅"}</div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 900, color: g ? D.red : D.green }}>
                        {g ? `Substitute Assigned (-${sl(process.minSkill) - sl(cell.skill)} Lvl)` : "Correctly Assigned"}
                      </div>
                      <div style={{ fontSize: 11, color: D.g500, marginTop: 2, fontWeight: 500 }}>
                        Current: {cell.skill} · Req: {process.minSkill}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <div style={{ fontSize: 46, marginBottom: 12, opacity: 0.45 }}>🪑</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: D.g800 }}>No Operator Assigned</div>
                <div style={{ fontSize: 13, color: D.g500, marginTop: 6, fontWeight: 500 }}>Station vacant for this shift</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}