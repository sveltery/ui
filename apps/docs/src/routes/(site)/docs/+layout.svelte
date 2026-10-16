<script lang="ts">
  import DocsSidebar from '$lib/components/site/DocsSidebar.svelte';
  let { data, children } = $props();
</script>

<div class="container-wrapper flex flex-1 flex-col px-2">
  <div class="flex min-h-min flex-1 items-start px-0 [--top-spacing:0] lg:grid lg:grid-cols-[calc(var(--spacing)*72)_minmax(0,1fr)] lg:[--top-spacing:calc(var(--spacing)*4)]">
    <DocsSidebar nav={data.nav} sections={data.sections} />
    <div class="h-full w-full">{@render children()}</div>
  </div>
</div>
