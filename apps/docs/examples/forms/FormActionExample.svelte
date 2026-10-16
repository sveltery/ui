<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { fromAction } from 'svelte/attachments';
  import { Form, isSubmitBlocked } from '@sveltery/base/form';
  import { Button } from '@sveltery/components/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { Input } from '@sveltery/components/input';

  const form = $derived(page.form);
</script>

<Form
  method="POST"
  errors={form?.errors}
  {@attach fromAction(enhance, () => ({ formElement, cancel }) => {
    if (isSubmitBlocked(formElement)) cancel();
  })}
  class="w-full max-w-sm"
>
  <FieldGroup>
    <Field name="name">
      <FieldLabel>Name</FieldLabel>
      <Input required autocomplete="off" defaultValue={form?.values?.name} />
      <FieldError />
    </Field>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" required autocomplete="off" defaultValue={form?.values?.email} />
      <FieldDescription>Try taken@example.com to see an error from the server.</FieldDescription>
      <FieldError />
    </Field>
    <Button type="submit">Sign up</Button>
    {#if form?.welcome}
      <p class="text-sm">Welcome, {form.welcome}.</p>
    {/if}
  </FieldGroup>
</Form>
