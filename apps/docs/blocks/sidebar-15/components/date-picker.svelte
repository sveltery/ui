<script lang="ts">
  import { Calendar } from '@sveltery/ui/calendar';
  import { SidebarGroup, SidebarGroupContent } from '@sveltery/ui/sidebar';

  let date = $state<Date | undefined>(new Date(new Date().getFullYear(), new Date().getMonth(), 12));
</script>

<SidebarGroup class="px-0">
  <SidebarGroupContent>
    <Calendar mode="single" bind:selected={date} captionLayout="dropdown" class="bg-transparent [--cell-size:2.1rem]" />
  </SidebarGroupContent>
</SidebarGroup>
