import { BandPosition } from './util/scale/RechartsScale.js';
/**
 * A function that converts data values to pixel coordinates.
 * @param value - The data value to convert (number, string, or category).
 * @param options - Optional configuration for banded scales.
 * @param options.position - Position within a band: 'start', 'middle', or 'end'.
 * @returns The pixel coordinate, or `undefined` if the value is not in the domain.
 */
export type ScaleFunction = (value: unknown, options?: { position?: BandPosition }) => number | undefined;
/**
 * A function that converts pixel coordinates back to data values.
 * @param pixelValue - The pixel coordinate to convert.
 * @returns The closest data value in the domain.
 */
export type InverseScaleFunction = (pixelValue: number) => unknown;
/**
 * Data point with x and y values that can be converted to pixel coordinates.
 * The x and y values should be in the same format as your chart data.
 */
export type CartesianDataPoint = {
  x: number | string;
  y: number | string;
};
