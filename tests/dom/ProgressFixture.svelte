<script lang="ts">
  import { Progress, ProgressLabel, ProgressValue } from '$ui/progress/index.js';
  let { value = 56, labelled = true }: { value?: number | null; labelled?: boolean } = $props();
  export function set(next: number | null) { value = next; }
</script>
<Progress {value} class="w-full" aria-label={labelled ? undefined : 'Plain'}>
  {#if labelled}
    <ProgressLabel>Upload progress</ProgressLabel>
    <ProgressValue />
  {/if}
</Progress>
