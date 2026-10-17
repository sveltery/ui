<script lang="ts">
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { Field, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeCheckbox } from '$registry/bases/base/ui/native-checkbox';
  import { NativeSlider } from '$registry/bases/base/ui/native-slider';
  import { NativeSwitch } from '$registry/bases/base/ui/native-switch';
  import { Slider } from '$registry/bases/base/ui/slider';
  import { Switch } from '$registry/bases/base/ui/switch';
  // Each state once on the Base control and once on its native twin, so a test can compare them.
  const states = [
    { id: 'unchecked', checked: false },
    { id: 'checked', checked: true },
    { id: 'invalid', checked: false, invalid: true },
    { id: 'invalid-checked', checked: true, invalid: true },
    { id: 'disabled', checked: false, disabled: true },
    { id: 'disabled-checked', checked: true, disabled: true },
  ];
  const sizes = ['default', 'sm'] as const;
</script>
<div class="grid gap-8 p-6">
  <div class="grid grid-cols-[auto_repeat(6,4rem)] items-center gap-4">
    <span class="text-xs">Checkbox</span>
    {#each states as state (state.id)}
      <Checkbox data-testid="base-checkbox-{state.id}" defaultChecked={state.checked} aria-invalid={state.invalid || undefined} disabled={state.disabled} />
    {/each}
    <span class="text-xs">NativeCheckbox</span>
    {#each states as state (state.id)}
      <NativeCheckbox data-testid="native-checkbox-{state.id}" defaultChecked={state.checked} aria-invalid={state.invalid || undefined} disabled={state.disabled} />
    {/each}
    {#each sizes as size (size)}
      <span class="text-xs">Switch {size}</span>
      {#each states as state (state.id)}
        <Switch {size} data-testid="base-switch-{size}-{state.id}" defaultChecked={state.checked} aria-invalid={state.invalid || undefined} disabled={state.disabled} />
      {/each}
      <span class="text-xs">NativeSwitch {size}</span>
      {#each states as state (state.id)}
        <NativeSwitch {size} data-testid="native-switch-{size}-{state.id}" defaultChecked={state.checked} aria-invalid={state.invalid || undefined} disabled={state.disabled} />
      {/each}
    {/each}
  </div>
  <div class="grid w-64 gap-4">
    <Slider data-testid="base-slider" defaultValue={50} max={100} />
    <NativeSlider data-testid="native-slider" aria-label="Native" defaultValue={50} max={100} />
    <NativeSlider data-testid="native-slider-disabled" aria-label="Disabled" defaultValue={50} max={100} disabled />
  </div>
  <!-- Labels and fieldsets next to each control, for the slot parity test. -->
  <div class="grid grid-cols-2 gap-8">
    {#each ['base', 'native'] as kind (kind)}
      <div class="grid gap-4" data-kind={kind}>
        <Field orientation="horizontal">
          {#if kind === 'base'}<Checkbox id="{kind}-checkbox" />{:else}<NativeCheckbox id="{kind}-checkbox" />{/if}
          <FieldLabel for="{kind}-checkbox">Checkbox</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          {#if kind === 'base'}<Switch id="{kind}-switch" />{:else}<NativeSwitch id="{kind}-switch" />{/if}
          <FieldLabel for="{kind}-switch">Switch</FieldLabel>
        </Field>
        <FieldSet data-testid="{kind}-checkbox-fieldset">
          <FieldLegend variant="label">Checkboxes</FieldLegend>
          {#each ['one', 'two'] as item (item)}
            <Field orientation="horizontal">
              {#if kind === 'base'}<Checkbox id="{kind}-group-{item}" />{:else}<NativeCheckbox id="{kind}-group-{item}" />{/if}
              <FieldLabel for="{kind}-group-{item}" class="font-normal">{item}</FieldLabel>
            </Field>
          {/each}
        </FieldSet>
        <FieldSet data-testid="{kind}-switch-fieldset">
          <FieldLegend variant="label">Switches</FieldLegend>
          {#each ['one', 'two'] as item (item)}
            <Field orientation="horizontal">
              {#if kind === 'base'}<Switch id="{kind}-sw-{item}" />{:else}<NativeSwitch id="{kind}-sw-{item}" />{/if}
              <FieldLabel for="{kind}-sw-{item}" class="font-normal">{item}</FieldLabel>
            </Field>
          {/each}
        </FieldSet>
      </div>
    {/each}
  </div>
</div>
