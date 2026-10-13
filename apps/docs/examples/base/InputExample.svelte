<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { Field, FieldDescription, FieldLabel } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { Label } from '@sveltery/ui/label';
  import { NativeSelect, NativeSelectOption } from '@sveltery/ui/native-select';
</script>

{#snippet InputBasic()}
  <Example title="Basic">
    <Input type="email" placeholder="Email" />
  </Example>
{/snippet}

{#snippet InputInvalid()}
  <Example title="Invalid">
    <Input type="text" placeholder="Error" aria-invalid="true" />
  </Example>
{/snippet}

{#snippet InputWithLabel()}
  <Example title="With Label">
    <Field>
      <FieldLabel for="input-demo-email">Email</FieldLabel>
      <Input id="input-demo-email" type="email" placeholder="name@example.com" />
    </Field>
  </Example>
{/snippet}

{#snippet InputWithDescription()}
  <Example title="With Description">
    <Field>
      <FieldLabel for="input-demo-username">Username</FieldLabel>
      <Input id="input-demo-username" type="text" placeholder="Enter your username" />
      <FieldDescription>Choose a unique username for your account.</FieldDescription>
    </Field>
  </Example>
{/snippet}

{#snippet InputDisabled()}
  <Example title="Disabled">
    <Field>
      <FieldLabel for="input-demo-disabled">Email</FieldLabel>
      <Input id="input-demo-disabled" type="email" placeholder="Email" disabled />
    </Field>
  </Example>
{/snippet}

{#snippet InputTypes()}
  <Example title="Input Types">
    <div class="flex w-full flex-col gap-6">
      <Field>
        <FieldLabel for="input-demo-password">Password</FieldLabel>
        <Input id="input-demo-password" type="password" placeholder="Password" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-tel">Phone</FieldLabel>
        <Input id="input-demo-tel" type="tel" placeholder="+1 (555) 123-4567" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-url">URL</FieldLabel>
        <Input id="input-demo-url" type="url" placeholder="https://example.com" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-search">Search</FieldLabel>
        <Input id="input-demo-search" type="search" placeholder="Search" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-number">Number</FieldLabel>
        <Input id="input-demo-number" type="number" placeholder="123" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-date">Date</FieldLabel>
        <Input id="input-demo-date" type="date" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-time">Time</FieldLabel>
        <Input id="input-demo-time" type="time" />
      </Field>
      <Field>
        <FieldLabel for="input-demo-file">File</FieldLabel>
        <Input id="input-demo-file" type="file" />
      </Field>
    </div>
  </Example>
{/snippet}

{#snippet InputWithButton()}
  <Example title="With Button">
    <div class="flex w-full gap-2">
      <Input type="search" placeholder="Search..." class="flex-1" />
      <Button>Search</Button>
    </div>
  </Example>
{/snippet}

{#snippet InputWithNativeSelect()}
  <Example title="With Native Select">
    <div class="flex w-full gap-2">
      <Input type="tel" placeholder="(555) 123-4567" class="flex-1" />
      <NativeSelect value="+1">
        <NativeSelectOption value="+1">+1</NativeSelectOption>
        <NativeSelectOption value="+44">+44</NativeSelectOption>
        <NativeSelectOption value="+46">+46</NativeSelectOption>
      </NativeSelect>
    </div>
  </Example>
{/snippet}

{#snippet InputForm()}
  <Example title="Form">
    <form class="flex w-full flex-col gap-7">
      <div class="flex w-full flex-col gap-3">
        <Label for="form-name">Name</Label>
        <Input id="form-name" name="name" type="text" placeholder="John Doe" />
      </div>
      <div class="flex w-full flex-col gap-3">
        <Label for="form-email">Email</Label>
        <Input id="form-email" name="email" type="email" placeholder="john@example.com" />
        <p class="text-sm text-muted-foreground">We&apos;ll never share your email with anyone.</p>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex w-full flex-col gap-3">
          <Label for="form-phone">Phone</Label>
          <Input id="form-phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>
        <div class="flex w-full flex-col gap-3">
          <Label for="form-country">Country</Label>
          <NativeSelect id="form-country" name="country" value="us">
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>
      <div class="flex w-full flex-col gap-3">
        <Label for="form-address">Address</Label>
        <Input id="form-address" name="address" type="text" placeholder="123 Main St" />
      </div>
      <div class="flex w-full items-center gap-3">
        <Button type="button" variant="outline">Cancel</Button>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render InputBasic()}
  {@render InputInvalid()}
  {@render InputWithLabel()}
  {@render InputWithDescription()}
  {@render InputDisabled()}
  {@render InputTypes()}
  {@render InputWithButton()}
  {@render InputWithNativeSelect()}
  {@render InputForm()}
</ExampleWrapper>
