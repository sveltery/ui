<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { fromAction } from 'svelte/attachments';
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Form, FormError } from '$registry/bases/base/ui/form';
  import { Input } from '$registry/bases/base/ui/input';

  const form = $derived(page.form);
</script>

<Form method="POST" errors={form?.errors} values={form?.values} {@attach fromAction(enhance)} class="w-full max-w-sm">
  <FieldGroup>
    <Field name="name">
      <FieldLabel>Name</FieldLabel>
      <Input required autocomplete="off" />
      <FieldError />
    </Field>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" required autocomplete="off" />
      <FieldDescription>Try taken@example.com to see an error from the server.</FieldDescription>
      <FieldError />
    </Field>
    <FormError />
    <Button type="submit">Sign up</Button>
    {#if form?.welcome}
      <p class="text-sm">Welcome, {form.welcome}.</p>
    {/if}
  </FieldGroup>
</Form>
