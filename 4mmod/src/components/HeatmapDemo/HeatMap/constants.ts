import type { ProcessColumn as Process, CellData, RowData } from "./heatmap.types";

// ─── DESIGN TOKENS — Midnight Navy & Gold Premium Theme ───────────────────
export const D = {
  pageBg: "#eef0f5", white: "#ffffff",
  purple: "#0f2744", purpleL: "#e4eaf4", purpleMid: "#0a1e38",
  green: "#1a6641", greenL: "#d4edda",
  amber: "#c9a84c", amberL: "#fdf6e3",
  blue: "#1a4a7a", blueL: "#dce8f5",
  red: "#9b1c1c", redL: "#fde8e8", redDark: "#7f1d1d",
  g100: "#f7f8fc", g200: "#e4e6ef", g300: "#c8cce0",
  g400: "#8890aa", g500: "#5a6278", g600: "#3a4158", g800: "#0d111e",
  border: "#dde0ec",
  sh: "0 4px 8px rgba(15,39,68,0.07), 0 1px 3px rgba(15,39,68,0.10)",
  shMd: "0 12px 20px -3px rgba(15,39,68,0.12), 0 4px 8px -2px rgba(15,39,68,0.07)",
};

// ─── SKILL CONFIG ─────────────────────────────────────────────────────────────
export const SK: Record<string, { bg: string; bdr: string; text: string; badge: string; btext: string; lbl: string; glow: string; gfrom: string; gto: string; particle: string }> = {
  L1: { bg: "rgba(254,240,138,0.8)", bdr: "#facc15", text: "#713f12", badge: "#fef08a", btext: "#a16207", lbl: "Beginner", glow: "rgba(253,224,71,0.3)", gfrom: "rgba(254,240,138,0.9)", gto: "rgba(254,240,138,0.6)", particle: "#eab308" },
  L2: { bg: "rgba(251,191,36,0.8)", bdr: "#f59e0b", text: "#78350f", badge: "#fcd34d", btext: "#b45309", lbl: "Developing", glow: "rgba(251,191,36,0.3)", gfrom: "rgba(251,191,36,0.9)", gto: "rgba(251,191,36,0.6)", particle: "#d97706" },
  L3: { bg: "rgba(249,115,22,0.8)", bdr: "#ea580c", text: "#fff7ed", badge: "#fdba74", btext: "#9a3412", lbl: "Proficient", glow: "rgba(234,88,12,0.3)", gfrom: "rgba(249,115,22,0.9)", gto: "rgba(249,115,22,0.6)", particle: "#c2410c" },
  L4: { bg: "rgba(220,38,38,0.8)", bdr: "#b91c1c", text: "#fef2f2", badge: "#fca5a5", btext: "#7f1d1d", lbl: "Expert", glow: "rgba(185,28,28,0.4)", gfrom: "rgba(220,38,38,0.9)", gto: "rgba(220,38,38,0.6)", particle: "#991b1b" },
};

export const MACHINE_IMAGES: Record<string, string> = {
  "metal": "/machines/env_metal.png",
  "cfolding": "/machines/env_cfolding.png",
  "clinch": "/machines/env_clinch.png",
  "inflator": "/machines/env_inflator.png",
  "final": "/machines/env_final.png",
  "matmov": "/machines/env_matmov.png",
  "matfeed": "/machines/env_matfeed.png",
  "subassy": "/machines/env_subassy.png",
  "assy": "/machines/env_assy.png",
  "vision": "/machines/env_vision.png",
};

export const STD = 8.0;
export const sl = (s: string | null): number => (s ? parseInt(s[1]) : 0);
export const hasGap = (skill: string | null, min: string | null): boolean => !!skill && !!min && sl(skill) < sl(min);