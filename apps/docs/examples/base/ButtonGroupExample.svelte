<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { ButtonGroup, ButtonGroupText } from '@sveltery/ui/button-group';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { Field, FieldGroup } from '@sveltery/ui/field';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/ui/input-group';
  import { Label } from '@sveltery/ui/label';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@sveltery/ui/tooltip';

  const currencyItems = [
    { label: '$', value: '$' },
    { label: '€', value: '€' },
    { label: '£', value: '£' }
  ];
  const durationItems = [
    { label: 'Hours', value: 'hours' },
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' }
  ];
</script>

{#snippet ButtonGroupBasic()}
  <Example title="Basic">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Another Button</Button>
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithInput()}
  <Example title="With Input">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Button</Button>
        <Input placeholder="Type something here..." />
      </ButtonGroup>
      <ButtonGroup>
        <Input placeholder="Type something here..." />
        <Button variant="outline">Button</Button>
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithText()}
  <Example title="With Text">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>Text</ButtonGroupText>
        <Button variant="outline">Another Button</Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>
          {#snippet render(props, _state, children)}
            <Label {...props} for="input-text">{@render children?.()}</Label>
          {/snippet}
          GPU Size
        </ButtonGroupText>
        <Input id="input-text" placeholder="Type something here..." class="style-luma:border-border" />
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithDropdown()}
  <Example title="With Dropdown">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">Update</Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" size="icon" {...props}>{@render content?.()}</Button>{/snippet}
            <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Disable</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Uninstall</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Follow</Button>
        <DropdownMenu>
          <DropdownMenuTrigger>
            {#snippet render(props, _state, content)}<Button variant="outline" size="icon" {...props}>{@render content?.()}</Button>{/snippet}
            <IconPlaceholder lucide="ChevronDownIcon" tabler="IconChevronDown" hugeicons="ArrowDown01Icon" phosphor="CaretDownIcon" remixicon="RiArrowDownSLine" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-50">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder lucide="VolumeX" tabler="IconVolume" hugeicons="VolumeOffIcon" phosphor="SpeakerSlashIcon" remixicon="RiVolumeMuteLine" />
                Mute Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="CheckIcon" tabler="IconCheck" hugeicons="Tick02Icon" phosphor="CheckIcon" remixicon="RiCheckLine" />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="AlertTriangleIcon" tabler="IconAlertTriangle" hugeicons="AlertCircleIcon" phosphor="WarningIcon" remixicon="RiErrorWarningLine" />
                Report Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="UserRoundXIcon" tabler="IconUserX" hugeicons="UserRemove01Icon" phosphor="UserMinusIcon" remixicon="RiUserUnfollowLine" />
                Block User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="ShareIcon" tabler="IconShare" hugeicons="Share03Icon" phosphor="ShareIcon" remixicon="RiShareLine" />
                Share Conversation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="Copy01Icon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
                Copy Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="Delete02Icon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
                Delete Conversation
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithSelect()}
  <Example title="With Select">
    <Field>
      <Label for="amount">Amount</Label>
      <ButtonGroup>
        <Select items={currencyItems} defaultValue={currencyItems[0]}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {#each currencyItems as item (item.value)}
                <SelectItem value={item}>{item.label}</SelectItem>
              {/each}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input id="amount" placeholder="Enter amount to send" />
        <Button variant="outline">
          <IconPlaceholder lucide="ArrowRightIcon" tabler="IconArrowRight" hugeicons="ArrowRight01Icon" phosphor="ArrowRightIcon" remixicon="RiArrowRightLine" />
        </Button>
      </ButtonGroup>
    </Field>
  </Example>
{/snippet}

{#snippet ButtonGroupWithIcons()}
  <Example title="With Icons">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">
          <IconPlaceholder
            lucide="FlipHorizontalIcon"
            tabler="IconFlipHorizontal"
            hugeicons="FlipHorizontalIcon"
            phosphor="ArrowsHorizontalIcon"
            remixicon="RiArrowLeftRightLine"
          />
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="FlipVerticalIcon"
            tabler="IconFlipVertical"
            hugeicons="FlipVerticalIcon"
            phosphor="ArrowsVerticalIcon"
            remixicon="RiArrowUpDownLine"
          />
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="RotateCwIcon"
            tabler="IconRotateClockwise2"
            hugeicons="Rotate01Icon"
            phosphor="ArrowClockwiseIcon"
            remixicon="RiRefreshLine"
          />
        </Button>
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithInputGroup()}
  <Example title="With Input Group">
    <div class="flex flex-col gap-4">
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon align="inline-start" class="text-muted-foreground">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </InputGroupAddon>
      </InputGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupWithFields()}
  <Example title="With Fields">
    <FieldGroup class="grid grid-cols-3 gap-4">
      <Field class="col-span-2">
        <Label for="width">Width</Label>
        <ButtonGroup>
          <InputGroup>
            <InputGroupInput id="width" />
            <InputGroupAddon class="text-muted-foreground">W</InputGroupAddon>
            <InputGroupAddon align="inline-end" class="text-muted-foreground">px</InputGroupAddon>
          </InputGroup>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="MinusIcon"
              tabler="IconMinus"
              hugeicons="MinusSignIcon"
              phosphor="MinusIcon"
              remixicon="RiSubtractLine"
            />
          </Button>
          <Button variant="outline" size="icon">
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
            />
          </Button>
        </ButtonGroup>
      </Field>
    </FieldGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupWithLike()}
  <Example title="With Like">
    <ButtonGroup>
      <Button variant="outline">
        <IconPlaceholder
          lucide="HeartIcon"
          tabler="IconBell"
          hugeicons="Notification02Icon"
          phosphor="HeartIcon"
          remixicon="RiHeartLine"
          data-icon="inline-start"
        />
        Like
      </Button>
      <Button variant="outline" size="icon" class="w-12" nativeButton={false}>
        {#snippet render(props)}
          <span {...props}>1.2K</span>
        {/snippet}
      </Button>
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet voiceAddon(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <InputGroupAddon align="inline-end" {...props}>{@render children?.()}</InputGroupAddon>
{/snippet}

{#snippet ButtonGroupWithSelectAndInput()}
  <Example title="With Select and Input">
    <ButtonGroup>
      <Select items={durationItems} defaultValue="hours">
        <SelectTrigger id="duration">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            {#each durationItems as item (item.value)}
              <SelectItem value={item.value}>{item.label}</SelectItem>
            {/each}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input />
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupNested()}
  <Example title="Nested">
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <InputGroup>
          <InputGroupInput placeholder="Send a message..." />
          <Tooltip>
            <TooltipTrigger render={voiceAddon}>
              <IconPlaceholder lucide="AudioLinesIcon" tabler="IconHeadphones" hugeicons="AudioWave01Icon" phosphor="MicrophoneIcon" remixicon="RiMicLine" />
            </TooltipTrigger>
            <TooltipContent>Voice Mode</TooltipContent>
          </Tooltip>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupPagination()}
  <Example title="Pagination">
    <ButtonGroup>
      <Button variant="outline" size="sm">
        <IconPlaceholder
          lucide="ArrowLeftIcon"
          tabler="IconArrowLeft"
          hugeicons="ArrowLeft02Icon"
          phosphor="ArrowLeftIcon"
          remixicon="RiArrowLeftLine"
          data-icon="inline-start"
        />
        Previous
      </Button>
      <Button variant="outline" size="sm">
        1
      </Button>
      <Button variant="outline" size="sm">
        2
      </Button>
      <Button variant="outline" size="sm">
        3
      </Button>
      <Button variant="outline" size="sm">
        4
      </Button>
      <Button variant="outline" size="sm">
        5
      </Button>
      <Button variant="outline" size="sm">
        Next
        <IconPlaceholder
          lucide="ArrowRightIcon"
          tabler="IconArrowRight"
          hugeicons="ArrowRight02Icon"
          phosphor="ArrowRightIcon"
          remixicon="RiArrowRightLine"
          data-icon="inline-end"
        />
      </Button>
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupPaginationSplit()}
  <Example title="Pagination Split">
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          4
        </Button>
        <Button variant="outline" size="sm">
          5
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-xs">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft01Icon"
            phosphor="ArrowLeftIcon"
            remixicon="RiArrowLeftLine"
          />
        </Button>
        <Button variant="outline" size="icon-xs">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight01Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupNavigation()}
  <Example title="Navigation">
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft01Icon"
            phosphor="ArrowLeftIcon"
            remixicon="RiArrowLeftLine"
          />
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="ArrowRightIcon"
            tabler="IconArrowRight"
            hugeicons="ArrowRight01Icon"
            phosphor="ArrowRightIcon"
            remixicon="RiArrowRightLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup aria-label="Single navigation button">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft01Icon"
            phosphor="ArrowLeftIcon"
            remixicon="RiArrowLeftLine"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </Example>
{/snippet}

{#snippet ButtonGroupTextAlignment()}
  <Example title="Text Alignment">
    <Field>
      <Label id="alignment-label">Text Alignment</Label>
      <ButtonGroup aria-labelledby="alignment-label">
        <Button variant="outline" size="sm">Left</Button>
        <Button variant="outline" size="sm">Center</Button>
        <Button variant="outline" size="sm">Right</Button>
        <Button variant="outline" size="sm">Justify</Button>
      </ButtonGroup>
    </Field>
  </Example>
{/snippet}

{#snippet ButtonGroupVertical()}
  <Example title="Vertical">
    <div class="flex gap-6">
      <ButtonGroup
        orientation="vertical"
        aria-label="Media controls"
        class="h-fit"
      >
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="MinusIcon"
            tabler="IconMinus"
            hugeicons="MinusSignIcon"
            phosphor="MinusIcon"
            remixicon="RiSubtractLine"
          />
        </Button>
      </ButtonGroup>
    </div>
  </Example>
{/snippet}

{#snippet ButtonGroupVerticalNested()}
  <Example title="Vertical Nested">
    <ButtonGroup orientation="vertical" aria-label="Design tools palette">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy01Icon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="ShareIcon"
            tabler="IconShare"
            hugeicons="Share03Icon"
            phosphor="ShareIcon"
            remixicon="RiShareLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="FlipHorizontalIcon"
            tabler="IconFlipHorizontal"
            hugeicons="FlipHorizontalIcon"
            phosphor="ArrowsHorizontalIcon"
            remixicon="RiArrowLeftRightLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="FlipVerticalIcon"
            tabler="IconFlipVertical"
            hugeicons="FlipVerticalIcon"
            phosphor="ArrowsVerticalIcon"
            remixicon="RiArrowUpDownLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="RotateCwIcon"
            tabler="IconRotateClockwise2"
            hugeicons="Rotate01Icon"
            phosphor="ArrowClockwiseIcon"
            remixicon="RiRefreshLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render ButtonGroupBasic()}
  {@render ButtonGroupWithInput()}
  {@render ButtonGroupWithText()}
  {@render ButtonGroupWithDropdown()}
  {@render ButtonGroupWithSelect()}
  {@render ButtonGroupWithIcons()}
  {@render ButtonGroupWithInputGroup()}
  {@render ButtonGroupWithFields()}
  {@render ButtonGroupWithLike()}
  {@render ButtonGroupWithSelectAndInput()}
  {@render ButtonGroupNested()}
  {@render ButtonGroupPagination()}
  {@render ButtonGroupPaginationSplit()}
  {@render ButtonGroupNavigation()}
  {@render ButtonGroupTextAlignment()}
  {@render ButtonGroupVertical()}
  {@render ButtonGroupVerticalNested()}
</ExampleWrapper>
