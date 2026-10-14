<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.List> = $props();
</script>

<Primitive.List data-slot="combobox-list" {children} {...props} class={cn('cn-combobox-list overflow-y-auto overscroll-contain', classProp)} />
