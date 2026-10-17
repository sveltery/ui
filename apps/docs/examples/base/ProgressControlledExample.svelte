<script lang="ts">
  import { Progress } from '$registry/bases/base/ui/progress';
  import { Slider } from '$registry/bases/base/ui/slider';

  let value = $state(50);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <Progress {value} class="w-full" />
  <Slider bind:value min={0} max={100} step={1} />
</div>
