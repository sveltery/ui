<script lang="ts">
  import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarGroup,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
  } from '$registry/bases/base/ui/menubar';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        file: 'File',
        newTab: 'New Tab',
        newWindow: 'New Window',
        newIncognitoWindow: 'New Incognito Window',
        share: 'Share',
        emailLink: 'Email link',
        messages: 'Messages',
        notes: 'Notes',
        print: 'Print...',
        edit: 'Edit',
        undo: 'Undo',
        redo: 'Redo',
        find: 'Find',
        searchTheWeb: 'Search the web',
        findItem: 'Find...',
        findNext: 'Find Next',
        findPrevious: 'Find Previous',
        cut: 'Cut',
        copy: 'Copy',
        paste: 'Paste',
        view: 'View',
        bookmarksBar: 'Bookmarks Bar',
        fullUrls: 'Full URLs',
        reload: 'Reload',
        forceReload: 'Force Reload',
        toggleFullscreen: 'Toggle Fullscreen',
        hideSidebar: 'Hide Sidebar',
        profiles: 'Profiles',
        andy: 'Andy',
        benoit: 'Benoit',
        luis: 'Luis',
        editProfile: 'Edit...',
        addProfile: 'Add Profile...',
      },
    },
    ar: {
      dir: 'rtl',
      values: {
        file: 'ملف',
        newTab: 'علامة تبويب جديدة',
        newWindow: 'نافذة جديدة',
        newIncognitoWindow: 'نافذة التصفح المتخفي الجديدة',
        share: 'مشاركة',
        emailLink: 'رابط البريد الإلكتروني',
        messages: 'الرسائل',
        notes: 'الملاحظات',
        print: 'طباعة...',
        edit: 'تعديل',
        undo: 'تراجع',
        redo: 'إعادة',
        find: 'بحث',
        searchTheWeb: 'البحث على الويب',
        findItem: 'بحث...',
        findNext: 'البحث التالي',
        findPrevious: 'البحث السابق',
        cut: 'قص',
        copy: 'نسخ',
        paste: 'لصق',
        view: 'عرض',
        bookmarksBar: 'شريط الإشارات المرجعية',
        fullUrls: 'عناوين URL الكاملة',
        reload: 'إعادة تحميل',
        forceReload: 'إعادة تحميل قسري',
        toggleFullscreen: 'تبديل وضع ملء الشاشة',
        hideSidebar: 'إخفاء الشريط الجانبي',
        profiles: 'الملفات الشخصية',
        andy: 'Andy',
        benoit: 'Benoit',
        luis: 'Luis',
        editProfile: 'تعديل...',
        addProfile: 'إضافة ملف شخصي...',
      },
    },
    he: {
      dir: 'rtl',
      values: {
        file: 'קובץ',
        newTab: 'כרטיסייה חדשה',
        newWindow: 'חלון חדש',
        newIncognitoWindow: 'חלון גלישה בסתר חדש',
        share: 'שתף',
        emailLink: 'קישור אימייל',
        messages: 'הודעות',
        notes: 'הערות',
        print: 'הדפס...',
        edit: 'ערוך',
        undo: 'בטל',
        redo: 'בצע שוב',
        find: 'מצא',
        searchTheWeb: 'חפש באינטרנט',
        findItem: 'מצא...',
        findNext: 'מצא הבא',
        findPrevious: 'מצא הקודם',
        cut: 'גזור',
        copy: 'העתק',
        paste: 'הדבק',
        view: 'תצוגה',
        bookmarksBar: 'סרגל סימניות',
        fullUrls: 'כתובות URL מלאות',
        reload: 'רענן',
        forceReload: 'רענן בכוח',
        toggleFullscreen: 'החלף מסך מלא',
        hideSidebar: 'הסתר סרגל צד',
        profiles: 'פרופילים',
        andy: 'Andy',
        benoit: 'Benoit',
        luis: 'Luis',
        editProfile: 'ערוך...',
        addProfile: 'הוסף פרופיל...',
      },
    },
  } as const;

  const language = useLanguage();
  let profile = $state('benoit');
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
  const align = $derived(dir === 'rtl' ? 'end' : 'start');
  const lang = $derived(dir === 'rtl' ? language.current : undefined);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Menubar class="w-72" {dir}>
    <MenubarMenu>
      <MenubarTrigger>{t.file}</MenubarTrigger>
      <MenubarContent {dir} {align}>
        <MenubarGroup>
          <MenubarItem>
            {t.newTab} <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            {t.newWindow} <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>{t.newIncognitoWindow}</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarSub>
            <MenubarSubTrigger>{t.share}</MenubarSubTrigger>
            <MenubarSubContent {dir} data-lang={lang}>
              <MenubarGroup>
                <MenubarItem>{t.emailLink}</MenubarItem>
                <MenubarItem>{t.messages}</MenubarItem>
                <MenubarItem>{t.notes}</MenubarItem>
              </MenubarGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem>
            {t.print} <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>{t.edit}</MenubarTrigger>
      <MenubarContent {dir} {align} data-lang={lang}>
        <MenubarGroup>
          <MenubarItem>
            {t.undo} <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            {t.redo} <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarSub>
            <MenubarSubTrigger>{t.find}</MenubarSubTrigger>
            <MenubarSubContent {dir} data-lang={lang}>
              <MenubarGroup>
                <MenubarItem>{t.searchTheWeb}</MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>{t.findItem}</MenubarItem>
                <MenubarItem>{t.findNext}</MenubarItem>
                <MenubarItem>{t.findPrevious}</MenubarItem>
              </MenubarGroup>
            </MenubarSubContent>
          </MenubarSub>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem>{t.cut}</MenubarItem>
          <MenubarItem>{t.copy}</MenubarItem>
          <MenubarItem>{t.paste}</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>{t.view}</MenubarTrigger>
      <MenubarContent class="w-44" {dir} {align} data-lang={lang}>
        <MenubarGroup>
          <MenubarCheckboxItem>{t.bookmarksBar}</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>{t.fullUrls}</MenubarCheckboxItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>
            {t.reload} <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled inset>
            {t.forceReload} <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>{t.toggleFullscreen}</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>{t.hideSidebar}</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>{t.profiles}</MenubarTrigger>
      <MenubarContent {dir} {align} data-lang={lang}>
        <MenubarRadioGroup bind:value={profile}>
          <MenubarRadioItem value="andy">{t.andy}</MenubarRadioItem>
          <MenubarRadioItem value="benoit">{t.benoit}</MenubarRadioItem>
          <MenubarRadioItem value="Luis">{t.luis}</MenubarRadioItem>
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>{t.editProfile}</MenubarItem>
        </MenubarGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>{t.addProfile}</MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</div>
