<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="field-content" {...props} class={cn('cn-field-content group/field-content flex flex-1 flex-col leading-snug', classProp)}>
  {@render children?.()}
</div>
