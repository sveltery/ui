<script lang="ts">
  import { Resizable } from '@sveltery/base/resizable';
  import { cn } from 'cn';
  import type { ResizablePanelGroupProps } from './types.js';
  let { groupRef = $bindable(), class: classProp, ...props }: ResizablePanelGroupProps = $props();
</script>
<Resizable.Group data-slot="resizable-panel-group" bind:this={groupRef} class={cn('cn-resizable-panel-group flex h-full w-full aria-[orientation=vertical]:flex-col', classProp)} {...props} />
