<script lang="ts">
  import { Badge } from '@sveltery/ui/badge';
  import { Checkbox } from '@sveltery/ui/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldItem,
    FieldLabel,
    FieldLegend,
    FieldSet,
    FieldTitle,
  } from '@sveltery/ui/field';
  import { Input } from '@sveltery/ui/input';
  import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '@sveltery/ui/native-select';
  import { RadioGroup, RadioGroupItem } from '@sveltery/ui/radio-group';
  import { Slider } from '@sveltery/ui/slider';
  import { Switch } from '@sveltery/ui/switch';
  import { Textarea } from '@sveltery/ui/textarea';

  let volume = $state([50]);
  let brightness = $state([75]);
  let temperature = $state([0.3, 0.7]);
  let priceRange = $state([25, 75]);
  let colorBalance = $state([10, 20, 70]);
</script>

{#snippet InputFields()}
  <Example title="Input Fields">
    <FieldGroup>
      <Field>
        <FieldLabel>Basic Input</FieldLabel>
        <Input placeholder="Enter text" />
      </Field>
      <Field>
        <FieldLabel>Input with Description</FieldLabel>
        <Input placeholder="Enter your username" />
        <FieldDescription>Choose a unique username for your account.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Email Address</FieldLabel>
        <FieldDescription>We&apos;ll never share your email with anyone.</FieldDescription>
        <Input type="email" placeholder="email@example.com" />
      </Field>
      <Field>
        <FieldLabel>Required Field <span class="text-destructive">*</span></FieldLabel>
        <Input placeholder="This field is required" required />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Disabled Input</FieldLabel>
        <Input placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>
          Input with Badge
          <Badge variant="secondary" class="ml-auto">Recommended</Badge>
        </FieldLabel>
        <Input placeholder="Enter value" />
      </Field>
      <Field invalid>
        <FieldLabel>Invalid Input</FieldLabel>
        <Input placeholder="This field has an error" />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel>Disabled Field</FieldLabel>
        <Input placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet TextareaFields()}
  <Example title="Textarea Fields">
    <FieldGroup>
      <Field>
        <FieldLabel id="textarea-1-label">Basic Textarea</FieldLabel>
        <Textarea aria-labelledby="textarea-1-label" placeholder="Enter your message" />
      </Field>
      <Field>
        <FieldLabel id="textarea-2-label">Comments</FieldLabel>
        <Textarea aria-labelledby="textarea-2-label" placeholder="Share your thoughts..." class="min-h-[100px]" />
        <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel id="textarea-3-label">Bio</FieldLabel>
        <FieldDescription>Tell us about yourself in a few sentences.</FieldDescription>
        <Textarea aria-labelledby="textarea-3-label" placeholder="I am a..." class="min-h-[120px]" />
      </Field>
      <Field>
        <FieldLabel id="textarea-4-label">Message</FieldLabel>
        <Textarea aria-labelledby="textarea-4-label" placeholder="Enter your message" />
        <FieldDescription>Enter your message so it is long enough to test the layout.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel id="textarea-5-label">Invalid Textarea</FieldLabel>
        <Textarea aria-labelledby="textarea-5-label" placeholder="This field has an error" aria-invalid="true" />
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel id="textarea-6-label">Disabled Field</FieldLabel>
        <Textarea aria-labelledby="textarea-6-label" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet CheckboxFields()}
  <Example title="Checkbox Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <Checkbox defaultChecked />
        <FieldLabel>I agree to the terms and conditions</FieldLabel>
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>Accept terms and conditions</FieldLabel>
        <Checkbox />
      </Field>
      <Field orientation="horizontal">
        <Checkbox />
        <FieldContent>
          <FieldLabel>Subscribe to newsletter</FieldLabel>
          <FieldDescription>Receive weekly updates about new features and promotions.</FieldDescription>
        </FieldContent>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox />
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
            <Checkbox />
            <FieldLabel>Dark mode</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldLabel>Compact view</FieldLabel>
          </Field>
          <Field orientation="horizontal">
            <Checkbox />
            <FieldLabel>Enable notifications</FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <Field invalid orientation="horizontal">
        <Checkbox />
        <FieldLabel>Invalid checkbox</FieldLabel>
      </Field>
      <Field disabled orientation="horizontal">
        <Checkbox disabled />
        <FieldLabel>Disabled checkbox</FieldLabel>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet RadioFields()}
  <Example title="Radio Fields">
    <FieldGroup>
      <Field>
        <FieldSet>
          <FieldLegend variant="label">Subscription Plan</FieldLegend>
          <RadioGroup defaultValue="free">
            <FieldItem>
              <RadioGroupItem value="free" />
              <FieldLabel>Free Plan</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="pro" />
              <FieldLabel>Pro Plan</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="enterprise" />
              <FieldLabel>Enterprise</FieldLabel>
            </FieldItem>
          </RadioGroup>
        </FieldSet>
      </Field>
      <Field>
        <FieldSet>
          <FieldLegend variant="label">Battery Level</FieldLegend>
          <FieldDescription>Choose your preferred battery level.</FieldDescription>
          <RadioGroup>
            <FieldItem>
              <RadioGroupItem value="high" />
              <FieldLabel>High</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="medium" />
              <FieldLabel>Medium</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="low" />
              <FieldLabel>Low</FieldLabel>
            </FieldItem>
          </RadioGroup>
        </FieldSet>
      </Field>
      <Field>
        <RadioGroup class="gap-6">
          <FieldItem>
            <RadioGroupItem value="option1" />
            <FieldContent>
              <FieldLabel>Enable Touch ID</FieldLabel>
              <FieldDescription>Enable Touch ID to quickly unlock your device.</FieldDescription>
            </FieldContent>
          </FieldItem>
        </RadioGroup>
      </Field>
      <Field>
        <RadioGroup class="gap-3">
          <FieldLabel>
            <FieldItem>
              <RadioGroupItem value="title1" />
              <FieldContent>
                <FieldTitle>Enable Touch ID</FieldTitle>
                <FieldDescription>Enable Touch ID to quickly unlock your device.</FieldDescription>
              </FieldContent>
            </FieldItem>
          </FieldLabel>
        </RadioGroup>
      </Field>
      <Field invalid>
        <FieldSet>
          <FieldLegend variant="label">Invalid Radio Group</FieldLegend>
          <RadioGroup>
            <FieldItem>
              <RadioGroupItem value="invalid1" />
              <FieldLabel>Invalid Option 1</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="invalid2" />
              <FieldLabel>Invalid Option 2</FieldLabel>
            </FieldItem>
          </RadioGroup>
        </FieldSet>
      </Field>
      <Field disabled>
        <FieldSet>
          <FieldLegend variant="label">Disabled Radio Group</FieldLegend>
          <RadioGroup disabled>
            <FieldItem>
              <RadioGroupItem value="disabled1" disabled />
              <FieldLabel>Disabled Option 1</FieldLabel>
            </FieldItem>
            <FieldItem>
              <RadioGroupItem value="disabled2" disabled />
              <FieldLabel>Disabled Option 2</FieldLabel>
            </FieldItem>
          </RadioGroup>
        </FieldSet>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet SwitchFields()}
  <Example title="Switch Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Airplane Mode</FieldLabel>
          <FieldDescription>Turn on airplane mode to disable all connections.</FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel>Dark Mode</FieldLabel>
        <Switch />
      </Field>
      <Field orientation="horizontal">
        <Switch />
        <FieldContent>
          <FieldLabel>Marketing Emails</FieldLabel>
          <FieldDescription>Receive emails about new products, features, and more.</FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Privacy Settings</FieldLabel>
        <FieldDescription>Manage your privacy preferences.</FieldDescription>
        <Field orientation="horizontal">
          <Switch defaultChecked />
          <FieldLabel>Make profile visible to others</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Switch />
          <FieldLabel>Show email on profile</FieldLabel>
        </Field>
      </Field>
      <Field invalid orientation="horizontal">
        <FieldContent>
          <FieldLabel>Invalid Switch</FieldLabel>
          <FieldDescription>This switch has validation errors.</FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
      <Field disabled orientation="horizontal">
        <FieldContent>
          <FieldLabel>Disabled Switch</FieldLabel>
          <FieldDescription>This switch is currently disabled.</FieldDescription>
        </FieldContent>
        <Switch disabled />
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet SliderFields()}
  <Example title="Slider Fields">
    <FieldGroup>
      <Field>
        <FieldLabel>Volume</FieldLabel>
        <Slider bind:value={volume} max={100} step={1} />
      </Field>
      <Field>
        <FieldLabel>Screen Brightness</FieldLabel>
        <Slider bind:value={brightness} max={100} step={5} />
        <FieldDescription>Current brightness: {brightness[0]}%</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Video Quality</FieldLabel>
        <FieldDescription>Higher quality uses more bandwidth.</FieldDescription>
        <Slider defaultValue={[720]} max={1080} min={360} step={360} />
      </Field>
      <Field>
        <FieldLabel>Temperature Range</FieldLabel>
        <Slider bind:value={temperature} min={0} max={1} step={0.1} />
        <FieldDescription>Range: {temperature[0].toFixed(1)} - {temperature[1].toFixed(1)}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Price Range</FieldLabel>
        <Slider bind:value={priceRange} max={100} step={5} />
        <FieldDescription>${priceRange[0]} - ${priceRange[1]}</FieldDescription>
      </Field>
      <Field>
        <FieldLabel>Color Balance</FieldLabel>
        <Slider bind:value={colorBalance} max={100} step={10} />
        <FieldDescription>
          Red: {colorBalance[0]}%, Green: {colorBalance[1]}%, Blue: {colorBalance[2]}%
        </FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Invalid Slider</FieldLabel>
        <Slider defaultValue={[30]} max={100} />
        <FieldDescription>This slider has validation errors.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel>Disabled Slider</FieldLabel>
        <Slider defaultValue={[50]} max={100} disabled />
        <FieldDescription>This slider is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet NativeSelectFields()}
  <Example title="Native Select Fields">
    <FieldGroup>
      <Field>
        <FieldLabel id="native-select-1-label">Basic Native Select</FieldLabel>
        <NativeSelect aria-labelledby="native-select-1-label">
          <NativeSelectOption value="">Choose an option</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel id="native-select-2-label">Country</FieldLabel>
        <NativeSelect aria-labelledby="native-select-2-label">
          <NativeSelectOption value="">Select your country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>Select the country where you currently reside.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel id="native-select-3-label">Timezone</FieldLabel>
        <FieldDescription>Choose your local timezone for accurate scheduling.</FieldDescription>
        <NativeSelect aria-labelledby="native-select-3-label">
          <NativeSelectOption value="">Select timezone</NativeSelectOption>
          <NativeSelectOption value="utc">UTC</NativeSelectOption>
          <NativeSelectOption value="est">Eastern Time</NativeSelectOption>
          <NativeSelectOption value="pst">Pacific Time</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field>
        <FieldLabel id="native-select-4-label">Grouped Options</FieldLabel>
        <NativeSelect aria-labelledby="native-select-4-label">
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
      <Field invalid>
        <FieldLabel id="native-select-5-label">Invalid Native Select</FieldLabel>
        <NativeSelect aria-labelledby="native-select-5-label" aria-invalid="true">
          <NativeSelectOption value="">This field has an error</NativeSelectOption>
          <NativeSelectOption value="option1">Option 1</NativeSelectOption>
          <NativeSelectOption value="option2">Option 2</NativeSelectOption>
          <NativeSelectOption value="option3">Option 3</NativeSelectOption>
        </NativeSelect>
        <FieldDescription>This field contains validation errors.</FieldDescription>
      </Field>
      <Field disabled>
        <FieldLabel id="native-select-6-label">Disabled Field</FieldLabel>
        <NativeSelect aria-labelledby="native-select-6-label" disabled>
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

{#snippet HorizontalFields()}
  <Example title="Horizontal Fields">
    <FieldGroup class="**:data-[slot=field-content]:min-w-48">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Username</FieldLabel>
          <FieldDescription>Enter your preferred username.</FieldDescription>
        </FieldContent>
        <Input placeholder="johndoe" />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel id="horizontal-bio-label">Bio</FieldLabel>
          <FieldDescription>Write a short description about yourself.</FieldDescription>
        </FieldContent>
        <Textarea aria-labelledby="horizontal-bio-label" placeholder="Tell us about yourself..." />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Email Notifications</FieldLabel>
          <FieldDescription>Receive email updates about your account.</FieldDescription>
        </FieldContent>
        <Switch />
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel id="horizontal-country-label">Country</FieldLabel>
          <FieldDescription>Select your country.</FieldDescription>
        </FieldContent>
        <NativeSelect aria-labelledby="horizontal-country-label">
          <NativeSelectOption value="">Select a country</NativeSelectOption>
          <NativeSelectOption value="us">United States</NativeSelectOption>
          <NativeSelectOption value="uk">United Kingdom</NativeSelectOption>
          <NativeSelectOption value="ca">Canada</NativeSelectOption>
        </NativeSelect>
      </Field>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel>Volume</FieldLabel>
          <FieldDescription>Adjust the volume level.</FieldDescription>
        </FieldContent>
        <Slider defaultValue={[50]} max={100} />
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render InputFields()}
  {@render TextareaFields()}
  {@render CheckboxFields()}
  {@render RadioFields()}
  {@render SwitchFields()}
  {@render SliderFields()}
  {@render NativeSelectFields()}
  {@render HorizontalFields()}
</ExampleWrapper>
