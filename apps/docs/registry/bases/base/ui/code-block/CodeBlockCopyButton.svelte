<script lang="ts">
  import type { CodeBlockCopyButtonProps } from './types.js';
  import { cn } from 'cn';
  import { Button } from '../button/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { value, variant = 'ghost', size = 'icon-xs', class: classProp, onclick, ...props }: CodeBlockCopyButtonProps = $props();
  let copied = $state(false);

  $effect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => (copied = false), 2000);
    return () => clearTimeout(timeout);
  });
</script>
<Button
  data-slot="code-block-copy-button"
  data-copied={copied || undefined}
  {variant}
  {size}
  aria-label={copied ? 'Copied' : 'Copy'}
  class={cn('cn-code-block-copy-button', classProp)}
  onclick={(event) => {
    onclick?.(event);
    // The clipboard is undefined outside a secure context.
    navigator.clipboard
      ?.writeText(value)
      .then(() => (copied = true))
      .catch(() => {});
  }}
  {...props}
>
  {#if copied}
    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
  {:else}
    <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="Copy01Icon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
  {/if}
</Button>
<span aria-live="polite" class="sr-only">{copied ? 'Copied' : ''}</span>
