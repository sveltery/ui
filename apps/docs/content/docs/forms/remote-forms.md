---
title: Remote forms
description: Use Field with a SvelteKit remote form.
order: 1
---

Spread a SvelteKit [remote form](https://svelte.dev/docs/kit/remote-functions#form) onto a `<form>`, and each of its fields onto its control with `as()`. The remote form owns the values and the issues, and each `Field` shows its own issues.

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
  import { Input } from '$lib/components/ui/input';
  import { signupSchema } from '$lib/forms/signup';
  import { signup } from '$lib/forms/signup.remote';

  const f = signup.preflight(signupSchema);
</script>

<form {...f}>
  <Field data-invalid={!!f.fields.email.issues()}>
    <FieldLabel for="email">Email</FieldLabel>
    <Input id="email" {...f.fields.email.as('email')} required />
    <FieldError errors={f.fields.email.issues()} />
  </Field>
  <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
</form>
```

`as()` gives the control the field's `name`, `type`, value and `aria-invalid`. `FieldError` shows the field's issues, and renders nothing while there are none. When the handler returns, `f.result` holds its return value and the form resets.

The form also works before the page hydrates and with JavaScript off: the browser checks the constraints, the form posts to the server, and the page renders again with the issues.
