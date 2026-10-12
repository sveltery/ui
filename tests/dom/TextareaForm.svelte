<script lang="ts">
  import { Textarea } from '$ui/textarea/index.js';
  let value = $state('Initial');
  export function read() { return value; }
  export function write(next: string) { value = next; }
</script>
<form>
  <Textarea name="bound" rows={4} bind:value {@attach node => { node.dataset.attached = 'true'; }} />
  <Textarea name="draft" defaultValue="Draft" />
  <Textarea name="off" value="Off" disabled />
</form>
