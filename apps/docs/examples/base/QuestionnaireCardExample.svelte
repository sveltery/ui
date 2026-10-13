<script lang="ts">
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
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
  } from '@sveltery/ui/questionnaire';

  const items = [
    { choices: [{ value: 'fix' }, { value: 'refactor' }, { value: 'docs' }], name: 'task', required: true },
    { choices: [{ value: 'summary' }, { value: 'files' }, { value: 'review' }], name: 'output', required: true },
  ];

  const uid = $props.id();
  const taskTitleId = `${uid}-task`;
  const outputTitleId = `${uid}-output`;

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    result = `Task: ${formData.get('task') ?? 'None'} · Handoff: ${formData.get('output') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" defaultItem="task" {items} shortcuts="numbers" onsubmit={handleSubmit}>
  <Card>
    <QuestionnaireItem aria-labelledby={taskTitleId} name="task" required>
      <CardHeader>
        <QuestionnaireTitle id={taskTitleId}>
          {#snippet render(props, _state, children)}
            <CardTitle {...props}>{@render children?.()}</CardTitle>
          {/snippet}
          What should the agent work on?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          {#snippet render(props, _state, children)}
            <CardDescription {...props}>{@render children?.()}</CardDescription>
          {/snippet}
          Choose the task that should be handled next.
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="fix">Fix the failing tests</QuestionnaireChoice>
          <QuestionnaireChoice value="refactor">Refactor the data layer</QuestionnaireChoice>
          <QuestionnaireChoice value="docs">Update the integration guide</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
    </QuestionnaireItem>

    <QuestionnaireItem aria-labelledby={outputTitleId} name="output" required>
      <CardHeader>
        <QuestionnaireTitle id={outputTitleId}>
          {#snippet render(props, _state, children)}
            <CardTitle {...props}>{@render children?.()}</CardTitle>
          {/snippet}
          What should the final handoff include?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          {#snippet render(props, _state, children)}
            <CardDescription {...props}>{@render children?.()}</CardDescription>
          {/snippet}
          Pick the level of detail needed for review.
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="summary">Summary only</QuestionnaireChoice>
          <QuestionnaireChoice value="files">Summary and changed files</QuestionnaireChoice>
          <QuestionnaireChoice value="review">Full review handoff</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
    </QuestionnaireItem>

    <CardFooter>
      <QuestionnaireActions class="w-full">
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Create task</QuestionnaireSubmit>
      </QuestionnaireActions>
    </CardFooter>
  </Card>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
