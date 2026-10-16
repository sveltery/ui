<script lang="ts">
  import type { BreadcrumbListProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: BreadcrumbListProps = $props();
</script>
<ol data-slot="breadcrumb-list" {...props} class={cn('cn-breadcrumb-list flex flex-wrap items-center wrap-break-word', classProp)}>
  {@render children?.()}
</ol>
