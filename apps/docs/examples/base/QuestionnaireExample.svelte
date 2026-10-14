<script lang="ts">
  import { toast } from '@sveltery/ui/toast';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoiceDescription,
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

  const questionnaireItems = [
    { choices: [{ value: 'delegation' }, { value: 'questions' }, { value: 'both' }], name: 'direction', required: true },
    { choices: [{ value: 'progress' }, { value: 'decisions' }, { value: 'risks' }], name: 'signals' },
    { choices: [{ value: 'week' }, { value: 'cycle' }, { value: 'later' }], name: 'timing', required: true },
  ] as const;

  const taskItems = [{ choices: [{ value: 'inspect' }, { value: 'implement' }, { value: 'review' }], name: 'task', required: true }] as const;

  const planItems = [{ choices: [{ value: 'plus' }, { value: 'pro' }, { disabled: true, value: 'enterprise' }], name: 'plan', required: true }] as const;

  const uid = $props.id();
  const directionTitleId = `${uid}-direction`;
  const signalsTitleId = `${uid}-signals`;
  const timingTitleId = `${uid}-timing`;

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const values = {
      direction: formData.get('direction'),
      signals: formData.getAll('signals'),
      timing: formData.get('timing'),
    };

    toast.add({
      title: 'Questionnaire submitted',
      description: `Direction: ${values.direction ?? 'None'} · Progress signals: ${values.signals.join(', ') || 'None'} · Timing: ${values.timing ?? 'None'}`,
    });
  }
</script>

{#snippet QuestionnaireNavigation()}
  <QuestionnaireActions class="w-full">
    <QuestionnairePrevious />
    <QuestionnaireSkip />
    <QuestionnaireNext>Next</QuestionnaireNext>
    <QuestionnaireSubmit>Save answers</QuestionnaireSubmit>
  </QuestionnaireActions>
{/snippet}

{#snippet QuestionnaireQuestions()}
  <QuestionnaireItem name="direction" required>
    <QuestionnaireTitle>What should we prototype next?</QuestionnaireTitle>
    <QuestionnaireDescription>Choose one direction or write another answer.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="delegation">
        <span class="font-medium">Sub-agent delegation</span>
        <QuestionnaireChoiceDescription>Show when work is delegated and what comes back.</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireChoice value="questions">
        <span class="font-medium">Question prompts</span>
        <QuestionnaireChoiceDescription>Show choices while the agent waits for input.</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireChoice value="both">
        <span class="font-medium">Both together</span>
        <QuestionnaireChoiceDescription>Explore one unified interaction pattern.</QuestionnaireChoiceDescription>
      </QuestionnaireChoice>
      <QuestionnaireInput aria-label="Another direction" placeholder="Type another direction…" />
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireItem name="signals" multiple>
    <QuestionnaireTitle>What should every progress update include?</QuestionnaireTitle>
    <QuestionnaireDescription>Select all that apply, or skip this question.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
      <QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
      <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
  <QuestionnaireItem name="timing" required>
    <QuestionnaireTitle>When should this be revisited?</QuestionnaireTitle>
    <QuestionnaireDescription>Choose when this should be revisited.</QuestionnaireDescription>
    <QuestionnaireChoices>
      <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
      <QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
      <QuestionnaireChoice value="later">Revisit later</QuestionnaireChoice>
    </QuestionnaireChoices>
    <QuestionnaireError />
  </QuestionnaireItem>
{/snippet}

{#snippet QuestionnaireCardQuestions()}
  <QuestionnaireItem aria-labelledby={directionTitleId} name="direction" required>
    <Card class="mx-auto w-full max-w-lg">
      <CardHeader>
        <QuestionnaireTitle id={directionTitleId}>
          {#snippet render(props, _state, children)}
            <CardTitle {...props}>{@render children?.()}</CardTitle>
          {/snippet}
          What should we prototype next?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          {#snippet render(props, _state, children)}
            <CardDescription {...props}>{@render children?.()}</CardDescription>
          {/snippet}
          Choose one direction or write another answer.
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="delegation">
            <span class="font-medium">Sub-agent delegation</span>
            <QuestionnaireChoiceDescription>Show when work is delegated and what comes back.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="questions">
            <span class="font-medium">Question prompts</span>
            <QuestionnaireChoiceDescription>Show choices while the agent waits for input.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="both">
            <span class="font-medium">Both together</span>
            <QuestionnaireChoiceDescription>Explore one unified interaction pattern.</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireInput aria-label="Another direction" placeholder="Type another direction…" />
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
      <CardFooter>
        {@render QuestionnaireNavigation()}
      </CardFooter>
    </Card>
  </QuestionnaireItem>
  <QuestionnaireItem aria-labelledby={signalsTitleId} name="signals" multiple>
    <Card class="mx-auto w-full max-w-lg">
      <CardHeader>
        <QuestionnaireTitle id={signalsTitleId}>
          {#snippet render(props, _state, children)}
            <CardTitle {...props}>{@render children?.()}</CardTitle>
          {/snippet}
          What should every progress update include?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          {#snippet render(props, _state, children)}
            <CardDescription {...props}>{@render children?.()}</CardDescription>
          {/snippet}
          Select all that apply, or skip this question.
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="progress">Progress</QuestionnaireChoice>
          <QuestionnaireChoice value="decisions">Decisions</QuestionnaireChoice>
          <QuestionnaireChoice value="risks">Risks</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
      <CardFooter>
        {@render QuestionnaireNavigation()}
      </CardFooter>
    </Card>
  </QuestionnaireItem>
  <QuestionnaireItem aria-labelledby={timingTitleId} name="timing" required>
    <Card class="mx-auto w-full max-w-lg">
      <CardHeader>
        <QuestionnaireTitle id={timingTitleId}>
          {#snippet render(props, _state, children)}
            <CardTitle {...props}>{@render children?.()}</CardTitle>
          {/snippet}
          When should this be revisited?
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          {#snippet render(props, _state, children)}
            <CardDescription {...props}>{@render children?.()}</CardDescription>
          {/snippet}
          Choose when this should be revisited.
        </QuestionnaireDescription>
        <CardAction>
          <QuestionnaireProgress />
        </CardAction>
      </CardHeader>
      <CardContent>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="week">This week</QuestionnaireChoice>
          <QuestionnaireChoice value="cycle">Next cycle</QuestionnaireChoice>
          <QuestionnaireChoice value="later">Revisit later</QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </CardContent>
      <CardFooter>
        {@render QuestionnaireNavigation()}
      </CardFooter>
    </Card>
  </QuestionnaireItem>
{/snippet}

{#snippet QuestionnaireStandalone()}
  <Example title="Standalone" containerClass="md:col-span-2">
    <Questionnaire class="mx-auto max-w-lg" defaultItem="direction" items={questionnaireItems} shortcuts="letters" onsubmit={handleSubmit}>
      <QuestionnaireProgress />
      {@render QuestionnaireQuestions()}
      {@render QuestionnaireNavigation()}
    </Questionnaire>
  </Example>
{/snippet}

{#snippet QuestionnaireCard()}
  <Example title="Card" containerClass="md:col-span-2">
    <Questionnaire defaultItem="direction" items={questionnaireItems} shortcuts="numbers" onsubmit={handleSubmit}>
      {@render QuestionnaireCardQuestions()}
    </Questionnaire>
  </Example>
{/snippet}

{#snippet QuestionnaireDialog()}
  <Example title="Dialog" class="items-center justify-center" containerClass="md:col-span-2">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Open questionnaire
      </DialogTrigger>
      <DialogContent>
        <Questionnaire defaultItem="direction" items={questionnaireItems} onsubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle class="sr-only">Plan an agent interface</DialogTitle>
            <DialogDescription class="sr-only">Answer three questions to shape the next prototype.</DialogDescription>
            <QuestionnaireProgress class="font-semibold tracking-widest text-foreground uppercase">
              {#snippet render(props, state)}
                <span {...props}>Question {state.current} of {state.total}</span>
              {/snippet}
            </QuestionnaireProgress>
          </DialogHeader>
          {@render QuestionnaireQuestions()}
          <DialogFooter>
            {@render QuestionnaireNavigation()}
          </DialogFooter>
        </Questionnaire>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet QuestionnaireNoDescription()}
  <Example title="No description" containerClass="md:col-span-2">
    <Questionnaire class="mx-auto max-w-lg" defaultItem="task" items={taskItems} shortcuts="letters" onsubmit={handleSubmit}>
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
      {@render QuestionnaireNavigation()}
    </Questionnaire>
  </Example>
{/snippet}

{#snippet QuestionnaireDisabled()}
  <Example title="Disabled" containerClass="md:col-span-2">
    <Questionnaire class="mx-auto max-w-lg" defaultItem="plan" items={planItems} onsubmit={handleSubmit}>
      <QuestionnaireItem name="plan" required>
        <QuestionnaireTitle>Choose a plan</QuestionnaireTitle>
        <QuestionnaireDescription>Enterprise is not available on your account.</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="plus">
            <span class="font-medium">Plus</span>
            <QuestionnaireChoiceDescription>For individuals and small teams</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="pro">
            <span class="font-medium">Pro</span>
            <QuestionnaireChoiceDescription>For growing businesses</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="enterprise" disabled>
            <span class="font-medium">Enterprise</span>
            <QuestionnaireChoiceDescription>For large teams and enterprises</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      {@render QuestionnaireNavigation()}
    </Questionnaire>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render QuestionnaireStandalone()}
  {@render QuestionnaireCard()}
  {@render QuestionnaireDialog()}
  {@render QuestionnaireNoDescription()}
  {@render QuestionnaireDisabled()}
</ExampleWrapper>
