<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, showRemove = true, ...props }: ComponentProps<typeof Primitive.Chip> & { showRemove?: boolean } = $props();
</script>

<Primitive.Chip data-slot="combobox-chip" {...props} class={cn('cn-combobox-chip has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50', classProp)}>
  {@render children?.()}
  {#if showRemove}
    <Primitive.ChipRemove data-slot="combobox-chip-remove" class="cn-combobox-chip-remove">
      {#snippet render(hostProps, _state, content)}
        <Button variant="ghost" size="icon-xs" {...hostProps as Record<string, unknown>}>
          {@render content?.()}
        </Button>
      {/snippet}
      <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" class="cn-combobox-chip-indicator-icon pointer-events-none" />
    </Primitive.ChipRemove>
  {/if}
</Primitive.Chip>
