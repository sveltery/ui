<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Label> = $props();
</script>
<Primitive.Label data-slot="field-label" {children} {...props} class={cn('cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed', 'cn-field-label group/field-label peer/field-label flex w-fit', 'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col', classProp)} />
