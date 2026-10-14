<script lang="ts">
  import AccountAccess from './components/account-access.svelte';
  import CardOverview from './components/card-overview.svelte';
  import ClaimableBalance from './components/claimable-balance.svelte';
  import ContributionHistory from './components/contribution-history.svelte';
  import CoverArt from './components/cover-art.svelte';
  import DividendIncome from './components/dividend-income.svelte';
  import EmptyConnectBank from './components/empty-connect-bank.svelte';
  import EmptyDistributeTrack from './components/empty-distribute-track.svelte';
  import EmptyExploreCatalog from './components/empty-explore-catalog.svelte';
  import Faq from './components/faq.svelte';
  import FrontDoor from './components/front-door.svelte';
  import IndexInvesting from './components/index-investing.svelte';
  import KitchenIsland from './components/kitchen-island.svelte';
  import LoadingCard from './components/loading-card.svelte';
  import NewMilestone from './components/new-milestone.svelte';
  import NotificationSettings from './components/notification-settings.svelte';
  import Payments from './components/payments.svelte';
  import PayoutThreshold from './components/payout-threshold.svelte';
  import PowerUsage from './components/power-usage.svelte';
  import Preferences from './components/preferences.svelte';
  import QrConnect from './components/qr-connect.svelte';
  import ReceivingMethod from './components/receiving-method.svelte';
  import RecentTransactions from './components/recent-transactions.svelte';
  import ReleaseCatalog from './components/release-catalog.svelte';
  import RollerShades from './components/roller-shades.svelte';
  import SavingsProgress from './components/savings-progress.svelte';
  import SavingsTargets from './components/savings-targets.svelte';
  import SidebarNav from './components/sidebar-nav.svelte';
  import SocialLinks from './components/social-links.svelte';
  import StockPerformance from './components/stock-performance.svelte';
  import SyncingState from './components/syncing-state.svelte';
  import TransferFunds from './components/transfer-funds.svelte';
  import UpcomingPayments from './components/upcoming-payments.svelte';
</script>

<div
  class="overflow-x-auto overflow-y-hidden bg-muted contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)]"
>
  <div class="flex w-full min-w-max justify-center">
    <div
      class="grid w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] *:[div]:gap-(--gap)"
      data-slot="capture-target"
    >
      <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <ContributionHistory />
        <EmptyDistributeTrack />
        <QrConnect />
        <DividendIncome />
        <IndexInvesting />
        <SyncingState />
      </div>
      <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <PayoutThreshold />
        <ClaimableBalance />
        <Preferences />
        <SavingsProgress />
        <KitchenIsland />
      </div>
      <div
        class="col-span-2 flex flex-col p-1 [contain-intrinsic-size:760px_1200px] [content-visibility:auto]"
      >
        <SavingsTargets />
        <RecentTransactions />
        <div class="grid grid-cols-2 items-start gap-(--gap)">
          <div class="flex flex-col gap-(--gap)">
            <SidebarNav />
            <Faq />
          </div>
          <div class="flex flex-col gap-(--gap)">
            <Payments />
            <FrontDoor />
          </div>
        </div>
        <ReleaseCatalog />
      </div>
      <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <AccountAccess />
        <CardOverview />
        <TransferFunds />
        <CoverArt />
        <LoadingCard />
      </div>
      <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <ReceivingMethod />
        <PowerUsage />
        <EmptyConnectBank />
        <UpcomingPayments />
        <RollerShades />
      </div>
      <div class="flex flex-col p-1 [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <StockPerformance />
        <EmptyExploreCatalog />
        <NewMilestone />
        <SocialLinks />
        <NotificationSettings />
      </div>
    </div>
  </div>
</div>
