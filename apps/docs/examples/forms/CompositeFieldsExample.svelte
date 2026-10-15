<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@sveltery/ui/field';
  import { RadioGroup, RadioGroupItem } from '@sveltery/ui/radio-group';
  import { Slider } from '@sveltery/ui/slider';
  import { Switch } from '@sveltery/ui/switch';

  const plans = [
    { value: 'starter', label: 'Starter', description: 'For one project.' },
    { value: 'pro', label: 'Pro', description: 'For a growing team.' },
  ];
  let submitted = $state<Record<string, unknown> | null>(null);

  function submit(event: SubmitEvent & { currentTarget: HTMLFormElement }) {
    event.preventDefault();
    submitted = Object.fromEntries(new FormData(event.currentTarget));
  }
</script>

<form class="w-full max-w-sm" onsubmit={submit}>
  <FieldGroup>
    <FieldSet>
      <FieldLegend variant="label">Plan</FieldLegend>
      <RadioGroup name="plan" defaultValue="starter">
        {#each plans as plan (plan.value)}
          <FieldLabel for="plan-{plan.value}">
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>{plan.label}</FieldTitle>
                <FieldDescription>{plan.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={plan.value} id="plan-{plan.value}" />
            </Field>
          </FieldLabel>
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
    <Field orientation="horizontal">
      <Checkbox id="terms" name="terms" required />
      <FieldLabel for="terms">Accept the terms</FieldLabel>
    </Field>
    <Button type="submit">Continue</Button>
    {#if submitted}
      <pre class="text-xs">{JSON.stringify(submitted)}</pre>
    {/if}
  </FieldGroup>
</form>
