<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { NativeCheckbox } from '$registry/bases/base/ui/native-checkbox';
  import { toggleVariants } from '$registry/bases/base/ui/toggle';
  import { cn } from 'cn';

  const desktopItems = [
    { value: 'hard-disks', label: 'Hard disks' },
    { value: 'external-disks', label: 'External disks' },
    { value: 'media', label: 'CDs, DVDs, and iPods' },
    { value: 'servers', label: 'Connected servers' },
  ];
  // A label styled as a Toggle, around a visually hidden checkbox: `has-checked:` reads the checkbox's state.
  const toggle = cn(toggleVariants({ variant: 'outline' }), 'cursor-pointer select-none has-checked:bg-muted has-focus-visible:border-ring has-focus-visible:ring-[3px] has-focus-visible:ring-ring/50 has-disabled:pointer-events-none has-disabled:opacity-50');
</script>

{#snippet NativeCheckboxBasic()}
  <Example title="Basic">
    <Field orientation="horizontal">
      <NativeCheckbox id="native-terms" />
      <FieldLabel for="native-terms">Accept terms and conditions</FieldLabel>
    </Field>
  </Example>
{/snippet}

{#snippet NativeCheckboxWithDescription()}
  <Example title="With Description">
    <Field orientation="horizontal">
      <NativeCheckbox id="native-terms-2" defaultChecked />
      <FieldContent>
        <FieldLabel for="native-terms-2">Accept terms and conditions</FieldLabel>
        <FieldDescription>By clicking this checkbox, you agree to the terms and conditions.</FieldDescription>
      </FieldContent>
    </Field>
  </Example>
{/snippet}

{#snippet NativeCheckboxInvalid()}
  <Example title="Invalid">
    <Field orientation="horizontal" data-invalid="true">
      <NativeCheckbox id="native-terms-3" aria-invalid="true" />
      <FieldLabel for="native-terms-3">Accept terms and conditions</FieldLabel>
    </Field>
  </Example>
{/snippet}

{#snippet NativeCheckboxDisabled()}
  <Example title="Disabled">
    <Field orientation="horizontal" data-disabled="true">
      <NativeCheckbox id="native-toggle" disabled />
      <FieldLabel for="native-toggle">Enable notifications</FieldLabel>
    </Field>
  </Example>
{/snippet}

{#snippet NativeCheckboxWithTitle()}
  <Example title="With Title">
    <FieldGroup>
      <FieldLabel for="native-toggle-2">
        <Field orientation="horizontal">
          <NativeCheckbox id="native-toggle-2" defaultChecked />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldLabel for="native-toggle-4">
        <Field orientation="horizontal" data-disabled="true">
          <NativeCheckbox id="native-toggle-4" disabled />
          <FieldContent>
            <FieldTitle>Enable notifications</FieldTitle>
            <FieldDescription>You can enable or disable notifications at any time.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet NativeCheckboxGroup()}
  <Example title="Group">
    <FieldSet>
      <FieldLegend variant="label">Show these items on the desktop:</FieldLegend>
      {#each desktopItems as item (item.value)}
        <Field orientation="horizontal">
          <NativeCheckbox id="native-desktop-{item.value}" name="desktop" value={item.value} />
          <FieldLabel for="native-desktop-{item.value}" class="font-normal">{item.label}</FieldLabel>
        </Field>
      {/each}
    </FieldSet>
  </Example>
{/snippet}

{#snippet NativeCheckboxToggleStyle()}
  <Example title="Toggle Style">
    <fieldset class="flex gap-1">
      <legend class="sr-only">Text style</legend>
      <label class={toggle} aria-label="Toggle bold">
        <input class="sr-only" type="checkbox" name="style" value="bold" checked />
        <IconPlaceholder lucide="BoldIcon" tabler="IconBold" hugeicons="TextBoldIcon" phosphor="TextBIcon" remixicon="RiBold" />
      </label>
      <label class={toggle} aria-label="Toggle italic">
        <input class="sr-only" type="checkbox" name="style" value="italic" />
        <IconPlaceholder lucide="ItalicIcon" tabler="IconItalic" hugeicons="TextItalicIcon" phosphor="TextItalicIcon" remixicon="RiItalic" />
      </label>
      <label class={toggle} aria-label="Toggle underline">
        <input class="sr-only" type="checkbox" name="style" value="underline" />
        <IconPlaceholder lucide="UnderlineIcon" tabler="IconUnderline" hugeicons="TextUnderlineIcon" phosphor="TextUnderlineIcon" remixicon="RiUnderline" />
      </label>
    </fieldset>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render NativeCheckboxBasic()}
  {@render NativeCheckboxWithDescription()}
  {@render NativeCheckboxInvalid()}
  {@render NativeCheckboxDisabled()}
  {@render NativeCheckboxWithTitle()}
  {@render NativeCheckboxGroup()}
  {@render NativeCheckboxToggleStyle()}
</ExampleWrapper>
