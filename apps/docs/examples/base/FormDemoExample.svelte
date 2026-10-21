<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Form } from '$registry/bases/base/ui/form';
  import { Input } from '$registry/bases/base/ui/input';
  import { Textarea } from '$registry/bases/base/ui/textarea';

  let sent = $state<string | null>(null);
</script>

<Form
  class="w-full max-w-sm"
  onsubmit={(event) => {
    event.preventDefault();
    sent = String(new FormData(event.currentTarget).get('email'));
  }}
>
  <FieldGroup>
    <Field name="email">
      <FieldLabel>Email</FieldLabel>
      <Input type="email" required placeholder="you@example.com" />
      <FieldError />
    </Field>
    <Field name="message" validate={(value) => (String(value ?? '').trim().split(/\s+/).length < 3 ? 'Write at least three words.' : null)}>
      <FieldLabel>Message</FieldLabel>
      <Textarea required />
      <FieldDescription>Submit it empty or with one word to see the messages.</FieldDescription>
      <FieldError />
    </Field>
    <Button type="submit" class="w-fit">Send</Button>
    {#if sent}
      <p class="text-sm">Sent from {sent}.</p>
    {/if}
  </FieldGroup>
</Form>
