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
    QuestionnaireNext,
    QuestionnairePrevious,
    QuestionnaireProgress,
    QuestionnaireSkip,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '@sveltery/ui/questionnaire';

  const items = [
    {
      choices: [
        { description: 'Show what the agent ran and what came back.', label: 'Tool call timeline', value: 'tool-calls' },
        { description: 'Ask before sensitive or destructive actions.', label: 'Approval checkpoints', value: 'approvals' },
        { description: 'Make delegated work and results easier to follow.', label: 'Sub-agent handoffs', value: 'handoffs' },
      ],
      description: 'Choose a direction or describe another task.',
      input: { label: 'Another agent feature', placeholder: 'Describe another feature…' },
      name: 'direction',
      required: true,
      title: 'What should the agent build next?',
    },
    {
      choices: [
        { label: 'Progress', value: 'progress' },
        { label: 'Decisions', value: 'decisions' },
        { label: 'Risks', value: 'risks' },
        { label: 'Next step', value: 'next-step' },
      ],
      description: 'Select all that apply, or skip this question.',
      multiple: true,
      name: 'signals',
      required: false,
      title: 'What should every progress update include?',
    },
    {
      choices: [
        { label: 'Start now', value: 'now' },
        { label: 'Next development cycle', value: 'next-cycle' },
        { label: 'Add it to the backlog', value: 'backlog' },
      ],
      description: 'Choose when the agent should begin the work.',
      name: 'timing',
      required: true,
      title: 'When should work begin?',
    },
  ] as const;

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    result = `Direction: ${formData.get('direction') ?? 'None'} · Progress signals: ${formData.getAll('signals').join(', ') || 'None'} · Timing: ${formData.get('timing') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" defaultItem="direction" {items} shortcuts="letters" onsubmit={handleSubmit}>
  <QuestionnaireProgress />
  {#each items as question (question.name)}
    <QuestionnaireItem name={question.name} multiple={'multiple' in question && question.multiple} required={question.required}>
      <QuestionnaireTitle>{question.title}</QuestionnaireTitle>
      <QuestionnaireDescription>{question.description}</QuestionnaireDescription>
      <QuestionnaireChoices>
        {#each question.choices as choice (choice.value)}
          <QuestionnaireChoice value={choice.value}>
            <span class="font-medium">{choice.label}</span>
            {#if 'description' in choice}
              <span class="text-muted-foreground">{choice.description}</span>
            {/if}
          </QuestionnaireChoice>
        {/each}
        {#if 'input' in question}
          <QuestionnaireInput aria-label={question.input.label} placeholder={question.input.placeholder} />
        {/if}
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>
  {/each}
  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save plan</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
