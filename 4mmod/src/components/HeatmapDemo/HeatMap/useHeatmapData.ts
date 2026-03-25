/**
 * useHeatmapData.ts
 *
 * Custom hook that owns the entire Heatmap data layer:
 *   - Hierarchy fetch and cascade navigation (Dept → Line → SubLine → Station)
 *   - Heatmap data fetch with debounced filter changes
 *   - Zod validation of the API response
 *   - Loading, error, and empty states
 *
 * The HeatMap component should hold no data-fetching logic.
 * It imports this hook and reads the state it needs.
 *
 * @example
 *   const { heatmapData, isLoading, error, hierarchy, selections, actions } = useHeatmapData();
 */
import { useState, useEffect, useRef, useCallback } from "react";

import { fetchHierarchy, fetchHeatmapData } from "../HetmapShiftPlan/api_heatmap";
import { safeParseHeatmapResponse } from "./heatmap.schema";
import type {
  HeatmapApiResponse,
  HierarchyData,
  HierarchyDepartment,
  HierarchyLine,
  HierarchySubLine,
  HierarchyStation,
  HierarchySelections,
} from "./heatmap.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HierarchyOptions {
  departments:  HierarchyDepartment[];
  lines:        HierarchyLine[];
  subLines:     HierarchySubLine[];
  stations:     HierarchyStation[];
}

interface UseHeatmapDataReturn {
  /** Validated API response; null while loading or on error */
  heatmapData: HeatmapApiResponse | null;
  /** Flat hierarchy index for rendering dropdowns */
  hierarchy:   HierarchyOptions;
  /** Current filter selections */
  selections:  HierarchySelections;
  /** Loading spinners */
  isLoading:   boolean;
  isHierarchyLoading: boolean;
  /** First-class error string; null when no error */
  error:       string | null;
  /** True when the error is a 401/403 — triggers auth-specific UI */
  isAuthError: boolean;
  /** Actions for the UI to dispatch */
  actions: {
    setDept:      (id: number | null) => void;
    setLine:      (id: number | null) => void;
    setSubLine:   (id: number | null) => void;
    setStation:   (id: number | null) => void;
    setDate:      (date: string) => void;
    retry:        () => void;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DEBOUNCE_MS = 400;     // wait 400ms after last filter change before firing
const TODAY       = new Date().toISOString().split("T")[0];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useHeatmapData(): UseHeatmapDataReturn {
  // ── Hierarchy raw data ─────────────────────────────────────────────────────
  const [rawHierarchy, setRawHierarchy]       = useState<HierarchyData>([]);
  const [isHierarchyLoading, setHierarchyLoading] = useState(false);

  // ── Filter selections ──────────────────────────────────────────────────────
  const [selections, setSelections] = useState<HierarchySelections>({
    selectedDeptId:    null,
    selectedLineId:    null,
    selectedSubLineId: null,
    selectedStationId: null,
    selectedDate:      TODAY,
  });

  // ── Heatmap response state ─────────────────────────────────────────────────
  const [heatmapData,  setHeatmapData]  = useState<HeatmapApiResponse | null>(null);
  const [isLoading,    setIsLoading]    = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [isAuthError,  setIsAuthError]  = useState(false);

  // ── Debounce timer ─────────────────────────────────────────────────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0); 

  // ── Derive available options from raw hierarchy ────────────────────────────
  const hierarchy = _deriveOptions(rawHierarchy, selections);

  // ── Initial hierarchy load ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const loadHierarchy = async () => {
      setHierarchyLoading(true);
      try {
        const res = await fetchHierarchy();
        if (cancelled) return;
        const data = res.data as HierarchyData;
        setRawHierarchy(data);

        // Auto-select first department
        const allDepts = data.flatMap(s => s.structure_data.departments);
        if (allDepts.length > 0) {
          setSelections(prev => ({
            ...prev,
            selectedDeptId: allDepts[0].id,
          }));
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[useHeatmapData] Failed to load hierarchy:", err);
        }
      } finally {
        if (!cancelled) setHierarchyLoading(false);
      }
    };
    loadHierarchy();
    return () => { cancelled = true; };
  }, []);

  // ── Debounced heatmap data fetch ───────────────────────────────────────────
  useEffect(() => {
    if (!selections.selectedDeptId) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      let cancelled = false;
      setIsLoading(true);
      setError(null);
      setIsAuthError(false);

      try {
        const res = await fetchHeatmapData(
          selections.selectedDate,
          selections.selectedDeptId!,
          {
            lineId:    selections.selectedLineId    ?? undefined,
            subLineId: selections.selectedSubLineId ?? undefined,
            stationId: selections.selectedStationId ?? undefined,
          }
        );

        if (cancelled) return;

        // Runtime validate response shape with Zod
        const parsed = safeParseHeatmapResponse(res.data);
        if (parsed.success) {
          setHeatmapData(parsed.data as HeatmapApiResponse);
        } else {
          // Shape mismatch — use raw data with lenient cast and surface warning
          console.warn("[useHeatmapData] Response schema validation failed. Using raw data.");
          setHeatmapData(res.data as HeatmapApiResponse);
        }
      } catch (err) {
        if (cancelled) return;

        // ── Auth errors (set by apiClient.ts interceptor) ─────────────────────
        if ((err as any)?.isAuthError === true) {
          setError((err as Error).message);
          setIsAuthError(true);
        } else {
          // ── Generic network / data errors ────────────────────────────────────
          const message = (err as Error).message ?? "Unexpected error loading heatmap data.";
          setError(message);
          setIsAuthError(false);
        }
        setHeatmapData(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }

      return () => { cancelled = true; };
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [
    selections.selectedDeptId,
    selections.selectedLineId,
    selections.selectedSubLineId,
    selections.selectedStationId,
    selections.selectedDate,
    retryTrigger, 
  ]);

  // ── Action creators ────────────────────────────────────────────────────────
  const setDept = useCallback((id: number | null) => {
    setSelections(prev => ({
      ...prev,
      selectedDeptId:    id,
      selectedLineId:    null,
      selectedSubLineId: null,
      selectedStationId: null,
    }));
  }, []);

  const setLine = useCallback((id: number | null) => {
    setSelections(prev => ({
      ...prev,
      selectedLineId:    id,
      selectedSubLineId: null,
      selectedStationId: null,
    }));
  }, []);

  const setSubLine = useCallback((id: number | null) => {
    setSelections(prev => ({
      ...prev,
      selectedSubLineId: id,
      selectedStationId: null,
    }));
  }, []);

  const setStation = useCallback((id: number | null) => {
    setSelections(prev => ({ ...prev, selectedStationId: id }));
  }, []);

  const setDate = useCallback((date: string) => {
    setSelections(prev => ({ ...prev, selectedDate: date }));
  }, []);

  const retry = useCallback(() => {
    setRetryTrigger(prev => prev + 1);
    setError(null);
  }, []);

  return {
    heatmapData,
    hierarchy,
    selections,
    isLoading,
    isHierarchyLoading,
    error,
    isAuthError,
    actions: { setDept, setLine, setSubLine, setStation, setDate, retry },
  };
}

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Derive available dropdown options from the raw hierarchy data given current selections.
 * This replaces the triple-nested forEach loops that reran on every render.
 * It is O(N) where N = total number of hierarchy nodes.
 */
function _deriveOptions(
  data:       HierarchyData,
  selections: HierarchySelections
): HierarchyOptions {
  const allDepts: HierarchyDepartment[] = data.flatMap(
    s => s.structure_data.departments
  );

  const selectedDept = allDepts.find(d => d.id === selections.selectedDeptId);

  const lines: HierarchyLine[]      = selectedDept?.lines ?? [];
  const selectedLine                 = lines.find(l => l.id === selections.selectedLineId);

  const subLines: HierarchySubLine[] = selectedLine?.sublines ?? [];
  const selectedSubLine              = subLines.find(sl => sl.id === selections.selectedSubLineId);

  // Stations: most specific level wins
  const stations: HierarchyStation[] =
    selectedSubLine?.stations ??
    selectedLine?.stations ??
    selectedDept?.stations ??
    [];

  return { departments: allDepts, lines, subLines, stations };
}
