<script lang="ts">
  import { Marker, MarkerContent } from '$registry/bases/base/ui/marker';
</script>

<div class="flex w-full max-w-sm flex-col gap-8 py-12">
  <Marker variant="separator">
    <MarkerContent>Today</MarkerContent>
  </Marker>
  <Marker variant="separator">
    <MarkerContent>Worked for 42s</MarkerContent>
  </Marker>
  <Marker variant="separator">
    <MarkerContent>Conversation compacted</MarkerContent>
  </Marker>
</div>
