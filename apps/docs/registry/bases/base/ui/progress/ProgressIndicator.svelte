<script lang="ts">
  import { Progress as Primitive } from '@sveltery/base/progress';
  import { cn } from 'cn';
  import type { ProgressIndicatorProps } from './types.js';
  let { children, class: classProp, ...props }: ProgressIndicatorProps = $props();
</script>
<Primitive.Indicator data-slot="progress-indicator" {children} {...props} class={cn('cn-progress-indicator h-full transition-all', classProp)} />
