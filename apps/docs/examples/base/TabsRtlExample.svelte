<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$registry/bases/base/ui/card';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      overview: 'Overview',
      analytics: 'Analytics',
      reports: 'Reports',
      settings: 'Settings',
      overviewTitle: 'Overview',
      overviewDesc:
        'View your key metrics and recent project activity. Track progress across all your active projects.',
      overviewContent: 'You have 12 active projects and 3 pending tasks.',
      analyticsTitle: 'Analytics',
      analyticsDesc:
        'Track performance and user engagement metrics. Monitor trends and identify growth opportunities.',
      analyticsContent: 'Page views are up 25% compared to last month.',
      reportsTitle: 'Reports',
      reportsDesc:
        'Generate and download your detailed reports. Export data in multiple formats for analysis.',
      reportsContent: 'You have 5 reports ready and available to export.',
      settingsTitle: 'Settings',
      settingsDesc:
        'Manage your account preferences and options. Customize your experience to fit your needs.',
      settingsContent: 'Configure notifications, security, and themes.',
    },
    ar: {
      dir: 'rtl',
      overview: 'نظرة عامة',
      analytics: 'التحليلات',
      reports: 'التقارير',
      settings: 'الإعدادات',
      overviewTitle: 'نظرة عامة',
      overviewDesc:
        'عرض مقاييسك الرئيسية وأنشطة المشروع الأخيرة. تتبع التقدم عبر جميع مشاريعك النشطة.',
      overviewContent: 'لديك ١٢ مشروعًا نشطًا و٣ مهام معلقة.',
      analyticsTitle: 'التحليلات',
      analyticsDesc:
        'تتبع مقاييس الأداء ومشاركة المستخدمين. راقب الاتجاهات وحدد فرص النمو.',
      analyticsContent: 'زادت مشاهدات الصفحة بنسبة ٢٥٪ مقارنة بالشهر الماضي.',
      reportsTitle: 'التقارير',
      reportsDesc:
        'إنشاء وتنزيل تقاريرك التفصيلية. تصدير البيانات بتنسيقات متعددة للتحليل.',
      reportsContent: 'لديك ٥ تقارير جاهزة ومتاحة للتصدير.',
      settingsTitle: 'الإعدادات',
      settingsDesc:
        'إدارة تفضيلات حسابك وخياراته. تخصيص تجربتك لتناسب احتياجاتك.',
      settingsContent: 'تكوين الإشعارات والأمان والسمات.',
    },
    he: {
      dir: 'rtl',
      overview: 'סקירה כללית',
      analytics: 'אנליטיקה',
      reports: 'דוחות',
      settings: 'הגדרות',
      overviewTitle: 'סקירה כללית',
      overviewDesc:
        'הצג את המדדים העיקריים שלך ופעילות הפרויקט האחרונה. עקוב אחר התקדמות בכל הפרויקטים הפעילים שלך.',
      overviewContent: 'יש לך 12 פרויקטים פעילים ו-3 משימות ממתינות.',
      analyticsTitle: 'אנליטיקה',
      analyticsDesc:
        'עקוב אחר ביצועים ומדדי מעורבות משתמשים. עקוב אחר מגמות וזהה הזדמנויות צמיחה.',
      analyticsContent: 'צפיות בדף עלו ב-25% בהשוואה לחודש שעבר.',
      reportsTitle: 'דוחות',
      reportsDesc:
        'צור והורד את הדוחות המפורטים שלך. ייצא נתונים בפורמטים מרובים לניתוח.',
      reportsContent: 'יש לך 5 דוחות מוכנים וזמינים לייצוא.',
      settingsTitle: 'הגדרות',
      settingsDesc:
        'נהל את העדפות החשבון והאפשרויות שלך. התאם אישית את החוויה שלך כך שתתאים לצרכים שלך.',
      settingsContent: 'הגדר התראות, אבטחה וערכות נושא.',
    },
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Tabs value="overview" class="w-full max-w-sm" dir={t.dir}>
    <TabsList dir={t.dir}>
      <TabsTrigger value="overview">{t.overview}</TabsTrigger>
      <TabsTrigger value="analytics">{t.analytics}</TabsTrigger>
      <TabsTrigger value="reports">{t.reports}</TabsTrigger>
      <TabsTrigger value="settings">{t.settings}</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <Card dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.overviewTitle}</CardTitle>
          <CardDescription>{t.overviewDesc}</CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">{t.overviewContent}</CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="analytics">
      <Card dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.analyticsTitle}</CardTitle>
          <CardDescription>{t.analyticsDesc}</CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">{t.analyticsContent}</CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="reports">
      <Card dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.reportsTitle}</CardTitle>
          <CardDescription>{t.reportsDesc}</CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">{t.reportsContent}</CardContent>
      </Card>
    </TabsContent>
    <TabsContent value="settings">
      <Card dir={t.dir}>
        <CardHeader>
          <CardTitle>{t.settingsTitle}</CardTitle>
          <CardDescription>{t.settingsDesc}</CardDescription>
        </CardHeader>
        <CardContent class="text-sm text-muted-foreground">{t.settingsContent}</CardContent>
      </Card>
    </TabsContent>
  </Tabs>
</div>
