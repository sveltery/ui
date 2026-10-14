<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.ScrollUpArrow> = $props();
</script>
<Primitive.ScrollUpArrow data-slot="select-scroll-up-button" {...props} class={cn('cn-select-scroll-up-button top-0 w-full', classProp)}>
  <IconPlaceholder lucide="ChevronUpIcon" tabler="IconChevronUp" hugeicons="ArrowUp01Icon" phosphor="CaretUpIcon" remixicon="RiArrowUpSLine" />
</Primitive.ScrollUpArrow>
