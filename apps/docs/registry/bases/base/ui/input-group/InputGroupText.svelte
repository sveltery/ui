<script lang="ts">
  import { cn } from 'cn';
  import type { InputGroupTextProps } from './types.js';
  let { children, class: classProp, ...props }: InputGroupTextProps = $props();
</script>
<span {...props} class={cn('cn-input-group-text flex items-center [&_svg]:pointer-events-none', classProp)}>
  {@render children?.()}
</span>
