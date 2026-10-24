<script lang="ts">
  import { Questionnaire as Primitive } from '@sveltery/base/questionnaire';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  import type { QuestionnaireChoiceProps } from './types.js';
  let { checked = $bindable(), children, class: classProp, ...props }: QuestionnaireChoiceProps = $props();
</script>
<Primitive.Choice
  data-slot="questionnaire-choice"
  bind:checked
  class={cn(
    'cn-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-colors outline-none select-none',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
    classProp,
  )}
  {...props}
>
  <Primitive.ChoiceInput
    data-slot="questionnaire-choice-input"
    class="cn-questionnaire-choice-input absolute inset-0 z-10 size-full cursor-pointer opacity-0"
  />
  <span
    aria-hidden="true"
    data-slot="questionnaire-choice-indicator"
    class="cn-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 items-center justify-center border group-data-[type=radio]/questionnaire-choice:rounded-full"
  >
    <span
      data-slot="questionnaire-choice-indicator-dot"
      class="cn-questionnaire-choice-indicator-dot hidden rounded-full group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
    ></span>
    <IconPlaceholder
      data-slot="questionnaire-choice-indicator-check"
      class="cn-questionnaire-choice-indicator-check hidden group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
      lucide="CheckIcon"
      tabler="IconCheck"
      hugeicons="Tick02Icon"
      phosphor="CheckIcon"
      remixicon="RiCheckLine"
    />
  </span>
  <Primitive.ChoiceLabel
    data-slot="questionnaire-choice-label"
    class="cn-questionnaire-choice-label cn-questionnaire-choice-content flex min-w-0 flex-1 flex-col leading-snug"
  >
    {@render children?.()}
  </Primitive.ChoiceLabel>
  <Primitive.ChoiceShortcut
    data-slot="questionnaire-choice-shortcut"
    class="cn-questionnaire-choice-shortcut cn-questionnaire-shortcut pointer-events-none ms-auto hidden shrink-0 group-data-[shortcut]/questionnaire-choice:inline-flex"
  />
</Primitive.Choice>
