<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="alert-dialog-description" {children} {...props} class={cn('cn-alert-dialog-description', classProp)} />
