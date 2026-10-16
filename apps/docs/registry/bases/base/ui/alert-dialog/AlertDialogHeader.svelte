<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="alert-dialog-header" {...props} class={cn('cn-alert-dialog-header', classProp)}>
  {@render children?.()}
</div>
