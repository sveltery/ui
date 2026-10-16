<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { List } from '@sveltery/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof List> = $props();
</script>
<List data-slot="command-list" class={cn('cn-command-list overflow-x-hidden overflow-y-auto', classProp)} {...props} />
