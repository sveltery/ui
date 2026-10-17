<svelte:options namespace="svg" />

<script lang="ts">
  import type { ActiveShape } from '../util/types.js';
  import { useAppSelector } from '../state/hooks.svelte.js';
  import { selectActiveTooltipDataKey, selectActiveTooltipIndex } from '../state/selectors/tooltipSelectors.js';
  import ZIndexLayer from '../zIndex/ZIndexLayer.svelte';
  import { DefaultZIndexes } from '../zIndex/DefaultZIndexes.js';
  import BarRectangle from '../util/BarRectangle.svelte';
  import BarStackClipLayer from './BarStackClipLayer.svelte';
  import type { BarRectangleItem, BarShapeProps, InternalProps } from './Bar.js';

  let {
    shape,
    activeBar,
    baseProps,
    entry,
    index,
    dataKey,
  }: {
    shape: ActiveShape<BarShapeProps, SVGPathElement> | undefined;
    activeBar: ActiveShape<BarShapeProps, SVGPathElement>;
    baseProps: Record<string, unknown>;
    entry: BarRectangleItem;
    index: number;
    dataKey: InternalProps['dataKey'];
  } = $props();

  const activeIndex = useAppSelector(selectActiveTooltipIndex);
  const activeDataKey = useAppSelector(selectActiveTooltipDataKey);
  // The active bar is the one whose original data index matches the tooltip, and whose dataKey matches when one is set.
  const isActive: boolean = $derived(
    Boolean(activeBar) && String(entry.originalDataIndex) === activeIndex.current && (activeDataKey.current == null || dataKey === activeDataKey.current),
  );

  let stayInLayer = $state(false);
  let hasMountedActive = $state(false);

  $effect(() => {
    let rafId: number | undefined;
    if (isActive) {
      // 1. Enter the layer immediately
      stayInLayer = true;

      // 2. Wait for the browser to paint the "inactive" state in the new layer,
      // then switch to active to trigger the CSS transition (width grow).
      rafId = requestAnimationFrame(() => {
        hasMountedActive = true;
      });
    } else {
      hasMountedActive = false;
    }

    return () => {
      if (rafId !== undefined) cancelAnimationFrame(rafId);
    };
  });

  const handleTransitionEnd = () => {
    // 4. Leave the layer only when the exit transition finishes
    if (!isActive) {
      stayInLayer = false;
    }
  };

  // Entering, the bar keeps its inactive size until it has painted once in the layer. Exiting, it is inactive at once.
  const isVisuallyActive = $derived(isActive && hasMountedActive);

  // Render in ZIndexLayer if active OR if we are waiting for exit transition
  const shouldRenderInLayer = $derived(isActive || stayInLayer);

  const option = $derived(isActive ? (activeBar === true ? shape : activeBar) : shape);
</script>

{#snippet content()}
  <BarRectangle
    {...baseProps}
    name={String(baseProps.name)}
    {...entry}
    isActive={isVisuallyActive}
    {option}
    {index}
    {dataKey}
    onTransitionEnd={handleTransitionEnd}
  />
{/snippet}

{#if shouldRenderInLayer}
  <ZIndexLayer zIndex={DefaultZIndexes.activeBar}>
    <BarStackClipLayer index={entry.originalDataIndex}>{@render content()}</BarStackClipLayer>
  </ZIndexLayer>
{:else}
  {@render content()}
{/if}
