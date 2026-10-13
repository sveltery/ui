<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Drawer as Primitive } from '@sveltery/base/drawer';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Backdrop> = $props();
</script>
<Primitive.Backdrop data-slot="drawer-overlay" {children} {...props} class={cn('cn-drawer-overlay fixed inset-0 z-50 min-h-dvh opacity-[max(var(--drawer-overlay-min-opacity,0),calc(1-var(--drawer-swipe-progress)))] transition-opacity duration-450 ease-[cubic-bezier(0.32,0.72,0,1)] select-none data-ending-style:pointer-events-none data-ending-style:opacity-0 data-ending-style:duration-[calc(var(--drawer-swipe-strength)*400ms)] data-snap-points:[--drawer-overlay-min-opacity:0.5] data-starting-style:opacity-0 data-swiping:duration-0 supports-[-webkit-touch-callout:none]:absolute', classProp)} />
