<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>
<div data-slot="input-otp-group" {...props} class={cn('cn-input-otp-group flex items-center', classProp)}>
  {@render children?.()}
</div>
