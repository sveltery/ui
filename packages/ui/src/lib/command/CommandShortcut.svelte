<script lang="ts">
  import { cn } from 'cn';
  import type { CommandShortcutProps } from './types.js';
  let { children, class: classProp, ...props }: CommandShortcutProps = $props();
</script>
<span data-slot="command-shortcut" {...props} class={cn('cn-command-shortcut', classProp)}>
  {@render children?.()}
</span>
