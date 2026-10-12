<script lang="ts">
  // shadcn Button anatomy/Nova appearance; behavior belongs to the pinned Base Button.
  import { Button as Primitive } from '@sveltery/base/button';
  import type { ButtonProps } from './types.js';
  import { buttonVariants } from './variants.js';
  import { classes } from '../shared/classes.js';
  let { children, class: classProp, variant = 'default', size = 'default', ref = $bindable(), ...props }: ButtonProps = $props();
</script>
<Primitive data-slot="button" {...props} {children} class={classes(buttonVariants({ variant, size }), classProp)} bind:ref />
