<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Tabs as Primitive } from '@sveltery/base/tabs';
  import { cn } from 'cn';
  let { children, class: classProp, value = $bindable(), orientation = 'horizontal', ...props }: ComponentProps<typeof Primitive.Root> = $props();
</script>
<Primitive.Root data-slot="tabs" data-orientation={orientation} {orientation} {...props} class={cn('cn-tabs group/tabs flex data-horizontal:flex-col', classProp)} bind:value>
  {@render children?.()}
</Primitive.Root>
