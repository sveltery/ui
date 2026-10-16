<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Input> = $props();
</script>

<Primitive.Input data-slot="combobox-chip-input" {...props} class={cn('cn-combobox-chip-input min-w-16 flex-1 outline-none', classProp)} />
