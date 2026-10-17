<script lang="ts">
  import { Card, CardAction, CardContent, CardFooter, CardHeader } from '$registry/bases/base/ui/card';
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
  import { z } from 'zod';

  const items = [
    { name: 'detail', required: true },
    { name: 'audience', required: true },
  ];

  const questionnaireSchema = z
    .object({
      detail: z.enum(['summary', 'complete']),
      audience: z.enum(['team', 'public']),
    })
    .superRefine((answers, context) => {
      if (answers.audience === 'public' && answers.detail === 'summary') {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Public answers need enough context. Choose a complete answer.',
          path: ['detail'],
        });
      }
    });

  type QuestionnaireItemName = keyof z.infer<typeof questionnaireSchema>;
  type QuestionnaireErrors = Partial<Record<QuestionnaireItemName, string>>;

  let item = $state('detail');
  let errors = $state<QuestionnaireErrors>({});

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();

    const result = questionnaireSchema.safeParse(Object.fromEntries(new FormData(event.currentTarget)));

    if (result.success) {
      errors = {};
      toast.add({ title: 'Agent response configured', description: `Detail: ${result.data.detail} · Audience: ${result.data.audience}` });
      return;
    }

    const nextErrors: QuestionnaireErrors = {};

    for (const issue of result.error.issues) {
      const name = issue.path[0];

      if ((name === 'detail' || name === 'audience') && !nextErrors[name]) {
        nextErrors[name] = issue.message;
      }
    }

    const firstInvalidItem = result.error.issues[0]?.path[0];

    errors = nextErrors;

    if (firstInvalidItem === 'detail' || firstInvalidItem === 'audience') {
      item = firstInvalidItem;
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
</Questionnaire>
