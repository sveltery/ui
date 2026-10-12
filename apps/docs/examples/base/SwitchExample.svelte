<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Label } from '@sveltery/ui/label';
  import { Switch } from '@sveltery/ui/switch';
</script>

{#snippet SwitchBasic()}
  <Example title="Basic">
    <div class="flex items-center gap-2">
      <Switch id="switch-basic" />
      <Label for="switch-basic">Airplane Mode</Label>
    </div>
  </Example>
{/snippet}

{#snippet SwitchWithLabel()}
  <Example title="With Label">
    <div class="flex items-center gap-2">
      <Switch id="switch-bluetooth" defaultChecked />
      <Label for="switch-bluetooth">Bluetooth</Label>
    </div>
  </Example>
{/snippet}

{#snippet SwitchWithDescription()}
  <Example title="With Description">
    <Label for="switch-focus-mode" class="items-start justify-between gap-4 rounded-lg border p-4">
      <div class="flex flex-col gap-1">
        <span class="font-medium">Share across devices</span>
        <span class="font-normal text-muted-foreground">
          Focus is shared across devices, and turns off when you leave the app.
        </span>
      </div>
      <Switch id="switch-focus-mode" />
    </Label>
  </Example>
{/snippet}

{#snippet SwitchDisabled()}
  <Example title="Disabled">
    <div class="flex flex-col gap-12">
      <div class="flex items-center gap-2">
        <Switch id="switch-disabled-unchecked" disabled />
        <Label for="switch-disabled-unchecked">Disabled (Unchecked)</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="switch-disabled-checked" defaultChecked disabled />
        <Label for="switch-disabled-checked">Disabled (Checked)</Label>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet SwitchSizes()}
  <Example title="Sizes">
    <div class="flex flex-col gap-12">
      <div class="flex items-center gap-2">
        <Switch id="switch-size-sm" size="sm" />
        <Label for="switch-size-sm">Small</Label>
      </div>
      <div class="flex items-center gap-2">
        <Switch id="switch-size-default" size="default" />
        <Label for="switch-size-default">Default</Label>
      </div>
    </div>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render SwitchBasic()}
  {@render SwitchWithDescription()}
  {@render SwitchWithLabel()}
  {@render SwitchDisabled()}
  {@render SwitchSizes()}
</ExampleWrapper>
