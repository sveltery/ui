<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.GroupLabel> = $props();
</script>
<Primitive.GroupLabel data-slot="select-label" {children} {...props} class={cn('cn-select-label', classProp)} />
