<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Title> = $props();
</script>
<Primitive.Title data-slot="alert-dialog-title" {children} {...props} class={cn('cn-alert-dialog-title cn-font-heading', classProp)} />
