<script lang="ts">
  import type { KbdProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: KbdProps = $props();
</script>
<kbd data-slot="kbd" {...props} class={cn('cn-kbd pointer-events-none inline-flex items-center justify-center select-none', classProp)}>
  {@render children?.()}
</kbd>
