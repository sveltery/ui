---
title: Questionnaire
description: A multi-step questionnaire with single-choice, multiple-choice, freeform, and skippable questions.
---

<ComponentPreview name="base/QuestionnaireDemoExample" align="end" />

## About

Questionnaire is built on `@sveltery/questionnaire`, a Svelte package that takes its design from `@shadcn/react/questionnaire`. It presents one question at a time and manages answers, progress, validation and navigation on top of native form controls.

## Installation

<Steps>

### Install the dependencies

```bash
npm install cn class-variance-authority @sveltery/questionnaire
```

### Copy the component

Copy the following files into `src/lib/components/ui/questionnaire`.

<ComponentSource name="questionnaire" />

### Update the import paths

Change the imports to match your project setup.

</Steps>

## Usage

```svelte
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
  } from '$lib/components/ui/questionnaire';
</script>
```

```svelte
<script lang="ts">
  const items = [
    {
      name: 'direction',
      required: true,
      prompt: 'What should we prototype next?',
      description: 'Choose a direction or write your own.',
      choices: [
        { value: 'delegation', label: 'Delegation', description: 'Show how work moves to a specialist.' },
        { value: 'questions', label: 'Question prompts', description: 'Show choices while the interface waits.' },
        { value: 'both', label: 'Both together' },
      ],
      input: { label: 'Another answer', placeholder: 'Type another answer…' },
    },
    {
      name: 'detail',
      required: false,
      prompt: 'How much detail should it include?',
      description: 'Skip this if you are not sure yet.',
      choices: [
        { value: 'focused', label: 'Focused' },
        { value: 'complete', label: 'Complete flow' },
      ],
    },
  ] as const;
</script>
```

Define the collection once: pass it to `Questionnaire` for server-rendered progress, actions, and shortcuts, then loop over it to render the parts.

```svelte
<Questionnaire {items} onsubmit={handleSubmit}>
  <QuestionnaireProgress />
  {#each items as question (question.name)}
    <QuestionnaireItem name={question.name} required={question.required}>
      <QuestionnaireTitle>{question.prompt}</QuestionnaireTitle>
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
    <QuestionnaireNext />
    <QuestionnaireSubmit />
  </QuestionnaireActions>
</Questionnaire>
```

```svelte
<script lang="ts">
  function handleSubmit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const answers = new FormData(event.currentTarget);
    // answers.get('direction'), answers.getAll(...) for multiple items.
  }
</script>
```

## Composition

Use the following composition to build a `Questionnaire`:

```text
Questionnaire
├── QuestionnaireProgress
├── QuestionnaireItem
│   ├── QuestionnaireTitle
│   ├── QuestionnaireDescription
│   ├── QuestionnaireChoices
│   │   ├── QuestionnaireChoice
│   │   └── QuestionnaireInput
│   └── QuestionnaireError
└── QuestionnaireActions
    ├── QuestionnairePrevious
    ├── QuestionnaireSkip
    ├── QuestionnaireNext
    └── QuestionnaireSubmit
```

Questionnaire owns the ordered items, active item, answer state, validation, progress, and navigation. The containing page, card, dialog, or drawer owns close and cancellation behavior, persistence, transport, and branching.

## Server Rendering

Pass `items` to server-render the active item, progress, actions, and answer shortcuts. The [API reference](#api-reference) below describes the complete behavior.

## Multiple Selection

Use `multiple` for an item that accepts more than one fixed answer. Read the answers with `FormData.getAll()`.

<ComponentPreview name="base/QuestionnaireMultipleExample" align="end" />

## Freeform Answer

Compose `QuestionnaireInput` with fixed choices when the user can provide another answer.

<ComponentPreview name="base/QuestionnaireFreeformExample" align="end" />

## Explicit Skip

Add `QuestionnaireSkip` when an optional item may be intentionally left unanswered. Use `onStatusChange` on the item when your application needs to distinguish a skipped answer from a missing one. A skipped item is absent from `FormData`.

<ComponentPreview name="base/QuestionnaireSkipExample" align="end" />

## Shortcuts

Assign a letter or number key to each answer with `shortcuts`. `"letters"` assigns `A` through `Z` and `"numbers"` assigns `1` through `9`. Disabled choices are skipped, and selecting an answer by shortcut does not advance to the next item.

<ComponentPreview name="base/QuestionnaireShortcutsExample" align="end" />

## Validation

Questionnaire validates the active item before moving forward and validates all enabled items when the form submits.

- A required item is valid after it has an answer.
- An optional item is valid after it has an answer or is explicitly skipped.
- Disabled items and answers are ignored.

`required` does not add visible "Required" text. Say it in the `QuestionnaireTitle` or `QuestionnaireDescription`. When validation fails, Questionnaire keeps or opens the invalid item and focuses an answer. `QuestionnaireError` stays hidden until its item is invalid, and its children replace the default message.

```svelte
<QuestionnaireItem name="scope" required>
  <QuestionnaireTitle>What should the project include? (Required)</QuestionnaireTitle>
  <QuestionnaireChoices>…</QuestionnaireChoices>
  <QuestionnaireError>Please choose a project scope.</QuestionnaireError>
</QuestionnaireItem>
```

## Custom Validation

Combine `bind:item` with your own check to return to an invalid item and present its error. Set `invalid` on the item, render the message in `QuestionnaireError`, and move `item` to the first invalid item.

<ComponentPreview name="base/QuestionnaireValidationExample" align="end" />

## Controlled

Bind `item` to control the active item from host state, such as returning to an invalid step. `onItemChange` runs whenever navigation requests a different item.

<ComponentPreview name="base/QuestionnaireControlledExample" align="end" />

## Resume

Restore a saved active item and default answers with `defaultItem`, `defaultChecked` and `defaultValue`, then reset changes back to that saved state with a `type="reset"` button.

<ComponentPreview name="base/QuestionnaireResumeExample" align="end" />

## Conditional Items

Disable items that do not apply to the user's earlier answers. Disabled items are excluded from progress, navigation, validation, and submission.

<ComponentPreview name="base/QuestionnaireConditionalExample" align="end" />

## Navigation State

Navigation actions stay enabled by default so activating Next or Submit can show a validation error. Read item status to opt into disabled navigation and custom action styling. `data-status` carries the active item's status, so you can restyle an action without reading it in script.

<ComponentPreview name="base/QuestionnaireNavigationStateExample" align="end" />

```svelte
<QuestionnaireNext class="data-[status=unanswered]:opacity-50" disabled={unanswered}>Next</QuestionnaireNext>
```

## Custom Progress

`QuestionnaireProgress` renders `Question {current} of {total}` by default. Use the `render` snippet to change its element or format, and pass a localized `aria-label` when needed.

<ComponentPreview name="base/QuestionnaireProgressExample" align="end" />

```svelte
<QuestionnaireProgress aria-label="Setup progress">
  {#snippet render(props, state)}
    <output {...props}>Checkpoint {state.current} of {state.total}</output>
  {/snippet}
</QuestionnaireProgress>
```

## Animated Items

Animate the active item while keeping progress and navigation stationary. Inactive items hide immediately and stay mounted, so a `transition:` directive never runs. Animate the entry from `onItemChange` instead, here with a `Tween` that skips the motion when the user prefers reduced motion.

<ComponentPreview name="base/QuestionnaireAnimatedExample" align="end" />

## Card

Compose Questionnaire with Card slots while keeping the question title and description semantic. Render `QuestionnaireTitle` and `QuestionnaireDescription` through `CardTitle` and `CardDescription`, give the title an `id`, and connect it with the item's `aria-labelledby` since it replaces the default legend.

<ComponentPreview name="base/QuestionnaireCardExample" align="end" />

```svelte
<QuestionnaireItem aria-labelledby={titleId} name="task" required>
  <CardHeader>
    <QuestionnaireTitle id={titleId}>
      {#snippet render(props, _state, children)}
        <CardTitle {...props}>{@render children?.()}</CardTitle>
      {/snippet}
      What should the agent work on?
    </QuestionnaireTitle>
    …
  </CardHeader>
</QuestionnaireItem>
```

## Dialog

Compose Questionnaire inside a Dialog while keeping cancellation and dismissal host-owned. Closing the dialog cancels the flow, while `QuestionnaireSkip` records an intentional unanswered item.

<ComponentPreview name="base/QuestionnaireDialogExample" align="end" />

## Custom render targets

Use the `render` snippet to replace a part's default element. It receives the element props, the render state and the part's children.

```svelte
<QuestionnaireNext>
  {#snippet render(props, state, children)}
    <MyButton {...props}>{@render children?.()}</MyButton>
  {/snippet}
  Next
</QuestionnaireNext>
```

`Questionnaire` and `QuestionnaireItem` always render a `form` and a `fieldset`. If `QuestionnaireTitle` no longer renders a `legend`, give it an `id` and pass that ID to the item with `aria-labelledby`.

## Native forms

`Questionnaire` always renders a native form and supports `onsubmit`, `onreset`, `action`, and the other form props. Do not nest a Questionnaire inside another form. Answers serialize through native controls: `FormData.get(itemName)` reads a single answer and `FormData.getAll(itemName)` reads multiple answers.

`novalidate` is `true` by default so validation uses `QuestionnaireError` instead of the browser's constraint validation UI. `form.reset()` restores the initial item, default answers, skip state, and validation state.

## Keyboard

Questionnaire builds on native radio, checkbox, input, and button behavior.

| Key | Behavior |
| --- | --- |
| `Tab` | Moves focus between answer controls and visible actions. |
| `Shift` + `Tab` | Moves focus to the previous control or action. |
| `ArrowUp` | Moves to the previous answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it. |
| `ArrowDown` | Moves to the next answer from the item, a fixed answer, or an empty text-like freeform input. Native radios also select it. |
| `ArrowLeft` | Moves to the previous item when focus is outside a radio or text entry control. |
| `ArrowRight` | Moves to the next item when the active item is answered or skipped and focus is outside a radio or text entry control. |
| `Space` | Selects a radio, toggles a checkbox, or activates a focused action. |
| `Enter` | Continues from a selected choice or selected, filled input; activates a focused action. |
| `Command/Ctrl` + `Enter` | Validates and continues from anywhere inside the questionnaire, or submits the final item. |

Shortcuts and arrow navigation pause while you type in a text field. Calling `preventDefault()` in the root `onkeydown` handler turns off questionnaire key handling.

Navigation actions stay enabled by default so an attempted action can reveal validation feedback. See [Navigation State](#navigation-state) to disable or restyle an unanswered action.

## Accessibility

`QuestionnaireItem` renders a `fieldset`, and `QuestionnaireTitle` renders its `legend`. Descriptions and active errors are associated with the current item, and invalid items and answer controls expose `aria-invalid`.

- `QuestionnaireTitle` renders the fieldset `legend` by default. If it uses a custom render target, connect its `id` to the item with `aria-labelledby`.
- `QuestionnaireDescription` and the active `QuestionnaireError` are connected with `aria-describedby`.
- Fixed choices use native radios and checkboxes.
- Progress is exposed as a named progressbar with current, minimum, maximum, and text values.
- Navigation uses real buttons. Assigned shortcut keys and available navigation are exposed with `aria-keyshortcuts`.
- Inactive items and actions are hidden and inert.
- Successful navigation focuses the newly active item; failed validation focuses an available answer control.
- Disabled items are omitted from progress and navigation.

Always give `QuestionnaireInput` an accessible name with a visible label, `aria-label`, or `aria-labelledby`. A placeholder is not a label. Use an explicit `id` with a visible label:

```svelte
<Label for="other-answer">Other answer</Label>
<QuestionnaireInput id="other-answer" placeholder="Type another answer…" />
```

When the design has no visible label, use `aria-label`:

```svelte
<QuestionnaireInput aria-label="Other answer" placeholder="Type another answer…" />
```

## API Reference

Every part accepts the native attributes of its element and a `class`. Navigation parts also accept the Button `size` and `variant` props. `QuestionnaireActions` is a styled-only layout `div`, and `QuestionnaireChoiceDescription` is a styled `span` for text under a choice label.

The styled `QuestionnaireChoice` composes the native input, the visual indicator, the label and the shortcut hint for you. Every part also takes a `render` snippet. It receives `(props, state)`, or `(props, state, children)` for a part with children, and the render states are listed per part below.

### Data attributes

Use these attributes for styling. Boolean attributes are present when true and absent when false.

#### Questionnaire and QuestionnaireProgress

| Data attribute | Value |
| --- | --- |
| `data-current` | One-based active item position. |
| `data-total` | Number of enabled items. |
| `data-first` | Present on the first item. |
| `data-last` | Present on the last item. |
| `data-shortcuts` | `"letters"` \| `"numbers"` on `Questionnaire` when enabled. |

#### QuestionnaireItem

| Data attribute | Value |
| --- | --- |
| `data-active` | Present when active. |
| `data-status` | `"unanswered"` \| `"answered"` \| `"skipped"` |
| `data-required` | Present when required. |
| `data-multiple` | Present when multiple. |
| `data-disabled` | Present when disabled. |
| `data-invalid` | Present after failed validation. |

#### QuestionnaireChoice

| Data attribute | Value |
| --- | --- |
| `data-type` | `"radio"` \| `"checkbox"` |
| `data-checked` | Present when selected. |
| `data-unchecked` | Present when not selected. |
| `data-disabled` | Present when disabled. |
| `data-invalid` | Present when its item is invalid. |
| `data-shortcut` | Assigned letter or number. |

#### QuestionnaireChoices

| Data attribute | Value |
| --- | --- |
| `data-shortcuts` | `"letters"` \| `"numbers"` when enabled. |

#### QuestionnaireInput

| Data attribute | Value |
| --- | --- |
| `data-filled` | Present when the input has non-empty text. |
| `data-empty` | Present when the input has no answer text. |
| `data-disabled` | Present when disabled. |
| `data-invalid` | Present when its item is invalid. |

#### QuestionnaireError

| Data attribute | Value |
| --- | --- |
| `data-invalid` | Present while the error is active. |

#### QuestionnairePrevious, QuestionnaireSkip, QuestionnaireNext and QuestionnaireSubmit

| Data attribute | Value |
| --- | --- |
| `data-visible` | Present when the action applies to the active item. |
| `data-hidden` | Present when the action does not apply. |
| `data-disabled` | Present when disabled. |
| `data-shortcut` | `"Enter"` on an enabled, visible Next or Submit. |
| `data-status` | Active item: `"unanswered"`, `"answered"`, or `"skipped"`. |

`QuestionnaireTitle` and `QuestionnaireDescription` have no state attributes.

### Questionnaire

The form and coordination root.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `item` | `string` | | Bindable. The active item name. |
| `defaultItem` | `string` | first enabled item | Initially active item name. |
| `items` | `readonly QuestionnaireItemDefinition[]` | | Optional item data for server rendering and item order. |
| `onItemChange` | `(item: string) => void` | | Called when navigation requests a different item. |
| `shortcuts` | `'letters' \| 'numbers'` | | Assigns scoped answer shortcuts in definition or rendered DOM order. |
| `novalidate` | `boolean` | `true` | Disables native constraint UI while preserving questionnaire validation. |
| `onsubmit` | `(event: SubmitEvent) => void` | | Native form submission handler after every item validates. |
| `onreset` | `(event: Event) => void` | | Native reset handler. Prevent default to stop questionnaire reset. |

`Questionnaire` exposes `current`, `total`, `first`, `last`, and `shortcuts` through data attributes. The optional collection types are exported with the component:

```ts
type QuestionnaireChoiceDefinition = {
  value: string;
  disabled?: boolean;
};

type QuestionnaireItemDefinition = {
  name: string;
  required?: boolean;
  disabled?: boolean;
  choices?: readonly QuestionnaireChoiceDefinition[];
};
```

### QuestionnaireProgress

Position within the enabled item collection.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `Snippet` | `Question {current} of {total}` | Custom progress content. |
| `aria-label` | `string` | `Questionnaire progress` | Accessible progressbar name. |
| `render` | `Snippet<[props, state, children]>` | `<div>` | Custom render target with progress state. |

The render state contains `current`, `total`, `first`, and `last`.

### QuestionnaireItem

One questionnaire step. Item names must be unique within a `Questionnaire`. The name belongs to the answer controls, not the fieldset.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | required | Unique item identifier and native form field name. |
| `invalid` | `boolean` | `false` | Marks the item invalid from an external validator. |
| `required` | `boolean` | `false` | Requires an answer and prevents Skip. |
| `multiple` | `boolean` | `false` | Renders fixed choices as checkboxes. |
| `disabled` | `boolean` | `false` | Omits the item from progress and navigation. |
| `onStatusChange` | `(status: QuestionnaireItemStatus) => void` | | Observes `"unanswered"`, `"answered"`, and `"skipped"` changes. |

The render state contains `active`, `disabled`, `invalid`, `multiple`, `required`, and `status`.

### QuestionnaireTitle

The item title. Renders a semantic `legend` by default.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `Snippet<[props, state, children]>` | `<legend>` | Custom render target. Pair its `id` with the item's `aria-labelledby`. |

### QuestionnaireDescription

Supporting text connected to the item with `aria-describedby`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `Snippet<[props, state, children]>` | `<p>` | Custom render target. |

### QuestionnaireChoices

A layout container for fixed and freeform answers.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `render` | `Snippet<[props, state, children]>` | `<div>` | Custom render target. |

The render state contains `shortcuts`.

### QuestionnaireChoice

A fixed answer. The default `<label>` keeps the whole row associated with its native control.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | required | Native answer value. |
| `checked` | `boolean` | | Bindable. The checked state. |
| `defaultChecked` | `boolean` | `false` | Initial checked state. |
| `disabled` | `boolean` | `false` | Disables the native answer control. |
| `onchange` | `(event: Event) => void` | | Native input change handler. |
| `render` | `Snippet<[props, state, children]>` | `<label>` | Custom render target with choice state. |

The render state contains `checked`, `disabled`, `invalid`, `shortcut`, and `type`.

### QuestionnaireInput

A freeform answer. Its native `name` is managed by the containing item.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | | Bindable. The input value. |
| `defaultValue` | `string` | | Initial input value. |
| `disabled` | `boolean` | `false` | Disables the input. |
| `oninput` | `(event: Event) => void` | | Native input handler. |
| `onchange` | `(event: Event) => void` | | Native change handler. |
| `type` | `QuestionnaireInputType` | `'text'` | A text-entry type such as `'email'`, `'number'`, or `'date'`. |
| `render` | `Snippet<[props, state]>` | `<input>` | Custom render target with input state. |

The render state contains `disabled`, `filled`, and `invalid`.

### QuestionnaireError

The validation message. It is hidden until its item fails validation.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `Snippet` | contextual message | Custom validation message. |
| `render` | `Snippet<[props, state, children]>` | `<p>` | Custom render target with invalid state. |

### Navigation actions

`QuestionnairePrevious`, `QuestionnaireSkip`, `QuestionnaireNext`, and `QuestionnaireSubmit` render native buttons and stay mounted while their visibility changes.

| Part | Default type | Visible when | Disabled when |
| --- | --- | --- | --- |
| `QuestionnairePrevious` | `button` | Not on the first item. | You set `disabled`. |
| `QuestionnaireSkip` | `button` | Active item is optional. | You set `disabled`. |
| `QuestionnaireNext` | `button` | Not on the last item. | You set `disabled`. |
| `QuestionnaireSubmit` | `submit` | On the last item. | You set `disabled`. |

Each accepts the native button attributes and:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `ButtonProps['size']` | `'default'` | Button size. |
| `variant` | `ButtonProps['variant']` | `'outline'` for Previous and Skip, `'default'` for Next and Submit | Button variant. |
| `children` | `Snippet` | The part's name | Button label. |
| `render` | `Snippet<[props, state, children]>` | `<button>` | Custom render target with navigation state. |

The render state contains `visible`, `disabled`, `shortcut`, and the active item's `status`.
