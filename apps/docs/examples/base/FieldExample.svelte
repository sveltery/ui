<script lang="ts">
  import { Badge } from '@sveltery/ui/badge';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
  } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@sveltery/ui/input-otp';
  import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@sveltery/ui/native-select';
  import { RadioGroup, RadioGroupItem } from '@sveltery/ui/radio-group';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Slider } from '@sveltery/ui/slider';
  import { Switch } from '@sveltery/ui/switch';
  import { Textarea } from '@sveltery/ui/textarea';

  let volume = $state([50]);
  let brightness = $state([75]);
  let temperature = $state([0.3, 0.7]);
  let priceRange = $state([25, 75]);
  let colorBalance = $state([10, 20, 70]);
  let otpValue = $state('');
  let pinValue = $state('');

  const fruitItems = [
    { label: 'Select a fruit', value: null },
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Orange', value: 'orange' },
  ];
  const selectBasicItems = [
    { label: 'Choose an option', value: null },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  const selectCountryItems = [
    { label: 'Select your country', value: null },
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'ca' },
  ];
  const selectTimezoneItems = [
    { label: 'Select timezone', value: null },
    { label: 'UTC', value: 'utc' },
    { label: 'Eastern Time', value: 'est' },
    { label: 'Pacific Time', value: 'pst' },
  ];
  const selectInvalidItems = [
    { label: 'This field has an error', value: null },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
  const selectDisabledItems = [
    { label: 'Cannot select', value: null },
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];
</script>

{#snippet InputFields()}
  <Example title="Input Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="input-basic">Basic Input</FieldLabel>
        <Input id="input-basic" placeholder="Enter text" />
      </Field>
      <Field>
        <FieldLabel for="input-with-desc">Input with Description</FieldLabel>
        <Input id="input-with-desc" placeholder="Enter your username" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="input-desc-first">Email Address</FieldLabel>
        <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
        <Input id="input-desc-first" type="email" placeholder="email@example.com" />
      </Field>
      <Field>
        <FieldLabel for="input-required">Required Field <span class="text-destructive">*</span></FieldLabel>
        <Input id="input-required" placeholder="This field is required" required />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="input-disabled">Disabled Input</FieldLabel>
        <Input id="input-disabled" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="input-badge">
          Input with Badge
          <Badge variant="secondary" class="ml-auto">Recommended</Badge>
        </FieldLabel>
        <Input id="input-badge" placeholder="Enter value" />
      </Field>
      <Field data-invalid>
        <FieldLabel for="input-invalid">Invalid Input</FieldLabel>
        <Input id="input-invalid" placeholder="This field has an error" aria-invalid />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="input-disabled-field">Disabled Field</FieldLabel>
        <Input id="input-disabled-field" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet TextareaFields()}
  <Example title="Textarea Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="textarea-basic">Basic Textarea</FieldLabel>
        <Textarea id="textarea-basic" placeholder="Enter your message" />
      </Field>
      <Field>
        <FieldLabel for="textarea-comments">Comments</FieldLabel>
        <Textarea id="textarea-comments" placeholder="Share your thoughts..." class="min-h-[100px]" />
        <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="textarea-bio">Bio</FieldLabel>
        <FieldDescription>Tell us about yourself in a few sentences.</FieldDescription>
        <Textarea id="textarea-bio" placeholder="I am a..." class="min-h-[120px]" />
      </Field>
      <Field>
        <FieldLabel for="textarea-desc-after">Message</FieldLabel>
        <Textarea id="textarea-desc-after" placeholder="Enter your message" />
        <FieldDescription>Enter your message so it is long enough to test the layout.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel for="textarea-invalid">Invalid Textarea</FieldLabel>
        <Textarea id="textarea-invalid" placeholder="This field has an error" aria-invalid />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="textarea-disabled-field">Disabled Field</FieldLabel>
        <Textarea id="textarea-disabled-field" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet SelectFields()}
  <Example title="Select Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="select-basic">Basic Select</FieldLabel>
        <Select items={selectBasicItems}>
          <SelectTrigger id="select-basic">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each selectBasicItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel for="select-country">Country</FieldLabel>
        <Select items={selectCountryItems}>
          <SelectTrigger id="select-country">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each selectCountryItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>Select the country where you currently reside.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="select-timezone">Timezone</FieldLabel>
        <FieldDescription>Choose your local timezone for accurate scheduling.</FieldDescription>
        <Select items={selectTimezoneItems}>
          <SelectTrigger id="select-timezone">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each selectTimezoneItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field data-invalid>
        <FieldLabel for="select-invalid">Invalid Select</FieldLabel>
        <Select items={selectInvalidItems}>
          <SelectTrigger id="select-invalid" aria-invalid>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each selectInvalidItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="select-disabled-field">Disabled Field</FieldLabel>
        <Select items={selectDisabledItems} disabled>
          <SelectTrigger id="select-disabled-field">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each selectDisabledItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet CheckboxFields()}
  <Example title="Checkbox Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-basic" defaultChecked />
        <FieldLabel for="checkbox-basic">I agree to the terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel for="checkbox-right">Accept terms and conditions</FieldLabel>
        <Checkbox id="checkbox-right" />
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="checkbox-with-desc" />
        <FieldContent>
          <FieldLabel for="checkbox-with-desc">Subscribe to newsletter</FieldLabel>
          <FieldDescription>Receive weekly updates about new features and promotions.</FieldDescription>
        </FieldContent>
      </Field>
      <FieldLabel for="checkbox-with-title">
        <Field orientation="horizontal">
          <Checkbox id="checkbox-with-title" />
          <FieldContent>
            <FieldTitle>Enable Touch ID</FieldTitle>
            <FieldDescription>Enable Touch ID to quickly unlock your device.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
      <FieldSet>
        <FieldLegend variant="label">Preferences</FieldLegend>
        <FieldDescription>Select all that apply to customize your experience.</FieldDescription>
        <FieldGroup class="gap-3">
          <Field orientation="horizontal">
            <Checkbox id="pref-dark" />
            <FieldLabel for="pref-dark">Dark mode</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-compact" />
            <FieldLabel for="pref-compact">Compact view</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="pref-notifications" />
            <FieldLabel for="pref-notifications">Enable notifications</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field data-invalid orientation="horizontal">
        <Checkbox id="checkbox-invalid" aria-invalid />
        <FieldLabel for="checkbox-invalid">Invalid checkbox</FieldLabel>
      </Field>
      <Field data-disabled orientation="horizontal">
        <Checkbox id="checkbox-disabled-field" disabled />
        <FieldLabel for="checkbox-disabled-field">Disabled checkbox</FieldLabel>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet RadioFields()}
  <Example title="Radio Fields">
    <FieldGroup>
      <FieldSet>
        <FieldLegend variant="label">Subscription Plan</FieldLegend>
        <RadioGroup defaultValue="free">
          <Field orientation="horizontal">
            <RadioGroupItem value="free" id="radio-free" />
            <FieldLabel for="radio-free">Free Plan</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="pro" id="radio-pro" />
            <FieldLabel for="radio-pro">Pro Plan</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="enterprise" id="radio-enterprise" />
            <FieldLabel for="radio-enterprise">Enterprise</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Battery Level</FieldLegend>
        <FieldDescription>Choose your preferred battery level.</FieldDescription>
        <RadioGroup>
          <Field orientation="horizontal">
            <RadioGroupItem value="high" id="battery-high" />
            <FieldLabel for="battery-high">High</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="medium" id="battery-medium" />
            <FieldLabel for="battery-medium">Medium</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <RadioGroupItem value="low" id="battery-low" />
            <FieldLabel for="battery-low">Low</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <RadioGroup class="gap-6">
        <Field orientation="horizontal">
          <RadioGroupItem value="option1" id="radio-content-1" />
          <FieldContent>
            <FieldLabel for="radio-content-1">Enable Touch ID</FieldLabel>
            <FieldDescription>Enable Touch ID to quickly unlock your device.</FieldDescription>
          </FieldContent>
        </Field>
      </RadioGroup>
      <RadioGroup class="gap-3">
        <FieldLabel for="radio-title-1">
          <Field orientation="horizontal">
            <RadioGroupItem value="title1" id="radio-title-1" />
            <FieldContent>
              <FieldTitle>Enable Touch ID</FieldTitle>
              <FieldDescription>Enable Touch ID to quickly unlock your device.</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      </RadioGroup>
      <FieldSet>
        <FieldLegend variant="label">Invalid Radio Group</FieldLegend>
        <RadioGroup>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem value="invalid1" id="radio-invalid-1" aria-invalid />
            <FieldLabel for="radio-invalid-1">Invalid Option 1</FieldLabel>
          </Field>
          <Field data-invalid orientation="horizontal">
            <RadioGroupItem value="invalid2" id="radio-invalid-2" aria-invalid />
            <FieldLabel for="radio-invalid-2">Invalid Option 2</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
      <FieldSet>
        <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
        <RadioGroup disabled>
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem value="disabled1" id="radio-disabled-1" disabled />
            <FieldLabel for="radio-disabled-1">Disabled Option 1</FieldLabel>
          </Field>
          <Field data-disabled orientation="horizontal">
            <RadioGroupItem value="disabled2" id="radio-disabled-2" disabled />
            <FieldLabel for="radio-disabled-2">Disabled Option 2</FieldLabel>
          </Field>
        </RadioGroup>
      </FieldSet>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet SwitchFields()}
  <Example title="Switch Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="switch-airplane">Airplane Mode</FieldLabel>
          <FieldDescription>Turn on airplane mode to disable all connections.</FieldDescription>
        </FieldContent>
        <Switch id="switch-airplane" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel for="switch-dark">Dark Mode</FieldLabel>
        <Switch id="switch-dark" />
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-marketing" />
        <FieldContent>
          <FieldLabel for="switch-marketing">Marketing Emails</FieldLabel>
          <FieldDescription>Receive emails about new products, features, and more.</FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Privacy Settings</FieldLabel>
        <FieldDescription>Manage your privacy preferences.</FieldDescription>
        <Field orientation="horizontal">
          <Switch id="switch-profile" defaultChecked />
          <FieldLabel for="switch-profile">Make profile visible to others</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-email" />
          <FieldLabel for="switch-email">Show email on profile</FieldLabel>
        </Field>
      </Field>
      <Field data-invalid orientation="horizontal">
        <FieldContent>
          <FieldLabel for="switch-invalid">Invalid Switch</FieldLabel>
          <FieldDescription>This switch has validation errors.</FieldDescription>
        </FieldContent>
        <Switch id="switch-invalid" aria-invalid />
      </Field>
      <Field data-disabled orientation="horizontal">
        <FieldContent>
          <FieldLabel for="switch-disabled-field">Disabled Switch</FieldLabel>
          <FieldDescription>This switch is currently disabled.</FieldDescription>
        </FieldContent>
        <Switch id="switch-disabled-field" disabled />
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet SliderFields()}
  <Example title="Slider Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="slider-volume">Volume</FieldLabel>
        <Slider id="slider-volume" bind:value={volume} max={100} step={1} />
      </Field>
      <Field>
        <FieldLabel for="slider-brightness">Screen Brightness</FieldLabel>
        <Slider id="slider-brightness" bind:value={brightness} max={100} step={5} />
        <FieldDescription>Current brightness: {brightness[0]}%</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="slider-quality">Video Quality</FieldLabel>
        <FieldDescription>Higher quality uses more bandwidth.</FieldDescription>
        <Slider id="slider-quality" defaultValue={[720]} max={1080} min={360} step={360} />
      </Field>
      <Field>
        <FieldLabel for="slider-temperature">Temperature Range</FieldLabel>
        <Slider id="slider-temperature" bind:value={temperature} min={0} max={1} step={0.1} />
        <FieldDescription>Range: {temperature[0].toFixed(1)} - {temperature[1].toFixed(1)}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="slider-price-range">Price Range</FieldLabel>
        <Slider id="slider-price-range" bind:value={priceRange} max={100} step={5} />
        <FieldDescription>${priceRange[0]} - ${priceRange[1]}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="slider-color-balance">Color Balance</FieldLabel>
        <Slider id="slider-color-balance" bind:value={colorBalance} max={100} step={10} />
        <FieldDescription>
          Red: {colorBalance[0]}%, Green: {colorBalance[1]}%, Blue: {colorBalance[2]}%
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel for="slider-invalid">Invalid Slider</FieldLabel>
        <Slider id="slider-invalid" defaultValue={[30]} max={100} aria-invalid />
        <FieldDescription>This slider has validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="slider-disabled-field">Disabled Slider</FieldLabel>
        <Slider id="slider-disabled-field" defaultValue={[50]} max={100} disabled />
        <FieldDescription>This slider is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet NativeSelectFields()}
  <Example title="Native Select Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="native-select-basic">Basic Native Select</FieldLabel>
        <NativeSelect id="native-select-basic">
          <NativeSelectOption value="">Choose an option</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel for="native-select-country">Country</FieldLabel>
        <NativeSelect id="native-select-country">
          <NativeSelectOption value="">Select your country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Select the country where you currently reside.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="native-select-timezone">Timezone</FieldLabel>
        <FieldDescription>Choose your local timezone for accurate scheduling.</FieldDescription>
        <NativeSelect id="native-select-timezone">
          <NativeSelectOption value="">Select timezone</NativeSelectOption>
          <NativeSelectOption value="utc">UTC</NativeSelectOption>
          <NativeSelectOption value="est">Eastern Time</NativeSelectOption>
          <NativeSelectOption value="pst">Pacific Time</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel for="native-select-grouped">Grouped Options</FieldLabel>
        <NativeSelect id="native-select-grouped">
          <NativeSelectOption value="">Select a region</NativeSelectOption>
          <NativeSelectOptGroup label="North America">
            <NativeSelectOption value="us">United States</NativeSelectOption>
            <NativeSelectOption value="ca">Canada</NativeSelectOption>
            <NativeSelectOption value="mx">Mexico</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Europe">
            <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
            <NativeSelectOption value="fr">France</NativeSelectOption>
            <NativeSelectOption value="de">Germany</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <FieldDescription>Native select with grouped options using optgroup.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel for="native-select-invalid">Invalid Native Select</FieldLabel>
        <NativeSelect id="native-select-invalid" aria-invalid>
          <NativeSelectOption value="">This field has an error</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="native-select-disabled-field">Disabled Field</FieldLabel>
        <NativeSelect id="native-select-disabled-field" disabled>
          <NativeSelectOption value="">Cannot select</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet InputOTPFields()}
  <Example title="OTP Input Fields">
    <FieldGroup>
      <Field>
        <FieldLabel for="otp-basic">Verification Code</FieldLabel>
        <InputOTP id="otp-basic" length={6}>
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
        </InputOTP>
      </Field>
      <Field>
        <FieldLabel for="otp-with-desc">Enter OTP</FieldLabel>
        <InputOTP id="otp-with-desc" length={6} bind:value={otpValue}>
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>Enter the 6-digit code sent to your email.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="otp-separator">Two-Factor Authentication</FieldLabel>
        <InputOTP id="otp-separator" length={6}>
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>Enter the code from your authenticator app.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel for="otp-pin">PIN Code</FieldLabel>
        <InputOTP id="otp-pin" length={4} validationType="numeric" bind:value={pinValue}>
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>Enter your 4-digit PIN (numbers only).</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel for="otp-invalid">Invalid OTP</FieldLabel>
        <InputOTP id="otp-invalid" length={6}>
          <InputOTPGroup>
            <InputOTPSlot aria-invalid />
            <InputOTPSlot aria-invalid />
            <InputOTPSlot aria-invalid />
            <InputOTPSlot aria-invalid />
            <InputOTPSlot aria-invalid />
            <InputOTPSlot aria-invalid />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>This OTP field contains validation errors.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel for="otp-disabled-field">Disabled OTP</FieldLabel>
        <InputOTP id="otp-disabled-field" length={6} disabled>
          <InputOTPGroup>
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
            <InputOTPSlot />
          </InputOTPGroup>
        </InputOTP>
        <FieldDescription>This OTP field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet HorizontalFields()}
  <Example title="Horizontal Fields">
    <FieldGroup class="**:data-[slot=field-content]:min-w-48">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-input">Username</FieldLabel>
          <FieldDescription>Enter your preferred username.</FieldDescription>
        </FieldContent>
        <Input id="horizontal-input" placeholder="johndoe" />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-textarea">Bio</FieldLabel>
          <FieldDescription>Write a short description about yourself.</FieldDescription>
        </FieldContent>
        <Textarea id="horizontal-textarea" placeholder="Tell us about yourself..." />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-switch">Email Notifications</FieldLabel>
          <FieldDescription>Receive email updates about your account.</FieldDescription>
        </FieldContent>
        <Switch id="horizontal-switch" />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-select">Favorite Fruit</FieldLabel>
          <FieldDescription>Choose your favorite fruit.</FieldDescription>
        </FieldContent>
        <Select items={fruitItems}>
          <SelectTrigger id="horizontal-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each fruitItems as item (item.value)}
                <SelectItem value={item.value}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-native-select">Country</FieldLabel>
          <FieldDescription>Select your country.</FieldDescription>
        </FieldContent>
        <NativeSelect id="horizontal-native-select">
          <NativeSelectOption value="">Select a country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel for="horizontal-slider">Volume</FieldLabel>
          <FieldDescription>Adjust the volume level.</FieldDescription>
        </FieldContent>
        <Slider id="horizontal-slider" defaultValue={[50]} max={100} />
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render InputFields()}
  {@render TextareaFields()}
  {@render SelectFields()}
  {@render CheckboxFields()}
  {@render RadioFields()}
  {@render SwitchFields()}
  {@render SliderFields()}
  {@render NativeSelectFields()}
  {@render InputOTPFields()}
  {@render HorizontalFields()}
</ExampleWrapper>
