<script lang="ts">
  import { Empty } from '@sveltery/command';
  import { cn } from 'cn';
  import type { CommandEmptyProps } from './types.js';
  let { class: classProp, ...props }: CommandEmptyProps = $props();
</script>
<Empty data-slot="command-empty" class={cn('cn-command-empty', classProp)} {...props} />
