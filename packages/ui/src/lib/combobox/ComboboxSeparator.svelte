<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Separator> = $props();
</script>

<Primitive.Separator data-slot="combobox-separator" {...props} class={cn('cn-combobox-separator', classProp)} />
