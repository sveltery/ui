<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '$registry/bases/base/ui/command';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const translations = {
    en: {
      dir: 'ltr',
      placeholder: 'Type a command or search...',
      empty: 'No results found.',
      suggestions: 'Suggestions',
      calendar: 'Calendar',
      searchEmoji: 'Search Emoji',
      calculator: 'Calculator',
      settings: 'Settings',
      profile: 'Profile',
      billing: 'Billing',
    },
    ar: {
      dir: 'rtl',
      placeholder: 'اكتب أمرًا أو ابحث...',
      empty: 'لم يتم العثور على نتائج.',
      suggestions: 'اقتراحات',
      calendar: 'التقويم',
      searchEmoji: 'البحث عن الرموز التعبيرية',
      calculator: 'الآلة الحاسبة',
      settings: 'الإعدادات',
      profile: 'الملف الشخصي',
      billing: 'الفوترة',
    },
    he: {
      dir: 'rtl',
      placeholder: 'הקלד פקודה או חפש...',
      empty: 'לא נמצאו תוצאות.',
      suggestions: 'הצעות',
      calendar: 'לוח שנה',
      searchEmoji: "חפש אמוג'י",
      calculator: 'מחשבון',
      settings: 'הגדרות',
      profile: 'פרופיל',
      billing: 'חיוב',
    },
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
    <Command class="rounded-lg border" dir={t.dir}>
      <CommandInput placeholder={t.placeholder} dir={t.dir} />
      <CommandList>
        <CommandEmpty>{t.empty}</CommandEmpty>
        <CommandGroup heading={t.suggestions}>
          <CommandItem>
            <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarBlankIcon" remixicon="RiCalendarLine" />
            <span>{t.calendar}</span>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder lucide="SmileIcon" tabler="IconMoodSmile" hugeicons="SmileIcon" phosphor="SmileyIcon" remixicon="RiEmotionLine" />
            <span>{t.searchEmoji}</span>
          </CommandItem>
          <CommandItem disabled>
            <IconPlaceholder lucide="CalculatorIcon" tabler="IconCalculator" hugeicons="CalculatorIcon" phosphor="CalculatorIcon" remixicon="RiCalculatorLine" />
            <span>{t.calculator}</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading={t.settings}>
          <CommandItem>
            <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
            <span>{t.profile}</span><CommandShortcut>⌘P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
            <span>{t.billing}</span><CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
            <span>{t.settings}</span><CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </DirectionProvider>
</div>
