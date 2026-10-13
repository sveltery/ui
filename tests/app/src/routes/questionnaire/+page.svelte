<script lang="ts">
  import { page } from '$app/state';
  import * as Questionnaire from '@sveltery/questionnaire';
  import type { QuestionnaireItemDefinition, QuestionnaireItemStatus } from '@sveltery/questionnaire';

  const scenario = $derived(page.url.searchParams.get('case'));
  let submissions = $state<string[]>([]);
  let status = $state<QuestionnaireItemStatus>('unanswered');
  const record = (event: SubmitEvent) => {
    event.preventDefault();
    const entries = [...new FormData(event.currentTarget as HTMLFormElement)].map(([name, value]) => `${name}=${value}`);
    submissions.push(`${entries.join('&') || '(empty)'}${scenario === 'final-skip' ? ` ${status}` : ''}`);
  };
  const scopeItems = [
    { choices: [{ value: 'delegation' }, { disabled: true, value: 'automatic' }, { value: 'questions' }], name: 'scope', required: true },
    { choices: [{ value: 'focused' }, { value: 'complete' }], name: 'detail' }
  ] satisfies QuestionnaireItemDefinition[];
  const reversed = [{ choices: [{ value: 'second' }, { value: 'first' }], name: 'answer' }];
</script>

{#snippet choice(value: string, label: string, props: Record<string, unknown> = {})}
  <Questionnaire.Choice data-testid={value} {value} {...props}>
    <Questionnaire.ChoiceInput />
    <Questionnaire.ChoiceLabel>{label}</Questionnaire.ChoiceLabel>
    <Questionnaire.ChoiceShortcut />
  </Questionnaire.Choice>
{/snippet}

{#if scenario === 'label'}
  <Questionnaire.Root data-testid="root" defaultItem="answer">
    <Questionnaire.Item name="answer" required>
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('answer', 'Answer')}
    </Questionnaire.Item>
  </Questionnaire.Root>
{:else if scenario === 'native-keys'}
  <Questionnaire.Root data-testid="root" defaultItem="single">
    <Questionnaire.Item name="single" required>
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('alpha', 'Alpha')}
      {@render choice('beta', 'Beta')}
      <Questionnaire.Input data-testid="other" aria-label="Other answer" />
    </Questionnaire.Item>
    <Questionnaire.Item multiple name="multiple" required>
      <Questionnaire.Title>Choose several</Questionnaire.Title>
      {@render choice('gamma', 'Gamma')}
      {@render choice('delta', 'Delta')}
    </Questionnaire.Item>
    <Questionnaire.Next data-testid="next" />
  </Questionnaire.Root>
{:else if scenario === 'arrows'}
  <Questionnaire.Root data-testid="root" defaultItem="first">
    <Questionnaire.Item data-testid="first" name="first" required>
      <Questionnaire.Title>First question</Questionnaire.Title>
      {@render choice('first-answer', 'First answer')}
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="second" name="second" required>
      <Questionnaire.Title>Second question</Questionnaire.Title>
      <Questionnaire.Input data-testid="second-answer" aria-label="Second answer" />
    </Questionnaire.Item>
    <Questionnaire.Previous />
    <Questionnaire.Next />
  </Questionnaire.Root>
{:else if scenario === 'number'}
  <Questionnaire.Root data-testid="root" defaultItem="rounds">
    <Questionnaire.Item name="rounds" required>
      <Questionnaire.Title>Review rounds</Questionnaire.Title>
      {@render choice('unlimited', 'No limit')}
      <Questionnaire.Input data-testid="round-count" aria-label="Round count" min={1} type="number" />
    </Questionnaire.Item>
  </Questionnaire.Root>
{:else if scenario === 'shortcuts'}
  <Questionnaire.Root data-testid="root" defaultItem="single" shortcuts="letters" onsubmit={record}>
    <Questionnaire.Item name="single" required>
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('alpha', 'Alpha')}
      {@render choice('beta', 'Beta')}
    </Questionnaire.Item>
    <Questionnaire.Item name="detail" required>
      <Questionnaire.Title>Add detail</Questionnaire.Title>
      {@render choice('brief', 'Keep it brief')}
      <Questionnaire.Input data-testid="detail-input" aria-label="Other detail" />
    </Questionnaire.Item>
    <Questionnaire.Next />
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'order'}
  <Questionnaire.Root data-testid="root" items={reversed} shortcuts="letters">
    <Questionnaire.Item data-testid="answer" name="answer">
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('first', 'First')}
      <Questionnaire.Input data-testid="other" aria-label="Other answer" />
      {@render choice('second', 'Second')}
    </Questionnaire.Item>
  </Questionnaire.Root>
{:else if scenario === 'confirm'}
  <Questionnaire.Root data-testid="root" defaultItem="first" onsubmit={record}>
    <Questionnaire.Item data-testid="first" name="first" required>
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('first-answer', 'First answer')}
      <Questionnaire.Input data-testid="first-input" aria-label="Other first answer" />
      <Questionnaire.Error data-testid="first-error" />
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="second" name="second" required>
      <Questionnaire.Title>Choose another</Questionnaire.Title>
      {@render choice('second-answer', 'Second answer')}
    </Questionnaire.Item>
    <Questionnaire.Next />
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'multiple-shortcuts'}
  <Questionnaire.Root data-testid="root" defaultItem="answers" shortcuts="numbers">
    <Questionnaire.Item multiple name="answers" required>
      <Questionnaire.Title>Choose several</Questionnaire.Title>
      {@render choice('alpha', 'Alpha')}
      {@render choice('beta', 'Beta')}
    </Questionnaire.Item>
  </Questionnaire.Root>
{:else if scenario === 'implicit'}
  <Questionnaire.Root data-testid="root" defaultItem="answer" onsubmit={record}>
    <Questionnaire.Item name="answer" required>
      <Questionnaire.Title>Choose one</Questionnaire.Title>
      {@render choice('alpha', 'Alpha')}
      {@render choice('beta', 'Beta')}
      <Questionnaire.Input data-testid="other" aria-label="Other answer" />
    </Questionnaire.Item>
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'skip'}
  <Questionnaire.Root data-testid="root" onsubmit={record}>
    <Questionnaire.Item data-testid="skip-item" name="skipped">
      <Questionnaire.Title>Skippable answer</Questionnaire.Title>
      {@render choice('kept', 'Kept', { checked: true })}
    </Questionnaire.Item>
    <Questionnaire.Skip data-testid="skip" />
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'native-freeform'}
  <Questionnaire.Root data-testid="root" defaultItem="answer" novalidate={false} onsubmit={record}>
    <Questionnaire.Item name="answer" required>
      <Questionnaire.Title>Choose or type</Questionnaire.Title>
      {@render choice('fixed', 'Fixed')}
      <Questionnaire.Input data-testid="other" aria-label="Other answer" />
    </Questionnaire.Item>
    <Questionnaire.Submit data-testid="submit" />
  </Questionnaire.Root>
{:else if scenario === 'native-email'}
  <Questionnaire.Root data-testid="root" defaultItem="contact" novalidate={false} onsubmit={record}>
    <Questionnaire.Item data-testid="contact" name="contact" required>
      <Questionnaire.Title>How should we contact you?</Questionnaire.Title>
      {@render choice('fixed-contact', 'Use the saved address', { value: 'fixed' })}
      <Questionnaire.Input data-testid="contact-input" aria-label="Another email" type="email" />
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="confirmation" name="confirmation" required>
      <Questionnaire.Title>Confirm</Questionnaire.Title>
      {@render choice('confirm', 'Confirmed', { value: 'confirmed' })}
    </Questionnaire.Item>
    <Questionnaire.Next data-testid="next" />
    <Questionnaire.Submit data-testid="submit" />
  </Questionnaire.Root>
{:else if scenario === 'ime'}
  <Questionnaire.Root data-testid="root" defaultItem="detail" shortcuts="numbers" onsubmit={record}>
    <Questionnaire.Item name="detail" required>
      <Questionnaire.Title>Add detail</Questionnaire.Title>
      <Questionnaire.Input data-testid="detail-input" aria-label="Other detail" />
    </Questionnaire.Item>
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'focus'}
  <Questionnaire.Root data-testid="root" defaultItem="first" onsubmit={record}>
    <Questionnaire.Item data-testid="first" name="first" required>
      <Questionnaire.Title>First</Questionnaire.Title>
      {@render choice('first-answer', 'First answer')}
      <Questionnaire.Error />
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="second" name="second" required>
      <Questionnaire.Title>Second</Questionnaire.Title>
      {@render choice('second-answer', 'Second answer')}
      <Questionnaire.Error />
    </Questionnaire.Item>
    <Questionnaire.Next data-testid="next" />
    <Questionnaire.Submit data-testid="submit" />
  </Questionnaire.Root>
{:else if scenario === 'final-skip'}
  <Questionnaire.Root data-testid="root" defaultItem="timing" onsubmit={record}>
    <Questionnaire.Item name="timing" onStatusChange={(next) => (status = next)}>
      <Questionnaire.Title>When?</Questionnaire.Title>
      {@render choice('today', 'Today')}
    </Questionnaire.Item>
    <Questionnaire.Skip data-testid="skip" />
    <Questionnaire.Submit />
  </Questionnaire.Root>
{:else if scenario === 'reset'}
  <Questionnaire.Root data-testid="root" defaultItem="channel">
    <Questionnaire.Item data-testid="channel" name="channel" required>
      <Questionnaire.Title>Channel</Questionnaire.Title>
      {@render choice('email', 'Email', { defaultChecked: true })}
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="detail" multiple name="detail" required>
      <Questionnaire.Title>Detail</Questionnaire.Title>
      <Questionnaire.Input data-testid="detail-input" aria-label="Detail" defaultValue="Default detail" />
      <Questionnaire.Input data-testid="fixed-detail-input" aria-label="Fixed detail" readonly value="Fixed detail" />
    </Questionnaire.Item>
    <Questionnaire.Previous data-testid="previous" />
    <Questionnaire.Next data-testid="next" />
    <button data-testid="reset" type="reset">Reset</button>
  </Questionnaire.Root>
{:else if scenario === 'collection'}
  <Questionnaire.Root data-testid="root" items={scopeItems} shortcuts="letters" onsubmit={record}>
    <Questionnaire.Progress data-testid="progress" />
    <Questionnaire.Item data-testid="scope" name="scope" required>
      <Questionnaire.Title>Choose the scope</Questionnaire.Title>
      {@render choice('delegation', 'Delegation')}
      {@render choice('automatic', 'Automatic', { disabled: true })}
      {@render choice('questions', 'Questions')}
    </Questionnaire.Item>
    <Questionnaire.Item data-testid="detail" name="detail">
      <Questionnaire.Title>Choose the detail</Questionnaire.Title>
      {@render choice('focused', 'Focused')}
      {@render choice('complete', 'Complete')}
    </Questionnaire.Item>
    <Questionnaire.Previous data-testid="previous" />
    <Questionnaire.Skip data-testid="skip" />
    <Questionnaire.Next data-testid="next" />
    <Questionnaire.Submit data-testid="submit" />
  </Questionnaire.Root>
{/if}
<output data-testid="submitted">{submissions.join(' | ')}</output>
