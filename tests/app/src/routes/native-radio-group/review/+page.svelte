<!-- Each Radio Group docs example next to the same markup on Native Radio Group, for review screenshots. -->
<script lang="ts">
  import { Field, FieldContent, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';
  const basic = [['default', 'Default'], ['comfortable', 'Comfortable'], ['compact', 'Compact']];
  const plans = [['plus', 'Plus', 'For individuals and small teams'], ['pro', 'Pro', 'For growing businesses'], ['enterprise', 'Enterprise', 'For large teams and enterprises']];
  const battery = [['high', 'High'], ['medium', 'Medium'], ['low', 'Low']];
  const sizes = [['small', 'Small'], ['medium', 'Medium'], ['large', 'Large'], ['xlarge', 'X-Large']];
  const options = [['option1', 'Option 1'], ['option2', 'Option 2'], ['option3', 'Option 3']];
  const channels = [['email', 'Email only'], ['sms', 'SMS only'], ['both', 'Both Email & SMS']];
</script>

{#snippet item(kind: string, group: string, value: string, checked: boolean, extra: Record<string, unknown> = {})}
  {#if kind === 'base'}
    <RadioGroupItem {value} id="{kind}-{group}-{value}" {...extra} />
  {:else}
    <NativeRadio name="{group}" {value} id="{kind}-{group}-{value}" defaultChecked={checked} {...extra} />
  {/if}
{/snippet}

{#snippet group(kind: string, value: string, body: import('svelte').Snippet, props: Record<string, unknown> = {})}
  {#if kind === 'base'}
    <RadioGroup defaultValue={value} {...props}>{@render body()}</RadioGroup>
  {:else}
    <NativeRadioGroup {...props}>{@render body()}</NativeRadioGroup>
  {/if}
{/snippet}

{#snippet basicExample(kind: string)}
  {#snippet body()}
    {#each basic as [value, label] (value)}
      <Field orientation="horizontal">
        {@render item(kind, 'basic', value, value === 'comfortable')}
        <FieldLabel for="{kind}-basic-{value}" class="font-normal">{label}</FieldLabel>
      </Field>
    {/each}
  {/snippet}
  {@render group(kind, 'comfortable', body)}
{/snippet}

{#snippet descriptionsExample(kind: string)}
  {#snippet body()}
    {#each plans as [value, label, description] (value)}
      <FieldLabel for="{kind}-plan-{value}">
        <Field orientation="horizontal">
          <FieldContent>
            <div class="font-medium">{label}</div>
            <FieldDescription>{description}</FieldDescription>
          </FieldContent>
          {@render item(kind, 'plan', value, value === 'plus')}
        </Field>
      </FieldLabel>
    {/each}
  {/snippet}
  {@render group(kind, 'plus', body)}
{/snippet}

{#snippet fieldSetExample(kind: string)}
  {#snippet body()}
    {#each battery as [value, label] (value)}
      <Field orientation="horizontal">
        {@render item(kind, 'battery', value, value === 'medium')}
        <FieldLabel for="{kind}-battery-{value}" class="font-normal">{label}</FieldLabel>
      </Field>
    {/each}
  {/snippet}
  <FieldSet>
    <FieldLegend>Battery Level</FieldLegend>
    <FieldDescription>Choose your preferred battery level.</FieldDescription>
    {@render group(kind, 'medium', body)}
  </FieldSet>
{/snippet}

{#snippet gridExample(kind: string)}
  {#snippet body()}
    {#each sizes as [value, label] (value)}
      <FieldLabel for="{kind}-size-{value}">
        <Field orientation="horizontal">
          {@render item(kind, 'size', value, value === 'medium')}
          <div class="font-medium">{label}</div>
        </Field>
      </FieldLabel>
    {/each}
  {/snippet}
  {@render group(kind, 'medium', body, { class: 'grid grid-cols-2 gap-2' })}
{/snippet}

{#snippet disabledExample(kind: string)}
  {#snippet body()}
    {#each options as [value, label] (value)}
      <Field orientation="horizontal">
        {@render item(kind, 'disabled', value, value === 'option2', { disabled: true })}
        <FieldLabel for="{kind}-disabled-{value}" class="font-normal">{label}</FieldLabel>
      </Field>
    {/each}
  {/snippet}
  {@render group(kind, 'option2', body, kind === 'base' ? { disabled: true } : {})}
{/snippet}

{#snippet invalidExample(kind: string)}
  {#snippet body()}
    {#each channels as [value, label] (value)}
      <Field orientation="horizontal" data-invalid>
        {@render item(kind, 'channel', value, value === 'email', { 'aria-invalid': true })}
        <FieldLabel for="{kind}-channel-{value}" class="font-normal">{label}</FieldLabel>
      </Field>
    {/each}
  {/snippet}
  <FieldSet>
    <FieldLegend>Notification Preferences</FieldLegend>
    <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
    {@render group(kind, 'email', body)}
  </FieldSet>
{/snippet}

{#snippet pair(name: string, example: import('svelte').Snippet<[string]>)}
  <section data-example={name} class="grid grid-cols-2 gap-10 p-6">
    <div><p class="text-muted-foreground mb-4 text-xs">RadioGroup</p>{@render example('base')}</div>
    <div><p class="text-muted-foreground mb-4 text-xs">NativeRadioGroup</p>{@render example('native')}</div>
  </section>
{/snippet}

<div class="bg-background text-foreground w-[760px]">
  {@render pair('basic', basicExample)}
  {@render pair('descriptions', descriptionsExample)}
  {@render pair('fieldset', fieldSetExample)}
  {@render pair('grid', gridExample)}
  {@render pair('disabled', disabledExample)}
  {@render pair('invalid', invalidExample)}
</div>
