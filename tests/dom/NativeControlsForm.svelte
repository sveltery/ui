<script lang="ts">
  import { NativeCheckbox } from '$ui/native-checkbox/index.js';
  import { NativeSlider } from '$ui/native-slider/index.js';
  import { NativeSwitch } from '$ui/native-switch/index.js';
  let changes = $state(0);
  export function changeCount() { return changes; }
</script>
<form>
  <NativeCheckbox name="topics" value="news" id="news" class="box-extra" onchange={() => changes++} />
  <NativeCheckbox name="topics" value="updates" defaultChecked />
  <NativeCheckbox name="topics" value="events" disabled checked />
  <NativeSwitch name="notify" size="sm" class="switch-extra" />
  <NativeSlider name="volume" min={0} max={10} defaultValue={4} class="slider-extra" />
</form>
