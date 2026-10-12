<script lang="ts">
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from '$ui/input-group/index.js';
  let value = $state('https://');
  let note = $state('Hello');
  let { events = [] }: { events?: string[] } = $props();
  export function read() { return { value, note }; }
  export function write(next: string) { value = next; }
</script>
<form>
  <InputGroup data-testid="url">
    <InputGroupAddon><InputGroupText data-testid="text">URL</InputGroupText></InputGroupAddon>
    <InputGroupInput name="url" bind:value />
    <InputGroupAddon align="inline-end">
      <InputGroupButton onclick={() => events.push('button')}>Go</InputGroupButton>
    </InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupAddon data-testid="vetoed" onclick={(event) => { events.push('addon'); event.preventDefault(); }}>Veto</InputGroupAddon>
    <InputGroupInput name="other" defaultValue="Other" />
  </InputGroup>
  <InputGroup>
    <InputGroupTextarea name="note" bind:value={note} />
    <InputGroupAddon align="block-end">Footer</InputGroupAddon>
  </InputGroup>
  <InputGroup>
    <InputGroupInput name="off" value="Off" disabled />
    <InputGroupButton size="icon-sm" variant="outline" type="submit">Send</InputGroupButton>
  </InputGroup>
</form>
