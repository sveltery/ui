<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { MediaQuery } from 'svelte/reactivity';
  import BadgeCheck from '@lucide/svelte/icons/badge-check';
  import Bell from '@lucide/svelte/icons/bell';
  import BookOpen from '@lucide/svelte/icons/book-open';
  import Bot from '@lucide/svelte/icons/bot';
  import ChevronRight from '@lucide/svelte/icons/chevron-right';
  import ChevronsUpDown from '@lucide/svelte/icons/chevrons-up-down';
  import CreditCard from '@lucide/svelte/icons/credit-card';
  import Folder from '@lucide/svelte/icons/folder';
  import Forward from '@lucide/svelte/icons/forward';
  import Frame from '@lucide/svelte/icons/frame';
  import GalleryVerticalEnd from '@lucide/svelte/icons/gallery-vertical-end';
  import LogOut from '@lucide/svelte/icons/log-out';
  import Map from '@lucide/svelte/icons/map';
  import MoreHorizontal from '@lucide/svelte/icons/more-horizontal';
  import PieChart from '@lucide/svelte/icons/pie-chart';
  import Settings2 from '@lucide/svelte/icons/settings-2';
  import Sparkles from '@lucide/svelte/icons/sparkles';
  import SquareTerminal from '@lucide/svelte/icons/square-terminal';
  import Trash2 from '@lucide/svelte/icons/trash-2';
  import { Avatar, AvatarFallback, AvatarImage } from '$registry/bases/base/ui/avatar';
  import { Button } from '$registry/bases/base/ui/button';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger
  } from '$registry/bases/base/ui/sidebar';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        teamName: 'Acme Inc',
        teamPlan: 'Enterprise',
        platform: 'Platform',
        projects: 'Projects',
        viewProject: 'View Project',
        shareProject: 'Share Project',
        deleteProject: 'Delete Project',
        more: 'More',
        upgradeToPro: 'Upgrade to Pro',
        account: 'Account',
        billing: 'Billing',
        notifications: 'Notifications',
        logOut: 'Log out',
        playground: 'Playground',
        history: 'History',
        starred: 'Starred',
        settings: 'Settings',
        models: 'Models',
        genesis: 'Genesis',
        explorer: 'Explorer',
        quantum: 'Quantum',
        documentation: 'Documentation',
        introduction: 'Introduction',
        getStarted: 'Get Started',
        tutorials: 'Tutorials',
        changelog: 'Changelog',
        general: 'General',
        team: 'Team',
        limits: 'Limits',
        designEngineering: 'Design Engineering',
        salesMarketing: 'Sales & Marketing',
        travel: 'Travel'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        teamName: 'شركة أكمي',
        teamPlan: 'المؤسسة',
        platform: 'المنصة',
        projects: 'المشاريع',
        viewProject: 'عرض المشروع',
        shareProject: 'مشاركة المشروع',
        deleteProject: 'حذف المشروع',
        more: 'المزيد',
        upgradeToPro: 'ترقية إلى Pro',
        account: 'الحساب',
        billing: 'الفوترة',
        notifications: 'الإشعارات',
        logOut: 'تسجيل الخروج',
        playground: 'ملعب',
        history: 'السجل',
        starred: 'المميز',
        settings: 'الإعدادات',
        models: 'النماذج',
        genesis: 'جينيسيس',
        explorer: 'إكسبلورر',
        quantum: 'كوانتوم',
        documentation: 'التوثيق',
        introduction: 'مقدمة',
        getStarted: 'ابدأ',
        tutorials: 'الدروس',
        changelog: 'سجل التغييرات',
        general: 'عام',
        team: 'الفريق',
        limits: 'الحدود',
        designEngineering: 'هندسة التصميم',
        salesMarketing: 'المبيعات والتسويق',
        travel: 'السفر'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        teamName: 'אקמי בע״מ',
        teamPlan: 'ארגוני',
        platform: 'פלטפורמה',
        projects: 'פרויקטים',
        viewProject: 'הצג פרויקט',
        shareProject: 'שתף פרויקט',
        deleteProject: 'מחק פרויקט',
        more: 'עוד',
        upgradeToPro: 'שדרג ל-Pro',
        account: 'חשבון',
        billing: 'חיוב',
        notifications: 'התראות',
        logOut: 'התנתק',
        playground: 'מגרש משחקים',
        history: 'היסטוריה',
        starred: 'מועדפים',
        settings: 'הגדרות',
        models: 'מודלים',
        genesis: "ג'נסיס",
        explorer: 'אקספלורר',
        quantum: 'קוונטום',
        documentation: 'תיעוד',
        introduction: 'מבוא',
        getStarted: 'התחל',
        tutorials: 'מדריכים',
        changelog: 'יומן שינויים',
        general: 'כללי',
        team: 'צוות',
        limits: 'מגבלות',
        designEngineering: 'הנדסת עיצוב',
        salesMarketing: 'מכירות ושיווק',
        travel: 'נסיעות'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);

  const navMain = $derived([
    {
      title: t.playground,
      url: '#',
      icon: SquareTerminal,
      isActive: true,
      items: [
        { title: t.history, url: '#' },
        { title: t.starred, url: '#' },
        { title: t.settings, url: '#' }
      ]
    },
    {
      title: t.models,
      url: '#',
      icon: Bot,
      items: [
        { title: t.genesis, url: '#' },
        { title: t.explorer, url: '#' },
        { title: t.quantum, url: '#' }
      ]
    },
    {
      title: t.documentation,
      url: '#',
      icon: BookOpen,
      items: [
        { title: t.introduction, url: '#' },
        { title: t.getStarted, url: '#' },
        { title: t.tutorials, url: '#' },
        { title: t.changelog, url: '#' }
      ]
    },
    {
      title: t.settings,
      url: '#',
      icon: Settings2,
      items: [
        { title: t.general, url: '#' },
        { title: t.team, url: '#' },
        { title: t.billing, url: '#' },
        { title: t.limits, url: '#' }
      ]
    }
  ]);

  const projects = $derived([
    { name: t.designEngineering, url: '#', icon: Frame },
    { name: t.salesMarketing, url: '#', icon: PieChart },
    { name: t.travel, url: '#', icon: Map }
  ]);

  const user = {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg'
  };

  const isMobile = new MediaQuery('max-width: 767px');
  type RenderProps = HTMLAttributes<HTMLElement> & { class?: string };
</script>

{#snippet teamLink(props: RenderProps, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

{#snippet userButton(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props} size="lg" class={[props.class, 'data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground']}>{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet moreAction(props: RenderProps, _state: unknown, children?: Snippet)}
  <SidebarMenuAction {...props} showOnHover>{@render children?.()}</SidebarMenuAction>
{/snippet}

<DirectionProvider direction={dir}>
  <div class="relative h-[32rem] w-full transform-gpu overflow-hidden rounded-lg border" {dir}>
    <div class="absolute top-4 right-4 z-10 flex gap-2 rtl:right-auto rtl:left-4" dir="ltr">
      {#each Object.keys(translations) as code (code)}
        <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
          {code}
        </Button>
      {/each}
    </div>
    <SidebarProvider class="h-full min-h-0">
      <Sidebar collapsible="icon" {dir} side={dir === 'ltr' ? 'left' : 'right'} variant="floating" class="absolute h-full">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" render={teamLink}>
                <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd class="size-4" />
                </div>
                <div class="flex flex-col gap-0.5 leading-none">
                  <span class="font-medium">{t.teamName}</span>
                  <span class="">{t.teamPlan}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>{t.platform}</SidebarGroupLabel>
            <SidebarMenu>
              {#each navMain as item (item.icon)}
                {#snippet trigger(props: RenderProps, _state: unknown, children?: Snippet)}
                  <SidebarMenuButton {...props} tooltip={item.title}>{@render children?.()}</SidebarMenuButton>
                {/snippet}
                {#snippet menuItem(props: RenderProps, _state: unknown, children?: Snippet)}
                  <SidebarMenuItem {...props}>{@render children?.()}</SidebarMenuItem>
                {/snippet}
                <Collapsible open={item.isActive} class="group/collapsible" render={menuItem}>
                  <CollapsibleTrigger render={trigger}>
                    <item.icon />
                    <span>{item.title}</span>
                    <ChevronRight class="ms-auto transition-transform duration-200 group-data-open/collapsible:rotate-90 rtl:rotate-180 rtl:group-data-open/collapsible:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {#each item.items as subItem (subItem.title)}
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton href={subItem.url}>
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      {/each}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              {/each}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup class="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>{t.projects}</SidebarGroupLabel>
            <SidebarMenu>
              {#each projects as item (item.icon)}
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    {#snippet render(props: RenderProps, _state: unknown, children?: Snippet)}
                      <a href={item.url} {...props}>{@render children?.()}</a>
                    {/snippet}
                    <item.icon />
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={moreAction}>
                      <MoreHorizontal />
                      <span class="sr-only">{t.more}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-48 rounded-lg" side={isMobile.current ? 'bottom' : 'inline-end'} align={isMobile.current ? 'end' : 'start'} {dir}>
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Folder class="text-muted-foreground" />
                          <span>{t.viewProject}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Forward class="text-muted-foreground" />
                          <span>{t.shareProject}</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <Trash2 class="text-muted-foreground" />
                          <span>{t.deleteProject}</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              {/each}
              <SidebarMenuItem>
                <SidebarMenuButton class="text-sidebar-foreground/70">
                  <MoreHorizontal class="text-sidebar-foreground/70" />
                  <span>{t.more}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={userButton}>
                  <Avatar class="rounded-lg">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div class="grid flex-1 text-start text-sm leading-tight">
                    <span class="truncate font-medium">{user.name}</span>
                    <span class="truncate text-xs">{user.email}</span>
                  </div>
                  <ChevronsUpDown class="ms-auto size-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent class="w-(--anchor-width) min-w-56 rounded-lg" side={isMobile.current ? 'bottom' : 'inline-end'} align="end" sideOffset={4} {dir}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel class="p-0 font-normal">
                      <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback class="rounded-lg">CN</AvatarFallback>
                        </Avatar>
                        <div class="grid flex-1 text-start text-sm leading-tight">
                          <span class="truncate font-medium">{user.name}</span>
                          <span class="truncate text-xs">{user.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <Sparkles />
                      {t.upgradeToPro}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <BadgeCheck />
                      {t.account}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CreditCard />
                      {t.billing}
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Bell />
                      {t.notifications}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <LogOut />
                      {t.logOut}
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset class="min-w-0 overflow-auto">
        <header class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12" {dir}>
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
          </div>
        </header>
      </SidebarInset>
    </SidebarProvider>
  </div>
</DirectionProvider>
