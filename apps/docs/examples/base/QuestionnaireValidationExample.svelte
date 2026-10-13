<script lang="ts">
  import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@sveltery/ui/card';
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
    { name: 'detail', required: true },
    { name: 'audience', required: true },
  ];

  type ItemName = 'detail' | 'audience';
  type Errors = Partial<Record<ItemName, string>>;

  // A cross-field rule the questionnaire cannot know: public answers must be complete.
  function validate(answers: { detail: string; audience: string }): Errors {
    if (answers.audience === 'public' && answers.detail === 'summary') {
      return { detail: 'Public answers need enough context. Choose a complete answer.' };
    }
    return {};
  }

  let item = $state('detail');
  let errors = $state<Errors>({});
  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const answers = { detail: String(formData.get('detail')), audience: String(formData.get('audience')) };
    errors = validate(answers);
    const firstInvalid = (['detail', 'audience'] as const).find((name) => errors[name]);
    if (firstInvalid) {
      item = firstInvalid;
      result = '';
    } else {
      result = `Detail: ${answers.detail} · Audience: ${answers.audience}`;
    }
  }
</script>

{#snippet validationProgress()}
  <QuestionnaireProgress class="min-w-0">
    {#snippet render(props, state)}
      <div {...props}>{state.current} / {state.total}</div>
    {/snippet}
  </QuestionnaireProgress>
{/snippet}

<Questionnaire class="mx-auto max-w-md" bind:item {items} onsubmit={handleSubmit}>
  <Card class="w-full">
    <QuestionnaireItem invalid={Boolean(errors.detail)} name="detail" required>
      <CardHeader>
        <QuestionnaireTitle>How much detail should the answer include?</QuestionnaireTitle>
        <QuestionnaireDescription>Choose the response depth.</QuestionnaireDescription>
        <CardAction>{@render validationProgress()}</CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="summary" onchange={() => delete errors.detail}>Concise summary</QuestionnaireChoice>
          <QuestionnaireChoice value="complete" onchange={() => delete errors.detail}>Complete answer</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>{errors.detail}</QuestionnaireError>
      </CardContent>
    </QuestionnaireItem>

    <QuestionnaireItem invalid={Boolean(errors.audience)} name="audience" required>
      <CardHeader>
        <QuestionnaireTitle>Who will read the answer?</QuestionnaireTitle>
        <QuestionnaireDescription>Public answers require complete context.</QuestionnaireDescription>
        <CardAction>{@render validationProgress()}</CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="team" onchange={() => delete errors.audience}>My team</QuestionnaireChoice>
          <QuestionnaireChoice value="public" onchange={() => delete errors.audience}>Public audience</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>{errors.audience}</QuestionnaireError>
      </CardContent>
    </QuestionnaireItem>

    <CardFooter>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext>Next</QuestionnaireNext>
        <QuestionnaireSubmit>Validate answers</QuestionnaireSubmit>
      </QuestionnaireActions>
    </CardFooter>
  </Card>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
