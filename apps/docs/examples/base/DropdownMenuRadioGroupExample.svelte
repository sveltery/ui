<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let position = $state('bottom');
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Open
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-32">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
      <DropdownMenuRadioGroup bind:value={position}>
        <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
