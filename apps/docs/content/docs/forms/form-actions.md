---
title: Form actions
description: Use Field with a SvelteKit form action.
order: 2
---

A classic [form action](https://svelte.dev/docs/kit/form-actions) reads the request, runs your schema and returns the errors with `fail`. Pass them to [Form](/docs/components/form) as `errors`, and each `Field` shows the errors under its `name`. The form works without JavaScript, and `enhance` submits it in place when JavaScript runs.

<ComponentPreview name="forms/FormActionExample" />

## The action

Read the values from `FormData` and validate them with your schema. On failure, return the values and a flat record of errors, keyed by field name. Errors that only the server can find go in the same record. An error under the empty key `''` belongs to the whole form:

```ts title="src/routes/signup/+page.server.ts"
import { fail } from '@sveltejs/kit';
import * as v from 'valibot';
import { signupSchema } from '#lib/forms/signup';

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

Pass `form?.errors` to `Form` as `errors` and `form?.values` as `values`. Each `Field` gives its `name` to its control, marks itself invalid while `errors` has an entry under that name, and shows the entry in `FieldError`. `values` fills each control by name, so the input keeps what the user typed after a submit without JavaScript. `use:` does not work on a component, so attach `enhance` with `fromAction`:

```svelte title="src/routes/signup/+page.svelte"
<script lang="ts">
  import { enhance } from '$app/forms';
  import { fromAction } from 'svelte/attachments';
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '#lib/components/ui/field';
  import { Form, FormError } from '#lib/components/ui/form';
  import { Input } from '#lib/components/ui/input';

  let { form } = $props();
</script>

<Form method="POST" errors={form?.errors} values={form?.values} {@attach fromAction(enhance)}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldError />
  </Field>
  <FormError />
  <Button type="submit">Sign up</Button>
  {#if form?.welcome}
    <p>Welcome, {form.welcome}.</p>
  {/if}
</Form>
```

Editing a field hides its error until the next submit.

The browser checks `required` and `type` before the submit, so an invalid submit sends no request.
