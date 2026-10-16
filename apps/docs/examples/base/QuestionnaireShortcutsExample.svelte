<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
  import {
    Questionnaire,
    QuestionnaireActions,
    QuestionnaireChoice,
    QuestionnaireChoices,
    QuestionnaireDescription,
    QuestionnaireError,
    QuestionnaireItem,
    QuestionnaireSubmit,
    QuestionnaireTitle,
  } from '$registry/bases/base/ui/questionnaire';

  const items = [{ choices: [{ value: 'inspect' }, { value: 'tests' }, { value: 'patch' }], name: 'action', required: true }];

  let style = $state<'none' | 'letters' | 'numbers'>('letters');
  let result = $state('');

  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    result = `Action: ${new FormData(event.currentTarget).get('action') ?? 'None'} · Shortcuts: ${style}`;
  }
</script>

<div class="relative mx-auto flex h-full w-full max-w-md flex-col">
  <NativeSelect aria-label="Shortcut style" class="absolute end-0 top-0" bind:value={style}>
    <NativeSelectOption value="none">No shortcuts</NativeSelectOption>
    <NativeSelectOption value="letters">Letters</NativeSelectOption>
    <NativeSelectOption value="numbers">Numbers</NativeSelectOption>
  </NativeSelect>

  <Questionnaire class="mt-auto" {items} shortcuts={style === 'none' ? undefined : style} onsubmit={handleSubmit}>
    <QuestionnaireItem name="action" required>
      <QuestionnaireTitle>What should the agent do next?</QuestionnaireTitle>
      <QuestionnaireDescription>Use the displayed shortcut or navigate with the keyboard.</QuestionnaireDescription>
      <QuestionnaireChoices>
        <QuestionnaireChoice value="inspect">Inspect the implementation</QuestionnaireChoice>
        <QuestionnaireChoice value="tests">Run the relevant tests</QuestionnaireChoice>
        <QuestionnaireChoice value="patch">Prepare the patch</QuestionnaireChoice>
      </QuestionnaireChoices>
      <QuestionnaireError />
    </QuestionnaireItem>

    <QuestionnaireActions>
      <QuestionnaireSubmit>Confirm action</QuestionnaireSubmit>
    </QuestionnaireActions>
    {#if result}
      <p role="status" class="mt-4 text-sm text-muted-foreground">{result}</p>
    {/if}
  </Questionnaire>
</div>
