<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Field, FieldDescription, FieldError, FieldLabel } from '@sveltery/ui/field';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@sveltery/ui/input-otp';
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
              <FieldLabel>Verification code</FieldLabel>
              <Button variant="outline" size="xs">
                <IconPlaceholder lucide="RefreshCwIcon" hugeicons="RefreshIcon" tabler="IconRefresh" phosphor="ArrowClockwiseIcon" remixicon="RiRefreshLine" data-icon="inline-start" />
                Resend Code
              </Button>
            </div>
            <InputOTP length={6} required>
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
      <FieldLabel>Simple</FieldLabel>
      <InputOTP length={6}>
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
      <FieldLabel>Digits Only</FieldLabel>
      <InputOTP length={6} validationType="numeric">
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
      <FieldLabel>With Separator</FieldLabel>
      <InputOTP length={6} bind:value={separated}>
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
      <FieldLabel>Alphanumeric</FieldLabel>
      <FieldDescription>Accepts both letters and numbers.</FieldDescription>
      <InputOTP length={6} validationType="alphanumeric">
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
    <Field disabled>
      <FieldLabel>Disabled</FieldLabel>
      <InputOTP length={6} value="123456">
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
      <FieldLabel>4 Digits</FieldLabel>
      <FieldDescription>Common pattern for PIN codes.</FieldDescription>
      <InputOTP length={4} validationType="numeric">
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
    <Field invalid>
      <FieldLabel>Invalid State</FieldLabel>
      <FieldDescription>Example showing the invalid error state.</FieldDescription>
      <InputOTP length={6} bind:value={invalid}>
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
      <FieldError match>Invalid code. Please try again.</FieldError>
    </Field>
  </Example>
</ExampleWrapper>
