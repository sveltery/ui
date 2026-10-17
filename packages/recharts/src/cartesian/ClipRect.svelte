<svelte:options namespace="svg" />

<script lang="ts">
  import type { CartesianLayout } from '../util/types.js';
  import type { BaseLineType } from '../shape/Curve.js';
  import type { AreaPointItem } from '../state/selectors/areaSelectors.js';
  import { isNumber } from '../util/DataUtils.js';
  import { isWellBehavedNumber } from '../util/isWellBehavedNumber.js';

  let {
    alpha,
    layout,
    points,
    baseLine,
    strokeWidth,
  }: {
    alpha: number;
    layout: CartesianLayout;
    points: ReadonlyArray<AreaPointItem>;
    baseLine: BaseLineType | undefined;
    strokeWidth: string | number | undefined;
  } = $props();

  type RectAttributes = { x: number; y: number; width: number; height: number };

  // Upstream's VerticalRect.
  function verticalRect(): RectAttributes | null {
    const startY = points[0]?.y;
    const endY = points[points.length - 1]?.y;
    if (!isWellBehavedNumber(startY) || !isWellBehavedNumber(endY)) {
      return null;
    }
    const height = alpha * Math.abs(startY - endY);
    let maxX = Math.max(...points.map((entry) => entry.x || 0));

    if (isNumber(baseLine)) {
      maxX = Math.max(baseLine, maxX);
    } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
      maxX = Math.max(...baseLine.map((entry) => entry.x || 0), maxX);
    }

    if (isNumber(maxX)) {
      return {
        x: 0,
        y: startY < endY ? startY : startY - height,
        width: maxX + (strokeWidth ? parseInt(`${strokeWidth}`, 10) : 1),
        height: Math.floor(height),
      };
    }

    return null;
  }

  // Upstream's HorizontalRect.
  function horizontalRect(): RectAttributes | null {
    const startX = points[0]?.x;
    const endX = points[points.length - 1]?.x;
    if (!isWellBehavedNumber(startX) || !isWellBehavedNumber(endX)) {
      return null;
    }
    const width = alpha * Math.abs(startX - endX);
    let maxY = Math.max(...points.map((entry) => entry.y || 0));

    if (isNumber(baseLine)) {
      maxY = Math.max(baseLine, maxY);
    } else if (baseLine && Array.isArray(baseLine) && baseLine.length) {
      maxY = Math.max(...baseLine.map((entry) => entry.y || 0), maxY);
    }

    if (isNumber(maxY)) {
      return {
        x: startX < endX ? startX : startX - width,
        y: 0,
        width,
        height: Math.floor(maxY + (strokeWidth ? parseInt(`${strokeWidth}`, 10) : 1)),
      };
    }

    return null;
  }

  const rect = $derived(layout === 'vertical' ? verticalRect() : horizontalRect());
</script>

{#if rect}
  <rect x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
{/if}
