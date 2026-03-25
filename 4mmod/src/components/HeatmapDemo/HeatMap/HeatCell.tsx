import { useState } from "react";
import type { ProcessColumn as Process, CellData } from "./heatmap.types";
import { D, SK, hasGap } from "./constants";
import { Sparkles } from "./Widgets";


// ─── HEAT CELL ─────────────────────────────────────────────────────────────────
export function HeatCell({ cell, process, delay, onClick }: { cell: CellData; process: Process; delay: number; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  const cfg = cell.skill ? SK[cell.skill] : null;
  const g = hasGap(cell.skill, process.minSkill);
  const empty = !cell.emp;
  const isL4 = cell.skill === "L4";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        height: 84, borderRadius: 12, position: "relative", overflow: "hidden",
        background: !cell.isApplicable 
          ? "#f1f5f9" // Gray for N/A
          : empty 
            ? "rgba(248, 250, 252, 0.5)" 
            : (cell.presence === 'Present' && !g && (!cell.requiresApproval || cell.isApproved)) 
              ? (hov ? "linear-gradient(135deg, #059669, #10b981)" : "linear-gradient(135deg, #10b981, #34d399)")
              : (hov ? `linear-gradient(150deg,${cfg!.gto},${cfg!.gfrom})` : `linear-gradient(135deg,${cfg!.gfrom},${cfg!.gto})`),
        backdropFilter: empty || !cell.isApplicable ? "none" : "blur(8px)",
        border: !cell.isApplicable
          ? `1.5px dashed ${D.border}`
            : (cell.presence === 'Absent' || (cell.requiresApproval && !cell.isApproved))
              ? `2.5px solid ${D.red}`
            : (cell.presence === 'Present' && !g && (!cell.requiresApproval || cell.isApproved))
              ? `2.5px solid #059669`
              : `1.5px solid ${hov && !empty ? cfg!.bdr : (empty ? D.border : (cfg?.bdr ?? D.border))}`,
        cursor: !cell.isApplicable ? "default" : "pointer",
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        transform: hov && cell.isApplicable && !empty ? "translateY(-4px) scale(1.05)" : "scale(1)",
        boxShadow: hov && !empty 
          ? ((cell.presence === 'Present' && !g && (!cell.requiresApproval || cell.isApproved)) ? "0 15px 30px rgba(16,185,129,0.3)" : `0 15px 30px ${cfg?.glow ?? "rgba(0,0,0,0.1)"}`)
          : D.sh,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4,
        animation: `cellPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms both`,
        zIndex: hov && !empty ? 10 : 1,
        opacity: !cell.isApplicable ? 0.6 : 1,
      }}
    >
      {!cell.isApplicable && <span style={{ fontSize: 13, fontWeight: 700, color: D.g400 }}>N/A</span>}
      
      {cell.isApplicable && !empty && (
        <>
          {/* Absent Alert Overlay */}
          {cell.presence === 'Absent' && (
            <div style={{ 
              position: "absolute", inset: 0, 
              background: "rgba(239, 68, 68, 0.15)", 
              border: `2px solid ${D.red}`, 
              animation: "pulseRed 1.5s infinite",
              zIndex: 1 
            }} />
          )}

          {/* Badge */}
          <span style={{ fontSize: 14, fontWeight: 900, background: cfg?.badge, color: cfg?.btext, padding: "2px 12px", borderRadius: 20, border: `1px solid ${cfg?.bdr}`, lineHeight: 1.4, position: "relative", zIndex: 2 }}>
            {cell.skill}
          </span>
          <span style={{ fontSize: 11, color: cell.presence === 'Absent' ? D.red : D.g600, fontWeight: 700, position: "relative", zIndex: 2 }}>
            {cell.isSubstitute ? "SUB: " : ""}#{cell.emp}
          </span>

          {/* Approval Alert */}
          {cell.requiresApproval && !cell.isApproved && (
            <div style={{ position: "absolute", bottom: 2, left: 0, right: 0, background: D.red, color: D.white, fontSize: 8, fontWeight: 900, textAlign: "center", padding: "1px 0", zIndex: 4 }}>
              APPROVAL REQ.
            </div>
          )}

          {/* Assignment Status Indicator */}
          <div style={{ position: "absolute", top: 8, left: 8, width: 14, height: 14, borderRadius: "50%", background: cell.requiresApproval ? D.red : D.green, border: `1px solid ${D.white}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: D.white, zIndex: 3 }}>
            {cell.requiresApproval ? "!" : "✓"}
          </div>

          {/* Presence Indicator */}
          <div 
            style={{ 
              position: "absolute", 
              top: 8, 
              right: 8, 
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 2,
              zIndex: 3 
            }} 
          >
            <div style={{ 
              width: 10, 
              height: 10, 
              borderRadius: "50%", 
              background: cell.presence === 'Present' ? '#10b981' : '#ef4444', 
              border: `1.5px solid white`,
              boxShadow: "0 0 4px rgba(0,0,0,0.2)"
            }} title={`Status: ${cell.presence}`} />
            {hov && (
              <span style={{ 
                fontSize: 7, 
                fontWeight: 900, 
                color: cell.presence === 'Present' ? '#059669' : '#b91c1c',
                background: "rgba(255,255,255,0.8)",
                padding: "1px 3px",
                borderRadius: 4,
                letterSpacing: "0.05em"
              }}>
                {cell.presence === 'Present' ? "PRESENT" : "ABSENT"}
              </span>
            )}
          </div>
        </>
      )}
      {cell.isApplicable && empty && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 20, color: D.g200 }}>+</span>
            <span style={{ fontSize: 9, fontWeight: 700, color: D.g400 }}>ASSIGN</span>
        </div>
      )}
    </div>
  );
}