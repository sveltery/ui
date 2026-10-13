<script lang="ts">
  import { Input as Primitive } from '@sveltery/base/input';
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { NativeSelectProps } from './types.js';
  import { cn } from 'cn';
  import { inField } from '../field/context.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { children, class: classProp, size = 'default', value = $bindable(), ...props }: NativeSelectProps = $props();
</script>
<div class={cn('cn-native-select-wrapper group/native-select relative w-fit has-[select:disabled]:opacity-50', classProp)} data-slot="native-select-wrapper" data-size={size}>
  {#if inField()}
    <!-- Base labels, describes and validates its control, so a Field renders the select through it. -->
    <Primitive {...props as Record<string, unknown>} bind:value>
      {#snippet render(control)}
        <select data-slot="native-select" data-size={size} class="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed" {...control as HTMLSelectAttributes}>
          {@render children?.()}
        </select>
      {/snippet}
    </Primitive>
  {:else}
    <select data-slot="native-select" data-size={size} class="cn-native-select outline-none disabled:pointer-events-none disabled:cursor-not-allowed" {...props} bind:value>
      {@render children?.()}
    </select>
  {/if}
  <IconPlaceholder
    lucide="ChevronDownIcon"
    tabler="IconSelector"
    hugeicons="UnfoldMoreIcon"
    phosphor="CaretDownIcon"
    remixicon="RiArrowDownSLine"
    class="cn-native-select-icon pointer-events-none absolute select-none"
    aria-hidden="true"
    data-slot="native-select-icon"
  />
</div>
