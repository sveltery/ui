<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldContent, FieldDescription, FieldLabel } from '$registry/bases/base/ui/field';
  import { RadioGroup, RadioGroupItem } from '$registry/bases/base/ui/radio-group';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        default: 'Default',
        defaultDescription: 'Standard spacing for most use cases.',
        comfortable: 'Comfortable',
        comfortableDescription: 'More space between elements.',
        compact: 'Compact',
        compactDescription: 'Minimal spacing for dense layouts.'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        default: 'افتراضي',
        defaultDescription: 'تباعد قياسي لمعظم حالات الاستخدام.',
        comfortable: 'مريح',
        comfortableDescription: 'مساحة أكبر بين العناصر.',
        compact: 'مضغوط',
        compactDescription: 'تباعد أدنى للتخطيطات الكثيفة.'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        default: 'ברירת מחדל',
        defaultDescription: 'ריווח סטנדרטי לרוב מקרי השימוש.',
        comfortable: 'נוח',
        comfortableDescription: 'יותר מקום בין האלמנטים.',
        compact: 'קומפקטי',
        compactDescription: 'ריווח מינימלי לפריסות צפופות.'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <RadioGroup defaultValue="comfortable" class="w-fit" {dir}>
      <Field orientation="horizontal">
        <RadioGroupItem value="default" id="r1-rtl" {dir} />
        <FieldContent>
          <FieldLabel for="r1-rtl" {dir}>{t.default}</FieldLabel>
          <FieldDescription {dir}>{t.defaultDescription}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="comfortable" id="r2-rtl" {dir} />
        <FieldContent>
          <FieldLabel for="r2-rtl" {dir}>{t.comfortable}</FieldLabel>
          <FieldDescription {dir}>{t.comfortableDescription}</FieldDescription>
        </FieldContent>
      </Field>
      <Field orientation="horizontal">
        <RadioGroupItem value="compact" id="r3-rtl" {dir} />
        <FieldContent>
          <FieldLabel for="r3-rtl" {dir}>{t.compact}</FieldLabel>
          <FieldDescription {dir}>{t.compactDescription}</FieldDescription>
        </FieldContent>
      </Field>
    </RadioGroup>
  </DirectionProvider>
</div>
