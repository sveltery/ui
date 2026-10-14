<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Toast as Primitive } from '@sveltery/base/toast';
  let { children, ...props }: ComponentProps<typeof Primitive.Portal> = $props();
</script>
<Primitive.Portal data-slot="toast-portal" {...props} {children} />
