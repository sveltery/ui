<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field, FieldContent, FieldDescription, FieldItem, FieldLabel, FieldLegend, FieldSet } from '@sveltery/ui/field';
  import { RadioGroup, RadioGroupItem } from '@sveltery/ui/radio-group';

  const plans = [
    { value: 'plus', name: 'Plus', description: 'For individuals and small teams' },
    { value: 'pro', name: 'Pro', description: 'For growing businesses' },
    { value: 'enterprise', name: 'Enterprise', description: 'For large teams and enterprises' },
  ];
  const sizes = [
    { value: 'small', name: 'Small' },
    { value: 'medium', name: 'Medium' },
    { value: 'large', name: 'Large' },
    { value: 'xlarge', name: 'X-Large' },
  ];
</script>

{#snippet RadioGroupBasic()}
  <Example title="Basic">
    <Field>
      <RadioGroup defaultValue="comfortable">
        <FieldItem>
          <RadioGroupItem value="default" />
          <FieldLabel class="font-normal">Default</FieldLabel>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem value="comfortable" />
          <FieldLabel class="font-normal">Comfortable</FieldLabel>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem value="compact" />
          <FieldLabel class="font-normal">Compact</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </Field>
  </Example>
{/snippet}

{#snippet RadioGroupWithDescriptions()}
  <Example title="With Descriptions">
    <Field>
      <RadioGroup defaultValue="plus">
        {#each plans as item (item.value)}
          <FieldLabel>
            <FieldItem>
              <FieldContent>
                <div class="font-medium">{item.name}</div>
                <FieldDescription>{item.description}</FieldDescription>
              </FieldContent>
              <RadioGroupItem value={item.value} />
            </FieldItem>
          </FieldLabel>
        {/each}
      </RadioGroup>
    </Field>
  </Example>
{/snippet}

{#snippet RadioGroupWithFieldSet()}
  <Example title="With FieldSet">
    <Field>
      <FieldSet>
        <FieldLegend>Battery Level</FieldLegend>
        <FieldDescription>Choose your preferred battery level.</FieldDescription>
        <RadioGroup defaultValue="medium">
          <FieldItem>
            <RadioGroupItem value="high" />
            <FieldLabel class="font-normal">High</FieldLabel>
          </FieldItem>
          <FieldItem>
            <RadioGroupItem value="medium" />
            <FieldLabel class="font-normal">Medium</FieldLabel>
          </FieldItem>
          <FieldItem>
            <RadioGroupItem value="low" />
            <FieldLabel class="font-normal">Low</FieldLabel>
          </FieldItem>
        </RadioGroup>
      </FieldSet>
    </Field>
  </Example>
{/snippet}

{#snippet RadioGroupGrid()}
  <Example title="Grid Layout">
    <Field>
      <RadioGroup defaultValue="medium" class="grid grid-cols-2 gap-2">
        {#each sizes as item (item.value)}
          <FieldLabel>
            <FieldItem>
              <RadioGroupItem value={item.value} />
              <div class="font-medium">{item.name}</div>
            </FieldItem>
          </FieldLabel>
        {/each}
      </RadioGroup>
    </Field>
  </Example>
{/snippet}

{#snippet RadioGroupDisabled()}
  <Example title="Disabled">
    <Field>
      <RadioGroup defaultValue="option2" disabled>
        <FieldItem>
          <RadioGroupItem value="option1" />
          <FieldLabel class="font-normal">Option 1</FieldLabel>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem value="option2" />
          <FieldLabel class="font-normal">Option 2</FieldLabel>
        </FieldItem>
        <FieldItem>
          <RadioGroupItem value="option3" />
          <FieldLabel class="font-normal">Option 3</FieldLabel>
        </FieldItem>
      </RadioGroup>
    </Field>
  </Example>
{/snippet}

{#snippet RadioGroupInvalid()}
  <Example title="Invalid">
    <Field invalid>
      <FieldSet>
        <FieldLegend>Notification Preferences</FieldLegend>
        <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
        <RadioGroup defaultValue="email">
          <FieldItem>
            <RadioGroupItem value="email" aria-invalid />
            <FieldLabel class="font-normal">Email only</FieldLabel>
          </FieldItem>
          <FieldItem>
            <RadioGroupItem value="sms" aria-invalid />
            <FieldLabel class="font-normal">SMS only</FieldLabel>
          </FieldItem>
          <FieldItem>
            <RadioGroupItem value="both" aria-invalid />
            <FieldLabel class="font-normal">Both Email &amp; SMS</FieldLabel>
          </FieldItem>
        </RadioGroup>
      </FieldSet>
    </Field>
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
