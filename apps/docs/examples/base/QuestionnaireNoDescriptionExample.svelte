<script lang="ts">
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireError,
    QuestionnaireItem,
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSkip,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '$registry/bases/base/ui/questionnaire';
  import { toast } from '$registry/bases/base/ui/toast';

  const items = [{ choices: [{ value: 'inspect' }, { value: 'implement' }, { value: 'review' }], name: 'task', required: true }];

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    toast.add({ title: 'Task selected', description: `Task: ${new FormData(event.currentTarget).get('task') ?? 'None'}` });
  }
</script>

<Questionnaire class="mx-auto max-w-lg" defaultItem="task" {items} shortcuts="letters" onsubmit={handleSubmit}>
  <QuestionnaireProgress />
  <QuestionnaireItem name="task" required>
    <QuestionnaireTitle>What should the agent do next?</QuestionnaireTitle>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="inspect">Inspect the codebase</QuestionnaireChoice>
      <QuestionnaireChoice value="implement">Implement the change</QuestionnaireChoice>
      <QuestionnaireChoice value="review">Review the result</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireActions class="w-full">
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
  </QuestionnaireActions>
</Questionnaire>
