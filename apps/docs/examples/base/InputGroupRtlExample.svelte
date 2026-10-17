<script lang="ts">
  import SearchIcon from '@lucide/svelte/icons/search';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldDescription, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from '$registry/bases/base/ui/input-group';
  import { Spinner } from '$registry/bases/base/ui/spinner';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        placeholder: 'Search...',
        results: '12 results',
        searching: 'Searching...',
        saving: 'Saving...',
        savingChanges: 'Saving changes...',
        textareaLabel: 'Textarea',
        textareaPlaceholder: 'Write a comment...',
        characterCount: '0/280',
        post: 'Post',
        textareaDescription: 'Footer positioned below the textarea.',
      },
    },
    ar: {
      dir: 'rtl',
      values: {
        placeholder: 'بحث...',
        results: '١٢ نتيجة',
        searching: 'جاري البحث...',
        saving: 'جاري الحفظ...',
        savingChanges: 'جاري حفظ التغييرات...',
        textareaLabel: 'منطقة النص',
        textareaPlaceholder: 'اكتب تعليقًا...',
        characterCount: '٠/٢٨٠',
        post: 'نشر',
        textareaDescription: 'تذييل موضع أسفل منطقة النص.',
      },
    },
    he: {
      dir: 'rtl',
      values: {
        placeholder: 'חפש...',
        results: '12 תוצאות',
        searching: 'מחפש...',
        saving: 'שומר...',
        savingChanges: 'שומר שינויים...',
        textareaLabel: 'אזור טקסט',
        textareaPlaceholder: 'כתוב תגובה...',
        characterCount: '0/280',
        post: 'פרסם',
        textareaDescription: 'כותרת תחתונה ממוקמת מתחת לאזור הטקסט.',
      },
    },
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
    <div class="grid w-full max-w-sm gap-6" {dir}>
      <InputGroup class="max-w-xs">
        <InputGroupInput placeholder={t.placeholder} />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">{t.results}</InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder={t.searching} />
        <InputGroupAddon align="inline-end">
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder={t.savingChanges} />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{t.saving}</InputGroupText>
          <Spinner />
        </InputGroupAddon>
      </InputGroup>
      <FieldGroup class="max-w-sm">
        <Field>
          <FieldLabel for="rtl-textarea">{t.textareaLabel}</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id="rtl-textarea" placeholder={t.textareaPlaceholder} />
            <InputGroupAddon align="block-end">
              <InputGroupText>{t.characterCount}</InputGroupText>
              <InputGroupButton variant="default" size="sm" class="ms-auto">{t.post}</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          <FieldDescription>{t.textareaDescription}</FieldDescription>
        </Field>
      </FieldGroup>
    </div>
  </DirectionProvider>
</div>
