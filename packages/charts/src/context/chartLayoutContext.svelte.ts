import type { CartesianLayout, CartesianViewBoxRequired, ChartOffsetInternal, LayoutType, Margin, PolarLayout } from '../util/types.js';
import { useAppSelector, type Box } from '../state/hooks.svelte.js';
import { selectChartOffsetInternal, selectChartViewBox } from '../state/selectors/selectChartOffsetInternal.js';
import { selectChartHeight, selectChartWidth } from '../state/selectors/containerSelectors.js';
import { selectBrushDimensions, selectBrushSettings } from '../state/selectors/brushSelectors.js';
import { useIsPanorama } from './PanoramaContext.js';
import { selectChartLayout, selectPolarChartLayout } from './chartLayoutContext.js';

export const useViewBox = (): Box<CartesianViewBoxRequired | undefined> => {
  const panorama = useIsPanorama();
  const rootViewBox = useAppSelector(selectChartViewBox);
  const brushDimensions = useAppSelector(selectBrushDimensions);
  const brushSettings = useAppSelector(selectBrushSettings);
  const viewBox = $derived.by(() => {
    const dimensions = brushDimensions.current;
    const brushPadding = brushSettings.current?.padding;
    if (!panorama || !dimensions || !brushPadding) {
      return rootViewBox.current;
    }
    return {
      width: dimensions.width - brushPadding.left - brushPadding.right,
      height: dimensions.height - brushPadding.top - brushPadding.bottom,
      x: brushPadding.left,
      y: brushPadding.top,
    };
  });
  return {
    get current() {
      return viewBox;
    },
  };
};

const manyComponentsThrowErrorsIfOffsetIsUndefined: ChartOffsetInternal = {
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  width: 0,
  height: 0,
  brushBottom: 0,
};

/** For internal use only. Reads the chart offset in pixels, or zeros outside a chart. */
export const useOffsetInternal = (): Box<ChartOffsetInternal> => {
  const offset = useAppSelector(selectChartOffsetInternal);
  return {
    get current() {
      return offset.current ?? manyComponentsThrowErrorsIfOffsetIsUndefined;
    },
  };
};

/**
 * Reads the width of the chart in pixels: the `width` prop, or the size a ResponsiveContainer decided on.
 * Axes and legend do not change it. Reads `undefined` outside a chart.
 */
export const useChartWidth = (): Box<number | undefined> => useAppSelector(selectChartWidth);

/**
 * Reads the height of the chart in pixels: the `height` prop, or the size a ResponsiveContainer decided on.
 * Axes and legend do not change it. Reads `undefined` outside a chart.
 */
export const useChartHeight = (): Box<number | undefined> => useAppSelector(selectChartHeight);

/** Reads the `margin` the chart was given, which excludes axes, legend and brush. Reads `undefined` outside a chart. */
export const useMargin = (): Box<Margin | undefined> => useAppSelector((state) => state.layout.margin);

export const useChartLayout = (): Box<LayoutType | undefined> => useAppSelector(selectChartLayout);

export const useCartesianChartLayout = (): Box<CartesianLayout | undefined> => {
  const layout = useChartLayout();
  return {
    get current() {
      const value = layout.current;
      return value === 'horizontal' || value === 'vertical' ? value : undefined;
    },
  };
};

export const usePolarChartLayout = (): Box<PolarLayout | undefined> => useAppSelector(selectPolarChartLayout);

/** Every chart reports a layout, so a component inside a chart reads true. */
export const useIsInChartContext = (): Box<boolean> => {
  const layout = useChartLayout();
  return {
    get current() {
      return layout.current !== undefined;
    },
  };
};
