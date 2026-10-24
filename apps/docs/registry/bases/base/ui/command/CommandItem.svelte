<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  let { class: classProp, children, ...props }: ComponentProps<typeof Command.Item> = $props();
</script>
<Command.Item
  data-slot="command-item"
  class={cn('cn-command-item group/command-item data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0', classProp)}
  {...props}
>
  {@render children?.()}
  <IconPlaceholder
    lucide="CheckIcon"
    tabler="IconCheck"
    hugeicons="Tick02Icon"
    phosphor="CheckIcon"
    remixicon="RiCheckLine"
    class="cn-command-item-indicator ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100"
  />
</Command.Item>
