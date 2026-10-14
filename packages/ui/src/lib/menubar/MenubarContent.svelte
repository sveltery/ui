<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import { DropdownMenuContent } from '../dropdown-menu/index.js';
  let { children, class: classProp, align = 'start', alignOffset = -4, sideOffset = 8, ...props }: ComponentProps<typeof DropdownMenuContent> = $props();
</script>
<DropdownMenuContent
  data-slot="menubar-content"
  {children}
  {align}
  {alignOffset}
  {sideOffset}
  {...props}
  class={cn('cn-menubar-content cn-menubar-content-logical cn-menu-target cn-menu-translucent', classProp)}
/>
