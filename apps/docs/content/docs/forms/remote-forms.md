---
title: Remote forms
description: Bind Form and Field to a SvelteKit remote form.
order: 1
---

Pass a SvelteKit [remote form](https://svelte.dev/docs/kit/remote-functions#form) to `form` on `Form`, and each of its fields to `field` on a `Field`. The remote form owns the values and the issues. Each `Field` shows its issues, and `Form` sends the submit through the remote form.

<ComponentPreview name="forms/RemoteFormExample" />

## Set up

Remote functions are experimental in SvelteKit. Turn them on in `vite.config.ts`:

```ts
sveltekit({ experimental: { remoteFunctions: true } });
```

Put the schema in its own module, so that the server and the page can both import it. Any [Standard Schema](https://standardschema.dev) library works. This example uses Valibot.

```ts title="src/lib/forms/signup.ts"
import * as v from 'valibot';

export const signupSchema = v.object({
  name: v.pipe(v.string(), v.minLength(2, 'Use at least 2 characters.')),
  email: v.pipe(v.string(), v.email('Enter a valid email address.')),
});
```

Create the remote form with `form(schema, handler)`. Call `invalid` with an issue on a field, or with a message for the whole form:

```ts title="src/lib/forms/signup.remote.ts"
import { form } from '$app/server';
import { invalid } from '@sveltejs/kit';
import { signupSchema } from './signup';

export const signup = form(signupSchema, async (data, issue) => {
  if (await isRegistered(data.email)) invalid(issue.email('That email is already registered.'));
  return { welcome: data.name };
});
```

## The page

`preflight` runs the same schema in the browser before each submit, so an invalid submit sends no request:

```svelte
<script lang="ts">
  import { Button } from '$lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Form, FormError } from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { signupSchema } from '$lib/forms/signup';
  import { signup } from '$lib/forms/signup.remote';

  const f = signup.preflight(signupSchema);
</script>

<Form form={f}>
  <FormError />
  <Field field={f.fields.email} type="email">
    <FieldLabel>Email</FieldLabel>
    <Input required />
    <FieldError />
  </Field>
  <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
</Form>
```

`Form` spreads the remote form onto its `<form>`, and each `Field` gives its control the field's `name`, `type`, value and `aria-invalid`, so do not set them on the control. The label, the description and `FieldError` link to the control without `for` or `id`. `FormError` shows the issues on the whole form. `type` on `Field` is the input type of its control, and TypeScript checks it against the field's value: a `number` field needs `type="number"` or `type="range"`, and a `boolean` field `type="checkbox"` or `type="switch"`.

A submit checks the native constraints and the preflight schema, then runs the handler on the server. When a constraint fails, `Form` blocks the submit and no request is sent, but the preflight still runs, so the schema's message shows in the field. Each issue shows in its field, and `Form` focuses the first invalid field. When the handler returns, `f.result` holds its return value and the form resets.

The form also works before the page hydrates and with JavaScript off: the browser checks the constraints, the form posts to the server, and the page renders again with the issues.

## Without Form

A plain `<form {...f}>` still works. Spread each field onto its control with `as()`, and pass its issues to `FieldError`:

```svelte
<form {...f}>
  <Field data-invalid={!!f.fields.email.issues()}>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" {...f.fields.email.as('email')} required />
    <FieldError errors={f.fields.email.issues()} />
  </Field>
</form>
```

Here you link each label to its control with `for` and `id` yourself, and a failed submit does not focus the first invalid field.
