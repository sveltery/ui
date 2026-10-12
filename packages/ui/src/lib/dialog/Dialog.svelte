<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import * as Primitive from '@sveltery/base/dialog';
  let { actions = $bindable(null), ...props }: ComponentProps<typeof Primitive.Root> = $props();
  let root: ReturnType<typeof Primitive.Root> | undefined;
  export function close() { root?.close(); }
  export function unmount() { root?.unmount(); }
</script>
<Primitive.Root {...props} bind:actions bind:this={root} />
