---
title: Form actions
description: Use Field with a SvelteKit form action.
order: 2
---

A classic [form action](https://svelte.dev/docs/kit/form-actions) reads the request, runs your schema and returns the errors with `fail`. The page passes them to `Form` and to each field. The form works without JavaScript, and `use:enhance` submits it in place when JavaScript runs.

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

Pass `form?.errors` to `errors` on `Form`. Give each field its messages, and set `data-invalid` on `Field` and `aria-invalid` on its control. Set `value` from `form?.values`, so that the input keeps what the user typed after a submit without JavaScript:

```svelte title="src/routes/signup/+page.svelte"
<script lang="ts">
  import { enhance } from '$app/forms';
  import { fromAction } from 'svelte/attachments';
  import { Form } from '@sveltery/base/form';
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Input } from '$lib/components/ui/input';

  let { form } = $props();
  const errors = (messages: string[] | undefined) => messages?.map((message) => ({ message }));
</script>

<Form method="POST" errors={form?.errors} {@attach fromAction(enhance)}>
  <Field data-invalid={!!form?.errors?.email}>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" name="email" type="email" value={form?.values?.email} aria-invalid={!!form?.errors?.email} required />
    <FieldError errors={errors(form?.errors?.email)} />
  </Field>
  <Button type="submit">Sign up</Button>
  {#if form?.welcome}
    <p>Welcome, {form.welcome}.</p>
  {/if}
</Form>
```

`Form` renders a `<form>` element, so `use:enhance` goes on it as an attachment, through `fromAction`. Without JavaScript, the browser checks `required` and `type` before the submit. Once the page hydrates, `Form` turns that check off and the action validates every submit.
