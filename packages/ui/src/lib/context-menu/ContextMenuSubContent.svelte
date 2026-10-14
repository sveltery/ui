<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { cn } from 'cn';
  import ContextMenuContent from './ContextMenuContent.svelte';
  let { class: classProp, side = 'right', ...props }: ComponentProps<typeof ContextMenuContent> = $props();
</script>
<ContextMenuContent data-slot="context-menu-sub-content" {side} {...props} class={cn('cn-context-menu-subcontent cn-menu-target cn-menu-translucent', classProp)} />
