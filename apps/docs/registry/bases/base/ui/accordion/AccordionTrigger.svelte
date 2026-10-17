<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Accordion as Primitive } from '@sveltery/base/accordion';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Header class="flex">
  <Primitive.Trigger data-slot="accordion-trigger" {...props} class={cn('cn-accordion-trigger group/accordion-trigger relative flex flex-1 items-start justify-between border border-transparent transition-all outline-none disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50', classProp)}>
    {@render children?.()}
    <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" data-slot="accordion-trigger-icon" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" class="cn-accordion-trigger-icon pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
    <IconPlaceholder lucide="ChevronUpIcon" tabler="IconChevronUp" data-slot="accordion-trigger-icon" hugeicons="ArrowUp01Icon" phosphor="CaretUpIcon" remixicon="RiArrowUpSLine" class="cn-accordion-trigger-icon pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
  </Primitive.Trigger>
</Primitive.Header>
