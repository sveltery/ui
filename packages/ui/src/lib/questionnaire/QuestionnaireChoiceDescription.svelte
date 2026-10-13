<script lang="ts">
  import { cn } from 'cn';
  import type { QuestionnaireChoiceDescriptionProps } from './types.js';
  let { children, class: classProp, ...props }: QuestionnaireChoiceDescriptionProps = $props();
</script>
<span data-slot="questionnaire-choice-description" {...props} class={cn('cn-questionnaire-choice-description', classProp)}>
  {@render children?.()}
</span>
