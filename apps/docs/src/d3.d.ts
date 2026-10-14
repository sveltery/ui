// `@types/d3-scale` and `@types/d3-shape` are not in the workspace lockfile, so the two d3
// imports of the dashboard blocks are declared here. LayerChart is the only consumer of both values.
declare module 'd3-scale' {
  import type { AnyScale } from 'layerchart/utils/scales.svelte';
  export function scaleUtc(): AnyScale;
}

declare module 'd3-shape' {
  export const curveNatural: unknown;
}
