<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$ui/resizable/index.js';
  import type { Layout } from '$ui/resizable/types.js';
  let layout = $state<Layout>();
  let changes = $state<string[]>([]);
  let panel = $state<ResizablePanel>();
  export function read() { return layout; }
  export function write(next: Layout) { layout = next; }
  export function changeLog() { return changes; }
  export function sideBar() { return panel; }
</script>
<ResizablePanelGroup id="horizontal" bind:layout onLayoutChanged={(next, details) => changes.push(`${JSON.stringify(next)} ${details.isUserInteraction}`)}>
  <ResizablePanel bind:this={panel} id="left" defaultSize="30%" minSize="10%" collapsible class="left">Left</ResizablePanel>
  <ResizableHandle id="handle" withHandle />
  <ResizablePanel id="right" defaultSize="70%" minSize="20%">Right</ResizablePanel>
</ResizablePanelGroup>
<ResizablePanelGroup id="vertical" orientation="vertical" class="extra">
  <ResizablePanel id="top" defaultSize="25%">Top</ResizablePanel>
  <ResizableHandle id="vertical-handle" />
  <ResizablePanel id="bottom" defaultSize="75%">Bottom</ResizablePanel>
</ResizablePanelGroup>
