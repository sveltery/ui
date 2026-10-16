<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldItem, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { Form } from '$registry/bases/base/ui/form';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  import { Slider } from '$registry/bases/base/ui/slider';
  import { Switch } from '$registry/bases/base/ui/switch';

  const plans = [
    { value: 'starter', label: 'Starter', description: 'For one project.' },
    { value: 'pro', label: 'Pro', description: 'For a growing team.' },
  ];
  let submitted = $state<Record<string, unknown> | null>(null);
</script>

<Form class="w-full max-w-sm" onFormSubmit={(values) => (submitted = values)}>
  <FieldGroup>
    <Field name="plan">
      <FieldSet>
        <FieldLegend variant="label">Plan</FieldLegend>
        <RadioGroup defaultValue="starter">
          {#each plans as plan (plan.value)}
            <FieldItem>
              <RadioGroupItem value={plan.value} />
              <FieldContent>
                <FieldLabel>{plan.label}</FieldLabel>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
            </FieldItem>
          {/each}
        </RadioGroup>
      </FieldSet>
    </Field>
    <Field name="seats">
      <FieldLabel>Seats</FieldLabel>
      <Slider defaultValue={5} min={1} max={20} />
    </Field>
    <Field name="newsletter" orientation="horizontal">
      <FieldContent>
        <FieldLabel>Newsletter</FieldLabel>
        <FieldDescription>Product news once a month.</FieldDescription>
      </FieldContent>
      <Switch />
    </Field>
    <Field name="terms" orientation="horizontal" validate={(value) => (value ? null : 'Accept the terms to continue.')}>
      <Checkbox />
      <FieldContent>
        <FieldLabel>Accept the terms</FieldLabel>
        <FieldError />
      </FieldContent>
    </Field>
    <Button type="submit">Continue</Button>
    {#if submitted}
      <pre class="text-xs">{JSON.stringify(submitted)}</pre>
    {/if}
  </FieldGroup>
</Form>
