<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireInput,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '@sveltery/components/questionnaire';

  const items = [{ name: 'change', required: true }, { name: 'verification', required: true }, { name: 'notes' }];

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    result = `Migration: ${formData.get('change') ?? 'None'} · Verification: ${formData.getAll('verification').join(', ') || 'None'} · Notes: ${formData.get('notes') || 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" defaultItem="verification" {items} onreset={() => (result = 'Saved answers restored')} onsubmit={handleSubmit}>
  <QuestionnaireProgress />

  <QuestionnaireItem name="change" required>
    <QuestionnaireTitle>What kind of migration is this?</QuestionnaireTitle>
    <QuestionnaireDescription>This answer was saved during the previous session.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="incremental" defaultChecked>Incremental migration</QuestionnaireChoice>
      <QuestionnaireChoice value="cutover">Single cutover</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem name="verification" multiple required>
    <QuestionnaireTitle>How should the migration be verified?</QuestionnaireTitle>
    <QuestionnaireDescription>These checks were selected during the previous session.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="tests" defaultChecked>Run migration tests</QuestionnaireChoice>
      <QuestionnaireChoice value="typecheck" defaultChecked>Run the typecheck</QuestionnaireChoice>
      <QuestionnaireChoice value="manual">Perform a manual smoke test</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem name="notes">
    <QuestionnaireTitle>Anything else the agent should remember?</QuestionnaireTitle>
    <QuestionnaireDescription>This note was saved with the draft.</QuestionnaireDescription>
    <QuestionnaireInput aria-label="Saved migration note" defaultValue="Keep the existing public API stable." />
  </QuestionnaireItem>

  <QuestionnaireActions>
    <Button type="reset" variant="outline">Reset changes</Button>
    <QuestionnairePrevious />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Update draft</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
