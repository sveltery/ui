<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Checkbox } from '$registry/bases/base/ui/checkbox';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from '$registry/bases/base/ui/field';
  import { Label } from '$registry/bases/base/ui/label';

  const translations = {
    en: {
      dir: 'ltr',
      acceptTerms: 'Accept terms and conditions',
      acceptTermsDescription: 'By clicking this checkbox, you agree to the terms.',
      enableNotifications: 'Enable notifications',
      enableNotificationsDescription: 'You can enable or disable notifications at any time.'
    },
    ar: {
      dir: 'rtl',
      acceptTerms: 'قبول الشروط والأحكام',
      acceptTermsDescription: 'بالنقر على هذا المربع، فإنك توافق على الشروط.',
      enableNotifications: 'تفعيل الإشعارات',
      enableNotificationsDescription: 'يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.'
    },
    he: {
      dir: 'rtl',
      acceptTerms: 'קבל תנאים והגבלות',
      acceptTermsDescription: 'על ידי לחיצה על תיבת הסימון הזו, אתה מסכים לתנאים.',
      enableNotifications: 'הפעל התראות',
      enableNotificationsDescription: 'אתה יכול להפעיל או להשבית התראות בכל עת.'
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <FieldGroup class="max-w-sm" dir={t.dir}>
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-rtl" name="terms-checkbox" />
        <Label for="terms-checkbox-rtl">{t.acceptTerms}</Label>
      </Field>
      <Field orientation="horizontal">
        <Checkbox id="terms-checkbox-2-rtl" name="terms-checkbox-2" defaultChecked />
        <FieldContent>
          <FieldLabel for="terms-checkbox-2-rtl">{t.acceptTerms}</FieldLabel>
          <FieldDescription>{t.acceptTermsDescription}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal" data-disabled>
        <Checkbox id="toggle-checkbox-rtl" name="toggle-checkbox" disabled />
        <FieldLabel for="toggle-checkbox-rtl">{t.enableNotifications}</FieldLabel>
      </Field>
      <FieldLabel>
        <Field orientation="horizontal">
          <Checkbox id="toggle-checkbox-2-rtl" name="toggle-checkbox-2" />
          <FieldContent>
            <FieldTitle>{t.enableNotifications}</FieldTitle>
            <FieldDescription>{t.enableNotificationsDescription}</FieldDescription>
          </FieldContent>
        </Field>
      </FieldLabel>
    </FieldGroup>
  </DirectionProvider>
</div>
