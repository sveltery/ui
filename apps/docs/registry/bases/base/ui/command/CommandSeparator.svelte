<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Command.Separator> = $props();
</script>
<Command.Separator data-slot="command-separator" class={cn('cn-command-separator', classProp)} {...props} />
