<script lang="ts">
  import type { NativeSelectProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, size = 'default', value = $bindable(), ...props }: NativeSelectProps = $props();
</script>
<div class={cn('cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50', classProp)} data-slot="native-select-wrapper" data-size={size}>
  <select data-slot="native-select" data-size={size} class="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed [&[multiple]]:h-auto [&[multiple]]:pr-2.5" {...props} bind:value>
    {@render children?.()}
  </select>
  <IconPlaceholder
    lucide="ChevronDownIcon"
    tabler="IconSelector"
    hugeicons="UnfoldMoreIcon"
    phosphor="CaretDownIcon"
    remixicon="RiArrowDownSLine"
    class="cn-native-select-icon pointer-events-none absolute select-none group-has-[select[multiple]]/native-select:hidden"
    aria-hidden="true"
    data-slot="native-select-icon"
  />
</div>
