<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '@sveltery/ui/native-select';
  let bound = $state('banana');
  let many = $state(['a', 'c']);
  let submitted = $state('');
</script>
<form
  onsubmit={event => {
    event.preventDefault();
    submitted = new URLSearchParams(new FormData(event.currentTarget) as unknown as Record<string, string>).toString();
  }}
>
  <NativeSelect name="bound" aria-label="Bound" bind:value={bound}>
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana">Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
  </NativeSelect>
  <NativeSelect name="plain" aria-label="Plain">
    <NativeSelectOption value="apple">Apple</NativeSelectOption>
    <NativeSelectOption value="banana" selected>Banana</NativeSelectOption>
    <NativeSelectOption value="cherry">Cherry</NativeSelectOption>
  </NativeSelect>
  <NativeSelect name="many" aria-label="Many" multiple bind:value={many}>
    <NativeSelectOption value="a" selected>A</NativeSelectOption>
    <NativeSelectOption value="b">B</NativeSelectOption>
    <NativeSelectOption value="c" selected>C</NativeSelectOption>
  </NativeSelect>
  <button type="submit">Submit</button>
  <button type="reset">Reset</button>
</form>
<output data-testid="bound">{bound}</output>
<output data-testid="many">{many.join(",")}</output>
<output data-testid="submitted">{submitted}</output>
