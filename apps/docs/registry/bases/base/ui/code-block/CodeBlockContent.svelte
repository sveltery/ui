<script lang="ts">
  import type { CodeBlockContentProps } from './types.js';
  import { cn } from 'cn';
  import CodeBlockLine from './CodeBlockLine.svelte';
  let { children, class: classProp, code, wrap = false, lineNumbers = false, startLine = 1, ...props }: CodeBlockContentProps = $props();
</script>
<!-- The content scrolls, so it takes focus for keyboard scrolling. -->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<pre
  data-slot="code-block-content"
  data-wrap={wrap || undefined}
  data-numbered={lineNumbers || undefined}
  dir="ltr"
  tabindex={0}
  {...props}
  style:counter-reset="line {startLine - 1}"
  class={cn(
    'cn-code-block-content min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto text-start font-mono outline-none data-wrap:scroll-fade-y data-wrap:wrap-break-word data-wrap:whitespace-pre-wrap',
    classProp,
  )}><code data-slot="code-block-code" class="cn-code-block-code grid min-h-lh min-w-max content-start in-data-numbered:grid-cols-[auto_1fr] in-data-wrap:min-w-0"
    >{#if code !== undefined && lineNumbers}{#each code.replace(/\n$/, '').split('\n') as line, index (index)}<CodeBlockLine>{line}</CodeBlockLine>{/each}{:else if code !== undefined}{code}{:else}{@render children?.()}{/if}</code
  ></pre>
