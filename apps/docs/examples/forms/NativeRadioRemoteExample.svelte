<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldItem, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { Form } from '$registry/bases/base/ui/form';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
  import { planSchema, plans } from '$lib/forms/plan';
  import { choosePlan } from '$lib/forms/plan.remote';

  const f = choosePlan.preflight(planSchema);
</script>

<Form form={f} class="w-full max-w-sm">
  <Field name="plan">
    <FieldSet>
      <FieldLegend>Plan</FieldLegend>
      <FieldDescription>Enterprise shows an issue from the server.</FieldDescription>
      <NativeRadioGroup>
        {#each plans as plan (plan)}
          <FieldItem>
            <NativeRadio id="remote-plan-{plan}" {...f.fields.plan.as('radio', plan)} />
            <FieldLabel for="remote-plan-{plan}" class="font-normal capitalize">{plan}</FieldLabel>
          </FieldItem>
        {/each}
      </NativeRadioGroup>
    </FieldSet>
    <FieldError />
  </Field>
  <Button type="submit" class="mt-4" disabled={f.pending > 0}>Choose plan</Button>
  {#if f.result}
    <p class="mt-2 text-sm">You chose {f.result.plan}.</p>
  {/if}
</Form>
