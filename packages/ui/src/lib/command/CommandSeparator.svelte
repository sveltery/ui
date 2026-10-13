<script lang="ts">
  import { Separator } from '@sveltery/command';
  import { cn } from 'cn';
  import type { CommandSeparatorProps } from './types.js';
  let { class: classProp, ...props }: CommandSeparatorProps = $props();
</script>
<Separator data-slot="command-separator" class={cn('cn-command-separator', classProp)} {...props} />
