<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireErrorProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireErrorProps = $props();
</script>
<Primitive.Error data-slot="questionnaire-error" class={cn('cn-questionnaire-error text-destructive', classProp)} {...props} />
