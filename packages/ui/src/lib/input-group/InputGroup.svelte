<script lang="ts">
  import { cn } from 'cn';
  import type { InputGroupProps } from './types.js';
  let { children, class: classProp, ...props }: InputGroupProps = $props();
</script>
<div data-slot="input-group" role="group" {...props} class={cn('group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto', classProp)}>
  {@render children?.()}
</div>
