<script lang="ts">
  import { cn } from 'cn';
  import type { InputGroupAddonProps } from './types.js';
  import { inputGroupAddonVariants } from './variants.js';
  let { children, class: classProp, align = 'inline-start', ...props }: InputGroupAddonProps = $props();
</script>
<div
  role="group"
  data-slot="input-group-addon"
  data-align={align}
  onclick={(event) => {
    if ((event.target as HTMLElement).closest('button')) return;
    event.currentTarget.parentElement?.querySelector('input')?.focus();
  }}
  {...props}
  class={cn(inputGroupAddonVariants({ align }), classProp)}
>
  {@render children?.()}
</div>
