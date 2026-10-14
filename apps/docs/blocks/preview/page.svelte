<script lang="ts">
  import ActivateAgentDialog from './components/activate-agent-dialog.svelte';
  import AnalyticsCard from './components/analytics-card.svelte';
  import AnomalyAlert from './components/anomaly-alert.svelte';
  import BarChartCard from './components/bar-chart-card.svelte';
  import BookAppointment from './components/book-appointment.svelte';
  import CodespacesCard from './components/codespaces-card.svelte';
  import ContributionsActivity from './components/contributions-activity.svelte';
  import Contributors from './components/contributors.svelte';
  import EnvironmentVariables from './components/environment-variables.svelte';
  import FeedbackForm from './components/feedback-form.svelte';
  import FileUpload from './components/file-upload.svelte';
  import GithubProfile from './components/github-profile.svelte';
  import IconPreviewGrid from './components/icon-preview-grid.svelte';
  import InviteTeam from './components/invite-team.svelte';
  import Invoice from './components/invoice.svelte';
  import LiveWaveformCard from './components/live-waveform.svelte';
  import NoTeamMembers from './components/no-team-members.svelte';
  import NotFound from './components/not-found.svelte';
  import ObservabilityCard from './components/observability-card.svelte';
  import PieChartCard from './components/pie-chart-card.svelte';
  import ReportBug from './components/report-bug.svelte';
  import ShippingAddress from './components/shipping-address.svelte';
  import Shortcuts from './components/shortcuts.svelte';
  import SkeletonLoading from './components/skeleton-loading.svelte';
  import SleepReport from './components/sleep-report.svelte';
  import StyleOverview from './components/style-overview.svelte';
  import TypographySpecimen from './components/typography-specimen.svelte';
  import UIElements from './components/ui-elements.svelte';
  import UsageCard from './components/usage-card.svelte';
  import Visitors from './components/visitors.svelte';
  import WeeklyFitnessSummary from './components/weekly-fitness-summary.svelte';
</script>

<div
  class="overflow-x-auto overflow-y-hidden bg-muted contain-[paint] [--gap:--spacing(4)] 3xl:[--gap:--spacing(12)] md:[--gap:--spacing(10)] dark:bg-background style-lyra:md:[--gap:--spacing(6)] style-mira:md:[--gap:--spacing(6)]"
>
  <div class="flex w-full min-w-max justify-center">
    <div
      class="grid w-[2400px] grid-cols-7 items-start gap-(--gap) bg-muted p-(--gap) md:w-[3000px] dark:bg-background style-lyra:md:w-[2600px] style-mira:md:w-[2600px] *:[div]:gap-(--gap)"
      data-slot="capture-target"
    >
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <StyleOverview />
        <TypographySpecimen />
        <div class="md:hidden">
          <UIElements />
        </div>
        <CodespacesCard />
        <Invoice />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <IconPreviewGrid />
        <div class="hidden w-full md:flex">
          <UIElements />
        </div>
        <ObservabilityCard />
        <ShippingAddress />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <EnvironmentVariables />
        <BarChartCard />
        <InviteTeam />
        <ActivateAgentDialog />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <SkeletonLoading />
        <PieChartCard />
        <NoTeamMembers />
        <ReportBug />
        <Contributors />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <FeedbackForm />
        <BookAppointment />
        <SleepReport />
        <GithubProfile />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <WeeklyFitnessSummary />
        <FileUpload />
        <AnalyticsCard />
        <UsageCard />
        <Shortcuts />
      </div>
      <div class="flex flex-col p-px [contain-intrinsic-size:380px_1200px] [content-visibility:auto]">
        <AnomalyAlert />
        <LiveWaveformCard />
        <Visitors />
        <ContributionsActivity />
        <NotFound />
      </div>
    </div>
  </div>
</div>
