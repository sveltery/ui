<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Group> = $props();
</script>
<Primitive.Group data-slot="select-group" {children} {...props} class={cn('cn-select-group', classProp)} />
