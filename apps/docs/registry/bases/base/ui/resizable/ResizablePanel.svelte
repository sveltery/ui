<script lang="ts">
  import { Resizable } from '@sveltery/base/resizable';
  import type { ResizablePanelProps } from './types.js';
  let { panelRef = $bindable(), ...props }: ResizablePanelProps = $props();
</script>
<Resizable.Panel data-slot="resizable-panel" bind:this={panelRef} {...props} />
