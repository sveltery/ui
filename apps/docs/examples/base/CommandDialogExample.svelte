<script lang="ts">
  import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from '$registry/bases/base/ui/command';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  let open = $state(false);

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'j' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      open = !open;
    }
  }
</script>

<svelte:window {onkeydown} />

<p class="text-sm text-muted-foreground">
  Press
  <kbd class="pointer-events-none inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 select-none"><span class="text-xs">⌘</span>J</kbd>
</p>
<CommandDialog bind:open>
  <Command>
    <CommandInput placeholder="Type a command or search..." />
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="CalendarIcon" phosphor="CalendarBlankIcon" remixicon="RiCalendarLine" />
          <span>Calendar</span>
        </CommandItem>
        <CommandItem>
          <IconPlaceholder lucide="SmileIcon" tabler="IconMoodSmile" hugeicons="SmileIcon" phosphor="SmileyIcon" remixicon="RiEmotionLine" />
          <span>Search Emoji</span>
        </CommandItem>
        <CommandItem>
          <IconPlaceholder lucide="CalculatorIcon" tabler="IconCalculator" hugeicons="CalculatorIcon" phosphor="CalculatorIcon" remixicon="RiCalculatorLine" />
          <span>Calculator</span>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
          <span>Profile</span><CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
          <span>Billing</span><CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
          <span>Settings</span><CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</CommandDialog>
