<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '$ui/field/index.js';
  import { Checkbox } from '$ui/checkbox/index.js';
</script>
<FieldSet>
  <FieldLegend>Notifications</FieldLegend>
  <FieldDescription>Choose what we email you.</FieldDescription>
  <FieldLabel>
    <Field orientation="horizontal">
      <Checkbox name="updates" />
      <FieldContent>
        <FieldTitle>Product updates</FieldTitle>
        <FieldDescription>Once a month.</FieldDescription>
      </FieldContent>
    </Field>
  </FieldLabel>
</FieldSet>
