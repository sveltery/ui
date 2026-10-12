<script lang="ts">
  import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from '$ui/native-select/index.js';
  let bound = $state('banana');
  export function read() { return bound; }
  export function write(next: string) { bound = next; }
  let many = $state(['a', 'c']);
  export function readMany() { return many; }
  let changes = $state(0);
  export function changeCount() { return changes; }
</script>
<form>
  <NativeSelect name="bound" bind:value={bound} class="wrapper-extra" id="bound">
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
  </NativeSelect>
  <NativeSelect name="plain" size="sm" onchange={() => changes++}>
    <NativeSelectOption value="">Pick one</NativeSelectOption>
    <NativeSelectOptGroup label="Fruits">
      <NativeSelectOption value="apple">Apple</NativeSelectOption>
      <NativeSelectOption value="banana" selected>Banana</NativeSelectOption>
    </NativeSelectOptGroup>
  </NativeSelect>
  <NativeSelect name="many" multiple bind:value={many}>
    <NativeSelectOption value="a" selected>A</NativeSelectOption>
    <NativeSelectOption value="b">B</NativeSelectOption>
    <NativeSelectOption value="c" selected>C</NativeSelectOption>
  </NativeSelect>
  <NativeSelect name="off" disabled>
    <NativeSelectOption value="x">X</NativeSelectOption>
  </NativeSelect>
</form>
