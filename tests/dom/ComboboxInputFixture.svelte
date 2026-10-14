<script lang="ts">
  import { Combobox, ComboboxInput } from '$ui/combobox/index.js';
  let { rootDisabled = false, inputDisabled = false }: { rootDisabled?: boolean; inputDisabled?: boolean } = $props();
</script>

<Combobox items={['Apple']} disabled={rootDisabled}>
  <ComboboxInput disabled={inputDisabled} showClear />
</Combobox>
