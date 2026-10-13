<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { PreviewCard as Primitive } from '@sveltery/base/preview-card';
  let { children, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="hover-card-trigger" {children} {...props} />
