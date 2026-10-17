<script lang="ts">
  import { ActivityIcon, Analytics01Icon, AnalyticsUpIcon, ArrowDataTransferHorizontalIcon, BankIcon, BookOpen02Icon, Calendar03Icon, ChartBarLineIcon, CreditCardIcon, File02Icon, Globe02Icon, HelpCircleIcon, Message01Icon, Notification03Icon, PaintBoardIcon, PieChartIcon, ShieldIcon, Target02Icon, UserIcon, Wallet01Icon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import type { Snippet } from 'svelte';
  import { Card } from '$registry/bases/base/ui/card';
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
      <HugeiconsIcon icon={Analytics01Icon} strokeWidth={2} />
      Analytics
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} strokeWidth={2} />
      Transactions
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={AnalyticsUpIcon} strokeWidth={2} />
      Investments
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={BankIcon} strokeWidth={2} />
      Accounts
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={PieChartIcon} strokeWidth={2} />
      Spending
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet planningItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={File02Icon} strokeWidth={2} />
      Documents
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />
      Budget
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={ChartBarLineIcon} strokeWidth={2} />
      Reports
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Target02Icon} strokeWidth={2} />
      Goals
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
      Calendar
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet supportItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
      Help Center
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />
      Docs
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
      Contact Us
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={ActivityIcon} strokeWidth={2} />
      Status
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Globe02Icon} strokeWidth={2} />
      Community
    </SidebarMenuButton>
  </SidebarMenuItem>
{/snippet}

{#snippet accountItems()}
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={UserIcon} strokeWidth={2} />
      Profile
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton isActive>
      <HugeiconsIcon icon={CreditCardIcon} strokeWidth={2} />
      Billing
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={Notification03Icon} strokeWidth={2} />
      Notifications
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={ShieldIcon} strokeWidth={2} />
      Security
    </SidebarMenuButton>
  </SidebarMenuItem>
  <SidebarMenuItem>
    <SidebarMenuButton>
      <HugeiconsIcon icon={PaintBoardIcon} strokeWidth={2} />
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
