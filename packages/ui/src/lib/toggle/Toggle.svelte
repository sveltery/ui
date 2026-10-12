<script lang="ts">
  import { Toggle as Primitive } from '@sveltery/base/toggle';
  import { cn } from 'cn';
  import type { ToggleProps } from './types.js';
  import { toggleVariants } from './variants.js';
  let { pressed = $bindable(), class: classProp, variant = 'default', size = 'default', ...props }: ToggleProps = $props();
</script>
<Primitive data-slot="toggle" bind:pressed {...props} class={cn(toggleVariants({ variant, size }), classProp)} />
