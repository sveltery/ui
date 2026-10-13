<script lang="ts">
  import { Field, FieldDescription, FieldError, FieldItem, FieldLabel, FieldLegend, FieldSet } from '$ui/field/index.js';
  import { Form, FormError, type FormErrors } from '$ui/form/index.js';
  import { Input } from '$ui/input/index.js';
  import { Checkbox } from '$ui/checkbox/index.js';
  import { Switch } from '$ui/switch/index.js';
  import { RadioGroup, RadioGroupItem } from '$ui/radio-group/index.js';
  let { submits = [] }: { submits?: Record<string, unknown>[] } = $props();
  let errors = $state<FormErrors>({});
  export function setErrors(next: FormErrors) { errors = next; }
</script>
<Form bind:errors onFormSubmit={(values) => submits.push(values)}>
  <FormError />
  <Field name="email" class="extra-field">
    <FieldLabel>Email</FieldLabel>
    <Input type="email" required />
    <FieldDescription>We send the receipt here.</FieldDescription>
    <FieldError />
  </Field>
  <Field name="agree" orientation="horizontal">
    <Checkbox />
    <FieldLabel>Accept the terms</FieldLabel>
  </Field>
  <Field name="newsletter" orientation="horizontal">
    <Switch />
    <FieldLabel>Newsletter</FieldLabel>
  </Field>
  <Field name="plan">
    <FieldSet>
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup defaultValue="free">
        <FieldItem><RadioGroupItem value="free" /><FieldLabel>Free</FieldLabel></FieldItem>
        <FieldItem><RadioGroupItem value="pro" /><FieldLabel>Pro</FieldLabel></FieldItem>
      </RadioGroup>
    </FieldSet>
  </Field>
  <button>Submit</button>
</Form>
