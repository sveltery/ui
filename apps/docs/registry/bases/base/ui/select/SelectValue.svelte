<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Value> = $props();
</script>
<Primitive.Value data-slot="select-value" {children} {...props} class={cn('cn-select-value', classProp)} />
