<script lang="ts">
  import { untrack } from 'svelte';
  import Example from '../../apps/docs/examples/base/DialogExample.svelte';
  let { initial = 'custom' }: { initial?: string } = $props();
  let scenario = $state(untrack(() => initial));
  export function setScenario(next: string) { scenario = next; }
</script>
<Example {scenario} />
