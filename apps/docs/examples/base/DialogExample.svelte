<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/components/button';
  import { Checkbox } from '@sveltery/components/checkbox';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@sveltery/components/dialog';
  import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldSeparator, FieldSet, FieldTitle } from '@sveltery/components/field';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Input } from '@sveltery/components/input';
  import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@sveltery/components/input-group';
  import { Kbd } from '@sveltery/components/kbd';
  import { NativeSelect, NativeSelectOption } from '@sveltery/components/native-select';
  import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@sveltery/components/select';
  import { Switch } from '@sveltery/components/switch';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@sveltery/components/tabs';
  import { Textarea } from '@sveltery/components/textarea';
  import { Tooltip, TooltipContent, TooltipTrigger } from '@sveltery/components/tooltip';

  let open = $state(false);
  let name = $state('Pedro Duarte');
  let username = $state('@peduarte');

  const spokenLanguages = [
    { label: 'Auto', value: 'auto' },
    { label: 'English', value: 'en' },
    { label: 'Spanish', value: 'es' },
    { label: 'French', value: 'fr' },
    { label: 'German', value: 'de' },
    { label: 'Italian', value: 'it' },
    { label: 'Portuguese', value: 'pt' },
    { label: 'Russian', value: 'ru' },
    { label: 'Chinese', value: 'zh' },
    { label: 'Japanese', value: 'ja' },
    { label: 'Korean', value: 'ko' },
    { label: 'Arabic', value: 'ar' },
    { label: 'Hindi', value: 'hi' },
    { label: 'Bengali', value: 'bn' },
    { label: 'Telugu', value: 'te' },
    { label: 'Marathi', value: 'mr' },
    { label: 'Kannada', value: 'kn' },
    { label: 'Malayalam', value: 'ml' }
  ];
  const voices = [
    { label: 'Samantha', value: 'samantha' },
    { label: 'Alex', value: 'alex' },
    { label: 'Fred', value: 'fred' },
    { label: 'Victoria', value: 'victoria' },
    { label: 'Tom', value: 'tom' },
    { label: 'Karen', value: 'karen' },
    { label: 'Sam', value: 'sam' },
    { label: 'Daniel', value: 'daniel' }
  ];
  const themes = [
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
    { label: 'System', value: 'system' }
  ];
  const accents = [
    { label: 'Default', value: 'default' },
    { label: 'Red', value: 'red' },
    { label: 'Blue', value: 'blue' },
    { label: 'Green', value: 'green' },
    { label: 'Purple', value: 'purple' },
    { label: 'Pink', value: 'pink' }
  ];
  let tab = $state('general');
  let theme = $state('system');
  let accentColor = $state('default');
  let spokenLanguage = $state('en');
  let voice = $state('samantha');
</script>

{#snippet nicknameInfoButton(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <InputGroupButton {...props} size="icon-xs">{@render children?.()}</InputGroupButton>
{/snippet}

{#snippet LoremParagraphs()}
  <div
    class="no-scrollbar max-h-[70vh] overflow-y-auto style-vega:-mx-6 style-vega:px-6 style-nova:-mx-4 style-nova:px-4 style-lyra:-mx-4 style-lyra:px-4 style-maia:-mx-6 style-maia:px-6 style-mira:-mx-4 style-mira:px-4 style-luma:-mx-6 style-luma:px-6 style-rhea:-mx-6 style-rhea:px-6"
  >
    {#each { length: 10 } as _, index (index)}
      <p class="mb-4 leading-normal style-lyra:mb-2 style-lyra:leading-relaxed">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
        ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
        fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    {/each}
  </div>
{/snippet}

{#snippet DialogWithForm()}
  <Example title="With Form" class="items-center justify-center">
    <Dialog bind:open>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Edit Profile
      </DialogTrigger>
      <DialogContent>
        <form
          onsubmit={(event) => {
            event.preventDefault();
            open = false;
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done. Your profile will be updated
              immediately.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup class="py-4">
            <Field>
              <FieldLabel for="name-1">Name</FieldLabel>
              <Input id="name-1" name="name" bind:value={name} />
            </Field>
            <Field>
              <FieldLabel for="username-1">Username</FieldLabel>
              <Input id="username-1" name="username" bind:value={username} />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose>
              {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
              Cancel
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogScrollableContent()}
  <Example title="Scrollable Content" class="items-center justify-center">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Scrollable Content
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
        </DialogHeader>
        {@render LoremParagraphs()}
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogWithStickyFooter()}
  <Example title="With Sticky Footer" class="items-center justify-center">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Sticky Footer
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scrollable Content</DialogTitle>
          <DialogDescription>This is a dialog with scrollable content.</DialogDescription>
        </DialogHeader>
        {@render LoremParagraphs()}
        <DialogFooter>
          <DialogClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogNoCloseButton()}
  <Example title="No Close Button" class="items-center justify-center">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        No Close Button
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn&apos;t have a close button in the top-right corner.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Close
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

{#snippet DialogChatSettings()}
  <Example title="Chat Settings" class="items-center justify-center">
    <Dialog>
      <DialogTrigger>
        {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
        Chat Settings
      </DialogTrigger>
      <DialogContent class="min-w-md">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>Customize your chat settings: theme, accent color, spoken language, voice, personality, and custom instructions.</DialogDescription>
        </DialogHeader>
        <div class="flex flex-col gap-4">
          <NativeSelect bind:value={tab} class="w-full md:hidden">
            <NativeSelectOption value="general">General</NativeSelectOption>
            <NativeSelectOption value="notifications">Notifications</NativeSelectOption>
            <NativeSelectOption value="personalization">Personalization</NativeSelectOption>
            <NativeSelectOption value="security">Security</NativeSelectOption>
          </NativeSelect>
          <Tabs bind:value={tab}>
            <TabsList class="hidden w-full md:flex">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="personalization">Personalization</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            <div class="border **:data-[slot=select-trigger]:min-w-[125px] style-vega:min-h-[550px] style-vega:rounded-lg style-vega:p-6 style-nova:min-h-[460px] style-nova:rounded-lg style-nova:p-4 style-lyra:min-h-[450px] style-lyra:rounded-none style-lyra:p-4 style-maia:min-h-[550px] style-maia:rounded-xl style-maia:p-6 style-mira:min-h-[450px] style-mira:rounded-md style-mira:p-4 style-luma:min-h-[550px] style-luma:rounded-xl style-luma:p-6 style-rhea:min-h-[480px] style-rhea:rounded-2xl style-rhea:p-6">
              <TabsContent value="general">
                <FieldSet>
                  <FieldGroup>
                    <Field orientation="horizontal">
                      <FieldLabel for="theme">Theme</FieldLabel>
                      <Select items={themes} bind:value={theme}>
                    <SelectTrigger id="theme">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        {#each themes as item (item.value)}
                          <SelectItem value={item.value}>{item.label}</SelectItem>
                        {/each}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    </Field>
                    <FieldSeparator />
                    <Field orientation="horizontal">
                      <FieldLabel for="accent-color">Accent Color</FieldLabel>
                      <Select items={accents} bind:value={accentColor}>
                    <SelectTrigger id="accent-color">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        {#each accents as item (item.value)}
                          <SelectItem value={item.value}>{item.label}</SelectItem>
                        {/each}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    </Field>
                    <FieldSeparator />
                    <Field orientation="responsive">
                      <FieldContent>
                        <FieldLabel for="spoken-language">Spoken Language</FieldLabel>
                        <FieldDescription>For best results, select the language you mainly speak. If it's not listed, it may still be supported via auto-detection.</FieldDescription>
                      </FieldContent>
                      <Select items={spokenLanguages} bind:value={spokenLanguage}>
                    <SelectTrigger id="spoken-language">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        {#each spokenLanguages as item (item.value)}
                          <SelectItem value={item.value}>{item.label}</SelectItem>
                        {/each}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    </Field>
                    <FieldSeparator />
                    <Field orientation="horizontal">
                      <FieldLabel for="voice">Voice</FieldLabel>
                      <Select items={voices} bind:value={voice}>
                    <SelectTrigger id="voice">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectGroup>
                        {#each voices as item (item.value)}
                          <SelectItem value={item.value}>{item.label}</SelectItem>
                        {/each}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                    </Field>
                  </FieldGroup>
                </FieldSet>
              </TabsContent>
              <TabsContent value="notifications">
                <FieldGroup>
                  <FieldSet>
                    <FieldLabel>Responses</FieldLabel>
                    <FieldDescription>Get notified when ChatGPT responds to requests that take time, like research or image generation.</FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      <Field orientation="horizontal">
                        <Checkbox id="push" defaultChecked disabled />
                        <FieldLabel for="push" class="font-normal">Push notifications</FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                  <FieldSeparator />
                  <FieldSet>
                    <FieldLabel>Tasks</FieldLabel>
                    <FieldDescription>Get notified when tasks you've created have updates. <a href="#manage-tasks">Manage tasks</a></FieldDescription>
                    <FieldGroup data-slot="checkbox-group">
                      <Field orientation="horizontal">
                        <Checkbox id="push-tasks" />
                        <FieldLabel for="push-tasks" class="font-normal">Push notifications</FieldLabel>
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox id="email-tasks" />
                        <FieldLabel for="email-tasks" class="font-normal">Email notifications</FieldLabel>
                      </Field>
                    </FieldGroup>
                  </FieldSet>
                </FieldGroup>
              </TabsContent>
              <TabsContent value="personalization">
                <FieldGroup>
                  <Field orientation="responsive">
                    <FieldLabel for="nickname">Nickname</FieldLabel>
                    <InputGroup>
                      <InputGroupInput id="nickname" placeholder="Broski" class="@md/field-group:max-w-[200px]" />
                      <InputGroupAddon align="inline-end">
                        <Tooltip>
                          <TooltipTrigger render={nicknameInfoButton}>
                            <IconPlaceholder lucide="InfoIcon" tabler="IconInfoCircle" hugeicons="AlertCircleIcon" phosphor="InfoIcon" remixicon="RiInformationLine" />
                          </TooltipTrigger>
                          <TooltipContent class="flex items-center gap-2">Used to identify you in the chat. <Kbd>N</Kbd></TooltipContent>
                        </Tooltip>
                      </InputGroupAddon>
                    </InputGroup>
                  </Field>
                  <FieldSeparator />
                  <Field orientation="responsive" class="@md/field-group:flex-col @2xl/field-group:flex-row">
                    <FieldContent>
                      <FieldLabel for="about">More about you</FieldLabel>
                      <FieldDescription>Tell us more about yourself. This will be used to help us personalize your experience.</FieldDescription>
                    </FieldContent>
                    <Textarea id="about" placeholder="I'm a software engineer..." class="min-h-[120px] @md/field-group:min-w-full @2xl/field-group:min-w-[300px]" />
                  </Field>
                  <FieldSeparator />
                  <FieldLabel>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldLabel for="customization">Enable customizations</FieldLabel>
                        <FieldDescription>Enable customizations to make ChatGPT more personalized.</FieldDescription>
                      </FieldContent>
                      <Switch id="customization" defaultChecked />
                    </Field>
                  </FieldLabel>
                </FieldGroup>
              </TabsContent>
              <TabsContent value="security">
                <FieldGroup>
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldLabel for="2fa">Multi-factor authentication</FieldLabel>
                      <FieldDescription>Enable multi-factor authentication to secure your account. If you do not have a two-factor authentication device, you can use a one-time code sent to your email.</FieldDescription>
                    </FieldContent>
                    <Switch id="2fa" />
                  </Field>
                  <FieldSeparator />
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Log out</FieldTitle>
                      <FieldDescription>Log out of your account on this device.</FieldDescription>
                    </FieldContent>
                    <Button variant="outline" size="sm">Log Out</Button>
                  </Field>
                  <FieldSeparator />
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Log out of all devices</FieldTitle>
                      <FieldDescription>This will log you out of all devices, including the current session. It may take up to 30 minutes for the changes to take effect.</FieldDescription>
                    </FieldContent>
                    <Button variant="outline" size="sm">Log Out All</Button>
                  </Field>
                </FieldGroup>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render DialogWithForm()}
  {@render DialogScrollableContent()}
  {@render DialogWithStickyFooter()}
  {@render DialogNoCloseButton()}
  {@render DialogChatSettings()}
</ExampleWrapper>
