<script lang="ts">
  import type { BreadcrumbEllipsisProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: BreadcrumbEllipsisProps = $props();
</script>
<span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" {...props} class={cn('cn-breadcrumb-ellipsis flex items-center justify-center', classProp)}>
  <IconPlaceholder
    lucide="MoreHorizontalIcon"
    tabler="IconDots"
    hugeicons="MoreHorizontalCircle01Icon"
    phosphor="DotsThreeIcon"
    remixicon="RiMoreLine"
  />
  <span class="sr-only">More</span>
</span>
