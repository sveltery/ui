<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menu as Primitive } from '@sveltery/base/menu';
  let { children, value = $bindable(), ...props }: ComponentProps<typeof Primitive.RadioGroup> = $props();
</script>
<Primitive.RadioGroup data-slot="dropdown-menu-radio-group" bind:value {children} {...props} />
