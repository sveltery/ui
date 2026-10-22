<script lang="ts">
  import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
</script>

<FieldSet class="w-full max-w-xs">
  <FieldLegend variant="label">Notification Preferences</FieldLegend>
  <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
  <RadioGroup defaultValue="email">
    <Field orientation="horizontal" invalid>
      <RadioGroupItem value="email" id="invalid-email" aria-invalid />
      <FieldLabel for="invalid-email" class="font-normal">Email only</FieldLabel>
    </Field>
    <Field orientation="horizontal" invalid>
      <RadioGroupItem value="sms" id="invalid-sms" aria-invalid />
      <FieldLabel for="invalid-sms" class="font-normal">SMS only</FieldLabel>
    </Field>
    <Field orientation="horizontal" invalid>
      <RadioGroupItem value="both" id="invalid-both" aria-invalid />
      <FieldLabel for="invalid-both" class="font-normal">Both Email & SMS</FieldLabel>
    </Field>
  </RadioGroup>
</FieldSet>
