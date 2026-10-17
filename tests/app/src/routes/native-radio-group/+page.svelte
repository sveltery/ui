<script lang="ts">
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
  // Each state once for Radio Group and once for Native Radio Group, so a test can compare them.
  const states = [
    { id: 'unchecked', checked: false },
    { id: 'checked', checked: true },
    { id: 'invalid', checked: false, invalid: true },
    { id: 'invalid-checked', checked: true, invalid: true },
    { id: 'disabled', checked: false, disabled: true },
    { id: 'disabled-checked', checked: true, disabled: true },
  ];
</script>
<div class="grid grid-cols-[auto_repeat(6,4rem)] items-center gap-4 p-6" data-testid="grid">
  <span></span>
  {#each states as state (state.id)}<span class="text-xs">{state.id}</span>{/each}
  <span class="text-xs">RadioGroup</span>
  {#each states as state (state.id)}
    <RadioGroup aria-label={state.id} defaultValue={state.checked ? 'on' : undefined}>
      <RadioGroupItem value="on" data-testid="base-{state.id}" aria-invalid={state.invalid || undefined} disabled={state.disabled} />
    </RadioGroup>
  {/each}
  <span class="text-xs">NativeRadioGroup</span>
  {#each states as state (state.id)}
    <NativeRadioGroup aria-label={state.id}>
      <NativeRadio name="native-{state.id}" value="on" data-testid="native-{state.id}" defaultChecked={state.checked} aria-invalid={state.invalid || undefined} disabled={state.disabled} />
    </NativeRadioGroup>
  {/each}
</div>
