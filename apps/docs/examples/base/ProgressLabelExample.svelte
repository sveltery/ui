<script lang="ts">
  import { Progress, ProgressLabel, ProgressValue } from '$registry/bases/base/ui/progress';
</script>

<Progress value={56} class="w-full max-w-sm">
  <ProgressLabel>Upload progress</ProgressLabel>
  <ProgressValue />
</Progress>
