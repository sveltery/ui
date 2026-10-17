<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireDescriptionProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireDescriptionProps = $props();
</script>
<Primitive.Description data-slot="questionnaire-description" class={cn('cn-questionnaire-description text-pretty text-muted-foreground', classProp)} {...props} />
