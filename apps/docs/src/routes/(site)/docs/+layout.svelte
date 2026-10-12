<script lang="ts">
  import DocsSidebar from '$lib/components/site/DocsSidebar.svelte';
  let { data, children } = $props();
</script>

<div class="container-wrapper flex flex-1 flex-col px-2">
  <div class="flex min-h-min flex-1 items-start px-0 lg:grid lg:grid-cols-[calc(var(--spacing)*72)_minmax(0,1fr)]">
    <DocsSidebar nav={data.nav} />
    <div class="h-full w-full">{@render children()}</div>
  </div>
</div>
