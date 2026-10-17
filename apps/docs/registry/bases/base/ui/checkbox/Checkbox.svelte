<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Checkbox as Primitive } from '@sveltery/base/checkbox';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { checked = $bindable(), class: classProp, ...props }: Omit<ComponentProps<typeof Primitive.Root>, 'children'> = $props();
</script>
<Primitive.Root data-slot="checkbox" bind:checked {...props} class={cn('cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50', classProp)}>
  <Primitive.Indicator data-slot="checkbox-indicator" class="cn-checkbox-indicator grid place-content-center text-current transition-none">
    <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
  </Primitive.Indicator>
</Primitive.Root>
