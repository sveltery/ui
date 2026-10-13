<script lang="ts">
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSubmit,
    QuestionnaireTitle,
    type QuestionnaireItemStatus,
  } from '@sveltery/ui/questionnaire';

  const items = [
    { name: 'permission', required: true },
    { name: 'verification', required: true },
  ];

  type ItemName = 'permission' | 'verification';

  let item = $state('permission');
  let statuses = $state<Record<ItemName, QuestionnaireItemStatus>>({ permission: 'unanswered', verification: 'unanswered' });
  const unanswered = $derived(statuses[item as ItemName] === 'unanswered');
  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    result = `Permission: ${formData.get('permission') ?? 'None'} · Verification: ${formData.get('verification') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" bind:item {items} onsubmit={handleSubmit}>
  <QuestionnaireProgress />

  <QuestionnaireItem name="permission" required onStatusChange={(status) => (statuses.permission = status)}>
    <QuestionnaireTitle>What may the agent modify?</QuestionnaireTitle>
    <QuestionnaireDescription>Next is intentionally disabled until an answer is selected.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="files">Project files</QuestionnaireChoice>
      <QuestionnaireChoice value="tests">Project files and tests</QuestionnaireChoice>
      <QuestionnaireChoice value="config">Files, tests, and configuration</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem name="verification" required onStatusChange={(status) => (statuses.verification = status)}>
    <QuestionnaireTitle>What must pass before completion?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="tests">Tests</QuestionnaireChoice>
      <QuestionnaireChoice value="types">Tests and types</QuestionnaireChoice>
      <QuestionnaireChoice value="all">Tests, types, and visual QA</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext class="data-[status=unanswered]:opacity-50" disabled={unanswered} variant="secondary">Next</QuestionnaireNext>
    <QuestionnaireSubmit disabled={unanswered}>Save permissions</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
