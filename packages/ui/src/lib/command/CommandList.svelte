<script lang="ts">
  import { List } from '@sveltery/command';
  import { cn } from 'cn';
  import type { CommandListProps } from './types.js';
  let { class: classProp, ...props }: CommandListProps = $props();
</script>
<List data-slot="command-list" class={cn('cn-command-list overflow-x-hidden overflow-y-auto', classProp)} {...props} />
