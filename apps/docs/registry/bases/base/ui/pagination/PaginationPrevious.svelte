<script lang="ts">
  import type { PaginationPreviousProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  import PaginationLink from './PaginationLink.svelte';
  let { class: classProp, text = 'Previous', ...props }: PaginationPreviousProps = $props();
</script>
<PaginationLink aria-label="Go to previous page" size="default" {...props} class={cn('cn-pagination-previous', classProp)}>
  <IconPlaceholder
    lucide="ChevronLeftIcon"
    tabler="IconChevronLeft"
    hugeicons="ArrowLeft01Icon"
    phosphor="CaretLeftIcon"
    remixicon="RiArrowLeftSLine"
    data-icon="inline-start"
    class="cn-rtl-flip"
  />
  <span class="cn-pagination-previous-text hidden sm:block">{text}</span>
</PaginationLink>
