<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeCheckbox } from '$registry/bases/base/ui/native-checkbox';
  import { NativeSlider } from '$registry/bases/base/ui/native-slider';
  import { NativeSwitch } from '$registry/bases/base/ui/native-switch';
  import { preferencesSchema, topics } from '$lib/forms/preferences';
  import { savePreferences } from '$lib/forms/preferences.remote';

  const f = savePreferences.preflight(preferencesSchema);
</script>

<form {...f} class="w-full max-w-sm">
  <FieldGroup>
    <FieldSet>
      <FieldLegend variant="label">Email me about</FieldLegend>
      <FieldDescription>Pick none and leave the digest off to see an issue from the server.</FieldDescription>
      {#each topics as topic (topic)}
        <Field orientation="horizontal" data-invalid={!!f.fields.topics.issues()}>
          <NativeCheckbox id="remote-topic-{topic}" {...f.fields.topics.as('checkbox', topic)} />
          <FieldLabel for="remote-topic-{topic}" class="font-normal capitalize">{topic}</FieldLabel>
        </Field>
      {/each}
      <FieldError errors={f.fields.topics.issues()} />
    </FieldSet>
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel for="remote-digest">Weekly digest</FieldLabel>
        <FieldDescription>One email with everything.</FieldDescription>
      </FieldContent>
      <NativeSwitch id="remote-digest" {...f.fields.digest.as('checkbox')} />
    </Field>
    <Field>
      <FieldLabel for="remote-volume">Emails per week</FieldLabel>
      <NativeSlider id="remote-volume" {...f.fields.volume.as('range')} min={0} max={10} />
    </Field>
    <Field orientation="horizontal" data-invalid={!!f.fields.terms.issues()}>
      <NativeCheckbox id="remote-terms" {...f.fields.terms.as('checkbox')} />
      <FieldContent>
        <FieldLabel for="remote-terms">Accept the terms</FieldLabel>
        <FieldError errors={f.fields.terms.issues()} />
      </FieldContent>
    </Field>
    <Button type="submit" class="w-fit" disabled={f.pending > 0}>Save</Button>
    {#if f.result}
      <p class="text-sm">Saved {f.result.topics.length} topics, {f.result.volume} emails a week.</p>
    {/if}
  </FieldGroup>
</form>
