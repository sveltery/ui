<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldGroup, FieldLabel } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
  } from '$registry/bases/base/ui/sheet';

  const translations = {
    en: {
      dir: 'ltr',
      open: 'Open',
      editProfile: 'Edit profile',
      description: "Make changes to your profile here. Click save when you're done.",
      name: 'Name',
      username: 'Username',
      save: 'Save changes',
      close: 'Close'
    },
    ar: {
      dir: 'rtl',
      open: 'فتح',
      editProfile: 'تعديل الملف الشخصي',
      description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر حفظ عند الانتهاء.',
      name: 'الاسم',
      username: 'اسم المستخدم',
      save: 'حفظ التغييرات',
      close: 'إغلاق'
    },
    he: {
      dir: 'rtl',
      open: 'פתח',
      editProfile: 'עריכת פרופיל',
      description: 'בצע שינויים בפרופיל שלך כאן. לחץ שמור כשתסיים.',
      name: 'שם',
      username: 'שם משתמש',
      save: 'שמור שינויים',
      close: 'סגור'
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
</script>

<div class="flex flex-col items-start gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Sheet>
      <SheetTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        {t.open}
      </SheetTrigger>
      <SheetContent dir={t.dir} side={t.dir === 'rtl' ? 'left' : 'right'} data-lang={t.dir === 'rtl' ? language : undefined}>
        <SheetHeader>
          <SheetTitle>{t.editProfile}</SheetTitle>
          <SheetDescription>{t.description}</SheetDescription>
        </SheetHeader>
        <FieldGroup class="px-4">
          <Field>
            <FieldLabel for="sheet-rtl-name">{t.name}</FieldLabel>
            <Input id="sheet-rtl-name" defaultValue="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel for="sheet-rtl-username">{t.username}</FieldLabel>
            <Input id="sheet-rtl-username" defaultValue="peduarte" />
          </Field>
        </FieldGroup>
        <SheetFooter>
          <Button type="submit">{t.save}</Button>
          <SheetClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            {t.close}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </DirectionProvider>
</div>
