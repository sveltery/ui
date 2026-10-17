<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
  import { planSchema, plans } from '$lib/forms/plan';
  import { choosePlan } from '$lib/forms/plan.remote';

  const f = choosePlan.preflight(planSchema);
</script>

<form {...f} class="w-full max-w-sm">
  <FieldSet>
    <FieldLegend>Plan</FieldLegend>
    <FieldDescription>Enterprise shows an issue from the server.</FieldDescription>
    <NativeRadioGroup>
      {#each plans as plan (plan)}
        <Field orientation="horizontal" data-invalid={!!f.fields.plan.issues()}>
          <NativeRadio id="remote-plan-{plan}" {...f.fields.plan.as('radio', plan)} />
          <FieldLabel for="remote-plan-{plan}" class="font-normal capitalize">{plan}</FieldLabel>
        </Field>
      {/each}
    </NativeRadioGroup>
    <FieldError errors={f.fields.plan.issues()} />
  </FieldSet>
  <Button type="submit" class="mt-4" disabled={f.pending > 0}>Choose plan</Button>
  {#if f.result}
    <p class="mt-2 text-sm">You chose {f.result.plan}.</p>
  {/if}
</form>
