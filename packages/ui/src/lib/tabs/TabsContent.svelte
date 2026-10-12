<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Tabs as Primitive } from '@sveltery/base/tabs';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Panel> = $props();
</script>
<Primitive.Panel data-slot="tabs-content" {...props} class={cn('cn-tabs-content flex-1 outline-none', classProp)}>
  {@render children?.()}
</Primitive.Panel>
