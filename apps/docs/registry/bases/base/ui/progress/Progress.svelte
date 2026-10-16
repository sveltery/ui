<script lang="ts">
  import { Progress as Primitive } from '@sveltery/base/progress';
  import { cn } from 'cn';
  import ProgressTrack from './ProgressTrack.svelte';
  import ProgressIndicator from './ProgressIndicator.svelte';
  import type { ProgressProps } from './types.js';
  let { children, class: classProp, value, ...props }: ProgressProps = $props();
</script>
<Primitive.Root {value} data-slot="progress" {...props} class={cn('cn-progress-root flex flex-wrap gap-3', classProp)}>
  {@render children?.()}
  <ProgressTrack>
    <ProgressIndicator />
  </ProgressTrack>
</Primitive.Root>
