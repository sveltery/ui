<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { ContextMenu as Primitive } from '@sveltery/base/context-menu';
  let { children, value = $bindable(), ...props }: ComponentProps<typeof Primitive.RadioGroup> = $props();
</script>
<Primitive.RadioGroup data-slot="context-menu-radio-group" bind:value {children} {...props} />
