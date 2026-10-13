<script lang="ts">
  import { Root } from '@sveltery/command';
  import { cn } from 'cn';
  import type { CommandProps } from './types.js';
  let { value = $bindable(''), class: classProp, ...props }: CommandProps = $props();
</script>
<Root data-slot="command" bind:value class={cn('cn-command flex size-full flex-col overflow-hidden', classProp)} {...props} />
