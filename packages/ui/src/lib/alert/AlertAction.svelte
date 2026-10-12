<script lang="ts">
  import type { AlertActionProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: AlertActionProps = $props();
</script>
<div data-slot="alert-action" {...props} class={cn('cn-alert-action', classProp)}>
  {@render children?.()}
</div>
