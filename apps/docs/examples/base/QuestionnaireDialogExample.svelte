<script lang="ts">
  import { buttonVariants } from '@sveltery/ui/button';
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
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
    { name: 'scope', required: true },
    { name: 'tests', required: true },
  ];

  let open = $state(false);
  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    open = false;
    result = `Scope: ${formData.get('scope') ?? 'None'} · Verification: ${formData.get('tests') ?? 'None'}`;
  }
</script>

<div class="flex flex-col items-center gap-4">
  <Dialog bind:open>
    <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open clarification</DialogTrigger>
    <DialogContent>
      <Questionnaire defaultItem="scope" {items} onsubmit={handleSubmit}>
        <QuestionnaireItem name="scope" required>
          <DialogHeader>
            <QuestionnaireProgress />
            <QuestionnaireTitle>
              {#snippet render(props, _state, children)}
                <DialogTitle {...props}>{@render children?.()}</DialogTitle>
              {/snippet}
              Which files are in scope?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              {#snippet render(props, _state, children)}
                <DialogDescription {...props}>{@render children?.()}</DialogDescription>
              {/snippet}
              Choose how broadly the agent can update the workspace.
            </QuestionnaireDescription>
          </DialogHeader>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="component">Component only</QuestionnaireChoice>
            <QuestionnaireChoice value="feature">Complete feature directory</QuestionnaireChoice>
            <QuestionnaireChoice value="workspace">Any related workspace file</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <QuestionnaireItem name="tests" required>
          <DialogHeader>
            <QuestionnaireProgress />
            <QuestionnaireTitle>
              {#snippet render(props, _state, children)}
                <DialogTitle {...props}>{@render children?.()}</DialogTitle>
              {/snippet}
              How much verification is needed?
            </QuestionnaireTitle>
            <QuestionnaireDescription>
              {#snippet render(props, _state, children)}
                <DialogDescription {...props}>{@render children?.()}</DialogDescription>
              {/snippet}
              Choose the checks the agent should run before handoff.
            </QuestionnaireDescription>
          </DialogHeader>
          <QuestionnaireChoices>
            <QuestionnaireChoice value="targeted">Targeted tests</QuestionnaireChoice>
            <QuestionnaireChoice value="package">Package tests</QuestionnaireChoice>
            <QuestionnaireChoice value="full">Full workspace verification</QuestionnaireChoice>
          </QuestionnaireChoices>
          <QuestionnaireError />
        </QuestionnaireItem>

        <DialogFooter>
          <DialogClose type="button" class={buttonVariants({ variant: 'outline' })}>Cancel</DialogClose>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireNext>Next</QuestionnaireNext>
            <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
          </QuestionnaireActions>
        </DialogFooter>
      </Questionnaire>
    </DialogContent>
  </Dialog>
  {#if result}
    <p role="status" class="text-sm text-muted-foreground">{result}</p>
  {/if}
</div>
