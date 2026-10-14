<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Group> = $props();
</script>

<Primitive.Group data-slot="combobox-group" {children} {...props} class={cn('cn-combobox-group', classProp)} />
