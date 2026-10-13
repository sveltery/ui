<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="field-label" {...props} class={cn('cn-field-title flex w-fit items-center', classProp)}>
  {@render children?.()}
</div>
