<script lang="ts">
  import type { BreadcrumbItemProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: BreadcrumbItemProps = $props();
</script>
<li data-slot="breadcrumb-item" {...props} class={cn('cn-breadcrumb-item inline-flex items-center', classProp)}>
  {@render children?.()}
</li>
