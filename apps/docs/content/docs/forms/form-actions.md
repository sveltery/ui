---
title: Form actions
description: Bind Form and Field to a SvelteKit form action.
order: 2
---

A classic [form action](https://svelte.dev/docs/kit/form-actions) works like a [remote form](/docs/forms/remote-forms). `actionForm` from `@sveltery/base/form/kit` builds a form source from the page's `form` prop, and `parseForm` reads the request on the server with the same field encoding. The `Field` markup does not change.

<ComponentPreview name="forms/FormActionExample" />

## The action

Call `parseForm` with the request and the schema, and return `submission.fail()` to send the issues back. Pass it more issues, built with `submission.issue`, or a string for an issue on the whole form:

```ts title="src/routes/signup/+page.server.ts"
import { parseForm } from '@sveltery/base/form/kit';
import { signupSchema } from '$lib/forms/signup';

export const actions = {
  default: async ({ request }) => {
    const submission = await parseForm(request, signupSchema);
    if (!submission.ok) return submission.fail();
    if (await isRegistered(submission.data.email)) {
      return submission.fail(submission.issue.email('That email is already registered.'));
    }
    return { welcome: submission.data.name };
  },
};
```

## The page

Pass `form` to `actionForm` as a getter, so that the source follows each new value of the prop:

```svelte title="src/routes/signup/+page.svelte"
<script lang="ts">
  import { actionForm } from '@sveltery/base/form/kit';
  import { Field, FieldError, FieldLabel } from '$lib/components/ui/field';
  import { Form, FormError } from '$lib/components/ui/form';
  import { signupSchema } from '$lib/forms/signup';

  let { form } = $props();
  const f = actionForm(signupSchema, () => form);
</script>

<Form form={f}>
  <FormError />
  <Field field={f.fields.email} type="email">
    <FieldLabel>Email</FieldLabel>
    <Input required />
    <FieldError />
  </Field>
  <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
  {#if f.result}
    <p>Welcome, {f.result.welcome}.</p>
  {/if}
</Form>
```

`actionForm` runs `use:enhance` for you, so do not add it. The schema runs in the browser before each submit, and only a valid submit reaches the server. For a named action, pass its name, as in `actionForm(schema, () => form, { action: 'signup' })`.
