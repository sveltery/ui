---
title: Remote forms
description: Use Field with a SvelteKit remote form.
order: 1
---

Pass a SvelteKit [remote form](https://svelte.dev/docs/kit/remote-functions#form) to [Form](/docs/components/form), name each `Field` by its field's path, and spread each field onto its control with `as()`. The remote form owns the values and the issues. Each `Field` reads its own issues by its `name`, and `FormError` shows the issues that belong to no field.

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
  import { Button } from '#lib/components/ui/button';
  import { Field, FieldError, FieldLabel } from '#lib/components/ui/field';
  import { Form, FormError } from '#lib/components/ui/form';
  import { Input } from '#lib/components/ui/input';
  import { signupSchema } from '#lib/forms/signup';
  import { signup } from '#lib/forms/signup.remote';

  const f = signup.preflight(signupSchema);
</script>

<Form form={f}>
  <Field name="email">
    <FieldLabel>Email</FieldLabel>
    <Input {...f.fields.email.as('email')} required />
    <FieldError />
  </Field>
  <FormError />
  <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
</Form>
```

`Form` takes the remote form's `method`, `action` and submit handling. `as()` gives the control the field's `name`, `type` and value, and TypeScript checks the path and the type against the schema. `Field`'s `name` is a plain string that TypeScript does not check. In development, `Field` warns in the console when it differs from the path in the control's spread.

`Field` marks itself and its control invalid while the field has issues, also in the server HTML. `FieldError` shows the issues, and renders nothing while there are none. Editing the field hides its issues until the next submit. When the handler returns, `f.result` holds its return value and the form resets.

The form also works before the page hydrates and with JavaScript off. The browser checks the constraints, the form posts to the server, and the page renders again with the issues in each `FieldError`.

Don't name `value` or `checked` after a spread, as in `{...f.fields.email.as('email')} value="x"`: SvelteKit's accessors for them cannot be overridden, and the server render throws. Pass a default to `as()` instead, as in `as('email', 'ada@example.com')`.

## Controls

`as()` describes a native input, so it spreads onto a control that renders one. Name the `Field` around each of them, so that its `FieldError` shows the field's issues: [Input](/docs/components/input#remote-forms), [Textarea](/docs/components/textarea), [Native Select](/docs/components/native-select#remote-forms), [Native Checkbox](/docs/components/native-checkbox#remote-forms), [Native Switch](/docs/components/native-switch#remote-forms), [Native Radio Group](/docs/components/native-radio-group#remote-forms) and [Native Slider](/docs/components/native-slider#remote-forms). `InputGroupInput`, `InputGroupTextarea` and `Button` with `as('submit', value)` take it as well.
