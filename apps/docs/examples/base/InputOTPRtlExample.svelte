<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';

  const translations = {
    en: { dir: 'ltr', verificationCode: 'Verification code' },
    ar: { dir: 'rtl', verificationCode: 'رمز التحقق' },
    he: { dir: 'rtl', verificationCode: 'קוד אימות' }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="mx-auto flex w-full max-w-xs flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Field>
      <FieldLabel for="input-otp-rtl">{t.verificationCode}</FieldLabel>
      <InputOTP maxLength={6} defaultValue="123456" dir={t.dir} id="input-otp-rtl">
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </Field>
  </DirectionProvider>
</div>
