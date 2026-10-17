<script lang="ts">
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';
  import { useDefaultLayout, type Layout } from '@sveltery/resizable';

  let current = $state<Layout>();
  let changes = $state<string[]>([]);
  const persisted = useDefaultLayout({ id: 'resizable-fixture', storage: typeof localStorage === 'undefined' ? { getItem: () => null, setItem: () => {} } : localStorage });
</script>

<div id="horizontal" style="width: 800px; height: 100px">
  <ResizablePanelGroup onLayoutChange={(layout) => { current = layout; }} onLayoutChanged={(layout) => { changes.push(`${Math.round(layout.a)}`); }}>
    <ResizablePanel id="a" defaultSize="50%" minSize="20%">A</ResizablePanel>
    <ResizableHandle id="horizontal-handle" withHandle />
    <ResizablePanel id="b" defaultSize="50%" minSize="100px">B</ResizablePanel>
  </ResizablePanelGroup>
</div>
<output data-testid="current">{current ? Math.round(current.a) : ''}</output>
<output data-testid="changes">{changes.join(',')}</output>

<div id="vertical" style="width: 200px; height: 400px">
  <ResizablePanelGroup orientation="vertical">
    <ResizablePanel id="top" defaultSize="50%" minSize="20%">Top</ResizablePanel>
    <ResizableHandle id="vertical-handle" />
    <ResizablePanel id="bottom" defaultSize="50%" minSize="20%">Bottom</ResizablePanel>
  </ResizablePanelGroup>
</div>

<div id="collapsible" style="width: 800px; height: 100px">
  <ResizablePanelGroup>
    <ResizablePanel id="side" defaultSize="30%" minSize="20%" collapsible>Side</ResizablePanel>
    <ResizableHandle id="collapsible-handle" />
    <ResizablePanel id="main" defaultSize="70%">Main</ResizablePanel>
  </ResizablePanelGroup>
</div>

<div id="three" style="width: 800px; height: 100px">
  <ResizablePanelGroup>
    <ResizablePanel id="drawer" defaultSize="30%" minSize="25%">Drawer</ResizablePanel>
    <ResizableHandle id="three-handle" />
    <ResizablePanel id="page" defaultSize="40%">Page</ResizablePanel>
    <ResizableHandle id="three-second-handle" />
    <ResizablePanel id="aside" defaultSize="30%">Aside</ResizablePanel>
  </ResizablePanelGroup>
</div>

<div id="nested" style="width: 800px; height: 300px">
  <ResizablePanelGroup>
    <ResizablePanel id="outer-left" defaultSize="50%">Left</ResizablePanel>
    <ResizableHandle id="outer-handle" />
    <ResizablePanel id="outer-right" defaultSize="50%">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel id="inner-top" defaultSize="50%">Top</ResizablePanel>
        <ResizableHandle id="inner-handle" />
        <ResizablePanel id="inner-bottom" defaultSize="50%">Bottom</ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
</div>

<div id="rtl" dir="rtl" style="width: 800px; height: 100px">
  <ResizablePanelGroup>
    <ResizablePanel id="first" defaultSize="50%" minSize="20%">First</ResizablePanel>
    <ResizableHandle id="rtl-handle" />
    <ResizablePanel id="second" defaultSize="50%" minSize="20%">Second</ResizablePanel>
  </ResizablePanelGroup>
</div>

<div id="persisted" style="width: 800px; height: 100px">
  <ResizablePanelGroup defaultLayout={persisted.defaultLayout} onLayoutChanged={persisted.onLayoutChanged}>
    <ResizablePanel id="left" defaultSize="50%" minSize="10%">Left</ResizablePanel>
    <ResizableHandle id="persisted-handle" />
    <ResizablePanel id="right" defaultSize="50%" minSize="10%">Right</ResizablePanel>
  </ResizablePanelGroup>
</div>
