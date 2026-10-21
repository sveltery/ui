# Forms & Inputs

The full guides are [Forms](https://ui.sveltery.dev/docs/forms.md), [Remote forms](https://ui.sveltery.dev/docs/forms/remote-forms.md), [Form actions](https://ui.sveltery.dev/docs/forms/form-actions.md) and [Field](https://ui.sveltery.dev/docs/components/field.md). They win over this page.

## Contents

- Forms use FieldGroup + Field
- Labels use `for` and `id`
- Form state lives in the form
- InputGroup requires InputGroupInput/InputGroupTextarea
- Buttons inside inputs use InputGroup + InputGroupAddon
- Option sets (2–7 choices) use ToggleGroup
- FieldSet + FieldLegend for grouping related fields
- Field validation and disabled states
- Forms that work without JavaScript

---

## Forms use FieldGroup + Field

Always use `FieldGroup` + `Field`. Never a raw `div` with `space-y-*`:

```svelte
<FieldGroup>
  <Field>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" />
  </Field>
  <Field>
    <FieldLabel for="password">Password</FieldLabel>
    <Input id="password" name="password" type="password" />
  </Field>
</FieldGroup>
```

Use `<Field orientation="horizontal">` for settings rows. Use `<FieldLabel class="sr-only">` for a visually hidden label.

**Choosing form controls:**

- Text → `Input`
- Dropdown with set options → `Select`
- Searchable dropdown → `Combobox`
- Native select (works without JavaScript) → `NativeSelect`
- Boolean → `Switch` (settings) or `Checkbox` (forms)
- One choice from a few → `RadioGroup`
- Toggle between 2–5 options → `ToggleGroup` + `ToggleGroupItem`
- One-time code → `InputOTP`
- Multi-line text → `Textarea`

---

## Labels use `for` and `id`

Svelte uses the HTML attribute. `htmlFor` is React and does nothing here.

**Incorrect:**

```svelte
<FieldLabel htmlFor="email">Email</FieldLabel>
```

**Correct:**

```svelte
<FieldLabel for="email">Email</FieldLabel>
<Input id="email" name="email" />
```

---

## Form state lives in the form

`Field` holds no form state. Give each control a `name`, and let one of these own the state:

- **A native `<form>`.** Read `new FormData(event.currentTarget)` in `onsubmit`.
- **A SvelteKit remote form.** Spread the field's `as()` onto the control.
- **A SvelteKit form action.** Read the errors from the `form` prop.

There is no React Hook Form or TanStack Form layer. Do not add one, and do not mirror every input in `$state` to submit it.

**Incorrect:**

```svelte
<script lang="ts">
  let email = $state('');
  let password = $state('');
  async function submit() {
    await fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  }
</script>

<div class="space-y-4">
  <Input bind:value={email} />
  <Input bind:value={password} type="password" />
  <Button onclick={submit}>Sign in</Button>
</div>
```

**Correct:**

```svelte
<form method="POST" action="?/login">
  <FieldGroup>
    <Field>
      <FieldLabel for="email">Email</FieldLabel>
      <Input id="email" name="email" type="email" required />
    </Field>
    <Field>
      <FieldLabel for="password">Password</FieldLabel>
      <Input id="password" name="password" type="password" required />
    </Field>
    <Button type="submit">Sign in</Button>
  </FieldGroup>
</form>
```

Use `bind:value` when the UI reads the value while the user types, not to collect it for submission.

---

## InputGroup requires InputGroupInput/InputGroupTextarea

Never use a raw `Input` or `Textarea` inside an `InputGroup`.

**Incorrect:**

```svelte
<InputGroup>
  <Input placeholder="Search..." />
</InputGroup>
```

**Correct:**

```svelte
<script lang="ts">
  import { InputGroup, InputGroupInput } from '#lib/components/ui/input-group';
</script>

<InputGroup>
  <InputGroupInput placeholder="Search..." />
</InputGroup>
```

---

## Buttons inside inputs use InputGroup + InputGroupAddon

Never position a `Button` over an `Input` by hand.

**Incorrect:**

```svelte
<div class="relative">
  <Input placeholder="Search..." class="pr-10" />
  <Button class="absolute top-0 right-0" size="icon">
    <SearchIcon />
  </Button>
</div>
```

**Correct:**

```svelte
<script lang="ts">
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '#lib/components/ui/input-group';
</script>

<InputGroup>
  <InputGroupInput placeholder="Search..." />
  <InputGroupAddon align="inline-end">
    <InputGroupButton size="icon-xs" aria-label="Search">
      <SearchIcon />
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>
```

---

## Option sets (2–7 choices) use ToggleGroup

Don't loop `Button` with a manual active state.

**Incorrect:**

```svelte
<script lang="ts">
  let selected = $state('daily');
</script>

<div class="flex gap-2">
  {#each ['daily', 'weekly', 'monthly'] as option (option)}
    <Button variant={selected === option ? 'default' : 'outline'} onclick={() => (selected = option)}>
      {option}
    </Button>
  {/each}
</div>
```

**Correct:**

```svelte
<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '#lib/components/ui/toggle-group';

  let frequency = $state(['daily']);
</script>

<ToggleGroup bind:value={frequency} variant="outline">
  <ToggleGroupItem value="daily">Daily</ToggleGroupItem>
  <ToggleGroupItem value="weekly">Weekly</ToggleGroupItem>
  <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
</ToggleGroup>
```

`value` is always an array. Without `multiple`, pressing an item releases the others. Add `multiple` for independent toggles.

With a label:

```svelte
<Field orientation="horizontal">
  <FieldTitle id="theme-label">Theme</FieldTitle>
  <ToggleGroup aria-labelledby="theme-label" variant="outline">
    <ToggleGroupItem value="light">Light</ToggleGroupItem>
    <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
    <ToggleGroupItem value="system">System</ToggleGroupItem>
  </ToggleGroup>
</Field>
```

---

## FieldSet + FieldLegend for grouping related fields

Use `FieldSet` + `FieldLegend` for related checkboxes, radios or switches, not a `div` with a heading:

```svelte
<FieldSet>
  <FieldLegend variant="label">Preferences</FieldLegend>
  <FieldDescription>Select all that apply.</FieldDescription>
  <FieldGroup class="gap-3">
    <Field orientation="horizontal">
      <Checkbox id="dark" name="dark" />
      <FieldLabel for="dark" class="font-normal">Dark mode</FieldLabel>
    </Field>
  </FieldGroup>
</FieldSet>
```

For a radio group, put `name` on `RadioGroup` and give each option its own horizontal `Field` and label.

---

## Field validation and disabled states

Both attributes are needed. `data-invalid`/`data-disabled` styles the field (label, description). `aria-invalid`/`disabled` styles the control. Show the message in `FieldError`.

```svelte
<!-- Invalid. -->
<Field data-invalid={emailInvalid}>
  <FieldLabel for="email">Email</FieldLabel>
  <Input id="email" name="email" aria-invalid={emailInvalid} />
  {#if emailInvalid}
    <FieldError>Enter a valid email address.</FieldError>
  {/if}
</Field>

<!-- Disabled. -->
<Field data-disabled>
  <FieldLabel for="email">Email</FieldLabel>
  <Input id="email" disabled />
</Field>
```

Prefer native validation first: `required`, `pattern`, `minlength`, `maxlength`, `min`, `max` and `step`. Check your own rules in the submit handler or on the server.

---

## Forms that work without JavaScript

`Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Select` and `ToggleGroup` need JavaScript. For a form that must work before hydration, use the native twins: `NativeCheckbox`, `NativeSwitch`, `NativeRadioGroup`, `NativeSlider` and `NativeSelect`. For dates, colors, files and codes, use `Input` with the native `type`.
