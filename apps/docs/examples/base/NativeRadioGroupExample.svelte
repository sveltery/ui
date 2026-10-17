<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Field, FieldDescription, FieldLabel, FieldLegend, FieldSet } from '$registry/bases/base/ui/field';
  import { NativeRadio, NativeRadioGroup } from '$registry/bases/base/ui/native-radio-group';
</script>

{#snippet NativeRadioGroupBasic()}
  <Example title="Basic">
    <NativeRadioGroup aria-label="Density">
      <Field orientation="horizontal">
        <NativeRadio name="density" value="default" id="native-r1" />
        <FieldLabel for="native-r1" class="font-normal">Default</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <NativeRadio name="density" value="comfortable" id="native-r2" defaultChecked />
        <FieldLabel for="native-r2" class="font-normal">Comfortable</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <NativeRadio name="density" value="compact" id="native-r3" />
        <FieldLabel for="native-r3" class="font-normal">Compact</FieldLabel>
      </Field>
    </NativeRadioGroup>
  </Example>
{/snippet}

{#snippet NativeRadioGroupWithFieldSet()}
  <Example title="With FieldSet">
    <FieldSet>
      <FieldLegend>Battery Level</FieldLegend>
      <FieldDescription>Choose your preferred battery level.</FieldDescription>
      <NativeRadioGroup>
        {#each ['high', 'medium', 'low'] as level (level)}
          <Field orientation="horizontal">
            <NativeRadio name="battery" value={level} id="native-battery-{level}" defaultChecked={level === 'medium'} />
            <FieldLabel for="native-battery-{level}" class="font-normal capitalize">{level}</FieldLabel>
          </Field>
        {/each}
      </NativeRadioGroup>
    </FieldSet>
  </Example>
{/snippet}

{#snippet NativeRadioGroupDisabled()}
  <Example title="Disabled">
    <NativeRadioGroup aria-label="Notifications">
      <Field orientation="horizontal" data-disabled="true">
        <NativeRadio name="notify" value="all" id="native-notify-all" disabled />
        <FieldLabel for="native-notify-all" class="font-normal">All</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <NativeRadio name="notify" value="mentions" id="native-notify-mentions" defaultChecked />
        <FieldLabel for="native-notify-mentions" class="font-normal">Mentions</FieldLabel>
      </Field>
    </NativeRadioGroup>
  </Example>
{/snippet}

{#snippet NativeRadioGroupInvalid()}
  <Example title="Invalid">
    <FieldSet>
      <FieldLegend>Notification Preferences</FieldLegend>
      <FieldDescription>Choose how you want to receive notifications.</FieldDescription>
      <NativeRadioGroup>
        {#each ['email', 'sms', 'both'] as channel (channel)}
          <Field orientation="horizontal" data-invalid="true">
            <NativeRadio name="channel" value={channel} id="native-channel-{channel}" aria-invalid="true" defaultChecked={channel === 'email'} />
            <FieldLabel for="native-channel-{channel}" class="font-normal">{channel === 'sms' ? 'SMS' : channel === 'both' ? 'Both' : 'Email'}</FieldLabel>
          </Field>
        {/each}
      </NativeRadioGroup>
    </FieldSet>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render NativeRadioGroupBasic()}
  {@render NativeRadioGroupWithFieldSet()}
  {@render NativeRadioGroupDisabled()}
  {@render NativeRadioGroupInvalid()}
</ExampleWrapper>
