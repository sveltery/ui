<script lang="ts">
  import { Checkbox } from '$ui/checkbox/index.js';
  let ticked = $state(false);
  export function read() { return ticked; }
  export function write(next: boolean) { ticked = next; }
</script>
<form>
  <Checkbox name="terms" id="terms" defaultChecked class="extra" />
  <label for="terms">Accept</label>
  <Checkbox name="bound" value="yes" bind:checked={ticked} />
  <Checkbox name="off" disabled defaultChecked />
</form>
