<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$ui/resizable/index.js';
  let { handleProps }: { handleProps: ComponentProps<typeof ResizableHandle> & { children?: Snippet } } = $props();
</script>
<ResizablePanelGroup>
  <ResizablePanel id="one">One</ResizablePanel>
  <ResizableHandle {...handleProps} />
  <ResizablePanel id="two">Two</ResizablePanel>
</ResizablePanelGroup>
