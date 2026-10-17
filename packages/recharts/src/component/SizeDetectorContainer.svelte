<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import { clsx } from 'clsx';
  import throttle from 'es-toolkit/compat/throttle';
  import { warn } from '../util/LogUtils.js';
  import { attrs } from '../util/attrs.js';
  import type { Props } from './ResponsiveContainer.js';
  import { calculateChartDimensions, defaultResponsiveContainerProps, getInnerDivStyle } from './responsiveContainerUtils.js';
  import ResponsiveContainerContextProvider from './ResponsiveContainerContextProvider.svelte';

  let {
    aspect,
    initialDimension = defaultResponsiveContainerProps.initialDimension,
    width,
    height,
    // The default for minWidth is 0 so that a flexbox parent can shrink the container.
    minWidth = defaultResponsiveContainerProps.minWidth,
    minHeight,
    maxHeight,
    children,
    debounce = defaultResponsiveContainerProps.debounce,
    id,
    className,
    onResize,
    style = {},
    ref = $bindable(null),
  }: Omit<Props, 'children'> & { children?: Snippet; ref?: HTMLDivElement | null } = $props();

  const initial = untrack(() => initialDimension);
  let sizes = $state({ containerWidth: initial.width, containerHeight: initial.height });

  function setContainerSize(newWidth: number, newHeight: number) {
    const roundedWidth = Math.round(newWidth);
    const roundedHeight = Math.round(newHeight);
    if (sizes.containerWidth === roundedWidth && sizes.containerHeight === roundedHeight) return;
    sizes = { containerWidth: roundedWidth, containerHeight: roundedHeight };
  }

  $effect(() => {
    const node = ref;
    const delay = debounce;
    if (node == null || typeof ResizeObserver === 'undefined') return;
    return untrack(() => {
      let callback = (entries: ResizeObserverEntry[]) => {
        const entry = entries[0];
        if (entry == null) return;
        const { width: containerWidth, height: containerHeight } = entry.contentRect;
        setContainerSize(containerWidth, containerHeight);
        onResize?.(containerWidth, containerHeight);
      };
      if (delay > 0) {
        callback = throttle(callback, delay, { trailing: true, leading: false });
      }
      const observer = new ResizeObserver(callback);
      const { width: containerWidth, height: containerHeight } = node.getBoundingClientRect();
      setContainerSize(containerWidth, containerHeight);
      observer.observe(node);
      return () => observer.disconnect();
    });
  });

  const calculated = $derived(calculateChartDimensions(sizes.containerWidth, sizes.containerHeight, { width, height, aspect, maxHeight }));

  $effect.pre(() => {
    warn(!aspect || aspect > 0, 'The aspect(%s) must be greater than zero.', aspect);
    warn(
      (calculated.calculatedWidth != null && calculated.calculatedWidth > 0) || (calculated.calculatedHeight != null && calculated.calculatedHeight > 0),
      `The width(%s) and height(%s) of chart should be greater than 0,
       please check the style of container, or the props width(%s) and height(%s),
       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the
       height and width.`,
      calculated.calculatedWidth,
      calculated.calculatedHeight,
      width,
      height,
      minWidth,
      minHeight,
      aspect,
    );
  });
</script>

<div {...attrs({ id: id ? `${id}` : undefined, className: clsx('recharts-responsive-container', className), style: { ...style, width, height, minWidth, minHeight, maxHeight } })} bind:this={ref}>
  <div {...attrs({ style: getInnerDivStyle({ width, height }) })}>
    <ResponsiveContainerContextProvider width={calculated.calculatedWidth} height={calculated.calculatedHeight}>
      {@render children?.()}
    </ResponsiveContainerContextProvider>
  </div>
</div>
