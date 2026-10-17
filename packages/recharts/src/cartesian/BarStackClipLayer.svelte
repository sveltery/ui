<svelte:options namespace="svg" />

<script lang="ts">
  import Layer from '../container/Layer.svelte';
  import type { Props as LayerProps } from '../container/Layer.js';
  import type { SvelteProps } from '../util/svelteProps.js';
  import { useBarStackClipPathUrl } from './BarStack.hooks.js';

  let { index, ...rest }: SvelteProps<LayerProps> & { index: number } = $props();
  const clipPathUrl = useBarStackClipPathUrl(() => index);
</script>

<Layer class="recharts-bar-stack-layer" clipPath={clipPathUrl.current} {...rest} />
