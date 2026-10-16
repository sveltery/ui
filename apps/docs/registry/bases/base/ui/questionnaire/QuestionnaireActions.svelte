<script lang="ts">
  import { cn } from 'cn';
  import type { QuestionnaireActionsProps } from './types.js';
  let { children, class: classProp, ...props }: QuestionnaireActionsProps = $props();
</script>
<div data-slot="questionnaire-actions" {...props} class={cn('cn-questionnaire-actions grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center', classProp)}>
  {@render children?.()}
</div>
