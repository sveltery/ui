<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
</script>

<ToggleGroup variant="outline" value={['all']}>
  <ToggleGroupItem value="all" aria-label="Toggle all">All</ToggleGroupItem>
  <ToggleGroupItem value="missed" aria-label="Toggle missed">Missed</ToggleGroupItem>
</ToggleGroup>
