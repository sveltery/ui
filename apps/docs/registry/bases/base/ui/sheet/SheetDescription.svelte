<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="sheet-description" {children} {...props} class={cn('cn-sheet-description', classProp)} />
