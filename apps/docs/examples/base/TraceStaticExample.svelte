<script lang="ts">
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { Trace, TraceIcon, TraceLine, TraceTitle } from '$registry/bases/base/ui/trace';
</script>

<Trace class="max-w-sm">
  <TraceLine>
    <TraceIcon>
      <IconPlaceholder lucide="GitBranchIcon" tabler="IconGitBranch" hugeicons="GitBranchIcon" phosphor="GitBranchIcon" remixicon="RiGitBranchLine" />
    </TraceIcon>
    <TraceTitle>Created branch fix/frozen-lockfile</TraceTitle>
  </TraceLine>
</Trace>
