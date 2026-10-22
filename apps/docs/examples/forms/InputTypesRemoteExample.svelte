<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Form } from '$registry/bases/base/ui/form';
  import { Input } from '$registry/bases/base/ui/input';
  import { demoCode, profileSchema } from '$lib/forms/profile';
  import { saveProfile } from '$lib/forms/profile.remote';

  const f = saveProfile.preflight(profileSchema);
</script>

<!-- A file field needs the multipart encoding, which the form does not set for you. -->
<Form form={f} enctype="multipart/form-data" class="w-full max-w-sm">
  <FieldGroup>
    <Field name="birthday">
      <FieldLabel>Birthday</FieldLabel>
      <Input {...f.fields.birthday.as('date')} required />
      <FieldError />
    </Field>
    <Field name="accent">
      <FieldLabel>Accent color</FieldLabel>
      <Input {...f.fields.accent.as('color')} class="w-16 p-1" />
    </Field>
    <Field name="avatar">
      <FieldLabel>Avatar</FieldLabel>
      <Input {...f.fields.avatar.as('file')} accept="image/*" />
    </Field>
    <Field name="code">
      <FieldLabel>Verification code</FieldLabel>
      <Input {...f.fields.code.as('text')} inputmode="numeric" autocomplete="one-time-code" maxlength={6} pattern={'\\d{6}'} required class="font-mono tracking-[0.5em]" />
      <FieldDescription>The demo accepts {demoCode}.</FieldDescription>
      <FieldError />
    </Field>
    <Button type="submit" class="w-fit" disabled={f.pending > 0}>Save profile</Button>
    {#if f.result}
      <p class="text-sm">Saved{f.result.avatar ? ` with ${f.result.avatar}` : ''}.</p>
    {/if}
  </FieldGroup>
</Form>
