<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Field, FieldDescription, FieldLabel } from '@sveltery/ui/field';
  import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@sveltery/ui/native-select';
</script>

{#snippet NativeSelectBasic()}
  <Example title="Basic">
    <NativeSelect>
      <NativeSelectOption value="">Select a fruit</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      <NativeSelectOption value="grapes" disabled>Grapes</NativeSelectOption>
      <NativeSelectOption value="pineapple">Pineapple</NativeSelectOption>
    </NativeSelect>
  </Example>
{/snippet}

{#snippet NativeSelectWithGroups()}
  <Example title="With Groups">
    <NativeSelect>
      <NativeSelectOption value="">Select a food</NativeSelectOption>
      <NativeSelectOptGroup label="Fruits">
        <NativeSelectOption value="apple">Apple</NativeSelectOption>
        <NativeSelectOption value="banana">Banana</NativeSelectOption>
        <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
      </NativeSelectOptGroup>
      <NativeSelectOptGroup label="Vegetables">
        <NativeSelectOption value="carrot">Carrot</NativeSelectOption>
        <NativeSelectOption value="broccoli">Broccoli</NativeSelectOption>
        <NativeSelectOption value="spinach">Spinach</NativeSelectOption>
      </NativeSelectOptGroup>
    </NativeSelect>
  </Example>
{/snippet}

{#snippet NativeSelectSizes()}
  <Example title="Sizes">
    <div class="flex flex-col gap-4">
      {#each ['sm', 'default'] as const as size (size)}
        <NativeSelect {size}>
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
        </NativeSelect>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet NativeSelectWithField()}
  <Example title="With Field">
    <Field>
      <FieldLabel for="native-select-country">Country</FieldLabel>
      <NativeSelect id="native-select-country">
        <NativeSelectOption value="">Select a country</NativeSelectOption>
        <NativeSelectOption value="us">United States</NativeSelectOption>
        <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
        <NativeSelectOption value="ca">Canada</NativeSelectOption>
        <NativeSelectOption value="au">Australia</NativeSelectOption>
      </NativeSelect>
      <FieldDescription>Select your country of residence.</FieldDescription>
    </Field>
  </Example>
{/snippet}

{#snippet NativeSelectDisabled()}
  <Example title="Disabled">
    <NativeSelect disabled>
      <NativeSelectOption value="">Disabled</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  </Example>
{/snippet}

{#snippet NativeSelectInvalid()}
  <Example title="Invalid">
    <NativeSelect aria-invalid="true">
      <NativeSelectOption value="">Error state</NativeSelectOption>
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana">Banana</NativeSelectOption>
      <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
    </NativeSelect>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render NativeSelectBasic()}
  {@render NativeSelectWithGroups()}
  {@render NativeSelectSizes()}
  {@render NativeSelectWithField()}
  {@render NativeSelectDisabled()}
  {@render NativeSelectInvalid()}
</ExampleWrapper>
