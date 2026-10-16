<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="context-menu-trigger" {children} {...props} class={cn('cn-context-menu-trigger select-none', classProp)} />
