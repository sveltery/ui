<script lang="ts">
  import { Field } from '@sveltery/base/field';
  import type { EnhanceCallback, FormIssue, FormSource } from '@sveltery/base/form';
  import { createAttachmentKey } from 'svelte/attachments';
  import { on } from 'svelte/events';
  import * as Questionnaire from '@sveltery/questionnaire';
  import Choice from './QuestionnaireChoice.svelte';

  let { serverIssues }: { serverIssues: FormIssue[] } = $props();

  // The slice of a SvelteKit remote form that Base reads. Its submit answers with `serverIssues`.
  let issues = $state.raw<FormIssue[]>([]);
  let pending = $state(0);
  let callback: EnhanceCallback | undefined;
  const handle = (name: string) => ({
    as: () => ({ name }),
    issues: () => {
      const own = issues.filter((issue) => issue.path[0] === name);
      return own.length > 0 ? own : undefined;
    },
    value: () => undefined,
    set: () => {},
    touched: () => false,
    dirty: () => false
  });
  const source: FormSource = Object.defineProperties(
    {
      method: 'POST' as const,
      [createAttachmentKey()]: (element: HTMLFormElement) =>
        on(element, 'submit', (event) => {
          event.preventDefault();
          void callback?.({
            element,
            submit: () => {
              pending += 1;
              const submission = Promise.resolve().then(() => {
                issues = serverIssues;
                pending -= 1;
                return false;
              });
              return Object.assign(submission, { updates: () => submission });
            }
          });
        })
    },
    {
      fields: { value: { scope: handle('scope'), detail: handle('detail'), allIssues: () => issues } },
      pending: { get: () => pending },
      submitted: { value: false },
      validate: { value: async () => {} },
      enhance: { value: (next: EnhanceCallback) => (callback = next) }
    }
  ) as FormSource;
</script>

<Questionnaire.Root form={source} data-testid="root">
  <Questionnaire.Item name="scope" required data-testid="scope">
    <Questionnaire.Title>Scope</Questionnaire.Title>
    <Choice data-testid="scope-choice" value="wide">Wide</Choice>
    <Field.Error data-testid="scope-field-error" />
    <Questionnaire.Error data-testid="scope-error" />
  </Questionnaire.Item>
  <Questionnaire.Item name="detail" required data-testid="detail">
    <Questionnaire.Title>Detail</Questionnaire.Title>
    <Choice data-testid="detail-choice" value="brief">Brief</Choice>
    <Questionnaire.Error data-testid="detail-error" />
  </Questionnaire.Item>
  <Questionnaire.Next data-testid="next" />
  <Questionnaire.Submit data-testid="submit" />
</Questionnaire.Root>
