<script lang="ts">
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
  import RotateCwIcon from '@lucide/svelte/icons/rotate-cw';
  import {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger
  } from '$registry/bases/base/ui/context-menu';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        rightClick: 'Right click here',
        longPress: 'Long press here',
        navigation: 'Navigation',
        back: 'Back',
        forward: 'Forward',
        reload: 'Reload',
        moreTools: 'More Tools',
        savePage: 'Save Page...',
        createShortcut: 'Create Shortcut...',
        nameWindow: 'Name Window...',
        developerTools: 'Developer Tools',
        delete: 'Delete',
        showBookmarks: 'Show Bookmarks',
        showFullUrls: 'Show Full URLs',
        people: 'People',
        pedro: 'Pedro Duarte',
        colm: 'Colm Tuite'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        rightClick: 'انقر بزر الماوس الأيمن هنا',
        longPress: 'اضغط مطولاً هنا',
        navigation: 'التنقل',
        back: 'رجوع',
        forward: 'تقدم',
        reload: 'إعادة تحميل',
        moreTools: 'المزيد من الأدوات',
        savePage: 'حفظ الصفحة...',
        createShortcut: 'إنشاء اختصار...',
        nameWindow: 'تسمية النافذة...',
        developerTools: 'أدوات المطور',
        delete: 'حذف',
        showBookmarks: 'إظهار الإشارات المرجعية',
        showFullUrls: 'إظهار عناوين URL الكاملة',
        people: 'الأشخاص',
        pedro: 'Pedro Duarte',
        colm: 'Colm Tuite'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        rightClick: 'לחץ לחיצה ימנית כאן',
        longPress: 'לחץ לחיצה ארוכה כאן',
        navigation: 'ניווט',
        back: 'חזור',
        forward: 'קדימה',
        reload: 'רענן',
        moreTools: 'כלים נוספים',
        savePage: 'שמור עמוד...',
        createShortcut: 'צור קיצור דרך...',
        nameWindow: 'שם חלון...',
        developerTools: 'כלי מפתח',
        delete: 'מחק',
        showBookmarks: 'הצג סימניות',
        showFullUrls: 'הצג כתובות URL מלאות',
        people: 'אנשים',
        pedro: 'Pedro Duarte',
        colm: 'Colm Tuite'
      }
    }
  } as const;

  const language = useLanguage();
  let people = $state('pedro');
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
  const lang = $derived(dir === 'rtl' ? language.current : undefined);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <ContextMenu>
    <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
      <span class="hidden pointer-fine:inline-block">{t.rightClick}</span>
      <span class="hidden pointer-coarse:inline-block">{t.longPress}</span>
    </ContextMenuTrigger>
    <ContextMenuContent class="w-48" {dir} data-lang={lang}>
      <ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>{t.navigation}</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44" {dir} data-lang={lang}>
            <ContextMenuGroup>
              <ContextMenuItem>
                <ArrowLeftIcon />
                {t.back}
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem disabled>
                <ArrowRightIcon />
                {t.forward}
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                <RotateCwIcon />
                {t.reload}
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>{t.moreTools}</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44" {dir} data-lang={lang}>
            <ContextMenuGroup>
              <ContextMenuItem>{t.savePage}</ContextMenuItem>
              <ContextMenuItem>{t.createShortcut}</ContextMenuItem>
              <ContextMenuItem>{t.nameWindow}</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>{t.developerTools}</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">{t.delete}</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuCheckboxItem checked>{t.showBookmarks}</ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem>{t.showFullUrls}</ContextMenuCheckboxItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuRadioGroup bind:value={people}>
          <ContextMenuLabel>{t.people}</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">{t.pedro}</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">{t.colm}</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</div>
