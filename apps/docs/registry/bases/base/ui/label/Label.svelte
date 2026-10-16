<script lang="ts">
  import type { HTMLLabelAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLLabelAttributes = $props();
</script>
<label data-slot="label" {...props} class={cn('cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed', classProp)}>
  {@render children?.()}
</label>
