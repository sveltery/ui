<script lang="ts">
  import { cn } from 'cn';
  import { Separator } from '../separator/index.js';
  import type { SidebarSeparatorProps } from './types.js';
  let { class: classProp, ...props }: SidebarSeparatorProps = $props();
</script>
<Separator data-slot="sidebar-separator" data-sidebar="separator" {...props} class={cn('cn-sidebar-separator w-auto', classProp)} />
