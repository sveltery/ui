<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  let { children, ref = $bindable(), ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="dialog-portal" {...props} bind:ref>
  {@render children?.()}
</Primitive.Portal>
