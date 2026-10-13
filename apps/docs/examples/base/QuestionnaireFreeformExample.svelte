<script lang="ts">
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireInput,
    QuestionnaireItem,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '@sveltery/ui/questionnaire';

  const items = [{ choices: [{ value: 'incremental' }, { value: 'module' }, { value: 'rewrite' }], name: 'approach', required: true }];

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    result = `Approach: ${new FormData(event.currentTarget).get('approach') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" {items} shortcuts="letters" onsubmit={handleSubmit}>
  <QuestionnaireItem name="approach" required>
    <QuestionnaireTitle>How should the agent approach this refactor?</QuestionnaireTitle>
    <QuestionnaireDescription>Choose a strategy or write a more specific instruction.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="incremental">Make the smallest safe change</QuestionnaireChoice>
      <QuestionnaireChoice value="module">Refactor one module at a time</QuestionnaireChoice>
      <QuestionnaireChoice value="rewrite">Replace the implementation completely</QuestionnaireChoice>
      <QuestionnaireInput aria-label="Another refactoring approach" placeholder="Describe another approach…" />
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireActions>
    <QuestionnaireSubmit>Use this approach</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
