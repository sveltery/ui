<script lang="ts">
  import type { ComponentProps } from 'svelte';
  import { Command } from '@sveltery/base/command';
  import { cn } from 'cn';
  import { InputGroup, InputGroupAddon } from '../input-group/index.js';
  import { IconPlaceholder } from '../icons/index.js';
  let { value = $bindable(''), class: classProp, ...props }: ComponentProps<typeof Command.Input> = $props();
</script>
<div data-slot="command-input-wrapper" class="cn-command-input-wrapper">
  <InputGroup class="cn-command-input-group">
    <Command.Input data-slot="command-input" bind:value class={cn('cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50', classProp)} {...props} />
    <InputGroupAddon>
      <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" class="cn-command-input-icon" />
    </InputGroupAddon>
  </InputGroup>
</div>
