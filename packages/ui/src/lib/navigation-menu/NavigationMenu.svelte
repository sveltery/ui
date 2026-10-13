<script lang="ts" generics="Value = unknown">
  import type { NavigationMenuPositionerProps, NavigationMenuRootProps } from '@sveltery/base/navigation-menu';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  import NavigationMenuPositioner from './NavigationMenuPositioner.svelte';
  let { value = $bindable(null), align = 'start', children, class: classProp, ...props }: NavigationMenuRootProps<Value> & Pick<NavigationMenuPositionerProps, 'align'> = $props();
  let root: ReturnType<typeof Primitive.Root>;
  export function close() {
    root.close();
  }
  export function unmount() {
    root.unmount();
  }
</script>
<Primitive.Root bind:this={root} data-slot="navigation-menu" bind:value {...props} class={cn('cn-navigation-menu group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', classProp)}>
  {@render children?.()}
  <NavigationMenuPositioner {align} />
</Primitive.Root>
