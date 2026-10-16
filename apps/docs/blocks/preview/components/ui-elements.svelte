<script lang="ts">
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@sveltery/components/alert-dialog';
  import { Badge } from '@sveltery/components/badge';
  import { Button } from '@sveltery/components/button';
  import { ButtonGroup } from '@sveltery/components/button-group';
  import { Card, CardContent } from '@sveltery/components/card';
  import { Checkbox } from '@sveltery/components/checkbox';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/components/dropdown-menu';
  import { Field, FieldGroup } from '@sveltery/components/field';
  import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '@sveltery/components/input-group';
  import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from '@sveltery/components/item';
  import { RadioGroup, RadioGroupItem } from '@sveltery/components/radio-group';
  import { Slider } from '@sveltery/components/slider';
  import { Switch } from '@sveltery/components/switch';
  import { Textarea } from '@sveltery/components/textarea';
  import { IconPlaceholder } from '@sveltery/components/icons';

  let sliderValue = $state<number[]>([500]);
</script>

<Card class="w-full">
  <CardContent class="flex flex-col gap-6">
    <div class="flex flex-col gap-4">
      <div class="flex flex-wrap gap-2">
        <Button>Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Two-factor authentication</ItemTitle>
          <ItemDescription class="text-pretty xl:hidden 2xl:block">Verify via email or phone number.</ItemDescription>
        </ItemContent>
        <ItemActions class="hidden md:flex">
          <Button size="sm" variant="secondary">Enable</Button>
        </ItemActions>
      </Item>
    </div>
    <Slider
      bind:value={sliderValue}
      max={1000}
      min={0}
      step={10}
      class="flex-1"
      aria-label="Slider"
    />
    <FieldGroup>
      <Field>
        <InputGroup>
          <InputGroupInput placeholder="Name" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>
              <IconPlaceholder lucide="SearchIcon" tabler="IconSearch" hugeicons="Search01Icon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Field>
      <Field class="flex-1">
        <Textarea placeholder="Message" class="resize-none" />
      </Field>
    </FieldGroup>
    <div class="flex items-center gap-2">
      <div class="flex gap-2">
        <Badge>Badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
      <RadioGroup defaultValue="apple" class="ml-auto flex w-fit gap-3">
        <RadioGroupItem value="apple" />
        <RadioGroupItem value="banana" />
      </RadioGroup>
      <div class="flex gap-3">
        <Checkbox checked />
        <Checkbox />
      </div>
    </div>
    <div class="flex items-center gap-4">
      <AlertDialog>
        <AlertDialogTrigger>
          {#snippet render(props, _state, content)}
            <Button {...props} variant="outline">{@render content?.()}</Button>
          {/snippet}
          <span class="hidden md:flex style-sera:md:hidden">Alert Dialog</span>
          <span class="flex md:hidden style-sera:md:flex">Dialog</span>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
            <AlertDialogDescription>
              Do you want to allow the USB accessory to connect to this device and your data?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
            <AlertDialogAction>Allow</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ButtonGroup>
        <Button variant="outline">
          <span class="style-sera:hidden">Button Group</span>
          <span class="hidden style-sera:block">Group</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, _state, content)}
              <Button {...props} variant="outline" size="icon">{@render content?.()}</Button>
            {/snippet}
            <IconPlaceholder lucide="ChevronUpIcon" tabler="IconChevronUp" hugeicons="ArrowUp01Icon" phosphor="CaretUpIcon" remixicon="RiArrowUpSLine" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" class="w-fit">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
              <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
              <DropdownMenuItem>Mark as Read</DropdownMenuItem>
              <DropdownMenuItem>Block User</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Conversation</DropdownMenuLabel>
              <DropdownMenuItem>Share Conversation</DropdownMenuItem>
              <DropdownMenuItem>Copy Conversation</DropdownMenuItem>
              <DropdownMenuItem>Report Conversation</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Delete Conversation</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <Switch checked class="ml-auto" />
    </div>
  </CardContent>
</Card>
