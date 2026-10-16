<script lang="ts">
  import type { BreadcrumbProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: BreadcrumbProps = $props();
</script>
<nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} class={cn('cn-breadcrumb', classProp)}>
  {@render children?.()}
</nav>
