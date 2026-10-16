<script lang="ts">
  import * as Questionnaire from '@sveltery/svelte/questionnaire';
  import type { QuestionnaireItemProps } from '@sveltery/svelte/questionnaire';
  import Choice from './QuestionnaireChoice.svelte';
  let props: QuestionnaireItemProps = $props();
</script>
<Questionnaire.Item data-testid={props.name} {...props}>
  <Questionnaire.Title>{props.name}</Questionnaire.Title>
  <Choice data-testid="{props.name}-choice" value="{props.name}-answer">Answer</Choice>
  <Questionnaire.Error data-testid="{props.name}-error" />
</Questionnaire.Item>
