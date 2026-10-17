<script lang="ts">
  import type { NativeCheckboxProps } from './types.js';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, ...props }: NativeCheckboxProps = $props();
</script>
<!-- The wrapper takes Base's `checkbox` slot, so a label or field that reads its peer's slot styles both alike. -->
<span data-slot="checkbox" class={cn('peer relative inline-grid shrink-0 *:col-start-1 *:row-start-1 has-disabled:opacity-50', classProp)}>
  <input type="checkbox" data-slot="native-checkbox" class="cn-native-checkbox peer m-0 appearance-none outline-none disabled:cursor-not-allowed" {...props} />
  <span data-slot="checkbox-indicator" class="cn-checkbox-indicator pointer-events-none invisible grid place-content-center text-primary-foreground peer-checked:visible">
    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
  </span>
</span>
