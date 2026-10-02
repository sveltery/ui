<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconData } from './data.js';
  import type { IconLibraryName } from './config.js';
  import { iconAttributes, iconNodes, type IconAttributes } from './attributes.js';
  import SvgNodes from './SvgNodes.svelte';
  let { data, library, attributes, children, ref = $bindable() }: { data: IconData; library: IconLibraryName | 'fallback'; attributes: IconAttributes; children?: Snippet; ref?: SVGSVGElement | null } = $props();
  const svgAttributes = $derived(iconAttributes(data, library, attributes));
  const nodes = $derived(iconNodes(data, library));
  // Svelte removes an explicit empty class during client attribute updates,
  // while SVG SSR and the pinned React renderers retain it. Reflect that native attribute.
  $effect(() => { if (ref && svgAttributes.class === '' && !ref.hasAttribute('class')) ref.setAttribute('class', ''); });
</script>
<svg bind:this={ref} {...svgAttributes}>
  {#if library === 'tabler' && attributes.title}<title>{attributes.title}</title>{/if}
  {#if library === 'phosphor'}{@render children?.()}{/if}
  <SvgNodes {nodes} />
  {#if library === 'lucide' || library === 'tabler' || library === 'fallback'}{@render children?.()}{/if}
</svg>
