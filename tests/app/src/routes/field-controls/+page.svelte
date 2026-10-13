<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldLabel } from '@sveltery/ui/field';
  import { Form } from '@sveltery/ui/form';
  import { NativeSelect, NativeSelectOption } from '@sveltery/ui/native-select';
  import { Textarea } from '@sveltery/ui/textarea';
  let country = $state('');
  let submitted = $state('');
  const filled = (message: string) => (value: unknown) => (value ? null : message);
</script>
<Form onFormSubmit={values => (submitted = JSON.stringify(values))}>
  <Field name="bio" validate={filled('Write a short bio.')}>
    <FieldLabel>Bio</FieldLabel>
    <Textarea defaultValue="Hello" />
    <FieldDescription>Shown on your profile.</FieldDescription>
    <FieldError />
  </Field>
  <Field name="country" validate={filled('Choose a country.')}>
    <FieldLabel>Country</FieldLabel>
    <NativeSelect bind:value={country}>
      <NativeSelectOption value="">Select a country</NativeSelectOption>
      <NativeSelectOption value="ca">Canada</NativeSelectOption>
      <NativeSelectOption value="fr">France</NativeSelectOption>
    </NativeSelect>
    <FieldError />
  </Field>
  <Field name="notes" disabled>
    <FieldLabel>Notes</FieldLabel>
    <Textarea />
  </Field>
  <Field name="region" disabled>
    <FieldLabel>Region</FieldLabel>
    <NativeSelect>
      <NativeSelectOption value="eu">Europe</NativeSelectOption>
    </NativeSelect>
  </Field>
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</Form>
<output data-testid="country">{country}</output>
<output data-testid="submitted">{submitted}</output>
