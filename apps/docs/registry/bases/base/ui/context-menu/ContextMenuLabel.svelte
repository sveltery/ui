<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  let { children, class: classProp, inset, ...props }: ComponentProps<typeof Primitive.GroupLabel> & { inset?: boolean } = $props();
</script>
<Primitive.GroupLabel data-slot="context-menu-label" data-inset={inset} {children} {...props} class={cn('cn-context-menu-label', classProp)} />
