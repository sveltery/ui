<script lang="ts">
  import type { BreadcrumbSeparatorProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, ...props }: BreadcrumbSeparatorProps = $props();
</script>
<li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" {...props} class={cn('cn-breadcrumb-separator', classProp)}>
  {#if children}
    {@render children()}
  {:else}
    <IconPlaceholder
      lucide="ChevronRightIcon"
      tabler="IconChevronRight"
      hugeicons="ArrowRight01Icon"
      phosphor="CaretRightIcon"
      remixicon="RiArrowRightSLine"
      class="cn-rtl-flip"
    />
  {/if}
</li>
