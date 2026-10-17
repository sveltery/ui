<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import type { QuestionnaireSubmitProps } from './types.js';
  let { class: classProp, size = 'default', variant = 'default', ...props }: QuestionnaireSubmitProps = $props();
</script>
<Primitive.Submit
  data-slot="questionnaire-submit"
  data-size={size}
  data-variant={variant}
  class={cn(buttonVariants({ size, variant }), 'cn-questionnaire-submit col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0', classProp)}
  {...props}
/>
