<script lang="ts">
  import * as Primitive from '@sveltery/questionnaire';
  import { cn } from 'cn';
  import { buttonVariants } from '../button/index.js';
  import type { QuestionnairePreviousProps } from './types.js';
  let { class: classProp, size = 'default', variant = 'outline', ...props }: QuestionnairePreviousProps = $props();
</script>
<Primitive.Previous
  data-slot="questionnaire-previous"
  data-size={size}
  data-variant={variant}
  class={cn(buttonVariants({ size, variant }), 'cn-questionnaire-previous col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0', classProp)}
  {...props}
/>
