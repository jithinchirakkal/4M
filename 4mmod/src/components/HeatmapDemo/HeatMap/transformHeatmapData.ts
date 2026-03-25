/**
 * transformHeatmapData.ts
 *
 * Pure transformation functions: API response → grid view data.
 *
 * Principles:
 *   - No side effects. No setState. No API calls. Pure functions only.
 *   - Single source of truth for all view transformations (matrix, 24h, list).
 *   - Replaces the duplicated `data` useMemo + `getShiftData` useCallback pattern.
 *   - All functions are deterministic given the same inputs.
 *
 * Usage:
 *   import { transformForShift } from './transformHeatmapData';
 *   const grid = transformForShift(apiResponse, 'A');
 */
import type {
  HeatmapApiResponse,
  CellData,
  RowData,
  ProcessColumn,
  TransformedHeatmap,
  ShiftKey,
  SkillLevel,
  StationData,
} from "./heatmap.types";

// ─── Skill Level helpers ──────────────────────────────────────────────────────

const SKILL_ORDER: Record<NonNullable<SkillLevel>, number> = {
  L0: 0, L1: 1, L2: 2, L3: 3, L4: 4,
};

/**
 * Returns true if the employee's skill level is BELOW the station's minimum.
 * Returns false when either value is null (no configured requirement).
 */
export function hasSkillGap(
  empSkill: SkillLevel,
  minSkill: SkillLevel
): boolean {
  if (!empSkill || !minSkill) return false;
  return SKILL_ORDER[empSkill] < SKILL_ORDER[minSkill];
}

// ─── Column builder ───────────────────────────────────────────────────────────

/**
 * Build the ordered list of ProcessColumn (grid columns) from the API response.
 * Uses insertion-order dedup so the column order matches the API's line/station order.
 */
export function buildProcessColumns(data: HeatmapApiResponse): ProcessColumn[] {
  const seen = new Map<number, ProcessColumn>();
  for (const line of data.lines) {
    for (const station of line.stations) {
      if (!seen.has(station.station_id)) {
        seen.set(station.station_id, {
          id:       String(station.station_id),
          sh:       station.station_name, // Use full name
          full:     station.station_name,
          minSkill: station.min_skill,
        });
      }
    }
  }
  return Array.from(seen.values());
}

// ─── Core transformation ──────────────────────────────────────────────────────

/**
 * Transform the canonical API response into grid data for a specific shift.
 *
 * @param apiData   — validated HeatmapApiResponse from the backend
 * @param shiftKey  — "A" | "B" | "C"
 * @param simHours  — optional override for hours (simulation mode; null = use default 8)
 *
 * @returns TransformedHeatmap with pre-computed gap flags and coverage stats
 */
export function transformForShift(
  apiData: HeatmapApiResponse,
  shiftKey: ShiftKey,
  simHours: number | null = null
): TransformedHeatmap {
  // 1. Build the columns from the full dataset (all shifts share the same column set)
  const procs = buildProcessColumns(apiData);
  const procIndexById = new Map(procs.map((p, i) => [p.id, i]));
  const procMinSkill  = new Map(procs.map(p => [p.id, p.minSkill]));

  // 2. Build one RowData per line, with one CellData per station
  const rows: RowData[] = [];
  const allCells: CellData[] = [];

  for (const line of apiData.lines) {
    // Build a station_id → StationData lookup for this line
    const stationMap = new Map<number, StationData>(
      line.stations.map(s => [s.station_id, s])
    );

    // One row per line — initialise all cells as empty
    const cellMap = new Map<string, CellData>();
    for (const proc of procs) {
      cellMap.set(proc.id, {
        processId:   proc.id,
        emp:         null,
        name:        null,
        skill:       null,
        hrs:         0,
        hasSkillGap: false,
        isApplicable: false, // Default to false (Not Applicable)
      });
    }

    // Fill in cells for stations in this line
    for (const station of line.stations) {
      const procId   = String(station.station_id);
      const minSkill = procMinSkill.get(procId) ?? null;

      // Find the employee assigned to this station for the requested shift
      const emp = station.employees.find(e => e.shift === shiftKey) ?? null;

      const hrs = emp
        ? (simHours !== null ? Math.min(8, simHours) : 8)
        : 0;

      const gapFlag = emp ? hasSkillGap(emp.skill_level, minSkill) : false;

      const cell: CellData = {
        processId:   procId,
        emp:         emp?.emp_id    ?? null,
        name:        emp?.name      ?? null,
        skill:       emp?.skill_level ?? null,
        hrs,
        hasSkillGap: gapFlag,
        presence:    emp?.presence,
        isSubstitute: emp?.is_substitute,
        requiresApproval: emp?.requires_approval,
        isApproved:   emp?.is_approved,
        isApplicable: !!station.is_applicable,
      };
      cellMap.set(procId, cell);
    }

    // Convert map to sorted array (sorted by column order in procs)
    const cells = Array.from(cellMap.values()).sort(
      (a, b) =>
        (procIndexById.get(a.processId) ?? 0) -
        (procIndexById.get(b.processId) ?? 0)
    );

    rows.push({ line: line.line_name, cells });

    // Collect assigned cells for global stats
    const assignedCells = cells.filter(c => c.emp !== null);
    allCells.push(...assignedCells);
  }

  // 3. Global stats
  const totalSlots = rows.length * procs.length;
  const gapCount   = allCells.filter(c => c.hasSkillGap).length;
  const coverage   = totalSlots > 0
    ? Math.round((allCells.length / totalSlots) * 100)
    : 0;

  return { procs, rows, allCells, gapCount, coverage };
}
