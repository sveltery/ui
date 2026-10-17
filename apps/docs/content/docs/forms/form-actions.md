---
title: Form actions
description: Use Field with a SvelteKit form action.
order: 2
---

A classic [form action](https://svelte.dev/docs/kit/form-actions) reads the request, runs your schema and returns the errors with `fail`. Each field shows its own errors from `form`. The form works without JavaScript, and `use:enhance` submits it in place when JavaScript runs.

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

Mark each field invalid when `form?.errors` has an entry under its name, and show the first error in `FieldError`. Pass each submitted value to the control's `defaultValue`, so that the input keeps what the user typed after a submit without JavaScript:

```svelte title="src/routes/signup/+page.svelte"
<script lang="ts">
  import { enhance } from '$app/forms';
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';

  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <Field data-invalid={!!form?.errors?.email}>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" required defaultValue={form?.values?.email} aria-invalid={!!form?.errors?.email} />
    {#if form?.errors?.email}
      <FieldError>{form.errors.email[0]}</FieldError>
    {/if}
  </Field>
  <Button type="submit">Sign up</Button>
  {#if form?.welcome}
    <p>Welcome, {form.welcome}.</p>
  {/if}
</form>
```

The browser checks `required` and `type` before the submit, so an invalid submit sends no request.
