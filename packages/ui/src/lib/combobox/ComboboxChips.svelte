<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { children, class: classProp, ref = $bindable(null), ...props }: ComponentProps<typeof Primitive.Chips> & { ref?: HTMLElement | null } = $props();
</script>

<Primitive.Chips data-slot="combobox-chips" {...props} class={cn('cn-combobox-chips', classProp)}>
  {#snippet render(hostProps, _state, content)}
    <div {...hostProps as HTMLAttributes<HTMLDivElement>} bind:this={ref}>{@render content?.()}</div>
  {/snippet}
  {@render children?.()}
</Primitive.Chips>
