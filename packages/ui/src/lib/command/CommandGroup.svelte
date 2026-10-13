<script lang="ts">
  import { Group } from '@sveltery/command';
  import { cn } from 'cn';
  import type { CommandGroupProps } from './types.js';
  let { class: classProp, ...props }: CommandGroupProps = $props();
</script>
<Group data-slot="command-group" class={cn('cn-command-group', classProp)} {...props} />
