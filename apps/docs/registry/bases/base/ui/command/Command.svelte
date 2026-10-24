<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  let { value = $bindable(''), class: classProp, ...props }: ComponentProps<typeof Command.Root> = $props();
</script>
<Command.Root data-slot="command" bind:value class={cn('cn-command flex size-full flex-col overflow-hidden', classProp)} {...props} />
