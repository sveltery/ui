<script lang="ts">
  import type { SVGAttributes } from 'svelte/elements';
  import type { Icon } from './options';

  let { icon, ...rest }: { icon: Icon } & SVGAttributes<SVGSVGElement> = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" viewBox={icon.viewBox} fill="none" aria-hidden="true" {...rest}>
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static markup authored in options.ts -->
  {@html icon.body}
</svg>
