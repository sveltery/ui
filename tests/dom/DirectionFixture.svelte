<script lang="ts">
  import { DirectionProvider, useDirection } from '$ui/direction/index.js';
  import DirectionReader from './DirectionReader.svelte';
  let direction = $state<'ltr' | 'rtl'>('rtl');
  const outer = useDirection();
  export function set(next: 'ltr' | 'rtl') { direction = next; }
</script>
<p data-testid="outer">{outer.direction}</p>
<DirectionProvider {direction}>
  <DirectionReader />
</DirectionProvider>
