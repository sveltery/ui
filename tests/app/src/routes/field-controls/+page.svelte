<script lang="ts">
  import { Field, FieldDescription, FieldLabel } from '@sveltery/ui/field';
  import { NativeSelect, NativeSelectOption } from '@sveltery/ui/native-select';
  import { Textarea } from '@sveltery/ui/textarea';
  let country = $state('');
</script>
<form>
  <Field>
    <FieldLabel for="bio">Bio</FieldLabel>
    <Textarea id="bio" name="bio" defaultValue="Hello" aria-describedby="bio-description" />
    <FieldDescription id="bio-description">Shown on your profile.</FieldDescription>
  </Field>
  <Field>
    <FieldLabel for="country">Country</FieldLabel>
    <NativeSelect id="country" name="country" bind:value={country}>
      <NativeSelectOption value="">Select a country</NativeSelectOption>
      <NativeSelectOption value="ca">Canada</NativeSelectOption>
      <NativeSelectOption value="fr">France</NativeSelectOption>
    </NativeSelect>
  </Field>
  <button type="reset">Reset</button>
</form>
<output data-testid="country">{country}</output>
