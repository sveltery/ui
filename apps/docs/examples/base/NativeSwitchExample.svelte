<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from '$registry/bases/base/ui/field';
  import { Label } from '$registry/bases/base/ui/label';
  import { NativeSwitch } from '$registry/bases/base/ui/native-switch';
</script>

{#snippet NativeSwitchBasic()}
  <Example title="Basic">
    <Field orientation="horizontal">
      <NativeSwitch id="native-switch-basic" />
      <FieldLabel for="native-switch-basic">Airplane Mode</FieldLabel>
    </Field>
  </Example>
{/snippet}

{#snippet NativeSwitchWithDescription()}
  <Example title="With Description">
    <FieldLabel for="native-switch-focus-mode">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldTitle>Share across devices</FieldTitle>
          <FieldDescription>Focus is shared across devices, and turns off when you leave the app.</FieldDescription>
        </FieldContent>
        <NativeSwitch id="native-switch-focus-mode" />
      </Field>
    </FieldLabel>
  </Example>
{/snippet}

{#snippet NativeSwitchWithLabel()}
  <Example title="With Label">
    <div class="flex items-center gap-2">
      <NativeSwitch id="native-switch-bluetooth" defaultChecked />
      <Label for="native-switch-bluetooth">Bluetooth</Label>
    </div>
  </Example>
{/snippet}

{#snippet NativeSwitchDisabled()}
  <Example title="Disabled">
    <div class="flex flex-col gap-12">
      <div class="flex items-center gap-2">
        <NativeSwitch id="native-switch-disabled-unchecked" disabled />
        <Label for="native-switch-disabled-unchecked">Disabled (Unchecked)</Label>
      </div>
      <div class="flex items-center gap-2">
        <NativeSwitch id="native-switch-disabled-checked" defaultChecked disabled />
        <Label for="native-switch-disabled-checked">Disabled (Checked)</Label>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet NativeSwitchInvalid()}
  <Example title="Invalid">
    <Field orientation="horizontal" data-invalid="true">
      <NativeSwitch id="native-switch-invalid" aria-invalid="true" />
      <FieldLabel for="native-switch-invalid">Accept the policy</FieldLabel>
    </Field>
  </Example>
{/snippet}

{#snippet NativeSwitchSizes()}
  <Example title="Sizes">
    <div class="flex flex-col gap-12">
      <div class="flex items-center gap-2">
        <NativeSwitch id="native-switch-size-sm" size="sm" />
        <Label for="native-switch-size-sm">Small</Label>
      </div>
      <div class="flex items-center gap-2">
        <NativeSwitch id="native-switch-size-default" size="default" />
        <Label for="native-switch-size-default">Default</Label>
      </div>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render NativeSwitchBasic()}
  {@render NativeSwitchWithDescription()}
  {@render NativeSwitchWithLabel()}
  {@render NativeSwitchDisabled()}
  {@render NativeSwitchInvalid()}
  {@render NativeSwitchSizes()}
</ExampleWrapper>
