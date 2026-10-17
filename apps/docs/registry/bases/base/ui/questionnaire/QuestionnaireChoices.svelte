<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireChoicesProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireChoicesProps = $props();
</script>
<Primitive.Choices data-slot="questionnaire-choices" class={cn('cn-questionnaire-choices group/questionnaire-choices grid min-w-0', classProp)} {...props} />
