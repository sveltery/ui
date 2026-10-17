<script lang="ts">
  import type { CodeBlockLineProps } from './types.js';
  import { cn } from 'cn';
  import { codeBlockLineVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', ...props }: CodeBlockLineProps = $props();

  // An empty line holds a newline so copying a selection keeps blank lines. A snippet cannot be inspected for
  // emptiness, so the rendered content is watched instead.
  const newline = '\n';
  let empty = $state(true);
  function watchContent(node: HTMLElement) {
    const sync = () => (empty = node.childElementCount === 0 && node.textContent?.replace(/\n$/, '') === '');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(node, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }
</script>
<span data-slot="code-block-line" data-variant={variant} {...props} class={cn(codeBlockLineVariants({ variant }), classProp)}>
  <span data-slot="code-block-line-content" class="min-w-0" {@attach watchContent}>{@render children?.()}{#if empty}{newline}{/if}</span>
</span>
