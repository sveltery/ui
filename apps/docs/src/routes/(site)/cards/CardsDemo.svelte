<script lang="ts">
  import MessageScrollerDemo from '../../../../examples/base/MessageScrollerDemo.svelte';
  import AccountAccess from './AccountAccess.svelte';
  import AnalyticsCard from './AnalyticsCard.svelte';
  import ClaimableBalance from './ClaimableBalance.svelte';
  import ContributionHistory from './ContributionHistory.svelte';
  import DividendIncome from './DividendIncome.svelte';
  import EmptyDistributeTrack from './EmptyDistributeTrack.svelte';
  import NewMilestone from './NewMilestone.svelte';
  import NotificationSettings from './NotificationSettings.svelte';
  import Payments from './Payments.svelte';
  import PayoutThreshold from './PayoutThreshold.svelte';
  import PowerUsage from './PowerUsage.svelte';
  import QrConnect from './QrConnect.svelte';
  import SavingsTargets from './SavingsTargets.svelte';
  import SidebarNav from './SidebarNav.svelte';
  import UIElements from './UIElements.svelte';
  import CardsSkeletonRails from './skeleton/CardsSkeletonRails.svelte';

  // The page body is .style-nova, so Nova rules that Rhea leaves unset would leak into these Rhea cards.
  const cancelNova = [
    '**:data-[slot=card]:has-data-[slot=card-footer]:pb-(--card-spacing)',
    '**:data-[slot=card-footer]:border-t-0 **:data-[slot=card-footer]:bg-transparent **:data-[slot=card-footer]:py-0',
    '**:data-[slot=card-title]:[--tw-leading:initial] **:data-[size=sm]:**:data-[slot=card-title]:text-base',
    '**:data-[slot=item-description]:[--tw-leading:initial]',
    'dark:**:data-[slot=input]:bg-input/50 dark:**:data-[slot=textarea]:bg-input/50 dark:**:data-[slot=input-group]:bg-input/50 dark:**:data-[slot=select-trigger]:bg-input/50',
    'dark:**:data-[slot=checkbox]:not-data-checked:bg-input/90 dark:**:data-[slot=radio-group-item]:not-data-checked:bg-input/90',
  ];
</script>

<div
  data-slot="demo"
  class={['theme-neutral style-rhea relative flex w-full max-w-none flex-col gap-(--gap) overflow-hidden bg-muted p-12 pb-0! [--gap:--spacing(8)] 3xl:[--gap:--spacing(8)] min-[1900px]:p-12 min-[1900px]:[--gap:--spacing(10)]! lg:p-6 lg:[--gap:--spacing(6)] dark:bg-background', cancelNova]}
>
  <CardsSkeletonRails />
  <div class="relative z-10 mx-auto grid gap-(--gap) **:data-[slot=card]:w-full min-[1400px]:grid-cols-4! min-[1900px]:grid-cols-5! md:max-w-3xl md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:max-w-[1600px] 2xl:max-w-[1900px]">
    <div class="flex flex-col items-start gap-(--gap)">
      <UIElements />
      <SidebarNav />
      <SavingsTargets />
    </div>
    <div class="hidden flex-col gap-(--gap) lg:flex">
      <ContributionHistory />
      <ClaimableBalance />
      <DividendIncome />
    </div>
    <div class="hidden flex-col gap-(--gap) min-[1400px]:flex">
      <NewMilestone />
      <PayoutThreshold />
      <AccountAccess />
    </div>
    <div class="hidden flex-col gap-(--gap) md:flex">
      <QrConnect />
      <div class="**:[.text-center.text-xs]:hidden">
        <MessageScrollerDemo />
      </div>
      <Payments />
    </div>
    <div class="hidden flex-col gap-(--gap) min-[1900px]:flex">
      <EmptyDistributeTrack />
      <AnalyticsCard />
      <NotificationSettings />
      <PowerUsage />
    </div>
  </div>
  <div class="absolute inset-x-0 top-0 z-1 h-120 bg-linear-to-b from-background via-muted to-transparent dark:hidden"></div>
  <div class="absolute inset-x-0 bottom-0 z-20 h-48 bg-linear-to-t from-background via-muted/80 to-transparent lg:h-80 xl:h-64 dark:via-background/80"></div>
</div>
