// types.ts  // 2024-06-17 // THis file is used to define the types for the Heatmap components//

export interface Process {
  id: string;
  sh: string;
  full: string;
  minSkill: string | null;
}

export interface CellData {
  processId: string;
  emp: string | null;
  name: string | null;
  skill: string | null;
  hrs: number;
}

export interface RowData {
  line: string;
  cells: CellData[];
}