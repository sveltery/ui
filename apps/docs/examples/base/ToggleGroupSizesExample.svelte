<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
</script>

<div class="flex flex-col gap-4">
  <ToggleGroup size="sm" value={['top']} variant="outline">
    <ToggleGroupItem value="top" aria-label="Toggle top">Top</ToggleGroupItem>
    <ToggleGroupItem value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroupItem>
    <ToggleGroupItem value="left" aria-label="Toggle left">Left</ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Toggle right">Right</ToggleGroupItem>
  </ToggleGroup>
  <ToggleGroup value={['top']} variant="outline">
    <ToggleGroupItem value="top" aria-label="Toggle top">Top</ToggleGroupItem>
    <ToggleGroupItem value="bottom" aria-label="Toggle bottom">Bottom</ToggleGroupItem>
    <ToggleGroupItem value="left" aria-label="Toggle left">Left</ToggleGroupItem>
    <ToggleGroupItem value="right" aria-label="Toggle right">Right</ToggleGroupItem>
  </ToggleGroup>
</div>
