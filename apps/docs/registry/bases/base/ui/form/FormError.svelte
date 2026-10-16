<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Form as Primitive } from '@sveltery/base/form';
  import { cn } from 'cn';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Error> = $props();
</script>
<Primitive.Error data-slot="form-error" {children} {...props} class={cn('cn-field-error font-normal [&>ul]:ml-4 [&>ul]:flex [&>ul]:list-disc [&>ul]:flex-col [&>ul]:gap-1', classProp)} />
