<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLSpanElement> = $props();
</script>
<span data-slot="dropdown-menu-shortcut" {...props} class={cn('cn-dropdown-menu-shortcut', classProp)}>
  {@render children?.()}
</span>
