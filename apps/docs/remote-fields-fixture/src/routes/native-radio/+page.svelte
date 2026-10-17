<!-- Design D: shadcn-styled native radios that take Kit's `.as('radio', option)` spread as they are. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
  import { planForm as f } from './plan.remote';
  const plans = ['free', 'pro', 'team'];
  let hydrated = $state(false);
  onMount(() => { hydrated = true; });
</script>
<main data-hydrated={hydrated}>
  <form {...f}>
    <span id="plan-label">Plan</span>
    <NativeRadioGroup aria-labelledby="plan-label" data-testid="group">
      {#each plans as plan (plan)}
        <label><NativeRadio {...f.fields.plan.as('radio', plan)} data-testid="radio-{plan}" />{plan}</label>
      {/each}
    </NativeRadioGroup>
    {#each f.fields.plan.issues() ?? [] as issue (issue.message)}<p data-testid="error">{issue.message}</p>{/each}
    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
  <pre data-testid="debug">{JSON.stringify({ result: f.result ?? null, kit: f.fields.value() })}</pre>
</main>
