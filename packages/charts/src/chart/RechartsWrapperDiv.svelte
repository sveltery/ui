<script lang="ts" module>
  /**
   * Upstream picks one of four wrapper div components (chart/RechartsWrapper.tsx:72-232). Each mode here is one of
   * them: ResponsiveDiv, ReadSizeOnceDiv, StaticDiv, and the plain div that reports no usable size.
   */
  export type WrapperDivMode = 'responsive' | 'readOnce' | 'static' | 'none';
</script>

<script lang="ts">
  import { untrack, type Snippet } from 'svelte';
  import type { Attachment } from 'svelte/attachments';
  import type { CSSProperties } from '../react.js';
  import { attrs } from '../util/attrs.js';
  import ReportChartSize from '../context/ReportChartSize.svelte';

  type WrapperDivProps = {
    mode: WrapperDivMode;
    innerRef: (node: HTMLDivElement | null) => void;
    children: Snippet;
    width: number | string | undefined;
    height: number | string | undefined;
    style: CSSProperties;
    [key: string]: unknown;
  };

  let { mode, innerRef, children, ...props }: WrapperDivProps = $props();

  function getNumberOrZero(value: unknown): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return 0;
  }

  let sizes = $state(
    untrack(() =>
      mode === 'responsive'
        ? { containerWidth: getNumberOrZero(props.style?.width), containerHeight: getNumberOrZero(props.style?.height) }
        : { containerWidth: getNumberOrZero(props.width), containerHeight: getNumberOrZero(props.height) },
    ),
  );

  function setContainerSize(newWidth: number, newHeight: number) {
    const roundedWidth = Math.round(newWidth);
    const roundedHeight = Math.round(newHeight);
    if (sizes.containerWidth === roundedWidth && sizes.containerHeight === roundedHeight) return;
    sizes = { containerWidth: roundedWidth, containerHeight: roundedHeight };
  }

  const measured = $derived(mode === 'responsive' || mode === 'readOnce');

  const ref: Attachment<HTMLDivElement> = (node) =>
    untrack(() => {
      innerRef(node);
      let observer: ResizeObserver | undefined;
      if (mode === 'readOnce' || (mode === 'responsive' && typeof ResizeObserver !== 'undefined')) {
        const { width: containerWidth, height: containerHeight } = node.getBoundingClientRect();
        setContainerSize(containerWidth, containerHeight);
      }
      if (mode === 'responsive' && typeof ResizeObserver !== 'undefined') {
        observer = new ResizeObserver((entries) => {
          const entry = entries[0];
          if (entry == null) return;
          setContainerSize(entry.contentRect.width, entry.contentRect.height);
        });
        observer.observe(node);
      }
      return () => {
        observer?.disconnect();
        innerRef(null);
      };
    });
</script>

<ReportChartSize width={measured ? sizes.containerWidth : (props.width as number | undefined)} height={measured ? sizes.containerHeight : (props.height as number | undefined)}
/><div {...attrs(props)} {@attach ref}>
  {@render children()}
</div>
