<script lang="ts">
  import { cubicOut } from 'svelte/easing';
  import { prefersReducedMotion, Tween } from 'svelte/motion';
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
  } from '@sveltery/components/questionnaire';

  const items = [
    { name: 'task', required: true },
    { name: 'review', required: true },
    { name: 'delivery', required: true },
  ];

  // Items stay mounted and only toggle `hidden`, so a transition directive never fires. A tween plays the entry instead.
  const entry = new Tween(1, { duration: 300, easing: cubicOut });

  function animate() {
    if (prefersReducedMotion.current) return;
    entry.set(0, { duration: 0 });
    entry.set(1);
  }

  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    result = `Task: ${formData.get('task') ?? 'None'} · Review: ${formData.get('review') ?? 'None'} · Delivery: ${formData.get('delivery') ?? 'None'}`;
  }
</script>

<Questionnaire class="mx-auto max-w-md" defaultItem="task" {items} onItemChange={animate} onsubmit={handleSubmit}>
  <QuestionnaireProgress />

  <div style:opacity={entry.current} style:transform="translateY({(1 - entry.current) * 0.5}rem)">
    <QuestionnaireItem name="task" required>
      <QuestionnaireTitle>What should the agent do?</QuestionnaireTitle>
      <QuestionnaireDescription>Choose the task for this run.</QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="implement">Implement the requested change</QuestionnaireChoice>
        <QuestionnaireChoice value="debug">Debug the current behavior</QuestionnaireChoice>
        <QuestionnaireChoice value="review">Review the implementation</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    <QuestionnaireItem name="review" required>
      <QuestionnaireTitle>How should the work be reviewed?</QuestionnaireTitle>
      <QuestionnaireDescription>Select the verification depth.</QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="targeted">Targeted checks</QuestionnaireChoice>
        <QuestionnaireChoice value="complete">Complete test suite</QuestionnaireChoice>
        <QuestionnaireChoice value="manual">Tests and manual QA</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    <QuestionnaireItem name="delivery" required>
      <QuestionnaireTitle>How should the result be delivered?</QuestionnaireTitle>
      <QuestionnaireDescription>Choose the final handoff format.</QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="summary">Concise summary</QuestionnaireChoice>
        <QuestionnaireChoice value="diff">Summary and changed files</QuestionnaireChoice>
        <QuestionnaireChoice value="handoff">Detailed review handoff</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>
  </div>

  <QuestionnaireActions>
    <QuestionnairePrevious />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save workflow</QuestionnaireSubmit>
  </QuestionnaireActions>
  {#if result}
    <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
  {/if}
</Questionnaire>
