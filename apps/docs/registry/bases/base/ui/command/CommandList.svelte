<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Command.List> = $props();
</script>
<Command.List data-slot="command-list" class={cn('cn-command-list overflow-x-hidden overflow-y-auto', classProp)} {...props} />
