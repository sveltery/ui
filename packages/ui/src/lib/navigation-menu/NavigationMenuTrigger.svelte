<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { NavigationMenu as Primitive } from '@sveltery/base/navigation-menu';
  import { cn } from 'cn';
  import { IconPlaceholder } from '../icons/index.js';
  import { navigationMenuTriggerStyle } from './variants.js';
  let { children, class: classProp, ...props }: ComponentProps<typeof Primitive.Trigger> = $props();
</script>
<Primitive.Trigger data-slot="navigation-menu-trigger" {...props} class={cn(navigationMenuTriggerStyle(), 'group', classProp)}>
  {@render children?.()} <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" class="cn-navigation-menu-trigger-icon" aria-hidden="true" />
</Primitive.Trigger>
