<script lang="ts">
  // Pinned shadcn anatomy/classes; all primitive behavior belongs to Base.
  import { Separator as Primitive } from '@sveltery/base/separator';
  import { cn, type ClassValue } from 'cn';
  import type { SeparatorProps } from './types.js';
  let { orientation = 'horizontal', class: classProp, ...props }: SeparatorProps = $props();
  // The source calls cn rather than resolving Base class callbacks. Preserve that limit.
  const className = $derived(cn('shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch', classProp as ClassValue));
</script>
<Primitive data-slot="separator" {orientation} class={className} {...props} />
