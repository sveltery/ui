<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="field-group" {...props} class={cn('cn-field-group group/field-group @container/field-group flex w-full flex-col', classProp)}>
  {@render children?.()}
</div>
