<script lang="ts">
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoiceDescription,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireSkip,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '@sveltery/components/questionnaire';

  const items = [{ choices: [{ value: 'plus' }, { value: 'pro' }, { disabled: true, value: 'enterprise' }], name: 'plan', required: true }];

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    result = `Plan: ${new FormData(event.currentTarget).get('plan') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-lg" defaultItem="plan" {items} onsubmit={handleSubmit}>
  <QuestionnaireItem name="plan" required>
    <QuestionnaireTitle>Choose a plan</QuestionnaireTitle>
    <QuestionnaireDescription>Enterprise is not available on your account.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="plus">
        <span class="font-medium">Plus</span>
        <QuestionnaireChoiceDescription>For individuals and small teams</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireChoice value="pro">
        <span class="font-medium">Pro</span>
        <QuestionnaireChoiceDescription>For growing businesses</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireChoice value="enterprise" disabled>
        <span class="font-medium">Enterprise</span>
        <QuestionnaireChoiceDescription>For large teams and enterprises</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireActions class="w-full">
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
