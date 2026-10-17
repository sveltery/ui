<script lang="ts">
  import { Calendar } from '$registry/bases/base/ui/calendar';

  let date = $state<Date | undefined>(new Date());
</script>

<Calendar mode="single" bind:selected={date} class="rounded-lg border" captionLayout="dropdown" />
