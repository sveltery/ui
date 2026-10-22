<script lang="ts">
  import { Switch } from '$ui/switch/index.js';
  let airplane = $state(false);
  let changes = $state<boolean[]>([]);
  export function read() { return airplane; }
  export function write(next: boolean) { airplane = next; }
  export function changeLog() { return changes; }
</script>
<form>
  <Switch id="airplane" name="airplane" bind:checked={airplane} onchange={(event) => changes.push(event.currentTarget.checked)} />
  <label for="airplane">Airplane Mode</label>
  <Switch id="bluetooth" name="bluetooth" value="enabled" defaultChecked size="sm" class="extra" />
  <Switch id="wifi" name="wifi" disabled defaultChecked />
  <Switch id="locked" name="locked" readonly defaultChecked />
  <Switch id="away" name="away" uncheckedValue="no" />
</form>
