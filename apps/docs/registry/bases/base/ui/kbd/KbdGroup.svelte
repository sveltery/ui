<script lang="ts">
  import type { KbdGroupProps } from './types.js';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: KbdGroupProps = $props();
</script>
<kbd data-slot="kbd-group" {...props} class={cn('cn-kbd-group inline-flex items-center', classProp)}>
  {@render children?.()}
</kbd>
