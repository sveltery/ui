<script lang="ts">
  import { cn } from 'cn';
  import type { InputGroupAddonProps } from './types.js';
  import { inputGroupAddonVariants } from './variants.js';
  let { children, class: classProp, align = 'inline-start', onclick, ...props }: InputGroupAddonProps = $props();

  function focusInput(event: MouseEvent & { currentTarget: HTMLDivElement }) {
    onclick?.(event);
    if (event.defaultPrevented || (event.target as HTMLElement).closest('button')) return;
    event.currentTarget.parentElement?.querySelector('input')?.focus();
  }
</script>
<div role="group" data-slot="input-group-addon" data-align={align} {...props} class={cn(inputGroupAddonVariants({ align }), classProp)} onclick={focusInput}>
  {@render children?.()}
</div>
