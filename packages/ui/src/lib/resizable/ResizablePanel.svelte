<script lang="ts">
  import { Panel } from '@sveltery/resizable';
  import type { PanelSize, SizeInput } from '@sveltery/resizable';
  import type { ResizablePanelProps } from './types.js';
  let { ...props }: ResizablePanelProps = $props();
  let panel: ReturnType<typeof Panel> | undefined;
  export function collapse(): void { panel?.collapse(); }
  export function expand(): void { panel?.expand(); }
  export function resize(size: SizeInput): void { panel?.resize(size); }
  export function getSize(): PanelSize | undefined { return panel?.getSize(); }
  export function isCollapsed(): boolean { return panel?.isCollapsed() ?? false; }
</script>
<Panel bind:this={panel} data-slot="resizable-panel" {...props} />
