<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import DropdownMenuContent from './DropdownMenuContent.svelte';
  let { class: classProp, align = 'start', alignOffset = -3, side = 'right', sideOffset = 0, ...props }: ComponentProps<typeof DropdownMenuContent> = $props();
</script>
<DropdownMenuContent
  data-slot="dropdown-menu-sub-content"
  {...props}
  class={cn('cn-dropdown-menu-sub-content cn-menu-target cn-menu-translucent w-auto', classProp)}
  {align}
  {alignOffset}
  {side}
  {sideOffset}
/>
