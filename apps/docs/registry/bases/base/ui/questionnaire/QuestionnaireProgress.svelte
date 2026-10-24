<script lang="ts">
  import { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireProgressProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireProgressProps = $props();
</script>
<Primitive.Progress data-slot="questionnaire-progress" class={cn('cn-questionnaire-progress min-h-[1lh] w-fit min-w-[14ch] font-medium text-muted-foreground tabular-nums', classProp)} {...props} />
