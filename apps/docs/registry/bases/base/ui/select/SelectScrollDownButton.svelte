<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.ScrollDownArrow> = $props();
</script>
<Primitive.ScrollDownArrow data-slot="select-scroll-down-button" {...props} class={cn('cn-select-scroll-down-button bottom-0 w-full', classProp)}>
  <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" />
</Primitive.ScrollDownArrow>
