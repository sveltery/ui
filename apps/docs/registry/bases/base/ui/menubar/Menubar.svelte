<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Menubar as Primitive } from '@sveltery/base/menubar';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive> = $props();
</script>
<Primitive data-slot="menubar" {children} {...props} class={cn('cn-menubar flex items-center', classProp)} />
