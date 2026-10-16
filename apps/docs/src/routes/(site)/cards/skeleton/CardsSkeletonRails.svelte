<script lang="ts">
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
  import TransferFunds from './TransferFunds.svelte';
  import UIElements from './UIElements.svelte';
</script>

<div aria-hidden="true" class="pointer-events-none absolute inset-x-0 top-12 z-10 hidden min-[2200px]:block [&_[data-slot=skeleton]:nth-child(even)]:hidden">
  <div class="absolute top-0 left-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
    <div class="flex flex-col gap-(--gap)">
      <ContributionHistory />
      <ClaimableBalance />
      <DividendIncome />
      <PayoutThreshold />
    </div>
    <div class="flex flex-col gap-(--gap)">
      <UIElements />
      <SavingsTargets />
      <NewMilestone />
      <PayoutThreshold />
      <AccountAccess />
    </div>
  </div>
  <div class="absolute top-0 right-[calc(50%-950px-var(--rail-width)-var(--gap))] grid w-(--rail-width) grid-cols-[repeat(2,var(--rail-column))] gap-(--gap) opacity-50 [--rail-column:20rem] [--rail-width:calc(var(--rail-column)*2+var(--gap))]">
    <div class="flex flex-col gap-(--gap)">
      <NewMilestone />
      <PayoutThreshold />
      <AccountAccess />
      <QrConnect />
      <TransferFunds />
      <Payments />
      <EmptyDistributeTrack />
    </div>
    <div class="flex flex-col gap-(--gap)">
      <QrConnect />
      <TransferFunds />
      <Payments />
      <EmptyDistributeTrack />
      <AnalyticsCard />
      <NotificationSettings />
      <PowerUsage />
    </div>
  </div>
</div>
