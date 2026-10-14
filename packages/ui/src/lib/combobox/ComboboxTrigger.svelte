<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>

<Primitive.Trigger data-slot="combobox-trigger" {...props} class={cn('cn-combobox-trigger', classProp)}>
  {@render children?.()}
  <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" class="cn-combobox-trigger-icon pointer-events-none" />
</Primitive.Trigger>
