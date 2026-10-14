<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Group } from '@sveltery/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Group> = $props();
</script>
<Group data-slot="command-group" class={cn('cn-command-group', classProp)} {...props} />
