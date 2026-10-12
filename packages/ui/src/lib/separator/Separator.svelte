<script lang="ts">
  import { Separator as Primitive } from '@sveltery/base/separator';
  import { cn } from 'cn';
  import type { SeparatorProps } from './types.js';
  let { orientation = 'horizontal', class: classProp, ...props }: SeparatorProps = $props();
  const className = $derived(cn('shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch', classProp));
</script>
<Primitive data-slot="separator" {orientation} class={className} {...props} />
