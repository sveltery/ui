<script lang="ts">
  import type { PaginationNextProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  import PaginationLink from './PaginationLink.svelte';
  let { class: classProp, text = 'Next', ...props }: PaginationNextProps = $props();
</script>
<PaginationLink aria-label="Go to next page" size="default" {...props} class={cn('cn-pagination-next', classProp)}>
  <span class="cn-pagination-next-text hidden sm:block">{text}</span>
  <IconPlaceholder
    lucide="ChevronRightIcon"
    tabler="IconChevronRight"
    hugeicons="ArrowRight01Icon"
    phosphor="CaretRightIcon"
    remixicon="RiArrowRightSLine"
    data-icon="inline-end"
    class="cn-rtl-flip"
  />
</PaginationLink>
