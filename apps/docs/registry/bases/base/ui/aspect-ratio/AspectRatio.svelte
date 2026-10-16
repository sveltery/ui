<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { ratio, children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> & { ratio: number } = $props();
</script>
<div data-slot="aspect-ratio" {...props} style:--ratio={ratio} class={cn('relative aspect-(--ratio)', classProp)}>
  {@render children?.()}
</div>
