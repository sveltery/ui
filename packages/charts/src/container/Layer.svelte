<svelte:options namespace="svg" />

<script lang="ts">
  import { clsx } from 'clsx';
  import { omit } from 'es-toolkit';
  import { svgPropertiesAndEvents } from '../util/svgPropertiesAndEvents.js';
  import { attrs } from '../util/attrs.js';
  import { rechartsProps, type SvelteProps } from '../util/svelteProps.js';
  import type { Props } from './Layer.js';

  let { ref = $bindable(null), ...raw }: SvelteProps<Props> & { ref?: SVGGElement | null } = $props();
  const resolved = rechartsProps<Props, object>(() => raw, {});

  const groupAttributes = $derived(attrs({ className: clsx('recharts-layer', resolved.className), ...svgPropertiesAndEvents(omit(resolved, ['children', 'className'])) }));
</script>

<g {...groupAttributes} bind:this={ref}>
  {@render raw.children?.()}
</g>
