<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '$registry/bases/base/ui/dialog';
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

  const items = [
    { name: 'scope', required: true },
    { name: 'tests', required: true },
  ];

  let open = $state(false);

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    open = false;
    toast.add({ title: 'Clarification sent', description: `Scope: ${formData.get('scope') ?? 'None'} · Verification: ${formData.get('tests') ?? 'None'}` });
  }
</script>

<Dialog bind:open>
  <DialogTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open clarification
  </DialogTrigger>
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
        <DialogClose type="button">
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          Cancel
        </DialogClose>
        <QuestionnaireActions>
          <QuestionnairePrevious />
          <QuestionnaireNext>Next</QuestionnaireNext>
          <QuestionnaireSubmit>Send answer</QuestionnaireSubmit>
        </QuestionnaireActions>
      </DialogFooter>
    </Questionnaire>
  </DialogContent>
</Dialog>
