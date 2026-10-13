<script lang="ts">
  import type { Snippet } from 'svelte';
  import * as Questionnaire from '@sveltery/questionnaire';
  import type { QuestionnaireChoiceProps } from '@sveltery/questionnaire';
  let { checked = $bindable(), children, ...props }: QuestionnaireChoiceProps & { children?: Snippet } = $props();
</script>
<Questionnaire.Choice data-testid="choice-{props.value}" bind:checked {...props}>
  <Questionnaire.ChoiceInput data-testid={props['data-testid'] ? `${props['data-testid']}-input` : `input-${props.value}`} />
  <Questionnaire.ChoiceLabel>{#if children}{@render children()}{:else}{props.value}{/if}</Questionnaire.ChoiceLabel>
  <Questionnaire.ChoiceShortcut data-testid={props['data-testid'] ? `${props['data-testid']}-shortcut` : `shortcut-${props.value}`} />
</Questionnaire.Choice>
