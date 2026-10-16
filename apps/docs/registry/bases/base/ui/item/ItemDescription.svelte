<script lang="ts">
  import type { ItemDescriptionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ItemDescriptionProps = $props();
</script>
<p data-slot="item-description" {...props} class={cn('cn-item-description line-clamp-2 font-normal [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)}>
  {@render children?.()}
</p>
