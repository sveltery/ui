<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
  let showPanel = $state(false);
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-40">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Appearance</DropdownMenuLabel>
      <DropdownMenuCheckboxItem bind:checked={showStatusBar}>Status Bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={showActivityBar} disabled>Activity Bar</DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={showPanel}>Panel</DropdownMenuCheckboxItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
