<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  let { children, ref = $bindable(), ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="dialog-trigger" {children} {...props} bind:ref />
