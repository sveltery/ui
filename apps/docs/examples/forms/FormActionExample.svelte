<script lang="ts">
  import { page } from '$app/state';
  import { actionForm } from '@sveltery/base/form/kit';
  import { Button } from '@sveltery/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Form, FormError } from '@sveltery/ui/form';
  import { Input } from '@sveltery/ui/input';
  import { signupSchema } from '$lib/forms/signup';

  const f = actionForm(signupSchema, () => page.form);
</script>

<Form form={f} class="w-full max-w-sm">
  <FieldGroup>
    <FormError />
    <Field field={f.fields.name}>
      <FieldLabel>Name</FieldLabel>
      <Input required autocomplete="off" />
      <FieldError />
    </Field>
    <Field field={f.fields.email} type="email">
      <FieldLabel>Email</FieldLabel>
      <Input required autocomplete="off" />
      <FieldDescription>Try taken@example.com to see an issue from the server.</FieldDescription>
      <FieldError />
    </Field>
    <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
    {#if f.result}
      <p class="text-sm">Welcome, {f.result.welcome}.</p>
    {/if}
  </FieldGroup>
</Form>
