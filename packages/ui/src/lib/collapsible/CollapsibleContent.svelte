<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Collapsible as Primitive } from '@sveltery/base/collapsible';
  let { children, ...props }: ComponentProps<typeof Primitive.Panel> = $props();
</script>
<Primitive.Panel data-slot="collapsible-content" {children} {...props} />
