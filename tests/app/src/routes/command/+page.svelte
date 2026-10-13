<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '@sveltery/ui/command';

  let value = $state('');
  let search = $state('');
  let picked = $state<string[]>([]);
  let open = $state(false);
</script>

<div id="inline" style="width: 400px">
  <Command bind:value class="rounded-lg border" loop>
    <CommandInput bind:value={search} placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem onSelect={(item) => picked.push(item)}>Calendar</CommandItem>
        <CommandItem onSelect={(item) => picked.push(item)}>Search Emoji</CommandItem>
        <CommandItem disabled>Calculator</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem value="Profile" onSelect={(item) => picked.push(item)}>Profile<CommandShortcut>⌘P</CommandShortcut></CommandItem>
        <CommandItem value="Billing" onSelect={(item) => picked.push(item)}>Billing<CommandShortcut>⌘B</CommandShortcut></CommandItem>
        <CommandItem value="Settings" onSelect={(item) => picked.push(item)} keywords={['preferences']}>Settings<CommandShortcut>⌘S</CommandShortcut></CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</div>
<output data-testid="value">{value}</output>
<output data-testid="search">{search}</output>
<output data-testid="picked">{picked.join(',')}</output>

<Button data-testid="open" variant="outline" onclick={() => (open = true)}>Open Menu</Button>
<CommandDialog bind:open>
  <Command>
    <CommandInput placeholder="Search the dialog..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Pages">
        <CommandItem onSelect={() => (open = false)}>Home</CommandItem>
        <CommandItem onSelect={() => (open = false)}>Inbox</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
