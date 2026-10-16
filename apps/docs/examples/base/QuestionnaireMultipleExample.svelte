<script lang="ts">
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireItem,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '@sveltery/components/questionnaire';

  const items = [{ choices: [{ value: 'source' }, { value: 'tests' }, { value: 'docs' }, { value: 'history' }], name: 'context', required: true }];

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    result = `Context: ${new FormData(event.currentTarget).getAll('context').join(', ') || 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" {items} shortcuts="letters" onsubmit={handleSubmit}>
  <QuestionnaireItem name="context" multiple required>
    <QuestionnaireTitle>What context should the agent inspect?</QuestionnaireTitle>
    <QuestionnaireDescription>Select every source that may affect the implementation.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="source">Relevant source files</QuestionnaireChoice>
      <QuestionnaireChoice value="tests">Existing tests</QuestionnaireChoice>
      <QuestionnaireChoice value="docs">Architecture documentation</QuestionnaireChoice>
      <QuestionnaireChoice value="history">Recent commit history</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireActions>
    <QuestionnaireSubmit>Share context</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
