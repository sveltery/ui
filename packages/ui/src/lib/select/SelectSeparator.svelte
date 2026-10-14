<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Select as Primitive } from '@sveltery/base/select';
  import { cn } from 'cn';
  let { class: classProp, ...props }: ComponentProps<typeof Primitive.Separator> = $props();
</script>
<Primitive.Separator data-slot="select-separator" {...props} class={cn('cn-select-separator pointer-events-none', classProp)} />
