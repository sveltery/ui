<script lang="ts">
  import { Panel } from '@sveltery/resizable';
  import type { ResizablePanelProps } from './types.js';
  let { panelRef = $bindable(), elementRef = $bindable(), ...props }: ResizablePanelProps = $props();
</script>
<Panel data-slot="resizable-panel" bind:panelRef bind:elementRef {...props} />
