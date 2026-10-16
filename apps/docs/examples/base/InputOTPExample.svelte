<script lang="ts">
  import { Example, ExampleWrapper } from '$registry/bases/base/components/example';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Field, FieldDescription, FieldError, FieldLabel } from '$registry/bases/base/ui/field';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
  let separated = $state('123456');
  let invalid = $state('000000');
</script>

<ExampleWrapper>
  <Example title="Form">
    <Card class="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Verify your login</CardTitle>
        <CardDescription>
          Enter the verification code we sent to your email address: <span class="font-medium">m@example.com</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Field>
            <div class="flex items-center justify-between">
              <FieldLabel for="otp-verification">Verification code</FieldLabel>
              <Button variant="outline" size="xs">
                <IconPlaceholder lucide="RefreshCwIcon" hugeicons="RefreshIcon" tabler="IconRefresh" phosphor="ArrowClockwiseIcon" remixicon="RiRefreshLine" data-icon="inline-start" />
                Resend Code
              </Button>
            </div>
            <InputOTP length={6} id="otp-verification" required>
              <InputOTPGroup class="*:data-[slot=input-otp-slot]:text-xl style-vega:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-mira:*:data-[slot=input-otp-slot]:w-11 style-luma:*:data-[slot=input-otp-slot]:h-16 style-luma:*:data-[slot=input-otp-slot]:w-12">
                <InputOTPSlot />
                <InputOTPSlot />
                <InputOTPSlot />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup class="*:data-[slot=input-otp-slot]:text-xl style-vega:*:data-[slot=input-otp-slot]:h-16 style-vega:*:data-[slot=input-otp-slot]:w-12 style-nova:*:data-[slot=input-otp-slot]:h-12 style-nova:*:data-[slot=input-otp-slot]:w-11 style-lyra:*:data-[slot=input-otp-slot]:h-12 style-lyra:*:data-[slot=input-otp-slot]:w-11 style-maia:*:data-[slot=input-otp-slot]:h-16 style-maia:*:data-[slot=input-otp-slot]:w-12 style-mira:*:data-[slot=input-otp-slot]:h-12 style-mira:*:data-[slot=input-otp-slot]:w-11 style-luma:*:data-[slot=input-otp-slot]:h-16 style-luma:*:data-[slot=input-otp-slot]:w-12">
                <InputOTPSlot />
                <InputOTPSlot />
                <InputOTPSlot />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              <a href="#">I no longer have access to this email address.</a>
            </FieldDescription>
          </Field>
        </form>
      </CardContent>
      <CardFooter class="flex-col gap-2">
        <Button type="submit" class="w-full">Verify</Button>
        <div class="text-sm text-muted-foreground">
          Having trouble signing in? <a href="#" class="underline underline-offset-4 transition-colors hover:text-primary">Contact support</a>
        </div>
      </CardFooter>
    </Card>
  </Example>
  <Example title="Simple">
    <Field>
      <FieldLabel for="simple">Simple</FieldLabel>
      <InputOTP id="simple" length={6}>
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
    </Field>
  </Example>
  <Example title="Digits Only">
    <Field>
      <FieldLabel for="digits-only">Digits Only</FieldLabel>
      <InputOTP id="digits-only" length={6} validationType="numeric">
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
  </Example>
  <Example title="With Separator">
    <Field>
      <FieldLabel for="with-separator">With Separator</FieldLabel>
      <InputOTP id="with-separator" length={6} bind:value={separated}>
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  </Example>
  <Example title="Alphanumeric">
    <Field>
      <FieldLabel for="alphanumeric">Alphanumeric</FieldLabel>
      <FieldDescription>Accepts both letters and numbers.</FieldDescription>
      <InputOTP id="alphanumeric" length={6} validationType="alphanumeric">
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
    </Field>
  </Example>
  <Example title="Disabled">
    <Field>
      <FieldLabel for="disabled">Disabled</FieldLabel>
      <InputOTP id="disabled" length={6} disabled value="123456">
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
    </Field>
  </Example>
  <Example title="4 Digits">
    <Field>
      <FieldLabel for="four-digits">4 Digits</FieldLabel>
      <FieldDescription>Common pattern for PIN codes.</FieldDescription>
      <InputOTP id="four-digits" length={4} validationType="numeric">
        <InputOTPGroup>
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
          <InputOTPSlot />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  </Example>
  <Example title="Invalid State">
    <Field>
      <FieldLabel for="invalid">Invalid State</FieldLabel>
      <FieldDescription>Example showing the invalid error state.</FieldDescription>
      <InputOTP id="invalid" length={6} bind:value={invalid}>
        <InputOTPGroup>
          <InputOTPSlot aria-invalid />
          <InputOTPSlot aria-invalid />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot aria-invalid />
          <InputOTPSlot aria-invalid />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot aria-invalid />
          <InputOTPSlot aria-invalid />
        </InputOTPGroup>
      </InputOTP>
      <FieldError errors={[{ message: 'Invalid code. Please try again.' }]} />
    </Field>
  </Example>
</ExampleWrapper>
