<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  let { children, ref = $bindable(), ...props }: ComponentProps<typeof Primitive.Close> = $props();
</script>
<Primitive.Close data-slot="dialog-close" {children} {...props} bind:ref />
