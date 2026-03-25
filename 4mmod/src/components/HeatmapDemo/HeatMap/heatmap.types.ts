/**
 * heatmap.types.ts
 *
 * Strict domain type definitions for the Heatmap module.
 */

export type SkillLevel = "L0" | "L1" | "L2" | "L3" | "L4" | null;

export interface EmployeeAssignment {
  emp_id:            string;
  name:              string;
  shift:             string;
  skill_level:       SkillLevel;
  presence?:         "Present" | "Absent";
  is_substitute?:    boolean;
  requires_approval?: boolean;
  is_approved?:      boolean;
}

export interface StationData {
  station_id:   number;
  station_name: string;
  min_skill:    SkillLevel;
  required:     number;
  available:    number;
  gap:          number;
  is_applicable?: boolean;
  employees:    EmployeeAssignment[];
}

export interface LineData {
  line_id:   number;
  line_name: string;
  required:  number;
  available: number;
  stations:  StationData[];
}

export interface HeatmapFilters {
  department_id:  number;
  line_id?:       number;
  subline_id?:    number;
  station_id?:    number;
}

export interface HeatmapMeta {
  date:             string;
  applied_filters:  HeatmapFilters;
  total_stations:   number;
  total_assigned:   number;
  coverage_pct:     number;
  total_gaps:       number;
}

export interface HeatmapSummary {
  required:  number;
  available: number;
  gap:       number;
}

export interface HeatmapApiResponse {
  meta:    HeatmapMeta;
  summary: HeatmapSummary;
  lines:   LineData[];
}

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
  stations:  HierarchyStation[];
}

export interface HierarchyDepartment {
  id:              number;
  department_name: string;
  lines:           HierarchyLine[];
  stations:        HierarchyStation[];
}

export interface HierarchyStructure {
  structure_data: {
    departments: HierarchyDepartment[];
  };
}

export type HierarchyData = HierarchyStructure[];

export interface CellData {
  processId:     string;
  emp:           string | null;
  name:          string | null;
  skill:         SkillLevel;
  hrs:           number;
  hasSkillGap:   boolean;
  presence?:     "Present" | "Absent";
  isSubstitute?: boolean;
  requiresApproval?: boolean;
  isApproved?:   boolean;
  isApplicable:  boolean;
}

export interface RowData {
  line:  string;
  cells: CellData[];
}

export interface ProcessColumn {
  id:       string;
  sh:       string;
  full:     string;
  minSkill: SkillLevel;
}

export interface TransformedHeatmap {
  procs:    ProcessColumn[];
  rows:     RowData[];
  allCells: CellData[];
  gapCount: number;
  coverage: number;
}

export type ShiftKey = "A" | "B" | "C" | "G";
