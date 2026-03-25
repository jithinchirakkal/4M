import { useState, useMemo, useCallback, useEffect } from "react";
import type { CellData, RowData, ProcessColumn, ShiftKey } from "./heatmap.types";
import { D, SK, STD, sl } from "./constants";
import { Modal } from "./Modal";
import { HeatCell } from "./HeatCell";
import { useHeatmapData } from "./useHeatmapData";
import { transformForShift } from "./transformHeatmapData";
import { SubstitutionModal } from "./SubstitutionModal";
import { approveSubstitute } from "../HetmapShiftPlan/api_heatmap";

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function HeatmapSkeleton() {
  return (
    <div style={{ padding: 24, animation: "fadeUp .3s ease" }}>
      {[1, 2, 3].map(row => (
        <div key={row} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {[0, 1, 2, 3, 4, 5].map(col => (
            <div key={col} style={{
              flex: col === 0 ? "0 0 112px" : 1, height: 56, borderRadius: 12,
              background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
              backgroundSize: "200% 100%",
              animation: `shimmerSweep 1.5s infinite linear ${col * 80}ms`,
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Error State ────────────────────────────────────────────────────────────────────
function HeatmapError({
  message,
  onRetry,
  isAuth = false,
}: {
  message: string;
  onRetry: () => void;
  isAuth?: boolean;
}) {
  if (isAuth) {
    return (
      <div role="alert" aria-live="assertive" style={{ padding: "56px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
        <div style={{ fontSize: 18, fontWeight: 900, color: "#1e3a5f", marginBottom: 8 }}>
          Session Expired
        </div>
        <div style={{ fontSize: 14, color: "#64748b", marginBottom: 28, maxWidth: 360, margin: "0 auto 28px" }}>
          Your login session has expired or your credentials were not provided. Please sign in again to continue.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => { window.location.href = "/login"; }}
            style={{
              background: `linear-gradient(135deg, #0f2744, #1e4a8a)`,
              color: "white", border: "none", borderRadius: 12,
              padding: "11px 32px", fontWeight: 900, fontSize: 14, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(15,39,68,0.35)",
            }}
            aria-label="Go to login page"
          >
            Sign In Again
          </button>
          <button
            onClick={onRetry}
            style={{
              background: "white", color: "#0f2744",
              border: "1.5px solid #cbd5e1", borderRadius: 12,
              padding: "11px 24px", fontWeight: 700, fontSize: 14, cursor: "pointer",
            }}
            aria-label="Retry with current session"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div role="alert" aria-live="assertive" style={{ padding: "48px 32px", textAlign: "center" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#991b1b", marginBottom: 8 }}>
        Failed to load heatmap data
      </div>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24, maxWidth: 360, margin: "0 auto 24px" }}>
        {message}
      </div>
      <button
        onClick={onRetry}
        style={{
          background: `linear-gradient(135deg, ${D.purple}, ${D.purpleMid})`,
          color: "white", border: "none", borderRadius: 12,
          padding: "10px 28px", fontWeight: 800, fontSize: 14, cursor: "pointer",
        }}
        aria-label="Retry loading heatmap data"
      >
        Retry
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function HeatmapEmpty() {
  return (
    <div style={{ padding: "48px 32px", textAlign: "center" }} aria-label="No data to display">
      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
      <div style={{ fontSize: 16, fontWeight: 800, color: "#475569", marginBottom: 8 }}>
        No stations found for this selection
      </div>
      <div style={{ fontSize: 13, color: "#94a3b8" }}>
        Try selecting a different department, line, or date.
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function HeatMap() {
  // ── UI-only state (no data logic here) ──────────────────────────────────────
  const [shift, setShift] = useState<ShiftKey>("A");
  const [modal, setModal] = useState<{ cell: CellData; process: ProcessColumn } | null>(null);
  const [subModal, setSubModal] = useState<{ date: string; shift: string; station: ProcessColumn; cell: CellData } | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const [view, setView] = useState<"heat" | "list" | "24h">("heat");
  const [simMode, setSimMode] = useState(false);
  const [simHour, setSimHour] = useState(4);
  const [reportPage, setReportPage] = useState(0);
  const [opsShift, setOpsShift] = useState<ShiftKey>("A");
  const [gapModalData, setGapModalData] = useState<{ shift: ShiftKey; line: string } | null>(null);
  const REPORT_PER_PAGE = 5;

  // ── Data layer (fully encapsulated in hook) ──────────────────────────────────
  const {
    heatmapData,
    hierarchy,
    selections,
    isLoading,
    error,
    isAuthError,
    actions,
  } = useHeatmapData();

  // ── Transform for current shift (memoized, pure) ─────────────────────────────
  const transformed = useMemo(() => {
    if (!heatmapData) return null;
    return transformForShift(heatmapData, shift, simMode ? simHour : null);
  }, [heatmapData, shift, simMode, simHour]);

  // ── Shift-specific transform helper (for 24h view) ───────────────────────────
  const getShiftData = useCallback((s: ShiftKey) => {
    if (!heatmapData) return [];
    return transformForShift(heatmapData, s).rows;
  }, [heatmapData]);

  // ── Derived values ────────────────────────────────────────────────────────────
  const procs = transformed?.procs ?? [];
  const data = transformed?.rows ?? [];
  const allCells = transformed?.allCells ?? [];
  const gaps = transformed?.gapCount ?? 0;
  const coverage = transformed?.coverage ?? 0;

  // Find if any cell requires approval
  const needsApproval = data.some(row => row.cells.some(c => c.requiresApproval && !c.isApproved));

  const handleCellClick = (cell: CellData, proc: ProcessColumn) => {
    if (!cell.isApplicable) return;
    if (!cell.emp || cell.presence === 'Absent') {
      setSubModal({ 
        date: selections.selectedDate, 
        shift, 
        station: proc, 
        cell 
      });
    } else {
      setModal({ cell, process: proc });
    }
  };

  const handleApproveAll = async () => {
    for (const row of data) {
      for (const cell of row.cells) {
        if (cell.requiresApproval && !cell.isApproved) {
            await approveSubstitute({
                date: selections.selectedDate,
                shift,
                station_id: parseInt(cell.processId)
            });
        }
      }
    }
    actions.retry();
  };

  const today = useMemo(() => {
    const [y, m, d] = selections.selectedDate.split("-");
    return `${d}.${m}.${y}`;
  }, [selections.selectedDate]);

  const handleShift = (s: ShiftKey) => {
    setShift(s);
    setAnimKey(k => k + 1);
    setReportPage(0);
  };

  return (
    <div style={{ background: D.pageBg, minHeight: "100vh", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", overflowX: "hidden" }}>
      <style>{`
        .resp-nav { display: flex; align-items: center; justify-content: space-between; height: 60px; padding: 0 28px; }
        .resp-kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .resp-modal-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 400px; }
        .resp-modal-left { width: 100%; border-right: 1px solid ${D.border}; }
        .resp-modal-right { width: 100%; }
        .resp-gap-report-grid { display: grid; grid-template-columns: 1fr 1.5fr 1fr 1fr 1fr 1fr 1fr; gap: 12px; }
        .resp-24h-kpi { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .resp-ops-table-grid { display: grid; grid-template-columns: 150px 1fr 1fr 1.5fr 100px; gap: 16px; }
        
        @keyframes fadeUp  {from{opacity:0;transform:translateY(10px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes mFade   {from{opacity:0}to{opacity:1}}
        @keyframes dotPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}
        @keyframes shimmerSweep { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

        @media (max-width: 1024px) {
          .resp-kpi { grid-template-columns: repeat(2, 1fr); }
          .resp-modal-split { grid-template-columns: 1fr; }
          .resp-modal-left { border-right: none; border-bottom: 1px solid ${D.border}; min-height: 300px; }
          .resp-24h-kpi { grid-template-columns: repeat(2, 1fr); }
          .resp-gap-report-scroll, .resp-ops-table-scroll { overflow-x: auto; }
          .resp-gap-report-inner { min-width: 800px; }
          .resp-ops-table-inner { min-width: 900px; }
        }
        @media (max-width: 768px) {
          .resp-nav { flex-wrap: wrap; height: auto; padding: 16px 20px; row-gap: 12px; justify-content: center; text-align: center; }
          .resp-kpi { grid-template-columns: 1fr; }
          .resp-24h-kpi { grid-template-columns: 1fr; }
        }
        *{box-sizing:border-box;}
      `}</style>

      <div style={{ padding: "32px 28px", maxWidth: 1400, margin: "0 auto" }}>
        
        {/* ── Approval Alert Banner ── */}
        {needsApproval && (
          <div style={{ 
            background: `linear-gradient(90deg, ${D.red}, ${D.redDark})`, 
            padding: "12px 24px", 
            borderRadius: 16, 
            marginBottom: 20, 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            boxShadow: `0 10px 20px -5px ${D.red}40`,
            animation: "fadeUp 0.4s ease"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>🚨</span>
              <div>
                  <div style={{ color: "#fff", fontWeight: 900, fontSize: 15 }}>Substitution Approvals Required</div>
                  <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 12, fontWeight: 600 }}>Some substitutes do not meet the minimum skill requirement for their stations.</div>
              </div>
            </div>
            <button 
              onClick={handleApproveAll}
              style={{ 
                  background: "#fff", color: D.red, border: "none", 
                  padding: "8px 20px", borderRadius: 10, fontWeight: 800, 
                  fontSize: 13, cursor: "pointer", transition: "all 0.2s" 
              }}
            >
              APPROVE ALL GAPS
            </button>
          </div>
        )}

        {/* PAGE TITLE */}
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp .4s ease" }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: D.purple, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
            Man-Machine Heat Map
          </h1>
          <p style={{ color: D.g600, fontSize: 15, margin: 0, fontWeight: 500 }}>
            Real-time manpower allocation · Neemrana Plant · {today} · Business: SS
          </p>
        </div>

        {/* Error / Loading / Empty guard */}
        {error && !isLoading && (
          <HeatmapError message={error} onRetry={actions.retry} isAuth={isAuthError} />
        )}

        {/* KPI CARDS — Frosted Glass */}
        <div className="resp-kpi">
          {[
            { icon: "👷🏾", label: "Total Assigned", val: allCells.length, color: D.purple, bg: D.purpleL },
            { icon: "⚠️", label: "Substitutes", val: gaps, color: gaps > 0 ? D.red : D.green, bg: gaps > 0 ? D.redL : D.greenL },
            { icon: "📊", label: "Line Coverage", val: `${coverage}%`, color: D.blue, bg: D.blueL },
          ].map((k, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.7)", backdropFilter: "blur(10px)", borderRadius: 20, padding: "20px",
              boxShadow: D.sh, border: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 16,
              animation: `fadeUp .4s ease ${i * 60}ms both`, transition: "transform .2s,box-shadow .2s", cursor: "default",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = D.shMd; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = D.sh; }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: k.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0, boxShadow: `inset 0 0 10px ${k.color}20` }}>{k.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 900, color: k.color, lineHeight: 1 }}>{k.val}</div>
                <div style={{ fontSize: 13, color: D.g600, marginTop: 4, fontWeight: 600 }}>{k.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTROLS BAR */}
        <div style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", borderRadius: 20, boxShadow: D.sh, border: `1px solid ${D.border}`, marginBottom: 16, overflow: "hidden" }}>
          {/* Top Row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: `1px solid ${D.border}`, flexWrap: "wrap", gap: 12 }}>
            {/* Shift toggle */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, opacity: view === "24h" ? 0.3 : 1, pointerEvents: view === "24h" ? "none" : "auto", transition: "all .2s" }}>
              <div style={{ width: 3, height: 20, borderRadius: 2, background: `linear-gradient(180deg,${D.purple},${D.purpleMid})` }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: D.g500, textTransform: "uppercase", letterSpacing: "0.08em" }}>Shift</span>
              <div style={{ display: "flex", background: D.g100, borderRadius: 10, padding: 3, gap: 3, border: `1px solid ${D.border}` }}>
                {(["A", "B", "C", "G"] as const).map(s => (
                  <button key={s} onClick={() => handleShift(s)} style={{
                    padding: "7px 22px", fontSize: 13, fontWeight: 800, fontFamily: "inherit", cursor: "pointer", border: "none", borderRadius: 8,
                    background: shift === s ? `linear-gradient(135deg, ${D.purple}, ${D.purpleMid})` : "transparent",
                    color: shift === s ? "white" : D.g500,
                    transition: "all .25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    boxShadow: shift === s ? "0 4px 12px rgba(15,39,68,0.32)" : "none",
                    letterSpacing: "0.02em",
                  }}>Shift {s}</button>
                ))}
              </div>
            </div>

            {/* Hierarchy Filters */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }} role="group" aria-label="Hierarchy filters">
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: D.white, border: `1px solid ${D.border}`, borderRadius: 10, padding: "2px 8px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: D.g500 }}>DEPT</span>
                <select
                  aria-label="Select department"
                  value={selections.selectedDeptId ?? ""}
                  onChange={(e) => actions.setDept(e.target.value ? Number(e.target.value) : null)}
                  style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 800, color: D.purple, padding: "6px 4px", background: "transparent" }}>
                  <option value="">Select Dept</option>
                  {hierarchy.departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, background: D.white, border: `1px solid ${D.border}`, borderRadius: 10, padding: "2px 8px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: D.g500 }}>LINE</span>
                <select
                  aria-label="Select line"
                  value={selections.selectedLineId ?? ""}
                  onChange={(e) => actions.setLine(e.target.value ? Number(e.target.value) : null)}
                  style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 800, color: D.purple, padding: "6px 4px", background: "transparent" }}>
                  <option value="">All Lines</option>
                  {hierarchy.lines.map(l => <option key={l.id} value={l.id}>{l.line_name}</option>)}
                </select>
              </div>

              {hierarchy.subLines.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: D.white, border: `1px solid ${D.border}`, borderRadius: 10, padding: "2px 8px" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: D.g500 }}>SUB-LINE</span>
                  <select
                    aria-label="Select sub-line"
                    value={selections.selectedSubLineId ?? ""}
                    onChange={(e) => actions.setSubLine(e.target.value ? Number(e.target.value) : null)}
                    style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 800, color: D.purple, padding: "6px 4px", background: "transparent" }}>
                    <option value="">All SubLines</option>
                    {hierarchy.subLines.map(sl => <option key={sl.id} value={sl.id}>{sl.subline_name}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 6, background: D.white, border: `1px solid ${D.border}`, borderRadius: 10, padding: "2px 8px" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: D.g500 }}>DATE</span>
                <input
                  type="date"
                  aria-label="Select date"
                  value={selections.selectedDate}
                  onChange={(e) => actions.setDate(e.target.value)}
                  style={{ border: "none", outline: "none", fontSize: 13, fontWeight: 800, color: D.purple, padding: "6px 4px", background: "transparent" }} />
              </div>

              {isLoading && <div aria-live="polite" style={{ marginLeft: 8, fontSize: 12, color: D.purple, fontWeight: 700, animation: "dotPulse 1s infinite" }}>Refreshing...</div>}
            </div>
          </div>

          {/* Bottom Row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px" }}>
            {/* Simulate button (hidden in 24h view) */}
            <div style={{ opacity: view === "24h" ? 0.3 : 1, pointerEvents: view === "24h" ? "none" : "auto", transition: "all .2s" }}>
              <button onClick={() => setSimMode(s => !s)} style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, fontFamily: "'Inter', 'SF Pro', sans-serif", cursor: "pointer",
                border: `1px solid ${simMode ? D.purple : "#cbd5e1"}`, borderRadius: 6,
                background: simMode ? `linear-gradient(135deg,${D.purple},${D.purpleMid})` : "#ffffff",
                color: simMode ? "white" : "#475569", transition: "all .2s",
                boxShadow: simMode ? `0 4px 14px rgba(15,39,68,0.3)` : "0 1px 2px rgba(0,0,0,0.05)",
              }}>
                <span style={{ display: "flex", alignItems: "center", opacity: 0.9 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="2" y1="12" x2="4" y2="12" /></svg>
                </span>
                {simMode ? "SIM ON" : "SIMULATE"}
                {simMode && <span style={{ width: 6, height: 6, borderRadius: "50%", background: D.amber, animation: "dotPulse 1.2s infinite", display: "inline-block", marginLeft: 4 }} />}
              </button>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 28, background: D.border, margin: "0 4px" }} />

            {/* View toggle */}
            <div style={{ display: "flex", background: "#f8fafc", borderRadius: 8, padding: 4, gap: 4, border: `1px solid #cbd5e1` }}>
              {[
                { v: "heat", ico: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c3.5 0 6 3 6 7s-1 6-4 8" /><path d="M12 2c-3.5 0-6 3-6 7s1 6 4 8" /><path d="M12 22s2-2 2-5m-4 5s-2-2-2-5" /></svg>, lbl: "Matrix View" },
                { v: "list", ico: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>, lbl: "Substitutes" },
                { v: "24h", ico: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20" /><path d="M4 20V8l8-4 8 4v12" /><path d="M12 20v-6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v6" /><path d="M16 12v3" /></svg>, lbl: "24H Ops" }
              ].map(({ v, ico, lbl }) => (
                <button key={v} onClick={() => setView(v as any)} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 16px", fontSize: 13, fontWeight: 800, fontFamily: "'Inter', 'SF Pro', sans-serif", cursor: "pointer",
                  border: view === v ? "1px solid #0f172a" : "1px solid transparent",
                  borderRadius: 6,
                  background: view === v ? "#ffffff" : "transparent",
                  color: view === v ? "#0f172a" : "#64748b",
                  transition: "all .2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  boxShadow: view === v ? `0 2px 4px rgba(0,0,0,0.05)` : "none",
                }}>
                  <span style={{
                    display: "flex", alignItems: "center",
                    color: view === v ? "#ef4444" : "#94a3b8", // Use red stroke for active icon to match user screenshot style precisely
                    transition: "color .2s"
                  }}>{ico}</span>{lbl}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SHIFT SIMULATOR */}
        {simMode && (
          <div style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "20px 28px", boxShadow: D.shMd, border: `1.5px solid ${D.purpleMid}`, marginBottom: 20, animation: "fadeUp .3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ background: `linear-gradient(135deg, ${D.purple}, ${D.purpleMid})`, borderRadius: 12, padding: "8px 18px", fontSize: 13, fontWeight: 800, color: "white", flexShrink: 0, boxShadow: "0 4px 12px rgba(15,39,68,0.25)" }}>⏱ Shift Simulator</div>
              <div style={{ flex: 1 }}>
                <input type="range" min={0} max={8} step={0.5} value={simHour} onChange={e => setSimHour(parseFloat(e.target.value))} style={{ width: "100%", accentColor: D.purpleMid, cursor: "pointer" }} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                    <span key={h} style={{ fontSize: 11, fontWeight: simHour === h ? 800 : 600, color: simHour === h ? D.purple : D.g400 }}>{h}h</span>
                  ))}
                </div>
              </div>
              <div style={{ background: D.purple, color: "white", borderRadius: 12, padding: "8px 24px", fontSize: 16, fontWeight: 900, flexShrink: 0, textAlign: "center", border: `2px solid ${D.amber}` }}>{simHour}h</div>
            </div>
            <div style={{ fontSize: 13, color: D.g500, marginTop: 10, fontWeight: 500 }}>
              Scrub to see how long each operator has been on station vs. the standard cycle ({STD}h). Click any cell to see their time efficiency gauge update live.
            </div>
          </div>
        )}

        {/* HEATMAP GRID */}
        {view === "heat" && (
          <div key={`${animKey}-${shift}`} style={{ background: "rgba(255,255,255,0.6)", backdropFilter: "blur(20px)", borderRadius: 24, boxShadow: "0 20px 40px rgba(0,0,0,0.04)", border: `1px solid ${D.border}`, overflow: "hidden" }}>
            {isLoading && <HeatmapSkeleton />}
            {!isLoading && data.length === 0 && !error && <HeatmapEmpty />}
            <div style={{ background: `linear-gradient(135deg,${D.purple},${D.purpleMid})`, padding: "18px 28px", display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: "radial-gradient(ellipse at right, rgba(255,255,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔥</div>
              <div style={{ color: "white", fontWeight: 900, fontSize: 18, letterSpacing: "-0.01em" }}>Kinetic Matrix — Shift {shift}</div>
              <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", fontSize: 12, padding: "4px 14px", borderRadius: 20, fontWeight: 700 }}>
                {data.length} Lines Active
              </span>
              {simMode && (
                <span style={{ background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.4)", color: "white", fontSize: 12, padding: "4px 14px", borderRadius: 20, fontWeight: 800, marginLeft: 8, animation: "dotPulse 1.5s infinite" }}>⏱ t = {simHour}h</span>
              )}
              <span style={{ marginLeft: "auto", color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 500 }}>Click any cell for telemetry</span>
            </div>

            <div style={{ padding: 24, overflowX: "auto" }}>
              <div style={{ minWidth: 960 }}>
                {/* Process headers */}
                <div style={{ display: "grid", gridTemplateColumns: `112px repeat(${procs.length},1fr)`, gap: 8, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: D.g400, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                    Line / Process
                  </div>
                  {procs.map(p => (
                    <div key={p.id} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: D.g600, lineHeight: 1.35 }}>{p.sh}</div>
                      {p.minSkill && (
                        <span style={{ fontSize: 10, color: D.purple, fontWeight: 800, background: D.purpleL, border: `1px solid ${D.purple}40`, borderRadius: 10, padding: "2px 8px", display: "inline-block", marginTop: 4 }}>min {p.minSkill}</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Thermal flow separator */}
                <div style={{ height: 2, borderRadius: 2, marginBottom: 12, background: `linear-gradient(90deg,transparent,${D.purple}40,${D.amber}30,${D.green}30,transparent)` }} />

                {/* Rows */}
                {data.map((row: RowData, ri: number) => (
                  <div key={row.line} style={{ display: "grid", gridTemplateColumns: `112px repeat(${procs.length},1fr)`, gap: 8, marginBottom: 8 }} role="row">
                    <div role="rowheader" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#9b1c1c", backdropFilter: "blur(4px)", border: "1.5px solid #ff0000", borderLeft: `4px solid #0d111e`, borderRadius: 12, fontWeight: 900, fontSize: 14, color: "#eef0f5", animation: `fadeUp .3s ease ${ri * 50}ms both` }}>{row.line}</div>
                    {procs.map((proc: ProcessColumn, ci: number) => {
                      const cell = row.cells.find((x: CellData) => x.processId === proc.id);
                      if (!cell) return <div key={proc.id} />;
                      return (
                        <HeatCell key={proc.id} cell={cell} process={proc} delay={ri * 40 + ci * 25} onClick={() => handleCellClick(cell, proc)} />
                      );
                    })}
                  </div>
                ))}

                {/* Legend */}
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${D.border}`, display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: D.g600, textTransform: "uppercase" }}>Legend:</span>
                  {Object.entries(SK).map(([level, cfg]) => (
                    <div key={level} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ background: cfg.badge, color: cfg.btext, fontSize: 12, fontWeight: 800, padding: "2px 12px", borderRadius: 20, border: `1px solid ${cfg.bdr}` }}>{level}</span>
                      <span style={{ fontSize: 13, color: D.g600, fontWeight: 500 }}>{cfg.lbl}</span>
                      {level === "L4" && <span style={{ fontSize: 13, color: cfg.particle }}>✨</span>}
                    </div>
                  ))}
                  <div style={{ width: 1, height: 20, background: D.border, margin: "0 8px" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 28, height: 18, borderRadius: 6, background: D.redL, border: `2px solid ${D.red}` }} />
                    <span style={{ fontSize: 13, color: D.red, fontWeight: 700 }}>Substitute Worker</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: D.red, animation: "dotPulse 1.5s infinite" }} />
                    <span style={{ fontSize: 13, color: D.red, fontWeight: 700 }}>Absent Alert</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GAP REPORT */}
        {view === "list" && (() => {
          const allRows = data.flatMap((row: RowData) =>
            row.cells.filter((x: CellData) => x.emp).map((x: CellData) => ({ row, x }))
          );
          const totalPages = Math.max(1, Math.ceil(allRows.length / REPORT_PER_PAGE));
          const pageRows = allRows.slice(reportPage * REPORT_PER_PAGE, (reportPage + 1) * REPORT_PER_PAGE);
          return (
            <div style={{ background: D.white, borderRadius: 24, boxShadow: D.sh, border: `1px solid ${D.border}`, overflow: "hidden", animation: "fadeUp .25s ease" }}>
              <div style={{ background: `linear-gradient(135deg,${D.purple},${D.purpleMid})`, padding: "18px 28px", display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📋</div>
                <div style={{ color: "white", fontWeight: 900, fontSize: 18, letterSpacing: "-0.01em" }}>Substitute Report — Shift {shift}</div>
                <span style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", fontSize: 12, padding: "4px 14px", borderRadius: 20, fontWeight: 700 }}>{gaps} Substitutions</span>
                <span style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: 12, padding: "4px 14px", borderRadius: 20, fontWeight: 600 }}>Page {reportPage + 1} / {totalPages}</span>
              </div>
              <div style={{ padding: 24, overflowX: "auto" }}>
                <div style={{ minWidth: 800 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", gap: 12, padding: "12px 20px", background: D.g100, borderRadius: 12, marginBottom: 12 }}>
                    {["LINE", "OPERATOR", "PROCESS", "ASSIGNED", "REQUIRED", "TIME", "STATUS"].map(h => (
                      <div key={h} style={{ fontSize: 12, fontWeight: 800, color: D.g400, letterSpacing: "0.05em" }}>{h}</div>
                    ))}
                  </div>
                  {pageRows.map(({ row, x }, i) => {
                    const proc = procs.find(p => p.id === x.processId)!;
                    const g = x.hasSkillGap;
                    const cfg = x.skill ? SK[x.skill] : null;
                    return (
                      <div key={`${row.line}-${x.processId}`}
                        style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr 1fr 1fr 1fr 1fr", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${D.border}`, background: g ? "#fff8f8" : D.white, borderLeft: g ? `4px solid ${D.red}` : "4px solid transparent", alignItems: "center", transition: "background .15s", cursor: "pointer", animation: `fadeUp .3s ease ${i * 40}ms both` }}
                        onClick={() => handleCellClick(x, proc)}
                        onMouseEnter={e => { e.currentTarget.style.background = g ? "#fff0f0" : D.g100; }}
                        onMouseLeave={e => { e.currentTarget.style.background = g ? "#fff8f8" : D.white; }}>
                        <div style={{ fontWeight: 900, color: D.purple, fontSize: 14 }}>{row.line}</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: D.g800 }}>{x.name}</div>
                          <div style={{ fontSize: 12, color: D.g400, fontWeight: 500 }}>#{x.emp}</div>
                        </div>
                        <div style={{ fontSize: 13, color: D.g600, fontWeight: 600 }}>{proc.sh}</div>
                        <div><span style={{ background: cfg?.badge, color: cfg?.btext, fontSize: 12, fontWeight: 800, padding: "4px 12px", borderRadius: 20, border: `1px solid ${cfg?.bdr}`, display: "inline-block" }}>{x.skill}</span></div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: D.g600 }}>{proc.minSkill ?? "—"}</div>
                        <div style={{ fontSize: 13, color: D.g600, fontWeight: 600 }}>{x.hrs ? `${x.hrs}h` : "—"}</div>
                        <div><span style={{ background: g ? D.redL : D.greenL, color: g ? D.red : D.green, fontSize: 11, fontWeight: 800, padding: "4px 12px", borderRadius: 20, border: `1px solid ${g ? "#fca5a5" : "#86efac"}`, display: "inline-block" }}>{g ? "⚠️ SUBSTITUTE" : "✓ ASSIGNED"}</span></div>
                      </div>
                    );
                  })}
                </div>
                {/* Pagination */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${D.border}` }}>
                  <div style={{ fontSize: 13, color: D.g500, fontWeight: 600 }}>
                    Showing {reportPage * REPORT_PER_PAGE + 1}–{Math.min((reportPage + 1) * REPORT_PER_PAGE, allRows.length)} of {allRows.length} records
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button
                      disabled={reportPage === 0}
                      onClick={() => setReportPage(p => p - 1)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "9px 20px",
                        fontSize: 13, fontWeight: 800, fontFamily: "inherit", cursor: reportPage === 0 ? "not-allowed" : "pointer",
                        border: `1.5px solid ${reportPage === 0 ? D.border : D.purple}`, borderRadius: 10,
                        background: reportPage === 0 ? D.g100 : D.white,
                        color: reportPage === 0 ? D.g300 : D.purple,
                        transition: "all .2s", opacity: reportPage === 0 ? 0.5 : 1,
                      }}>← Previous</button>
                    <button
                      disabled={reportPage === totalPages - 1}
                      onClick={() => setReportPage(p => p + 1)}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "9px 20px",
                        fontSize: 13, fontWeight: 800, fontFamily: "inherit", cursor: reportPage === totalPages - 1 ? "not-allowed" : "pointer",
                        border: `1.5px solid ${reportPage === totalPages - 1 ? D.border : D.purple}`, borderRadius: 10,
                        background: reportPage === totalPages - 1 ? D.g100 : `linear-gradient(135deg,${D.purple},${D.purpleMid})`,
                        color: reportPage === totalPages - 1 ? D.g300 : "white",
                        transition: "all .2s", opacity: reportPage === totalPages - 1 ? 0.5 : 1,
                        boxShadow: reportPage === totalPages - 1 ? "none" : `0 4px 10px rgba(15,39,68,0.25)`,
                      }}>Next →</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 24H OPS VIEW */}
        {view === "24h" && (() => {
          const shiftDefs = [
            { key: "A" as const, label: "Morning Shift", emoji: "🌅", start: 6, end: 14, color: "#f59e0b" },
            { key: "B" as const, label: "Evening Shift", emoji: "🌆", start: 14, end: 22, color: "#0f2744" },
            { key: "C" as const, label: "Night Shift", emoji: "🌙", start: 22, end: 30, color: "#6d28d9" },
          ];
          return (
            <div style={{ animation: "fadeUp .4s ease" }}>
               {/* Simplified 24h summary for demo */}
               <div style={{ background: D.white, borderRadius: 24, padding: 32, boxShadow: D.sh }}>
                 <h2 style={{ fontSize: 22, fontWeight: 900, color: D.purple, marginBottom: 24 }}>Plant-Wide Coverage (24H)</h2>
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
                    {shiftDefs.map(s => {
                      const sd = getShiftData(s.key);
                      const head = sd.flatMap(r => r.cells.filter(c => c.emp)).length;
                      const cap = sd.length * procs.length;
                      const p = cap > 0 ? Math.round((head / cap) * 100) : 0;
                      return (
                        <div key={s.key} style={{ padding: 24, borderRadius: 16, border: `1.5px solid ${D.border}`, background: opsShift === s.key ? D.g100 : "#fff", cursor: "pointer" }} onClick={() => setOpsShift(s.key)}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: D.purple }}>Shift {s.key}</div>
                          <div style={{ fontSize: 13, color: D.g500, marginTop: 4 }}>{s.label}</div>
                          <div style={{ marginTop: 20, fontSize: 32, fontWeight: 900, color: p < 80 ? D.red : D.green }}>{p}%</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: D.g400, textTransform: "uppercase" }}>Coverage</div>
                        </div>
                      );
                    })}
                 </div>
               </div>
            </div>
          );
        })()}

      </div>

      {modal && <Modal cell={modal.cell} process={modal.process} onClose={() => setModal(null)} />}
      
      {subModal && (
        <SubstitutionModal
          {...subModal}
          onClose={() => setSubModal(null)}
          onSave={() => {
            setSubModal(null);
            actions.retry();
          }}
        />
      )}

      {gapModalData && (
        <div onClick={() => setGapModalData(null)} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 24, padding: 32, maxWidth: 500, width: "90%" }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, marginBottom: 16 }}>Gap Review: {gapModalData.line}</h2>
            <p>Direct station-level substitution suggested via Matrix View.</p>
            <button onClick={() => setGapModalData(null)} style={{ background: D.purple, color: "#fff", border: "none", padding: "12px 24px", borderRadius: 12, width: "100%", fontWeight: 700, marginTop: 20 }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
