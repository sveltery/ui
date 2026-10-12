<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Dialog as Primitive } from '@sveltery/base/dialog';
  let { open = $bindable(), triggerId = $bindable(), ...props }: ComponentProps<typeof Primitive.Root> = $props();
  let root: ReturnType<typeof Primitive.Root> | undefined = $state();
  export function close() { root?.close(); }
  export function unmount() { root?.unmount(); }
</script>
<Primitive.Root {...props} bind:open bind:triggerId bind:this={root} />
