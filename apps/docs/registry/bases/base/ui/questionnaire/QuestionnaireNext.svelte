<script lang="ts">
  import { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import type { QuestionnaireNextProps } from './types.js';
  let { class: classProp, size = 'default', variant = 'default', ...props }: QuestionnaireNextProps = $props();
</script>
<Primitive.Next
  data-slot="questionnaire-next"
  data-size={size}
  data-variant={variant}
  class={cn(buttonVariants({ size, variant }), 'cn-questionnaire-next col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0', classProp)}
  {...props}
/>
