<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Description> = $props();
</script>
<Primitive.Description data-slot="field-description" {children} {...props} class={cn('cn-field-description leading-normal font-normal group-has-data-horizontal/field:text-balance', 'last:mt-0 nth-last-2:-mt-1', '[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary', classProp)} />
