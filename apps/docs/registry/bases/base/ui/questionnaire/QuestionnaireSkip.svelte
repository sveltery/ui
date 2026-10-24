<script lang="ts">
  import { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import type { QuestionnaireSkipProps } from './types.js';
  let { class: classProp, size = 'default', variant = 'outline', ...props }: QuestionnaireSkipProps = $props();
</script>
<Primitive.Skip
  data-slot="questionnaire-skip"
  data-size={size}
  data-variant={variant}
  class={cn(buttonVariants({ size, variant }), 'cn-questionnaire-skip col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0', classProp)}
  {...props}
/>
