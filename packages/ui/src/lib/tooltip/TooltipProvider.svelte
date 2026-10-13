<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Tooltip as Primitive } from '@sveltery/base/tooltip';
  let { delay = 0, ...props }: ComponentProps<typeof Primitive.Provider> = $props();
</script>
<Primitive.Provider {delay} {...props} />
