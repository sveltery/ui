<script lang="ts">
  import { Slider } from '$ui/slider/index.js';
  let range = $state<readonly number[]>([0.3, 0.7]);
  let commits = $state<string[]>([]);
  export function read() { return range; }
  export function write(next: number[]) { range = next; }
  export function commitLog() { return commits; }
</script>
<form>
  <Slider id="single" name="volume" defaultValue={25} aria-label="Volume" />
  <Slider id="range" name="range" bind:value={range} min={0} max={1} step={0.1} aria-label="Temperature" onValueCommitted={(next) => commits.push(JSON.stringify(next))} />
  <Slider id="multi" name="multi" defaultValue={[10, 20, 70]} step={10} class="extra" aria-label="Multi" />
  <Slider id="vertical" name="vertical" defaultValue={[50]} orientation="vertical" aria-label="Vertical" />
  <Slider id="off" name="off" defaultValue={[50]} disabled aria-label="Off" />
</form>
