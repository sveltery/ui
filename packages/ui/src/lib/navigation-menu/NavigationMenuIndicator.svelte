<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  let { class: classProp, ...props }: Omit<ComponentProps<typeof Primitive.Icon>, 'children'> = $props();
</script>
<Primitive.Icon data-slot="navigation-menu-indicator" {...props} class={cn('cn-navigation-menu-indicator top-full z-1 flex h-1.5 items-end justify-center overflow-hidden', classProp)}>
  <div class="cn-navigation-menu-indicator-arrow relative top-[60%] h-2 w-2 rotate-45"></div>
</Primitive.Icon>
