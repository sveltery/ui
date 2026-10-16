<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Combobox as Primitive } from '@sveltery/base/combobox';
  let { children, ...props }: ComponentProps<typeof Primitive.Value> = $props();
</script>

<Primitive.Value {children} {...props} />
