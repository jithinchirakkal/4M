/**
 * heatmap.types.ts
 *
 * Strict domain type definitions for the Heatmap module.
 * These types mirror the canonical API response envelope from heatmap_data.
 *
 * ⚠ Do NOT use `any` anywhere in this module.
 *
 * @see app1/services/heatmap_service.py — the backend counterpart
 */

// ─── API Response Types (mirror backend canonical envelope) ──────────────────

export type SkillLevel = "L0" | "L1" | "L2" | "L3" | "L4" | null;

export interface EmployeeAssignment {
  emp_id:            string;
  name:              string;
  shift:             string;    // e.g. "A", "B", "C", "Off", "WO"
  skill_level:       SkillLevel;
  presence?:         "Present" | "Absent";
  is_substitute?:    boolean;
  requires_approval?: boolean;
  is_approved?:      boolean;
}

export interface StationData {
  station_id:   number;
  station_name: string;
  min_skill:    SkillLevel;     // null = no requirement defined; frontend should not assume L3
  required:     number;
  available:    number;
  gap:          number;
  employees:    EmployeeAssignment[];
}

export interface LineData {
  line_id:   number;
  line_name: string;
  required:  number;
  available: number;
  stations:  StationData[];
}

export interface HeatmapMeta {
  date:             string;
  applied_filters:  HeatmapFilters;
  total_stations:   number;
  total_assigned:   number;
  coverage_pct:     number;   // 0–100
  total_gaps:       number;
}

export interface HeatmapSummary {
  required:  number;
  available: number;
  gap:       number;
}

/** The canonical API response envelope returned by /shifts/heatmap_data/ */
export interface HeatmapApiResponse {
  meta:    HeatmapMeta;
  summary: HeatmapSummary;
  lines:   LineData[];
}

// ─── Filter / Selection State ─────────────────────────────────────────────────

/** Query-level filters sent to the backend */
export interface HeatmapFilters {
  department_id:  number;
  line_id?:       number;
  subline_id?:    number;
  station_id?:    number;
}

// ─── Hierarchy (fetched from /hierarchy-simple/) ─────────────────────────────

export interface HierarchyStation {
  id:           number;
  station_name: string;
}

export interface HierarchySubLine {
  id:           number;
  subline_name: string;
  stations:     HierarchyStation[];
}

export interface HierarchyLine {
  id:        number;
  line_name: string;
  sublines:  HierarchySubLine[];
  stations:  HierarchyStation[];   // direct (no sub-line)
}

export interface HierarchyDepartment {
  id:              number;
  department_name: string;
  lines:           HierarchyLine[];
  stations:        HierarchyStation[];  // direct (flat departments)
}

export interface HierarchyStructure {
  structure_data: {
    departments: HierarchyDepartment[];
  };
}

export type HierarchyData = HierarchyStructure[];

// ─── Grid / View Types (frontend-internal, not from API) ─────────────────────

/** A single heatmap cell in the matrix view */
export interface CellData {
  processId:  string;         // station_id as string (grid key)
  emp:           string | null;  // emp_id
  name:          string | null;
  skill:         SkillLevel;
  hrs:           number;
  hasSkillGap:   boolean;       // pre-computed from skill vs min_skill
  presence?:     "Present" | "Absent";
  isSubstitute?: boolean;
  requiresApproval?: boolean;
  isApproved?:   boolean;
  isApplicable:  boolean;       // false if station not in this line's hierarchy
}

/** A row in the matrix view (one per Line) */
export interface RowData {
  line:  string;
  cells: CellData[];
}

/** A column header in the matrix view (one per Station) */
export interface ProcessColumn {
  id:       string;           // station_id as string
  sh:       string;           // abbreviated name
  full:     string;           // full station name
  minSkill: SkillLevel;       // from StationData.min_skill
}

// ─── Hook State ───────────────────────────────────────────────────────────────

export interface HeatmapState {
  data:        HeatmapApiResponse | null;
  isLoading:   boolean;
  error:       string | null;
}

export interface HierarchySelections {
  selectedDeptId:    number | null;
  selectedLineId:    number | null;
  selectedSubLineId: number | null;
  selectedStationId: number | null;
  selectedDate:      string;         // YYYY-MM-DD
}

// ─── Transformation Output ────────────────────────────────────────────────────

export interface TransformedHeatmap {
  procs:    ProcessColumn[];
  rows:     RowData[];
  allCells: CellData[];        // flattened, assigned only
  gapCount: number;
  coverage: number;
}

export type ShiftKey = "A" | "B" | "C" | "G";
