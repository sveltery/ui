<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Button } from '@sveltery/components/button';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '@sveltery/components/field';
  import { Input } from '@sveltery/components/input';
  import { NativeSelect, NativeSelectOption } from '@sveltery/components/native-select';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/components/select';
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

{#snippet InputWithSelect()}
  <Example title="With Select">
    <div class="flex w-full gap-2">
      <Input type="text" placeholder="Enter amount" class="flex-1" />
      <Select defaultValue="usd">
        <SelectTrigger class="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="gbp">GBP</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
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
    <form class="w-full">
      <FieldGroup>
        <Field>
          <FieldLabel for="form-name">Name</FieldLabel>
          <Input id="form-name" type="text" placeholder="John Doe" />
        </Field>
        <Field>
          <FieldLabel for="form-email">Email</FieldLabel>
          <Input id="form-email" type="email" placeholder="john@example.com" />
          <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
        </Field>
        <div class="grid grid-cols-2 gap-4">
          <Field>
            <FieldLabel for="form-phone">Phone</FieldLabel>
            <Input id="form-phone" type="tel" placeholder="+1 (555) 123-4567" />
          </Field>
          <Field>
            <FieldLabel for="form-country">Country</FieldLabel>
            <Select defaultValue="us">
              <SelectTrigger id="form-country">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
        <Field>
          <FieldLabel for="form-address">Address</FieldLabel>
          <Input id="form-address" type="text" placeholder="123 Main St" />
        </Field>
        <Field orientation="horizontal">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit">Submit</Button>
        </Field>
      </FieldGroup>
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
  {@render InputWithSelect()}
  {@render InputWithButton()}
  {@render InputWithNativeSelect()}
  {@render InputForm()}
</ExampleWrapper>
