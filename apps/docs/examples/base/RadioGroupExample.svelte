<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Label } from '@sveltery/ui/label';
  import { RadioGroup, RadioGroupItem } from '@sveltery/ui/radio-group';

  let density = $state('comfortable');
  let plan = $state('plus');
  let battery = $state('medium');
  let size = $state('medium');
  let notification = $state('email');

  const plans = [
    { value: 'plus', id: 'plus-plan', name: 'Plus', description: 'For individuals and small teams' },
    { value: 'pro', id: 'pro-plan', name: 'Pro', description: 'For growing businesses' },
    { value: 'enterprise', id: 'enterprise-plan', name: 'Enterprise', description: 'For large teams and enterprises' },
  ];
  const sizes = [
    { value: 'small', id: 'size-small', name: 'Small' },
    { value: 'medium', id: 'size-medium', name: 'Medium' },
    { value: 'large', id: 'size-large', name: 'Large' },
    { value: 'xlarge', id: 'size-xlarge', name: 'X-Large' },
  ];
  const fieldClass = 'flex w-full items-center gap-2';
  const cardClass = 'flex w-full items-start gap-2 rounded-lg border p-2.5 has-[[data-checked]]:border-primary/50 has-[[data-checked]]:bg-primary/5';
</script>

{#snippet RadioGroupBasic()}
  <Example title="Basic">
    <RadioGroup bind:value={density}>
      <div class={fieldClass}>
        <RadioGroupItem value="default" id="r1" />
        <Label for="r1" class="font-normal">Default</Label>
      </div>
      <div class={fieldClass}>
        <RadioGroupItem value="comfortable" id="r2" />
        <Label for="r2" class="font-normal">Comfortable</Label>
      </div>
      <div class={fieldClass}>
        <RadioGroupItem value="compact" id="r3" />
        <Label for="r3" class="font-normal">Compact</Label>
      </div>
    </RadioGroup>
  </Example>
{/snippet}

{#snippet RadioGroupWithDescriptions()}
  <Example title="With Descriptions">
    <RadioGroup bind:value={plan}>
      {#each plans as item (item.value)}
        <Label for={item.id} class={cardClass}>
          <div class="flex flex-1 flex-col gap-1">
            <div class="font-medium">{item.name}</div>
            <p class="text-sm font-normal text-muted-foreground">{item.description}</p>
          </div>
          <RadioGroupItem value={item.value} id={item.id} />
        </Label>
      {/each}
    </RadioGroup>
  </Example>
{/snippet}

{#snippet RadioGroupWithFieldSet()}
  <Example title="With FieldSet">
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-1.5 font-medium">Battery Level</legend>
      <p class="text-sm text-muted-foreground">Choose your preferred battery level.</p>
      <RadioGroup bind:value={battery}>
        <div class={fieldClass}>
          <RadioGroupItem value="high" id="battery-high" />
          <Label for="battery-high" class="font-normal">High</Label>
        </div>
        <div class={fieldClass}>
          <RadioGroupItem value="medium" id="battery-medium" />
          <Label for="battery-medium" class="font-normal">Medium</Label>
        </div>
        <div class={fieldClass}>
          <RadioGroupItem value="low" id="battery-low" />
          <Label for="battery-low" class="font-normal">Low</Label>
        </div>
      </RadioGroup>
    </fieldset>
  </Example>
{/snippet}

{#snippet RadioGroupGrid()}
  <Example title="Grid Layout">
    <RadioGroup bind:value={size} class="grid grid-cols-2 gap-2">
      {#each sizes as item (item.value)}
        <Label for={item.id} class={cardClass}>
          <RadioGroupItem value={item.value} id={item.id} />
          <div class="font-medium">{item.name}</div>
        </Label>
      {/each}
    </RadioGroup>
  </Example>
{/snippet}

{#snippet RadioGroupDisabled()}
  <Example title="Disabled">
    <RadioGroup value="option2" disabled>
      <div class={fieldClass}>
        <RadioGroupItem value="option1" id="disabled-1" />
        <Label for="disabled-1" class="font-normal">Option 1</Label>
      </div>
      <div class={fieldClass}>
        <RadioGroupItem value="option2" id="disabled-2" />
        <Label for="disabled-2" class="font-normal">Option 2</Label>
      </div>
      <div class={fieldClass}>
        <RadioGroupItem value="option3" id="disabled-3" />
        <Label for="disabled-3" class="font-normal">Option 3</Label>
      </div>
    </RadioGroup>
  </Example>
{/snippet}

{#snippet RadioGroupInvalid()}
  <Example title="Invalid">
    <fieldset class="flex flex-col gap-3">
      <legend class="mb-1.5 font-medium">Notification Preferences</legend>
      <p class="text-sm text-muted-foreground">Choose how you want to receive notifications.</p>
      <RadioGroup bind:value={notification}>
        <div class={fieldClass} data-invalid>
          <RadioGroupItem value="email" id="invalid-email" aria-invalid="true" />
          <Label for="invalid-email" class="font-normal">Email only</Label>
        </div>
        <div class={fieldClass} data-invalid>
          <RadioGroupItem value="sms" id="invalid-sms" aria-invalid="true" />
          <Label for="invalid-sms" class="font-normal">SMS only</Label>
        </div>
        <div class={fieldClass} data-invalid>
          <RadioGroupItem value="both" id="invalid-both" aria-invalid="true" />
          <Label for="invalid-both" class="font-normal">Both Email &amp; SMS</Label>
        </div>
      </RadioGroup>
    </fieldset>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render RadioGroupBasic()}
  {@render RadioGroupWithDescriptions()}
  {@render RadioGroupWithFieldSet()}
  {@render RadioGroupGrid()}
  {@render RadioGroupDisabled()}
  {@render RadioGroupInvalid()}
</ExampleWrapper>
