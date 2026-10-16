<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Collapsible as Primitive } from '@sveltery/base/collapsible';
  let { open = $bindable(), children, ...props }: ComponentProps<typeof Primitive.Root> = $props();
</script>
<Primitive.Root data-slot="collapsible" bind:open {children} {...props} />
