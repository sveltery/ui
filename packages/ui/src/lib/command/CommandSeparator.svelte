<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Separator } from '@sveltery/command';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Separator> = $props();
</script>
<Separator data-slot="command-separator" class={cn('cn-command-separator', classProp)} {...props} />
