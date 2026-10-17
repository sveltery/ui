<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '$registry/bases/base/ui/dialog';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Field, FieldGroup } from '$registry/bases/base/ui/field';
  import { Input } from '$registry/bases/base/ui/input';
  import { Label } from '$registry/bases/base/ui/label';

  const translations = {
    en: {
      dir: 'ltr',
      openDialog: 'Open Dialog',
      editProfile: 'Edit profile',
      description: "Make changes to your profile here. Click save when you're done.",
      name: 'Name',
      username: 'Username',
      cancel: 'Cancel',
      saveChanges: 'Save changes',
    },
    ar: {
      dir: 'rtl',
      openDialog: 'فتح الحوار',
      editProfile: 'تعديل الملف الشخصي',
      description: 'قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.',
      name: 'الاسم',
      username: 'اسم المستخدم',
      cancel: 'إلغاء',
      saveChanges: 'حفظ التغييرات',
    },
    he: {
      dir: 'rtl',
      openDialog: 'פתח דיאלוג',
      editProfile: 'ערוך פרופיל',
      description: 'בצע שינויים בפרופיל שלך כאן. לחץ על שמור כשתסיים.',
      name: 'שם',
      username: 'שם משתמש',
      cancel: 'בטל',
      saveChanges: 'שמור שינויים',
    },
  } as const;

  type Language = keyof typeof translations;

  let language = $state<Language>('ar');
  let open = $state(false);
  const t = $derived(translations[language]);
</script>

<div class="flex flex-col items-center gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as Language)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <Dialog bind:open>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        {t.openDialog}
      </DialogTrigger>
      <DialogContent class="sm:max-w-sm" dir={t.dir} data-lang={t.dir === 'rtl' ? language : undefined}>
        <form
          class="contents"
          onsubmit={(event) => {
            event.preventDefault();
            open = false;
          }}
        >
          <DialogHeader>
            <DialogTitle>{t.editProfile}</DialogTitle>
            <DialogDescription>{t.description}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label for="name-rtl">{t.name}</Label>
              <Input id="name-rtl" name="name" value="Pedro Duarte" />
            </Field>
            <Field>
              <Label for="username-rtl">{t.username}</Label>
              <Input id="username-rtl" name="username" value="@peduarte" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              {t.cancel}
            </DialogClose>
            <Button type="submit">{t.saveChanges}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </DirectionProvider>
</div>
