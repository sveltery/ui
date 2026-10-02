<script lang="ts">
  import { onMount } from 'svelte';
  import { Skeleton } from '@sveltery/ui/skeleton';
  let hydrated = $state(false);
  let ascii = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  <Skeleton data-testid="cn-nonbreaking" class={ascii ? 'p-2 p-4' : 'p-2\u00a0p-4'} />
  <Skeleton data-testid="cn-line-separator" class={ascii ? 'p-2\tp-4' : 'p-2\u2028p-4'} />
  <button onclick={() => { ascii = !ascii; }}>Toggle class separators</button>
</main>
