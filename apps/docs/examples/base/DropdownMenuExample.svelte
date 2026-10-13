<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Avatar, AvatarFallback, AvatarImage } from '@sveltery/ui/avatar';
  import { buttonVariants } from '@sveltery/ui/button';
  import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@sveltery/ui/dialog';
  import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
  } from '@sveltery/ui/dropdown-menu';
  import { IconPlaceholder } from '@sveltery/ui/icons';

  const sides = ['inline-start', 'left', 'top', 'bottom', 'right', 'inline-end'] as const;

  let complexSidebar = $state(true);
  let complexStatusBar = $state(false);
  let showStatusBar = $state(true);
  let showActivityBar = $state(false);
  let showPanel = $state(false);
  let notifications = $state({ email: true, sms: false, push: true });
  let position = $state('bottom');
  let paymentMethod = $state('card');
  let showBookmarks = $state(true);
  let showUrls = $state(false);
  let theme = $state('system');
</script>

{#snippet DropdownMenuBasic()}
  <Example title="Basic">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>GitHub</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuItem disabled>API</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuComplex()}
  <Example title="Complex">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Complex Menu</DropdownMenuTrigger>
      <DropdownMenuContent class="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem bind:checked={complexSidebar}>
            <IconPlaceholder lucide="PanelLeftIcon" tabler="IconLayoutSidebar" hugeicons="LayoutLeftIcon" phosphor="SidebarIcon" remixicon="RiSideBarLine" />
            Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={complexStatusBar}>
            <IconPlaceholder lucide="LayoutIcon" tabler="IconLayout" hugeicons="LayoutIcon" phosphor="LayoutIcon" remixicon="RiLayoutLine" />
            Status Bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconPlaceholder lucide="UsersIcon" tabler="IconUsers" hugeicons="UserGroupIcon" phosphor="UsersIcon" remixicon="RiTeamLine" />
              Invite Users
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder lucide="MailIcon" tabler="IconMail" hugeicons="MailIcon" phosphor="EnvelopeIcon" remixicon="RiMailLine" />
                    Email
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <IconPlaceholder lucide="MessageSquareIcon" tabler="IconMessage" hugeicons="MessageIcon" phosphor="ChatCircleIcon" remixicon="RiChat1Line" />
                    Message
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <IconPlaceholder lucide="PlusCircleIcon" tabler="IconCirclePlus" hugeicons="AddCircleIcon" phosphor="PlusCircleIcon" remixicon="RiAddCircleLine" />
                    More...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconPlaceholder lucide="HelpCircleIcon" tabler="IconHelpCircle" hugeicons="HelpCircleIcon" phosphor="QuestionIcon" remixicon="RiQuestionLine" />
            Support
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="LogoutIcon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />
            Sign Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuSides()}
  <Example title="Sides" containerClass="col-span-2">
    <div class="flex flex-wrap justify-center gap-2">
      {#each sides as side (side)}
        <DropdownMenu>
          <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit capitalize' })}>
            {side.replace('-', ' ')}
          </DropdownMenuTrigger>
          <DropdownMenuContent {side}>
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      {/each}
    </div>
  </Example>
{/snippet}

{#snippet DropdownMenuWithIcons()}
  <Example title="With Icons">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
          Billing
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="LogoutIcon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithShortcuts()}
  <Example title="With Shortcuts">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithSubmenu()}
  <Example title="With Submenu">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithCheckboxes()}
  <Example title="With Checkboxes">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Checkboxes</DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem bind:checked={showStatusBar}>
            <IconPlaceholder lucide="LayoutIcon" tabler="IconLayout" hugeicons="LayoutIcon" phosphor="LayoutIcon" remixicon="RiLayoutLine" />
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={showActivityBar} disabled>
            <IconPlaceholder lucide="ActivityIcon" tabler="IconActivity" hugeicons="ActivityIcon" phosphor="PulseIcon" remixicon="RiPulseLine" />
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={showPanel}>
            <IconPlaceholder lucide="PanelLeftIcon" tabler="IconLayoutSidebar" hugeicons="LayoutLeftIcon" phosphor="SidebarIcon" remixicon="RiSideBarLine" />
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithCheckboxesIcons()}
  <Example title="Checkboxes with Icons">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Notifications</DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
          <DropdownMenuCheckboxItem bind:checked={notifications.email}>
            <IconPlaceholder lucide="MailIcon" tabler="IconMail" hugeicons="MailIcon" phosphor="EnvelopeIcon" remixicon="RiMailLine" />
            Email notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={notifications.sms}>
            <IconPlaceholder lucide="MessageSquareIcon" tabler="IconMessage" hugeicons="MessageIcon" phosphor="ChatCircleIcon" remixicon="RiChat1Line" />
            SMS notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem bind:checked={notifications.push}>
            <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />
            Push notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithRadio()}
  <Example title="With Radio Group">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Radio Group</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
          <DropdownMenuRadioGroup bind:value={position}>
            <DropdownMenuRadioItem value="top">
              <IconPlaceholder lucide="ArrowUpIcon" tabler="IconArrowUp" hugeicons="ArrowUp01Icon" phosphor="ArrowUpIcon" remixicon="RiArrowUpLine" />
              Top
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">
              <IconPlaceholder lucide="ArrowDownIcon" tabler="IconArrowDown" hugeicons="ArrowDown01Icon" phosphor="ArrowDownIcon" remixicon="RiArrowDownLine" />
              Bottom
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right" disabled>
              <IconPlaceholder lucide="ArrowRightIcon" tabler="IconArrowRight" hugeicons="ArrowRight01Icon" phosphor="ArrowRightIcon" remixicon="RiArrowRightLine" />
              Right
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithRadioIcons()}
  <Example title="Radio with Icons">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Payment Method</DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuRadioGroup bind:value={paymentMethod}>
            <DropdownMenuRadioItem value="card">
              <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
              Credit Card
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="paypal">
              <IconPlaceholder lucide="WalletIcon" tabler="IconWallet" hugeicons="WalletIcon" phosphor="WalletIcon" remixicon="RiWalletLine" />
              PayPal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bank">
              <IconPlaceholder lucide="Building2Icon" tabler="IconBuildingBank" hugeicons="BankIcon" phosphor="BankIcon" remixicon="RiBankLine" />
              Bank Transfer
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet DropdownMenuWithDestructive()}
  <Example title="With Destructive Items">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Actions</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <IconPlaceholder lucide="PencilIcon" tabler="IconPencil" hugeicons="EditIcon" phosphor="PencilIcon" remixicon="RiPencilLine" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder lucide="ShareIcon" tabler="IconShare" hugeicons="ShareIcon" phosphor="ShareIcon" remixicon="RiShareLine" />
          Share
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <IconPlaceholder lucide="ArchiveIcon" tabler="IconArchive" hugeicons="Archive02Icon" phosphor="ArchiveIcon" remixicon="RiArchiveLine" />
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

{#snippet avatarMenuContent()}
  <DropdownMenuGroup>
    <DropdownMenuItem>
      <IconPlaceholder lucide="BadgeCheckIcon" tabler="IconRosetteDiscountCheck" hugeicons="CheckmarkBadgeIcon" phosphor="CheckCircleIcon" remixicon="RiCheckboxCircleLine" />
      Account
    </DropdownMenuItem>
    <DropdownMenuItem>
      <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />
      Billing
    </DropdownMenuItem>
    <DropdownMenuItem>
      <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />
      Notifications
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem>
    <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="LogoutIcon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />
    Sign Out
  </DropdownMenuItem>
{/snippet}

{#snippet DropdownMenuWithAvatar()}
  <Example title="With Avatar">
    <div class="flex items-center justify-between gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'h-12 justify-start px-2 md:max-w-[200px] style-sera:font-normal style-sera:tracking-normal style-sera:normal-case' })}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="Shadcn" />
            <AvatarFallback class="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">shadcn</span>
            <span class="truncate text-xs text-muted-foreground">shadcn@example.com</span>
          </div>
          <IconPlaceholder lucide="ChevronsUpDownIcon" tabler="IconSelector" hugeicons="UnfoldMoreIcon" phosphor="CaretUpDownIcon" remixicon="RiArrowUpDownLine" class="ml-auto text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-(--anchor-width) min-w-56">
          {@render avatarMenuContent()}
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger class={buttonVariants({ variant: 'ghost', size: 'icon', class: 'rounded-full' })}>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="shadcn" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          {@render avatarMenuContent()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </Example>
{/snippet}

{#snippet DropdownMenuInDialog()}
  <Example title="In Dialog">
    <Dialog>
      <DialogTrigger class={buttonVariants({ variant: 'outline' })}>Open Dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dropdown Menu Example</DialogTitle>
          <DialogDescription>Click the button below to see the dropdown menu.</DialogDescription>
        </DialogHeader>
        <DropdownMenu>
          <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
              Copy
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
              Cut
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder lucide="ClipboardPasteIcon" tabler="IconClipboard" hugeicons="ClipboardIcon" phosphor="ClipboardIcon" remixicon="RiClipboardLine" />
              Paste
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Save Page...</DropdownMenuItem>
                  <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
                  <DropdownMenuItem>Name Window...</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Developer Tools</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder lucide="TrashIcon" tabler="IconTrash" hugeicons="DeleteIcon" phosphor="TrashIcon" remixicon="RiDeleteBinLine" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DropdownMenuWithInset()}
  <Example title="With Inset">
    <DropdownMenu>
      <DropdownMenuTrigger class={buttonVariants({ variant: 'outline', class: 'w-fit' })}>Open</DropdownMenuTrigger>
      <DropdownMenuContent class="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPlaceholder lucide="CopyIcon" tabler="IconCopy" hugeicons="CopyIcon" phosphor="CopyIcon" remixicon="RiFileCopyLine" />
            Copy
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder lucide="ScissorsIcon" tabler="IconCut" hugeicons="ScissorIcon" phosphor="ScissorsIcon" remixicon="RiScissorsLine" />
            Cut
          </DropdownMenuItem>
          <DropdownMenuItem inset>Paste</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem inset bind:checked={showBookmarks}>Bookmarks</DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem inset bind:checked={showUrls}>Full URLs</DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Theme</DropdownMenuLabel>
          <DropdownMenuRadioGroup bind:value={theme}>
            <DropdownMenuRadioItem inset value="light">Light</DropdownMenuRadioItem>
            <DropdownMenuRadioItem inset value="dark">Dark</DropdownMenuRadioItem>
            <DropdownMenuRadioItem inset value="system">System</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger inset>More Options</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuGroup>
                <DropdownMenuItem>Save Page...</DropdownMenuItem>
                <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render DropdownMenuBasic()}
  {@render DropdownMenuComplex()}
  {@render DropdownMenuSides()}
  {@render DropdownMenuWithIcons()}
  {@render DropdownMenuWithShortcuts()}
  {@render DropdownMenuWithSubmenu()}
  {@render DropdownMenuWithCheckboxes()}
  {@render DropdownMenuWithCheckboxesIcons()}
  {@render DropdownMenuWithRadio()}
  {@render DropdownMenuWithRadioIcons()}
  {@render DropdownMenuWithDestructive()}
  {@render DropdownMenuWithAvatar()}
  {@render DropdownMenuInDialog()}
  {@render DropdownMenuWithInset()}
</ExampleWrapper>
