<script lang="ts">
  import { NativeRadio, NativeRadioGroup } from '$ui/native-radio-group/index.js';
  let changes = $state(0);
  export function changeCount() { return changes; }
</script>
<form>
  <NativeRadioGroup aria-label="Plan" class="group-extra">
    <NativeRadio name="plan" value="free" id="free" class="radio-extra" onchange={() => changes++} />
    <NativeRadio name="plan" value="pro" defaultChecked />
    <NativeRadio name="plan" value="team" disabled />
  </NativeRadioGroup>
</form>
