---
title: Form actions
description: Use Field with a SvelteKit form action.
order: 2
---

A classic [form action](https://svelte.dev/docs/kit/form-actions) reads the request, runs your schema and returns the errors with `fail`. The page passes them to `Form`, and each field shows its own. The form works without JavaScript, and `use:enhance` submits it in place when JavaScript runs.

<ComponentPreview name="forms/FormActionExample" />

## The action

Read the values from `FormData` and validate them with your schema. On failure, return the values and a flat record of errors, keyed by field name. Errors that only the server can find go in the same record:

```ts title="src/routes/signup/+page.server.ts"
import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import { signupSchema } from '$lib/forms/signup';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const values = { name: String(data.get('name') ?? ''), email: String(data.get('email') ?? '') };
    const result = v.safeParse(signupSchema, values);
    if (!result.success) return fail(400, { values, errors: v.flatten<typeof signupSchema>(result.issues).nested });
    if (await isRegistered(result.output.email)) {
      return fail(400, { values, errors: { email: ['That email is already registered.'] } });
    }
    return { welcome: result.output.name };
  },
};
```

## The page

Pass `form?.errors` to `errors` on `Form`, and name each `Field` with `name`. `Form` gives each field the errors under its name. `FieldError` shows them, and the field and its control are marked invalid. `FieldLabel` and `FieldError` connect to the control with no `for` or `id`. Pass each submitted value to the control's `defaultValue`, so that the input keeps what the user typed after a submit without JavaScript:

```svelte title="src/routes/signup/+page.svelte"
<script lang="ts">
  import { enhance } from '$app/forms';
  import { fromAction } from 'svelte/attachments';
  import { Form, isSubmitBlocked } from '@sveltery/base/form';
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';

  let { form } = $props();
</script>

<Form
  method="POST"
  errors={form?.errors}
  {@attach fromAction(enhance, () => ({ formElement, cancel }) => {
    if (isSubmitBlocked(formElement)) cancel();
  })}
>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required defaultValue={form?.values?.email} />
    <FieldError />
  </Field>
  <Button type="submit">Sign up</Button>
  {#if form?.welcome}
    <p>Welcome, {form.welcome}.</p>
  {/if}
</Form>
```

`Form` renders a `<form>` element, so `use:enhance` goes on it as an attachment, through `fromAction`. Without JavaScript, the browser checks `required` and `type` before the submit. Once the page hydrates, `Form` runs those checks itself. It blocks an invalid submit with `preventDefault()` and focuses the first invalid field, as Base UI does. A server error also focuses its field, and clears when the user changes the field. `use:enhance` still sees the blocked submit and would send it, so its callback cancels the submit when `isSubmitBlocked` returns `true`. Call `isSubmitBlocked` before any `await`, since the next submit replaces its answer.
