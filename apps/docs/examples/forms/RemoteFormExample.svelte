<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { signupSchema } from '$lib/forms/signup';
  import { signup } from '$lib/forms/signup.remote';

  const f = signup.preflight(signupSchema);
</script>

<form {...f} class="w-full max-w-sm">
  <FieldGroup>
    <FieldError errors={f.fields.issues()} />
    <Field data-invalid={!!f.fields.name.issues()}>
      <FieldLabel for="remote-name">Name</FieldLabel>
      <Input id="remote-name" {...f.fields.name.as('text')} required autocomplete="off" />
      <FieldError errors={f.fields.name.issues()} />
    </Field>
    <Field data-invalid={!!f.fields.email.issues()}>
      <FieldLabel for="remote-email">Email</FieldLabel>
      <Input id="remote-email" {...f.fields.email.as('email')} required autocomplete="off" />
      <FieldDescription>Try taken@example.com to see an issue from the server.</FieldDescription>
      <FieldError errors={f.fields.email.issues()} />
    </Field>
    <Button type="submit" disabled={f.pending > 0}>Sign up</Button>
    {#if f.result}
      <p class="text-sm">Welcome, {f.result.welcome}.</p>
    {/if}
  </FieldGroup>
</form>
