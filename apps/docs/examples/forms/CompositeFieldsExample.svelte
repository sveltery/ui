<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  import { Slider } from '$registry/bases/base/ui/slider';
  import { Switch } from '$registry/bases/base/ui/switch';

  const plans = [
    { value: 'starter', label: 'Starter', description: 'For one project.' },
    { value: 'pro', label: 'Pro', description: 'For a growing team.' },
  ];
  let termsInvalid = $state(false);
  let submitted = $state<Record<string, unknown> | null>(null);

  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    termsInvalid = !values.terms;
    submitted = termsInvalid ? null : values;
  }
</script>

<form class="w-full max-w-sm" onsubmit={submit}>
  <FieldGroup>
    <FieldSet>
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup name="plan" defaultValue="starter">
        {#each plans as plan (plan.value)}
          <Field orientation="horizontal">
            <RadioGroupItem value={plan.value} id="plan-{plan.value}" />
            <FieldContent>
              <FieldLabel for="plan-{plan.value}">{plan.label}</FieldLabel>
              <FieldDescription>{plan.description}</FieldDescription>
            </FieldContent>
          </Field>
        {/each}
      </RadioGroup>
    </FieldSet>
    <Field>
      <FieldLabel for="seats">Seats</FieldLabel>
      <Slider id="seats" name="seats" defaultValue={5} min={1} max={20} />
    </Field>
    <Field orientation="horizontal">
      <FieldContent>
        <FieldLabel for="newsletter">Newsletter</FieldLabel>
        <FieldDescription>Product news once a month.</FieldDescription>
      </FieldContent>
      <Switch id="newsletter" name="newsletter" />
    </Field>
    <Field orientation="horizontal" data-invalid={termsInvalid}>
      <Checkbox id="terms" name="terms" aria-invalid={termsInvalid} onCheckedChange={() => (termsInvalid = false)} />
      <FieldContent>
        <FieldLabel for="terms">Accept the terms</FieldLabel>
        {#if termsInvalid}
          <FieldError>Accept the terms to continue.</FieldError>
        {/if}
      </FieldContent>
    </Field>
    <Button type="submit">Continue</Button>
    {#if submitted}
      <pre class="text-xs">{JSON.stringify(submitted)}</pre>
    {/if}
  </FieldGroup>
</form>
