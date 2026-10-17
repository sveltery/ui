<script lang="ts">
  import * as Primitive from '@sveltery/svelte/questionnaire';
  import { cn } from 'cn';
  import type { QuestionnaireInputProps } from './types.js';
  let { value = $bindable(), class: classProp, ...props }: QuestionnaireInputProps = $props();
</script>
<div data-slot="questionnaire-input-wrapper" class="cn-questionnaire-input-wrapper group/questionnaire-input relative min-w-0">
  <Primitive.Input
    data-slot="questionnaire-input"
    bind:value
    class={cn(
      'cn-questionnaire-input min-h-11 w-full min-w-0 transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0',
      'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
      classProp,
    )}
    {...props}
  />
</div>
