<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Backdrop> = $props();
</script>
<Primitive.Backdrop data-slot="sheet-overlay" {children} {...props} class={cn('cn-sheet-overlay fixed inset-0 z-50 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0', classProp)} />
