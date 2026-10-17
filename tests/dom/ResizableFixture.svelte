<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$ui/resizable/index.js';
  import type { GroupImperativeHandle, PanelImperativeHandle } from '$ui/resizable/types.js';
  let group = $state<GroupImperativeHandle | null>();
  let panel = $state<PanelImperativeHandle | null>();
  let changes = $state<string[]>([]);
  export function groupApi() { return group!; }
  export function panelApi() { return panel!; }
  export function changeLog() { return changes; }
</script>
<ResizablePanelGroup id="horizontal" bind:groupRef={group} onLayoutChanged={(next) => changes.push(JSON.stringify(next))}>
  <ResizablePanel bind:panelRef={panel} id="left" defaultSize="30%" minSize="10%" collapsible class="left">Left</ResizablePanel>
  <ResizableHandle id="handle" withHandle />
  <ResizablePanel id="right" defaultSize="70%" minSize="20%">Right</ResizablePanel>
</ResizablePanelGroup>
<ResizablePanelGroup id="vertical" orientation="vertical" class="extra">
  <ResizablePanel id="top" defaultSize="25%">Top</ResizablePanel>
  <ResizableHandle id="vertical-handle" />
  <ResizablePanel id="bottom" defaultSize="75%">Bottom</ResizablePanel>
</ResizablePanelGroup>
