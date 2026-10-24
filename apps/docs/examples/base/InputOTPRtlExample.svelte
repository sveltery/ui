<script lang="ts">
  import { Field, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputOTP, InputOTPGroup, InputOTPSlot } from '$registry/bases/base/ui/input-otp';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: { dir: 'ltr', verificationCode: 'Verification code' },
    ar: { dir: 'rtl', verificationCode: 'رمز التحقق' },
    he: { dir: 'rtl', verificationCode: 'קוד אימות' }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="mx-auto flex w-full max-w-xs flex-col gap-4">
  <Field dir={t.dir}>
    <FieldLabel for="input-otp-rtl">{t.verificationCode}</FieldLabel>
    <InputOTP maxlength={6} defaultValue="123456" dir={t.dir} id="input-otp-rtl">
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
</div>
