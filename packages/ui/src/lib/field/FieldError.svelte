<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Field as Primitive } from '@sveltery/base/field';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Error> = $props();
</script>
<Primitive.Error role="alert" data-slot="field-error" {children} {...props} class={cn('cn-field-error font-normal [&>ul]:ml-4 [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-1', classProp)} />
