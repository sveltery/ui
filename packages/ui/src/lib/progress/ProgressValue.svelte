<script lang="ts">
  import { Progress as Primitive } from '@sveltery/base/progress';
  import { cn } from 'cn';
  import type { ProgressValueProps } from './types.js';
  let { children, class: classProp, ...props }: ProgressValueProps = $props();
</script>
<Primitive.Value data-slot="progress-value" {children} {...props} class={cn('cn-progress-value', classProp)} />
