<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Card } from '$registry/bases/base/ui/card';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
  } from '$registry/bases/base/ui/sidebar';
</script>

{#snippet sidebarSection(label: string, className: string, items: Snippet)}
  <Card class="w-full overflow-hidden rounded-3xl py-0 {className}">
    <SidebarProvider class="min-h-0">
      <Sidebar collapsible="none" class="w-full bg-transparent">
        <SidebarContent class="gap-0 overflow-hidden">
          <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu class="gap-1">{@render items()}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  </Card>
{/snippet}

{#snippet overviewItems()}
  <SidebarMenuItem>
    <SidebarMenuButton isActive>
      <IconPlaceholder lucide="FileChartColumnIcon" tabler="IconReport" hugeicons="Analytics01Icon" phosphor="ChartLineIcon" remixicon="RiFileChartLine" />
      Analytics
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="ArrowLeftRightIcon" tabler="IconArrowsLeftRight" hugeicons="ArrowDataTransferHorizontalIcon" phosphor="ArrowsLeftRightIcon" remixicon="RiArrowLeftRightLine" />
      Transactions
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="TrendingUpIcon" tabler="IconTrendingUp" hugeicons="AnalyticsUpIcon" phosphor="TrendUpIcon" remixicon="RiLineChartLine" />
      Investments
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="Building2Icon" tabler="IconBuildingBank" hugeicons="BankIcon" phosphor="BankIcon" remixicon="RiBankLine" />
      Accounts
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="PieChartIcon" tabler="IconChartPie" hugeicons="PieChartIcon" phosphor="ChartPieIcon" remixicon="RiPieChartLine" />
      Spending
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet planningItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="FileTextIcon" tabler="IconFileText" hugeicons="File02Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />
      Documents
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="WalletIcon" tabler="IconWallet" hugeicons="Wallet01Icon" phosphor="WalletIcon" remixicon="RiWalletLine" />
      Budget
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="FileBarChartIcon" tabler="IconReportAnalytics" hugeicons="ChartBarLineIcon" phosphor="ChartBarIcon" remixicon="RiBarChartLine" />
      Reports
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="TargetIcon" tabler="IconTarget" hugeicons="Target02Icon" phosphor="TargetIcon" remixicon="RiFocus3Line" />
      Goals
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="Calendar03Icon" phosphor="CalendarIcon" remixicon="RiCalendarLine" />
      Calendar
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet supportItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="CircleHelpIcon" tabler="IconHelp" hugeicons="HelpCircleIcon" phosphor="QuestionIcon" remixicon="RiQuestionLine" />
      Help Center
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="BookOpenIcon" tabler="IconBook" hugeicons="BookOpen02Icon" phosphor="BookOpenIcon" remixicon="RiBookOpenLine" />
      Docs
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="MessageSquareIcon" tabler="IconMessage" hugeicons="Message01Icon" phosphor="ChatIcon" remixicon="RiChat1Line" />
      Contact Us
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="ActivityIcon" tabler="IconActivity" hugeicons="ActivityIcon" phosphor="PulseIcon" remixicon="RiPulseLine" />
      Status
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="GlobeIcon" tabler="IconGlobe" hugeicons="Globe02Icon" phosphor="GlobeIcon" remixicon="RiGlobeLine" />
      Community
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet accountItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
      Profile
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton isActive>
      <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
      Billing
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="Notification03Icon" phosphor="BellIcon" remixicon="RiBellLine" />
      Notifications
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="ShieldIcon" tabler="IconShield" hugeicons="ShieldIcon" phosphor="ShieldIcon" remixicon="RiShieldLine" />
      Security
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <IconPlaceholder lucide="PaintbrushIcon" tabler="IconPalette" hugeicons="PaintBoardIcon" phosphor="PaletteIcon" remixicon="RiPaletteLine" />
      Appearance
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

<div class="grid w-full grid-cols-2 gap-4 xl:gap-6">
  {@render sidebarSection('Overview', 'xl:col-start-1 xl:row-start-2', overviewItems)}
  {@render sidebarSection('Planning', 'xl:col-start-1 xl:row-start-1', planningItems)}
  {@render sidebarSection('Support', 'flex xl:col-start-2 xl:row-start-1', supportItems)}
  {@render sidebarSection('Account', 'flex xl:col-start-2 xl:row-start-2', accountItems)}
</div>
