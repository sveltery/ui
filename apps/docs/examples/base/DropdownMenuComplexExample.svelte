<script lang="ts">
  import BellIcon from '@lucide/svelte/icons/bell';
  import CreditCardIcon from '@lucide/svelte/icons/credit-card';
  import DownloadIcon from '@lucide/svelte/icons/download';
  import EyeIcon from '@lucide/svelte/icons/eye';
  import FileCodeIcon from '@lucide/svelte/icons/file-code';
  import FileIcon from '@lucide/svelte/icons/file';
  import FileTextIcon from '@lucide/svelte/icons/file-text';
  import FolderIcon from '@lucide/svelte/icons/folder';
  import FolderOpenIcon from '@lucide/svelte/icons/folder-open';
  import FolderSearchIcon from '@lucide/svelte/icons/folder-search';
  import HelpCircleIcon from '@lucide/svelte/icons/help-circle';
  import KeyboardIcon from '@lucide/svelte/icons/keyboard';
  import LanguagesIcon from '@lucide/svelte/icons/languages';
  import LayoutIcon from '@lucide/svelte/icons/layout';
  import LogOutIcon from '@lucide/svelte/icons/log-out';
  import MailIcon from '@lucide/svelte/icons/mail';
  import MonitorIcon from '@lucide/svelte/icons/monitor';
  import MoonIcon from '@lucide/svelte/icons/moon';
  import MoreHorizontalIcon from '@lucide/svelte/icons/more-horizontal';
  import PaletteIcon from '@lucide/svelte/icons/palette';
  import SaveIcon from '@lucide/svelte/icons/save';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import ShieldIcon from '@lucide/svelte/icons/shield';
  import SunIcon from '@lucide/svelte/icons/sun';
  import UserIcon from '@lucide/svelte/icons/user';
  import { Button } from '$registry/bases/base/ui/button';
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
  } from '$registry/bases/base/ui/dropdown-menu';

  let notifications = $state({ email: true, sms: false, push: true });
  let theme = $state('light');
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
    Complex Menu
  </DropdownMenuTrigger>
  <DropdownMenuContent class="w-44">
    <DropdownMenuGroup>
      <DropdownMenuLabel>File</DropdownMenuLabel>
      <DropdownMenuItem>
        <FileIcon />
        New File
        <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FolderIcon />
        New Folder
        <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FolderOpenIcon />
          Open Recent
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Alpha
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileCodeIcon />
                Project Beta
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <MoreHorizontalIcon />
                  More Projects
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Gamma
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileCodeIcon />
                      Project Delta
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <FolderSearchIcon />
                Browse...
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <SaveIcon />
        Save
        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <DownloadIcon />
        Export
        <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>View</DropdownMenuLabel>
      <DropdownMenuCheckboxItem bind:checked={notifications.email}>
        <EyeIcon />
        Show Sidebar
      </DropdownMenuCheckboxItem>
      <DropdownMenuCheckboxItem bind:checked={notifications.sms}>
        <LayoutIcon />
        Show Status Bar
      </DropdownMenuCheckboxItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <PaletteIcon />
          Theme
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <DropdownMenuRadioGroup bind:value={theme}>
                <DropdownMenuRadioItem value="light">
                  <SunIcon />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">
                  <MoonIcon />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  <MonitorIcon />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account</DropdownMenuLabel>
      <DropdownMenuItem>
        <UserIcon />
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <CreditCardIcon />
        Billing
      </DropdownMenuItem>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <SettingsIcon />
          Settings
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Preferences</DropdownMenuLabel>
              <DropdownMenuItem>
                <KeyboardIcon />
                Keyboard Shortcuts
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LanguagesIcon />
                Language
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <BellIcon />
                  Notifications
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                      <DropdownMenuCheckboxItem bind:checked={notifications.push}>
                        <BellIcon />
                        Push Notifications
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem bind:checked={notifications.email}>
                        <MailIcon />
                        Email Notifications
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ShieldIcon />
                Privacy & Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem>
        <HelpCircleIcon />
        Help & Support
      </DropdownMenuItem>
      <DropdownMenuItem>
        <FileTextIcon />
        Documentation
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuGroup>
      <DropdownMenuItem variant="destructive">
        <LogOutIcon />
        Sign Out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
  </DropdownMenuContent>
</DropdownMenu>
