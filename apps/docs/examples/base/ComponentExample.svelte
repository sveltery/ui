<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from '@sveltery/ui/alert-dialog';
  import { Badge } from '@sveltery/ui/badge';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Combobox, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@sveltery/ui/combobox';
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
    DropdownMenuTrigger,
  } from '@sveltery/ui/dropdown-menu';
  import { Field, FieldGroup, FieldLabel } from '@sveltery/ui/field';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/ui/select';
  import { Textarea } from '@sveltery/ui/textarea';

  const frameworks = ['Next.js', 'SvelteKit', 'Nuxt.js', 'Remix', 'Astro'] as const;
  const roleItems = [
    { label: 'Developer', value: 'developer' },
    { label: 'Designer', value: 'designer' },
    { label: 'Manager', value: 'manager' },
    { label: 'Other', value: 'other' },
  ];

  let notifications = $state({ email: true, sms: false, push: true });
  let theme = $state('light');
</script>

<ExampleWrapper>
  <Example title="Card" class="items-center justify-center" containerClass="md:col-span-2">
    <Card class="relative w-full max-w-sm overflow-hidden pt-0">
      <div class="absolute inset-0 z-30 aspect-video bg-primary opacity-50 mix-blend-color"></div>
      <img
        src="https://images.unsplash.com/photo-1604076850742-4c7221f3101b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Photo by mymind on Unsplash"
        title="Photo by mymind on Unsplash"
        class="relative z-20 aspect-video w-full object-cover brightness-60 grayscale"
      />
      <CardHeader>
        <CardTitle>Observability Plus is replacing Monitoring</CardTitle>
        <CardDescription>
          Switch to the improved way to explore your data, with natural language. Monitoring will no longer be available
          on the Pro plan in November, 2025
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <AlertDialog>
          <AlertDialogTrigger>
            {#snippet render(props, _state, content)}<Button {...props}>{@render content?.()}</Button>{/snippet}
            <IconPlaceholder
              lucide="PlusIcon"
              tabler="IconPlus"
              hugeicons="PlusSignIcon"
              phosphor="PlusIcon"
              remixicon="RiAddLine"
              data-icon="inline-start"
            />
            Show Dialog
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <IconPlaceholder
                  lucide="BluetoothIcon"
                  tabler="IconBluetooth"
                  hugeicons="BluetoothIcon"
                  phosphor="BluetoothIcon"
                  remixicon="RiBluetoothLine"
                />
              </AlertDialogMedia>
              <AlertDialogTitle>Allow accessory to connect?</AlertDialogTitle>
              <AlertDialogDescription>
                Do you want to allow the USB accessory to connect to this device?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Don&apos;t allow</AlertDialogCancel>
              <AlertDialogAction>Allow</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Badge variant="secondary" class="ml-auto">Warning</Badge>
      </CardFooter>
    </Card>
  </Example>
  <Example title="Form">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle>User Information</CardTitle>
        <CardDescription>Please fill in your details below</CardDescription>
        <CardAction>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet render(props, _state, content)}
                <Button {...(props as Record<string, unknown>)} variant="ghost" size="icon">{@render content?.()}</Button>
              {/snippet}
              <IconPlaceholder lucide="MoreVerticalIcon" tabler="IconDotsVertical" hugeicons="MoreVerticalCircle01Icon" phosphor="DotsThreeVerticalIcon" remixicon="RiMore2Line" />
              <span class="sr-only">More options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>File</DropdownMenuLabel>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="FileIcon" phosphor="FileIcon" remixicon="RiFileLine" />New File
                  <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="FolderIcon" phosphor="FolderIcon" remixicon="RiFolderLine" />New Folder
                  <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder lucide="FolderOpenIcon" tabler="IconFolderOpen" hugeicons="FolderOpenIcon" phosphor="FolderOpenIcon" remixicon="RiFolderOpenLine" />Open Recent
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="CodeIcon" remixicon="RiCodeLine" />Project Alpha
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="CodeIcon" remixicon="RiCodeLine" />Project Beta
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeOutlineIcon" remixicon="RiMoreLine" />More Projects
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem>
                                <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="CodeIcon" remixicon="RiCodeLine" />Project Gamma
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <IconPlaceholder lucide="FileCodeIcon" tabler="IconFileCode" hugeicons="CodeIcon" phosphor="CodeIcon" remixicon="RiCodeLine" />Project Delta
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="FolderSearchIcon" tabler="IconFolderSearch" hugeicons="SearchIcon" phosphor="MagnifyingGlassIcon" remixicon="RiSearchLine" />Browse...
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <IconPlaceholder lucide="SaveIcon" tabler="IconDeviceFloppy" hugeicons="FloppyDiskIcon" phosphor="FloppyDiskIcon" remixicon="RiSaveLine" />Save
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="DownloadIcon" tabler="IconDownload" hugeicons="DownloadIcon" phosphor="DownloadIcon" remixicon="RiDownloadLine" />Export
                  <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuLabel>View</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  bind:checked={notifications.email}
                >
                  <IconPlaceholder lucide="EyeIcon" tabler="IconEye" hugeicons="EyeIcon" phosphor="EyeIcon" remixicon="RiEyeLine" />Show Sidebar
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  bind:checked={notifications.sms}
                >
                  <IconPlaceholder lucide="LayoutIcon" tabler="IconLayout" hugeicons="LayoutIcon" phosphor="LayoutIcon" remixicon="RiLayoutLine" />Show Status Bar
                </DropdownMenuCheckboxItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder lucide="PaletteIcon" tabler="IconPalette" hugeicons="PaintBoardIcon" phosphor="PaletteIcon" remixicon="RiPaletteLine" />Theme
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                        <DropdownMenuRadioGroup bind:value={theme}>
                          <DropdownMenuRadioItem value="light">
                            <IconPlaceholder lucide="SunIcon" tabler="IconSun" hugeicons="SunIcon" phosphor="SunIcon" remixicon="RiSunLine" />Light
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="dark">
                            <IconPlaceholder lucide="MoonIcon" tabler="IconMoon" hugeicons="MoonIcon" phosphor="MoonIcon" remixicon="RiMoonLine" />Dark
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="system">
                            <IconPlaceholder lucide="MonitorIcon" tabler="IconDeviceDesktop" hugeicons="ComputerIcon" phosphor="MonitorIcon" remixicon="RiComputerLine" />System
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
                  <IconPlaceholder lucide="UserIcon" tabler="IconUser" hugeicons="UserIcon" phosphor="UserIcon" remixicon="RiUserLine" />Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="CreditCardIcon" tabler="IconCreditCard" hugeicons="CreditCardIcon" phosphor="CreditCardIcon" remixicon="RiBankCardLine" />Billing
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <IconPlaceholder lucide="SettingsIcon" tabler="IconSettings" hugeicons="SettingsIcon" phosphor="GearIcon" remixicon="RiSettingsLine" />Settings
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="KeyboardIcon" tabler="IconKeyboard" hugeicons="KeyboardIcon" phosphor="KeyboardIcon" remixicon="RiKeyboardLine" />Keyboard Shortcuts
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="LanguagesIcon" tabler="IconLanguage" hugeicons="LanguageCircleIcon" phosphor="TranslateIcon" remixicon="RiTranslate" />Language
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />Notifications
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                                <DropdownMenuCheckboxItem
                                  bind:checked={notifications.push}
                                >
                                  <IconPlaceholder lucide="BellIcon" tabler="IconBell" hugeicons="NotificationIcon" phosphor="BellIcon" remixicon="RiNotificationLine" />Push Notifications
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem
                                  bind:checked={notifications.email}
                                >
                                  <IconPlaceholder lucide="MailIcon" tabler="IconMail" hugeicons="MailIcon" phosphor="EnvelopeIcon" remixicon="RiMailLine" />Email Notifications
                                </DropdownMenuCheckboxItem>
                              </DropdownMenuGroup>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <IconPlaceholder lucide="ShieldIcon" tabler="IconShield" hugeicons="ShieldIcon" phosphor="ShieldIcon" remixicon="RiShieldLine" />Privacy & Security
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="HelpCircleIcon" tabler="IconHelpCircle" hugeicons="HelpCircleIcon" phosphor="QuestionIcon" remixicon="RiQuestionLine" />Help & Support
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconPlaceholder lucide="FileTextIcon" tabler="IconFileText" hugeicons="File01Icon" phosphor="FileTextIcon" remixicon="RiFileTextLine" />Documentation
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <IconPlaceholder lucide="LogOutIcon" tabler="IconLogout" hugeicons="LogoutIcon" phosphor="SignOutIcon" remixicon="RiLogoutBoxLine" />Sign Out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel for="small-form-name">Name</FieldLabel>
                <Input id="small-form-name" placeholder="Enter your name" required />
              </Field>
              <Field>
                <FieldLabel for="small-form-role">Role</FieldLabel>
                <Select items={roleItems} defaultValue={null}>
                  <SelectTrigger id="small-form-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {#each roleItems as item (item.value)}
                        <SelectItem value={item.value}>{item.label}</SelectItem>
                      {/each}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <Field>
              <FieldLabel for="small-form-framework">Framework</FieldLabel>
              <Combobox items={frameworks}>
                <ComboboxInput id="small-form-framework" placeholder="Select a framework" required />
                <ComboboxContent>
                  <ComboboxEmpty>No frameworks found.</ComboboxEmpty>
                  <ComboboxList>
                    <ComboboxCollection>
                      {#snippet children(item)}
                        <ComboboxItem value={item}>{item}</ComboboxItem>
                      {/snippet}
                    </ComboboxCollection>
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
            <Field>
              <FieldLabel for="small-form-comments">Comments</FieldLabel>
              <Textarea id="small-form-comments" placeholder="Add any additional comments" />
            </Field>
            <Field orientation="horizontal">
              <Button type="submit">Submit</Button>
              <Button variant="outline" type="button">Cancel</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </Example>
</ExampleWrapper>
