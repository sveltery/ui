<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  import { InputGroupButton } from '../input-group/index.js';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Clear> = $props();
</script>

<Primitive.Clear data-slot="combobox-clear" {...props} class={cn('cn-combobox-clear', classProp)}>
  {#snippet render(hostProps, _state, content)}
    <InputGroupButton variant="ghost" size="icon-xs" {...hostProps}>
      {@render content?.()}
    </InputGroupButton>
  {/snippet}
  <IconPlaceholder lucide="XIcon" tabler="IconX" hugeicons="Cancel01Icon" phosphor="XIcon" remixicon="RiCloseLine" class="cn-combobox-clear-icon pointer-events-none" />
</Primitive.Clear>
