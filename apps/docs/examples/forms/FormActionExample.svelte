<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';

  const form = $derived(page.form);
</script>

<form method="POST" use:enhance class="w-full max-w-sm">
  <FieldGroup>
    <Field data-invalid={!!form?.errors?.name}>
      <FieldLabel for="action-name">Name</FieldLabel>
      <Input id="action-name" name="name" required autocomplete="off" defaultValue={form?.values?.name} aria-invalid={!!form?.errors?.name} />
      {#if form?.errors?.name}
        <FieldError>{form.errors.name[0]}</FieldError>
      {/if}
    </Field>
    <Field data-invalid={!!form?.errors?.email}>
      <FieldLabel for="action-email">Email</FieldLabel>
      <Input id="action-email" name="email" type="email" required autocomplete="off" defaultValue={form?.values?.email} aria-invalid={!!form?.errors?.email} />
      <FieldDescription>Try taken@example.com to see an error from the server.</FieldDescription>
      {#if form?.errors?.email}
        <FieldError>{form.errors.email[0]}</FieldError>
      {/if}
    </Field>
    <Button type="submit">Sign up</Button>
    {#if form?.welcome}
      <p class="text-sm">Welcome, {form.welcome}.</p>
    {/if}
  </FieldGroup>
</form>
