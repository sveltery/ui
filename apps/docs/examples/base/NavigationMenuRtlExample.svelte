<script lang="ts">
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import CircleCheckIcon from '@lucide/svelte/icons/circle-check';
  import CircleDashedIcon from '@lucide/svelte/icons/circle-dashed';
  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle
  } from '$registry/bases/base/ui/navigation-menu';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        gettingStarted: 'Getting started',
        introduction: 'Introduction',
        introductionDesc: 'Re-usable components built with Tailwind CSS.',
        installation: 'Installation',
        installationDesc: 'How to install dependencies and structure your app.',
        typography: 'Typography',
        typographyDesc: 'Styles for headings, paragraphs, lists...etc',
        components: 'Components',
        alertDialog: 'Alert Dialog',
        alertDialogDesc: 'A modal dialog that interrupts the user with important content and expects a response.',
        hoverCard: 'Hover Card',
        hoverCardDesc: 'For sighted users to preview content available behind a link.',
        progress: 'Progress',
        progressDesc: 'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
        scrollArea: 'Scroll-area',
        scrollAreaDesc: 'Visually or semantically separates content.',
        tabs: 'Tabs',
        tabsDesc: 'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
        tooltip: 'Tooltip',
        tooltipDesc: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
        withIcon: 'With Icon',
        backlog: 'Backlog',
        toDo: 'To Do',
        done: 'Done',
        docs: 'Docs'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        gettingStarted: 'البدء',
        introduction: 'مقدمة',
        introductionDesc: 'مكونات قابلة لإعادة الاستخدام مبنية باستخدام Tailwind CSS.',
        installation: 'التثبيت',
        installationDesc: 'كيفية تثبيت التبعيات وتنظيم تطبيقك.',
        typography: 'الطباعة',
        typographyDesc: 'أنماط للعناوين والفقرات والقوائم...إلخ',
        components: 'المكونات',
        alertDialog: 'حوار التنبيه',
        alertDialogDesc: 'حوار نافذة يقطع المستخدم بمحتوى مهم ويتوقع استجابة.',
        hoverCard: 'بطاقة التحويم',
        hoverCardDesc: 'للمستخدمين المبصرين لمعاينة المحتوى المتاح خلف الرابط.',
        progress: 'التقدم',
        progressDesc: 'يعرض مؤشرًا يوضح تقدم إتمام المهمة، عادةً يتم عرضه كشريط تقدم.',
        scrollArea: 'منطقة التمرير',
        scrollAreaDesc: 'يفصل المحتوى بصريًا أو دلاليًا.',
        tabs: 'التبويبات',
        tabsDesc: 'مجموعة من أقسام المحتوى المتعددة الطبقات—المعروفة بألواح التبويب—التي يتم عرضها واحدة في كل مرة.',
        tooltip: 'تلميح',
        tooltipDesc: 'نافذة منبثقة تعرض معلومات متعلقة بعنصر عندما يتلقى العنصر التركيز على لوحة المفاتيح أو عند تحويم الماوس فوقه.',
        withIcon: 'مع أيقونة',
        backlog: 'قائمة الانتظار',
        toDo: 'المهام',
        done: 'منجز',
        docs: 'الوثائق'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        gettingStarted: 'התחלה',
        introduction: 'הקדמה',
        introductionDesc: 'רכיבים לשימוש חוזר שנבנו עם Tailwind CSS.',
        installation: 'התקנה',
        installationDesc: 'כיצד להתקין תלויות ולבנות את האפליקציה שלך.',
        typography: 'טיפוגרפיה',
        typographyDesc: "סגנונות לכותרות, פסקאות, רשימות...וכו'",
        components: 'רכיבים',
        alertDialog: 'דיאלוג התראה',
        alertDialogDesc: 'דיאלוג מודאלי שמפריע למשתמש עם תוכן חשוב ומצפה לתגובה.',
        hoverCard: 'כרטיס ריחוף',
        hoverCardDesc: 'למשתמשים רואים כדי להציג תצוגה מקדימה של תוכן זמין מאחורי קישור.',
        progress: 'התקדמות',
        progressDesc: 'מציג אינדיקטור המציג את התקדמות ההשלמה של משימה, בדרך כלל מוצג כסרגל התקדמות.',
        scrollArea: 'אזור גלילה',
        scrollAreaDesc: 'מפריד תוכן חזותית או סמנטית.',
        tabs: 'כרטיסיות',
        tabsDesc: 'קבוצה של חלקי תוכן מרובדים—המכונים לוחות כרטיסיות—המוצגים אחד בכל פעם.',
        tooltip: 'טולטיפ',
        tooltipDesc: 'חלון קופץ המציג מידע הקשור לאלמנט כאשר האלמנט מקבל מיקוד מקלדת או כאשר העכבר מרחף מעליו.',
        withIcon: 'עם אייקון',
        backlog: 'רשימת המתנה',
        toDo: 'לעשות',
        done: 'הושלם',
        docs: 'תיעוד'
      }
    }
  } as const;

  const components = [
    { titleKey: 'alertDialog', descriptionKey: 'alertDialogDesc', href: '/docs/components/alert-dialog' },
    { titleKey: 'hoverCard', descriptionKey: 'hoverCardDesc', href: '/docs/components/hover-card' },
    { titleKey: 'progress', descriptionKey: 'progressDesc', href: '/docs/components/progress' },
    { titleKey: 'scrollArea', descriptionKey: 'scrollAreaDesc', href: '/docs/components/scroll-area' },
    { titleKey: 'tabs', descriptionKey: 'tabsDesc', href: '/docs/components/tabs' },
    { titleKey: 'tooltip', descriptionKey: 'tooltipDesc', href: '/docs/components/tooltip' }
  ] as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
  const lang = $derived(dir === 'rtl' ? language.current : undefined);
</script>

{#snippet ListItem(title: string, href: string, description: string)}
  <li>
    <NavigationMenuLink {href}>
      <div class="flex flex-col gap-1 text-sm">
        <div class="leading-none font-medium">{title}</div>
        <div class="line-clamp-2 text-muted-foreground">{description}</div>
      </div>
    </NavigationMenuLink>
  </li>
{/snippet}

<div class="flex w-full flex-col items-start gap-4">
  <NavigationMenu {dir} align={dir === 'rtl' ? 'end' : 'start'}>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>{t.gettingStarted}</NavigationMenuTrigger>
        <NavigationMenuContent {dir} data-lang={lang}>
          <ul class="w-96">
            {@render ListItem(t.introduction, '/docs', t.introductionDesc)}
            {@render ListItem(t.installation, '/docs/installation', t.installationDesc)}
            {@render ListItem(t.typography, '/docs/components/typography', t.typographyDesc)}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem class="hidden md:flex">
        <NavigationMenuTrigger>{t.components}</NavigationMenuTrigger>
        <NavigationMenuContent {dir} data-lang={lang}>
          <ul class="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {#each components as component (component.titleKey)}
              {@render ListItem(t[component.titleKey], component.href, t[component.descriptionKey])}
            {/each}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuTrigger>{t.withIcon}</NavigationMenuTrigger>
        <NavigationMenuContent {dir} data-lang={lang}>
          <ul class="grid w-[200px]">
            <li>
              <NavigationMenuLink href="#" class="flex-row items-center gap-2">
                <CircleAlertIcon />
                {t.backlog}
              </NavigationMenuLink>
              <NavigationMenuLink href="#" class="flex-row items-center gap-2">
                <CircleDashedIcon />
                {t.toDo}
              </NavigationMenuLink>
              <NavigationMenuLink href="#" class="flex-row items-center gap-2">
                <CircleCheckIcon />
                {t.done}
              </NavigationMenuLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink href="/docs" class={navigationMenuTriggerStyle()} data-lang={lang}>{t.docs}</NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</div>
