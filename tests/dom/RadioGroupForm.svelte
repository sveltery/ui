<script lang="ts">
  import { RadioGroup, RadioGroupItem } from '$ui/radio-group/index.js';
  let { events = [] }: { events?: string[] } = $props();
  let size = $state('medium');
  export function read() { return size; }
  export function write(next: string) { size = next; }
</script>
<form>
  <RadioGroup name="size" bind:value={size} defaultValue="medium" class="grid-cols-2" onValueChange={(next) => events.push(`change:${next}`)}>
    <RadioGroupItem value="small" aria-label="Small" />
    <RadioGroupItem value="medium" aria-label="Medium" class="extra-item" />
    <RadioGroupItem value="large" aria-label="Large" />
    <RadioGroupItem value="xlarge" aria-label="X-Large" disabled />
  </RadioGroup>
  <RadioGroup name="plan" defaultValue="pro">
    <RadioGroupItem value="plus" aria-label="Plus" />
    <RadioGroupItem value="pro" aria-label="Pro" />
  </RadioGroup>
  <RadioGroup name="locked" value="a" disabled>
    <RadioGroupItem value="a" aria-label="Locked A" />
    <RadioGroupItem value="b" aria-label="Locked B" />
  </RadioGroup>
  <button type="reset">Reset</button>
</form>
