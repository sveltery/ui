<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/state';
  import { fromAction } from 'svelte/attachments';
  import { Form } from '@sveltery/base/form';
  import { Button } from '@sveltery/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';

  const form = $derived(page.form);
  const errors = (messages: string[] | undefined) => messages?.map((message) => ({ message }));
</script>

<Form method="POST" errors={form?.errors} {@attach fromAction(enhance)} class="w-full max-w-sm">
  <FieldGroup>
    <Field data-invalid={!!form?.errors?.name}>
      <FieldLabel for="action-name">Name</FieldLabel>
      <Input id="action-name" name="name" value={form?.values?.name} aria-invalid={!!form?.errors?.name} required autocomplete="off" />
      <FieldError errors={errors(form?.errors?.name)} />
    </Field>
    <Field data-invalid={!!form?.errors?.email}>
      <FieldLabel for="action-email">Email</FieldLabel>
      <Input id="action-email" name="email" type="email" value={form?.values?.email} aria-invalid={!!form?.errors?.email} required autocomplete="off" />
      <FieldDescription>Try taken@example.com to see an error from the server.</FieldDescription>
      <FieldError errors={errors(form?.errors?.email)} />
    </Field>
    <Button type="submit">Sign up</Button>
    {#if form?.welcome}
      <p class="text-sm">Welcome, {form.welcome}.</p>
    {/if}
  </FieldGroup>
</Form>
