<script lang="ts">
  import { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireTitleProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireTitleProps = $props();
</script>
<Primitive.Title data-slot="questionnaire-title" class={cn('cn-questionnaire-title cn-font-heading text-pretty', classProp)} {...props} />
