<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { useChartLayout } from '../context/chartLayoutContext.svelte.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { adaptEventHandlers } from '../util/types.js';
  import { attrs } from '../util/attrs.js';
  import { attachRef } from '../util/ref.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import { getPath, type Props } from './Curve.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});
  const layout = useChartLayout();

  const realPath = $derived(
    resolved.points && resolved.points.length
      ? getPath({ type: resolved.type, points: resolved.points, baseLine: resolved.baseLine, layout: resolved.layout || layout.current, connectNulls: resolved.connectNulls })
      : resolved.path,
  );
</script>

{#if (resolved.points && resolved.points.length) || resolved.path}
  <path
    {...attrs({ ...svgPropertiesNoEvents(resolved), ...adaptEventHandlers(resolved), className: clsx('recharts-curve', resolved.className), d: realPath === null ? undefined : realPath })}
    {@attach attachRef(resolved.pathRef)}
  />
{/if}
