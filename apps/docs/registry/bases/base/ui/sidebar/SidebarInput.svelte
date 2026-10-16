<script lang="ts">
  import { cn } from 'cn';
  import { Input } from '../input/index.js';
  import type { SidebarInputProps } from './types.js';
  let { class: classProp, value = $bindable(), ...props }: SidebarInputProps = $props();
</script>
<Input data-slot="sidebar-input" data-sidebar="input" {...props} class={cn('cn-sidebar-input', classProp)} bind:value />
