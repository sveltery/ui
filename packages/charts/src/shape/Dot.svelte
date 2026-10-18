<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { isNumber } from '../util/DataUtils.js';
  import { svgPropertiesNoEvents } from '../util/svgPropertiesNoEvents.js';
  import { adaptEventHandlers } from '../util/types.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import type { Props } from './Dot.js';

  let raw: SvelteProps<Props> = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});
</script>

{#if isNumber(resolved.cx) && isNumber(resolved.cy) && isNumber(resolved.r)}
  <circle {...attrs({ ...svgPropertiesNoEvents(resolved), ...adaptEventHandlers(resolved), className: clsx('recharts-dot', resolved.className), cx: resolved.cx, cy: resolved.cy, r: resolved.r })} />
{/if}
