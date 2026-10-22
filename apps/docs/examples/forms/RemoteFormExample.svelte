<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Form, FormError } from '$registry/bases/base/ui/form';
  import { Input } from '$registry/bases/base/ui/input';
  import { signupSchema } from '$lib/forms/signup';
  import { signup } from '$lib/forms/signup.remote';

  const f = signup.preflight(signupSchema);
</script>

<Form form={f} class="w-full max-w-sm">
  <FieldGroup>
    <Field name="name">
      <FieldLabel>Name</FieldLabel>
      <Input {...f.fields.name.as('text')} required autocomplete="off" />
      <FieldError />
    </Field>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input {...f.fields.email.as('email')} required autocomplete="off" />
      <FieldDescription>Try taken@example.com to see an issue from the server.</FieldDescription>
      <FieldError />
    </Field>
    <FormError />
    <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
    {#if f.result}
      <p class="text-sm">Welcome, {f.result.welcome}.</p>
    {/if}
  </FieldGroup>
</Form>
