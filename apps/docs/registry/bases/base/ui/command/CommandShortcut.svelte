<script lang="ts">
  import { cn } from 'cn';
  import type { HTMLAttributes } from 'svelte/elements';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLSpanElement> = $props();
</script>
<span data-slot="command-shortcut" {...props} class={cn('cn-command-shortcut', classProp)}>
  {@render children?.()}
</span>
