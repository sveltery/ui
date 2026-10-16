<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Empty> = $props();
</script>

<Primitive.Empty data-slot="combobox-empty" {children} {...props} class={cn('cn-combobox-empty', classProp)} />
