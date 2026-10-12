<script lang="ts">
  import type { BreadcrumbPageProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: BreadcrumbPageProps = $props();
</script>
<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" {...props} class={cn('cn-breadcrumb-page', classProp)}>
  {@render children?.()}
</span>
