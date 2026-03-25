/**
 * heatmap.schema.ts
 *
 * Mocked validation layer to remove zod dependency.
 * For the demo, we trust the mock API data shape.
 */

export function safeParseHeatmapResponse(raw: any) {
  return {
    success: true,
    data: raw
  };
}

// Mock types for downstream compatibility
export type HeatmapApiResponseParsed = any;
export type StationDataParsed         = any;
export type LineDataParsed            = any;
