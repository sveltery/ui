<script lang="ts">
  import { ToggleGroup, ToggleGroupItem } from '$ui/toggle-group/index.js';
  let single = $state<readonly string[]>(['center']);
  let multiple = $state<readonly string[]>(['bold']);
  export function readSingle() { return single; }
  export function writeSingle(next: string[]) { single = next; }
  export function readMultiple() { return multiple; }
</script>
<ToggleGroup aria-label="Align" id="single" variant="outline" size="sm" bind:value={single}>
  <ToggleGroupItem value="left" aria-label="Left">L</ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="Center">C</ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="Right" variant="default" size="lg">R</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup aria-label="Text" id="multiple" multiple spacing={0} orientation="vertical" bind:value={multiple} class="extra">
  <ToggleGroupItem value="bold" aria-label="Bold" variant="outline">B</ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="Italic" variant="outline">I</ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="Underline" disabled>U</ToggleGroupItem>
</ToggleGroup>
<ToggleGroup aria-label="Plain" id="plain" value={['b']} style="color: red">
  <ToggleGroupItem value="a" aria-label="A">A</ToggleGroupItem>
  <ToggleGroupItem value="b" aria-label="B">B</ToggleGroupItem>
</ToggleGroup>
<ToggleGroupItem value="solo" aria-label="Solo" variant="outline" size="lg">S</ToggleGroupItem>
