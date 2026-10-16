<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="alert-dialog-media" {...props} class={cn('cn-alert-dialog-media', classProp)}>
  {@render children?.()}
</div>
