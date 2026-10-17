<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '$registry/bases/base/ui/field';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
</script>

<RadioGroup defaultValue="plus" class="max-w-sm">
  <FieldLabel for="plus-plan">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Plus</FieldTitle>
        <FieldDescription>For individuals and small teams.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="plus" id="plus-plan" />
    </Field>
  </FieldLabel>
  <FieldLabel for="pro-plan">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Pro</FieldTitle>
        <FieldDescription>For growing businesses.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="pro" id="pro-plan" />
    </Field>
  </FieldLabel>
  <FieldLabel for="enterprise-plan">
    <Field orientation="horizontal">
      <FieldContent>
        <FieldTitle>Enterprise</FieldTitle>
        <FieldDescription>For large teams and enterprises.</FieldDescription>
      </FieldContent>
      <RadioGroupItem value="enterprise" id="enterprise-plan" />
    </Field>
  </FieldLabel>
</RadioGroup>
