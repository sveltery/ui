<script lang="ts">
  import { Progress as Primitive } from '@sveltery/base/progress';
  import { cn } from 'cn';
  import type { ProgressTrackProps } from './types.js';
  let { children, class: classProp, ...props }: ProgressTrackProps = $props();
</script>
<Primitive.Track data-slot="progress-track" {children} {...props} class={cn('cn-progress-track relative flex w-full items-center overflow-x-hidden', classProp)} />
