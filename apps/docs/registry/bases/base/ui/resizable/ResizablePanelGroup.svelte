<script lang="ts">
  import { Group } from '@sveltery/resizable';
  import { cn } from 'cn';
  import type { ResizablePanelGroupProps } from './types.js';
  let { layout = $bindable(), class: classProp, ...props }: ResizablePanelGroupProps = $props();
</script>
<Group data-slot="resizable-panel-group" bind:layout class={cn('cn-resizable-panel-group flex h-full w-full aria-[orientation=vertical]:flex-col', classProp)} {...props} />
