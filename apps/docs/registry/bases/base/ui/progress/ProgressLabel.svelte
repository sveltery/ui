<script lang="ts">
  import { Progress as Primitive } from '@sveltery/base/progress';
  import { cn } from 'cn';
  import type { ProgressLabelProps } from './types.js';
  let { children, class: classProp, ...props }: ProgressLabelProps = $props();
</script>
<Primitive.Label data-slot="progress-label" {children} {...props} class={cn('cn-progress-label', classProp)} />
