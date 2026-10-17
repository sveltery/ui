<script lang="ts">
  import BluetoothIcon from '@lucide/svelte/icons/bluetooth';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '$registry/bases/base/ui/alert-dialog';
  import { Button } from '$registry/bases/base/ui/button';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      showDialog: 'Show Dialog',
      showDialogSm: 'Show Dialog (sm)',
      title: 'Are you absolutely sure?',
      description: 'This action cannot be undone. This will permanently delete your account from our servers.',
      cancel: 'Cancel',
      continue: 'Continue',
      smallTitle: 'Allow accessory to connect?',
      smallDescription: 'Do you want to allow the USB accessory to connect to this device?',
      dontAllow: "Don't allow",
      allow: 'Allow'
    },
    ar: {
      dir: 'rtl',
      showDialog: 'إظهار الحوار',
      showDialogSm: 'إظهار الحوار (صغير)',
      title: 'هل أنت متأكد تمامًا؟',
      description: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف حسابك نهائيًا من خوادمنا.',
      cancel: 'إلغاء',
      continue: 'متابعة',
      smallTitle: 'السماح للملحق بالاتصال؟',
      smallDescription: 'هل تريد السماح لملحق USB بالاتصال بهذا الجهاز؟',
      dontAllow: 'عدم السماح',
      allow: 'السماح'
    },
    he: {
      dir: 'rtl',
      showDialog: 'הצג דיאלוג',
      showDialogSm: 'הצג דיאלוג (קטן)',
      title: 'האם אתה בטוח לחלוטין?',
      description: 'פעולה זו לא ניתנת לביטול. זה ימחק לצמיתות את החשבון שלך מהשרתים שלנו.',
      cancel: 'ביטול',
      continue: 'המשך',
      smallTitle: 'לאפשר להתקן להתחבר?',
      smallDescription: 'האם אתה רוצה לאפשר להתקן USB להתחבר למכשיר זה?',
      dontAllow: 'אל תאפשר',
      allow: 'אפשר'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
  const lang = $derived(t.dir === 'rtl' ? language.current : undefined);
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4" dir={t.dir}>
    <AlertDialog>
      <AlertDialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        {t.showDialog}
      </AlertDialogTrigger>
      <AlertDialogContent dir={t.dir} data-lang={lang}>
        <AlertDialogHeader>
          <AlertDialogTitle>{t.title}</AlertDialogTitle>
          <AlertDialogDescription>{t.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          <AlertDialogAction>{t.continue}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <AlertDialog>
      <AlertDialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        {t.showDialogSm}
      </AlertDialogTrigger>
      <AlertDialogContent size="sm" dir={t.dir} data-lang={lang}>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <BluetoothIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>{t.smallTitle}</AlertDialogTitle>
          <AlertDialogDescription>{t.smallDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t.dontAllow}</AlertDialogCancel>
          <AlertDialogAction>{t.allow}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</div>
