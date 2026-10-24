<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Command.Group> = $props();
</script>
<Command.Group data-slot="command-group" class={cn('cn-command-group', classProp)} {...props} />
