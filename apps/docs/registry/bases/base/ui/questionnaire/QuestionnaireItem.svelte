<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireItemProps } from './types.js';
  let { class: classProp, ...props }: QuestionnaireItemProps = $props();
</script>
<Primitive.Item data-slot="questionnaire-item" class={cn('cn-questionnaire-item min-w-0 border-0 p-0 outline-none', classProp)} {...props} />
