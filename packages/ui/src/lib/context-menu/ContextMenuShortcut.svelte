<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLSpanElement> = $props();
</script>
<span data-slot="context-menu-shortcut" {...props} class={cn('cn-context-menu-shortcut', classProp)}>
  {@render children?.()}
</span>
