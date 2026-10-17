<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>
<p data-slot="field-description" {...props} class={cn('cn-field-description leading-normal font-normal group-has-data-horizontal/field:text-balance', 'last:mt-0 nth-last-2:-mt-1', '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)}>
  {@render children?.()}
</p>
