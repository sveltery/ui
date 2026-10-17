<script lang="ts">
  import CreditCardIcon from '@lucide/svelte/icons/credit-card';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import UserIcon from '@lucide/svelte/icons/user';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        open: 'Open',
        account: 'Account',
        profile: 'Profile',
        billing: 'Billing',
        settings: 'Settings',
        logout: 'Log out',
        team: 'Team',
        inviteUsers: 'Invite users',
        email: 'Email',
        message: 'Message',
        more: 'More',
        calendar: 'Calendar',
        chat: 'Chat',
        webhook: 'Webhook',
        advanced: 'Advanced...',
        newTeam: 'New Team',
        view: 'View',
        statusBar: 'Status Bar',
        activityBar: 'Activity Bar',
        panel: 'Panel',
        position: 'Position',
        top: 'Top',
        bottom: 'Bottom',
        right: 'Right',
        left: 'Left'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        open: 'افتح القائمة',
        account: 'الحساب',
        profile: 'الملف الشخصي',
        billing: 'الفوترة',
        settings: 'الإعدادات',
        logout: 'تسجيل الخروج',
        team: 'الفريق',
        inviteUsers: 'دعوة المستخدمين',
        email: 'البريد الإلكتروني',
        message: 'رسالة',
        more: 'المزيد',
        calendar: 'تقويم',
        chat: 'دردشة',
        webhook: 'خطاف ويب',
        advanced: 'متقدم...',
        newTeam: 'فريق جديد',
        view: 'عرض',
        statusBar: 'شريط الحالة',
        activityBar: 'شريط النشاط',
        panel: 'اللوحة',
        position: 'الموضع',
        top: 'أعلى',
        bottom: 'أسفل',
        right: 'يمين',
        left: 'يسار'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        open: 'פתח תפריט',
        account: 'חשבון',
        profile: 'פרופיל',
        billing: 'חיוב',
        settings: 'הגדרות',
        logout: 'התנתק',
        team: 'הצוות',
        inviteUsers: 'הזמן משתמשים',
        email: 'אימייל',
        message: 'הודעה',
        more: 'עוד',
        calendar: 'יומן',
        chat: "צ'אט",
        webhook: 'Webhook',
        advanced: 'מתקדם...',
        newTeam: 'צוות חדש',
        view: 'תצוגה',
        statusBar: 'שורת סטטוס',
        activityBar: 'שורת פעילות',
        panel: 'לוח',
        position: 'מיקום',
        top: 'למעלה',
        bottom: 'למטה',
        right: 'ימין',
        left: 'שמאל'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
  let showPanel = $state(false);
  let position = $state('bottom');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
  const lang = $derived(dir === 'rtl' ? language : undefined);
</script>

<div class="flex flex-col items-start gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        {t.open}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={dir === 'rtl' ? 'end' : 'start'} {dir} class="w-36" data-lang={lang}>
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t.account}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent {dir} data-lang={lang}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <UserIcon />
                    {t.profile}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCardIcon />
                    {t.billing}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon />
                    {t.settings}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.team}</DropdownMenuLabel>
          <DropdownMenuItem>{t.team}</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>{t.inviteUsers}</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent {dir} data-lang={lang}>
                <DropdownMenuItem>{t.email}</DropdownMenuItem>
                <DropdownMenuItem>{t.message}</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>{t.more}</DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent {dir} data-lang={lang}>
                      <DropdownMenuItem>{t.calendar}</DropdownMenuItem>
                      <DropdownMenuItem>{t.chat}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>{t.webhook}</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>{t.advanced}</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            {t.newTeam}
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.view}</DropdownMenuLabel>
          <DropdownMenuCheckboxItem bind:checked={showStatusBar}>{t.statusBar}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={showActivityBar}>{t.activityBar}</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={showPanel}>{t.panel}</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t.position}</DropdownMenuLabel>
          <DropdownMenuRadioGroup bind:value={position}>
            <DropdownMenuRadioItem value="top">{t.top}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">{t.bottom}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">{t.right}</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="left">{t.left}</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">{t.logout}</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </DirectionProvider>
</div>
