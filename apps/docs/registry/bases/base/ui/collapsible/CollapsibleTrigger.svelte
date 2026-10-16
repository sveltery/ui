<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Collapsible as Primitive } from '@sveltery/base/collapsible';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="collapsible-trigger" {children} {...props} />
