<script lang="ts">
  import { Input } from '$ui/input/index.js';
  let value = $state('Initial');
  export function read() { return value; }
  export function write(next: string) { value = next; }
</script>
<form>
  <Input name="bound" type="email" placeholder="you@example.com" bind:value {@attach node => { node.dataset.attached = 'true'; }} />
  <Input name="draft" defaultValue="Draft" />
  <Input name="off" value="Off" disabled />
</form>
