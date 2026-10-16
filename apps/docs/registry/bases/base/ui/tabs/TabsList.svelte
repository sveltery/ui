<script lang="ts">
  import { Tabs as Primitive } from '@sveltery/base/tabs';
  import { cn } from 'cn';
  import type { TabsListProps } from './types.js';
  import { tabsListVariants } from './variants.js';
  let { children, class: classProp, variant = 'default', ...props }: TabsListProps = $props();
</script>
<Primitive.List data-slot="tabs-list" data-variant={variant} {...props} class={cn(tabsListVariants({ variant }), classProp)}>
  {@render children?.()}
</Primitive.List>
