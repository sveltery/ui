// Sketch B, not used: a builder keyed by ChartConfig that hides defineChart behind shadcn's defaults.
// Generic series keys defeat TanStack's datum inference, so the builder has to erase types to compile.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { areaY, barY, d3Curve, defineChart, lineY, stack } from '@tanstack/charts';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { scalePoint } from '@tanstack/charts/scales/point';
import { fold } from '@tanstack/charts/transform/fold';
import { curveNatural } from 'd3-shape';
import { chartColors, type ChartConfig } from '$registry/bases/base/ui/chart';

type Row = Record<string, string | number>;

export function cartesianChart<TKey extends string>(
  config: ChartConfig & Record<TKey, unknown>,
  options: { data: readonly Row[]; x: string; series: readonly TKey[]; mark: 'bar' | 'area' | 'line'; stacked?: boolean; curve?: 'natural' | 'linear'; format?: (value: string) => string }
) {
  void config;
  const rows: any[] = fold(options.data, { fields: options.series as readonly string[] as never, as: { key: 'series', value: 'value' } });
  const channels = {
    x: options.x,
    y: 'value',
    z: 'series',
    color: 'series',
    ...(options.curve === 'natural' ? { curve: d3Curve(curveNatural) } : {}),
    ...(options.stacked ? { layout: stack({ order: options.series }) } : {}),
  } as any;
  const mark: any = options.mark === 'bar' ? barY(rows, channels) : options.mark === 'area' ? areaY(rows, { ...channels, fillOpacity: 0.4 }) : lineY(rows, channels);
  return defineChart({
    marks: [mark],
    scales: {
      x: { scale: options.mark === 'bar' ? () => scaleBand<string>().padding(0.1) : scalePoint, axis: { line: false, ticks: { size: 0, padding: 8, format: options.format } } },
      y: { scale: scaleLinear, grid: true, axis: false },
    },
    color: chartColors(options.series),
    margin: { left: 12, right: 12 },
    focus: 'group-x',
  });
}
