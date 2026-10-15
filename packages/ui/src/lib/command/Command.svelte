<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Root } from '@sveltery/command';
  import { cn } from 'cn';
  let { value = $bindable(''), class: classProp, ...props }: ComponentProps<typeof Root> = $props();
</script>
<Root data-slot="command" bind:value class={cn('cn-command flex size-full flex-col overflow-hidden', classProp)} {...props} />
