<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Separator> = $props();
</script>
<Primitive.Separator data-slot="context-menu-separator" {...props} class={cn('cn-context-menu-separator', classProp)} />
