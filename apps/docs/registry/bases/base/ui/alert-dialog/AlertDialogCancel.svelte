<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { AlertDialog as Primitive } from '@sveltery/base/alert-dialog';
  import { cn } from 'cn';
  import { Button, type ButtonProps } from '../button/index.js';
  let { class: classProp, variant = 'outline', size = 'default', ...props }: ComponentProps<typeof Primitive.Close> & Pick<ButtonProps, 'variant' | 'size'> = $props();
</script>
{#snippet button(buttonProps: HTMLAttributes<HTMLElement>, _state: unknown, content: Snippet | undefined)}
  <Button {variant} {size} {...buttonProps}>{@render content?.()}</Button>
{/snippet}
<Primitive.Close data-slot="alert-dialog-cancel" class={cn('cn-alert-dialog-cancel', classProp)} render={button} {...props} />
