<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Empty } from '@sveltery/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Empty> = $props();
</script>
<Empty data-slot="command-empty" class={cn('cn-command-empty', classProp)} {...props} />
