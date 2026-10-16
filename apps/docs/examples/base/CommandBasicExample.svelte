<script lang="ts">
  import { Button } from '@sveltery/components/button';
  import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@sveltery/components/command';

  let open = $state(false);
</script>

<div class="flex flex-col gap-4">
  <Button onclick={() => (open = true)} variant="outline" class="w-fit">Open Menu</Button>
  <CommandDialog bind:open>
    <Command>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </CommandDialog>
</div>
