<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { demoCode, profileSchema } from '$lib/forms/profile';
  import { saveProfile } from '$lib/forms/profile.remote';

  const f = saveProfile.preflight(profileSchema);
</script>

<!-- A file field needs the multipart encoding, which the form does not set for you. -->
<form {...f} enctype="multipart/form-data" class="w-full max-w-sm">
  <FieldGroup>
    <Field data-invalid={!!f.fields.birthday.issues()}>
      <FieldLabel for="remote-birthday">Birthday</FieldLabel>
      <Input id="remote-birthday" {...f.fields.birthday.as('date')} required />
      <FieldError errors={f.fields.birthday.issues()} />
    </Field>
    <Field data-invalid={!!f.fields.accent.issues()}>
      <FieldLabel for="remote-accent">Accent color</FieldLabel>
      <Input id="remote-accent" {...f.fields.accent.as('color')} class="w-16 p-1" />
    </Field>
    <Field>
      <FieldLabel for="remote-avatar">Avatar</FieldLabel>
      <Input id="remote-avatar" {...f.fields.avatar.as('file')} accept="image/*" />
    </Field>
    <Field data-invalid={!!f.fields.code.issues()}>
      <FieldLabel for="remote-code">Verification code</FieldLabel>
      <Input id="remote-code" {...f.fields.code.as('text')} inputmode="numeric" autocomplete="one-time-code" maxlength={6} pattern={'\\d{6}'} required class="font-mono tracking-[0.5em]" />
      <FieldDescription>The demo accepts {demoCode}.</FieldDescription>
      <FieldError errors={f.fields.code.issues()} />
    </Field>
    <Button type="submit" class="w-fit" disabled={f.pending > 0}>Save profile</Button>
    {#if f.result}
      <p class="text-sm">Saved{f.result.avatar ? ` with ${f.result.avatar}` : ''}.</p>
    {/if}
  </FieldGroup>
</form>
