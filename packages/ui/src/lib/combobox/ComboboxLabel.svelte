<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.GroupLabel> = $props();
</script>

<Primitive.GroupLabel data-slot="combobox-label" {children} {...props} class={cn('cn-combobox-label', classProp)} />
