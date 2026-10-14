<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { DropdownMenuRadioGroup } from '../dropdown-menu/index.js';
  let { children, value = $bindable(), ...props }: ComponentProps<typeof DropdownMenuRadioGroup> = $props();
</script>
<DropdownMenuRadioGroup data-slot="menubar-radio-group" bind:value {children} {...props} />
