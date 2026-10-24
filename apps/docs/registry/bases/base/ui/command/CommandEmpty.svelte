<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Command.Empty> = $props();
</script>
<Command.Empty data-slot="command-empty" class={cn('cn-command-empty', classProp)} {...props} />
