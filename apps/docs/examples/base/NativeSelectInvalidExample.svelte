<script lang="ts">
  import { NativeSelect, NativeSelectOption } from '$registry/bases/base/ui/native-select';
</script>

<NativeSelect aria-invalid="true">
  <NativeSelectOption value="">Error state</NativeSelectOption>
  <NativeSelectOption value="apple">Apple</NativeSelectOption>
  <NativeSelectOption value="banana">Banana</NativeSelectOption>
  <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
</NativeSelect>
