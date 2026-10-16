<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Checkbox } from '@sveltery/components/checkbox';
  import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldItem, FieldLabel, FieldLegend, FieldSet } from '@sveltery/components/field';
  import { Form } from '@sveltery/components/form';
  import { RadioGroup, RadioGroupItem } from '@sveltery/components/radio-group';
  import { Slider } from '@sveltery/components/slider';
  import { Switch } from '@sveltery/components/switch';

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
