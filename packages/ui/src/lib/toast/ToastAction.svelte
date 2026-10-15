<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import { Toast as Primitive } from '@sveltery/base/toast';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  let { class: classProp, render, ...props }: ComponentProps<typeof Primitive.Action> = $props();
</script>
{#snippet button(buttonProps: HTMLButtonAttributes, _state: unknown, content: Snippet | undefined)}
  <Button variant="outline" size="sm" {...buttonProps}>{@render content?.()}</Button>
{/snippet}
<Primitive.Action data-slot="toast-action" render={render ?? button} {...props} class={cn('shrink-0', classProp)} />
