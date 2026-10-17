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
  } from '$registry/bases/base/ui/questionnaire';
  import { toast } from '$registry/bases/base/ui/toast';

  let runtime = $state('local');
  const items = $derived([{ name: 'runtime', required: true }, { disabled: runtime !== 'cloud', name: 'environment', required: true }, { name: 'approval', required: true }]);

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    toast.add({ title: 'Execution plan saved', description: `Runtime: ${formData.get('runtime') ?? 'None'} · Environment: ${formData.get('environment') ?? 'Not applicable'} · Approval: ${formData.get('approval') ?? 'None'}` });
  }
</script>

<Questionnaire class="mx-auto max-w-md" defaultItem="runtime" {items} onsubmit={handleSubmit}>
  <QuestionnaireProgress />

  <QuestionnaireItem name="runtime" required>
    <QuestionnaireTitle>Where should the agent run?</QuestionnaireTitle>
    <QuestionnaireDescription>Cloud runs add an environment question to this flow.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice checked={runtime === 'local'} value="local" onchange={() => (runtime = 'local')}>Local workspace</QuestionnaireChoice>
      <QuestionnaireChoice checked={runtime === 'cloud'} value="cloud" onchange={() => (runtime = 'cloud')}>Cloud workspace</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem disabled={runtime !== 'cloud'} name="environment" required>
    <QuestionnaireTitle>Which cloud environment should it use?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="preview">Preview</QuestionnaireChoice>
      <QuestionnaireChoice value="staging">Staging</QuestionnaireChoice>
      <QuestionnaireChoice value="isolated">Isolated sandbox</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireItem name="approval" required>
    <QuestionnaireTitle>When should the agent request approval?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="writes">Before writing files</QuestionnaireChoice>
      <QuestionnaireChoice value="commands">Before running commands</QuestionnaireChoice>
      <QuestionnaireChoice value="sensitive">Only for sensitive actions</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>

  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save execution plan</QuestionnaireSubmit>
  </QuestionnaireActions>
</Questionnaire>
