<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Input } from '@sveltery/ui/input';
  import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
  } from '@sveltery/ui/input-group';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { Label } from '@sveltery/ui/label';
  import { Spinner } from '@sveltery/ui/spinner';
  import { Textarea } from '@sveltery/ui/textarea';

  // Field, FieldGroup and FieldDescription are not ported yet. These stand in for them.
  const field = 'flex w-full flex-col gap-3';
  const group = 'flex w-full flex-col gap-7';
  const description = 'text-sm text-muted-foreground';
</script>

{#snippet InputGroupBasic()}
  <Example title="Basic">
    <div class={group}>
      <div class={field}>
        <Label for="input-default-01">Default (No Input Group)</Label>
        <Input placeholder="Placeholder" id="input-default-01" />
      </div>
      <div class={field}>
        <Label for="input-group-02">Input Group</Label>
        <InputGroup>
          <InputGroupInput id="input-group-02" placeholder="Placeholder" />
        </InputGroup>
      </div>
      <div class={field} data-disabled="true">
        <Label for="input-disabled-03">Disabled</Label>
        <InputGroup>
          <InputGroupInput id="input-disabled-03" placeholder="This field is disabled" disabled />
        </InputGroup>
      </div>
      <div class={field} data-invalid="true">
        <Label for="input-invalid-04">Invalid</Label>
        <InputGroup>
          <InputGroupInput id="input-invalid-04" placeholder="This field is invalid" aria-invalid="true" />
        </InputGroup>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet InputGroupWithAddons()}
  <Example title="With Addons">
    <div class={group}>
      <div class={field}>
        <Label for="input-icon-left-05">Addon (inline-start)</Label>
        <InputGroup>
          <InputGroupInput id="input-icon-left-05" />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="SearchIcon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
              class="text-muted-foreground"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-icon-right-07">Addon (inline-end)</Label>
        <InputGroup>
          <InputGroupInput id="input-icon-right-07" />
          <InputGroupAddon align="inline-end">
            <IconPlaceholder
              lucide="EyeOffIcon"
              tabler="IconEyeClosed"
              hugeicons="ViewOffIcon"
              phosphor="EyeSlashIcon"
              remixicon="RiEyeOffLine"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-icon-both-09">Addon (inline-start and inline-end)</Label>
        <InputGroup>
          <InputGroupInput id="input-icon-both-09" />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="MicIcon"
              tabler="IconMicrophone"
              hugeicons="VoiceIcon"
              phosphor="MicrophoneIcon"
              remixicon="RiMicLine"
              class="text-muted-foreground"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <IconPlaceholder
              lucide="RadioIcon"
              tabler="IconPlayerRecordFilled"
              hugeicons="RecordIcon"
              phosphor="RecordIcon"
              remixicon="RiRecordCircleLine"
              class="animate-pulse text-red-500"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-addon-20">Addon (block-start)</Label>
        <InputGroup class="h-auto">
          <InputGroupInput id="input-addon-20" />
          <InputGroupAddon align="block-start">
            <InputGroupText>First Name</InputGroupText>
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="AlertCircleIcon"
              phosphor="InfoIcon"
              remixicon="RiInformationLine"
              class="ml-auto text-muted-foreground"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-addon-21">Addon (block-end)</Label>
        <InputGroup class="h-auto">
          <InputGroupInput id="input-addon-21" />
          <InputGroupAddon align="block-end">
            <InputGroupText>20/240 characters</InputGroupText>
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="AlertCircleIcon"
              phosphor="InfoIcon"
              remixicon="RiInformationLine"
              class="ml-auto text-muted-foreground"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-icon-both-10">Multiple Icons</Label>
        <InputGroup>
          <InputGroupInput id="input-icon-both-10" />
          <InputGroupAddon align="inline-end">
            <IconPlaceholder
              lucide="StarIcon"
              tabler="IconStar"
              hugeicons="StarIcon"
              phosphor="StarIcon"
              remixicon="RiStarLine"
            />
            <InputGroupButton size="icon-xs">
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon>
            <IconPlaceholder
              lucide="RadioIcon"
              tabler="IconPlayerRecordFilled"
              hugeicons="RecordIcon"
              phosphor="RecordIcon"
              remixicon="RiRecordCircleLine"
              class="animate-pulse text-red-500"
            />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-description-10">Description</Label>
        <InputGroup>
          <InputGroupInput id="input-description-10" />
          <InputGroupAddon align="inline-end">
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="AlertCircleIcon"
              phosphor="InfoIcon"
              remixicon="RiInformationLine"
            />
          </InputGroupAddon>
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
      <div class={field}>
        <Label for="input-label-10">Label</Label>
        <InputGroup>
          <InputGroupAddon>
            <Label for="input-label-10">Label</Label>
          </InputGroupAddon>
          <InputGroupInput id="input-label-10" />
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-optional-12" aria-label="Optional" />
          <InputGroupAddon align="inline-end">
            <InputGroupText>(optional)</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet InputGroupWithButtons()}
  <Example title="With Buttons">
    <div class={group}>
      <div class={field}>
        <Label for="input-button-13">Button</Label>
        <InputGroup>
          <InputGroupInput id="input-button-13" />
          <InputGroupAddon>
            <InputGroupButton>Default</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-button-14" />
          <InputGroupAddon>
            <InputGroupButton variant="outline">Outline</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-button-15" />
          <InputGroupAddon>
            <InputGroupButton variant="secondary">Secondary</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-button-16" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary">Button</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-button-17" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs">
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-button-18" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="secondary" size="icon-xs">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet InputGroupWithKbd()}
  <Example title="With Kbd">
    <div class={group}>
      <div class={field}>
        <Label for="input-kbd-22">Input Group with Kbd</Label>
        <InputGroup>
          <InputGroupInput id="input-kbd-22" />
          <InputGroupAddon>
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-kbd-23" />
          <InputGroupAddon align="inline-end">
            <Kbd>⌘K</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-search-apps-24" placeholder="Search for Apps..." />
          <InputGroupAddon align="inline-end">Ask AI</InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>Tab</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput id="input-search-type-25" placeholder="Type to search..." />
          <InputGroupAddon align="inline-start">
            <IconPlaceholder
              lucide="SparklesIcon"
              tabler="IconServerSpark"
              hugeicons="SparklesIcon"
              phosphor="SparkleIcon"
              remixicon="RiSparklingLine"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>C</Kbd>
            </KbdGroup>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="input-username-26">Username</Label>
        <InputGroup>
          <InputGroupInput id="input-username-26" defaultValue="shadcn" />
          <InputGroupAddon align="inline-end">
            <div class="flex size-4 items-center justify-center rounded-full bg-green-500 dark:bg-green-800">
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
                class="size-3 text-white"
              />
            </div>
          </InputGroupAddon>
        </InputGroup>
        <p class="text-sm text-green-700">This username is available.</p>
      </div>
      <InputGroup>
        <InputGroupInput id="input-search-docs-27" placeholder="Search documentation..." />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="SearchIcon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">12 results</InputGroupAddon>
      </InputGroup>
      <InputGroup data-disabled="true">
        <InputGroupInput id="input-search-disabled-28" placeholder="Search documentation..." disabled />
        <InputGroupAddon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="SearchIcon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">Disabled</InputGroupAddon>
      </InputGroup>
      <div class="grid grid-cols-2 gap-4">
        <div class={field}>
          <Label for="input-group-11">First Name</Label>
          <InputGroup>
            <InputGroupInput id="input-group-11" placeholder="First Name" />
            <InputGroupAddon align="inline-end">
              <IconPlaceholder
                lucide="InfoIcon"
                tabler="IconInfoCircle"
                hugeicons="AlertCircleIcon"
                phosphor="InfoIcon"
                remixicon="RiInformationLine"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <div class={field}>
          <Label for="input-group-12">Last Name</Label>
          <InputGroup>
            <InputGroupInput id="input-group-12" placeholder="Last Name" />
            <InputGroupAddon align="inline-end">
              <IconPlaceholder
                lucide="InfoIcon"
                tabler="IconInfoCircle"
                hugeicons="AlertCircleIcon"
                phosphor="InfoIcon"
                remixicon="RiInformationLine"
              />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div class={field} data-disabled="true">
        <Label for="input-group-29">Loading (&quot;data-disabled=&quot;true&quot;)</Label>
        <InputGroup>
          <InputGroupInput id="input-group-29" disabled defaultValue="shadcn" />
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
    </div>
  </Example>
{/snippet}

{#snippet InputGroupInCard()}
  <Example title="In Card">
    <Card class="w-full">
      <CardHeader>
        <CardTitle>Card with Input Group</CardTitle>
        <CardDescription>This is a card with an input group.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class={group}>
          <div class={field}>
            <Label for="email-input">Email Address</Label>
            <InputGroup>
              <InputGroupInput id="email-input" type="email" placeholder="you@example.com" />
              <InputGroupAddon align="inline-end">
                <IconPlaceholder
                  lucide="MailIcon"
                  tabler="IconMail"
                  hugeicons="MailIcon"
                  phosphor="EnvelopeIcon"
                  remixicon="RiMailLine"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class={field}>
            <Label for="website-input">Website URL</Label>
            <InputGroup>
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupInput id="website-input" placeholder="example.com" />
              <InputGroupAddon align="inline-end">
                <IconPlaceholder
                  lucide="ExternalLinkIcon"
                  tabler="IconExternalLink"
                  hugeicons="LinkSquare02Icon"
                  phosphor="ArrowSquareOutIcon"
                  remixicon="RiExternalLinkLine"
                />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div class={field}>
            <Label for="feedback-textarea">Feedback &amp; Comments</Label>
            <InputGroup>
              <InputGroupTextarea id="feedback-textarea" placeholder="Share your thoughts..." class="min-h-[100px]" />
              <InputGroupAddon align="block-end">
                <InputGroupText>0/500 characters</InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </div>
      </CardContent>
      <CardFooter class="justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  </Example>
{/snippet}

{#snippet InputGroupTextareaExamples()}
  <Example title="Textarea">
    <div class={group}>
      <div class={field}>
        <Label for="textarea-header-footer-12">Default Textarea (No Input Group)</Label>
        <Textarea id="textarea-header-footer-12" placeholder="Enter your text here..." />
      </div>
      <div class={field}>
        <Label for="textarea-header-footer-13">Input Group</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-header-footer-13" placeholder="Enter your text here..." />
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
      <div class={field} data-invalid="true">
        <Label for="textarea-header-footer-14">Invalid</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-header-footer-14" placeholder="Enter your text here..." aria-invalid="true" />
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
      <div class={field} data-disabled="true">
        <Label for="textarea-header-footer-15">Disabled</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-header-footer-15" placeholder="Enter your text here..." disabled />
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
      <div class={field}>
        <Label for="prompt-31">Addon (block-start)</Label>
        <InputGroup>
          <InputGroupTextarea id="prompt-31" />
          <InputGroupAddon align="block-start">
            <InputGroupText>Ask, Search or Chat...</InputGroupText>
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="AlertCircleIcon"
              phosphor="InfoIcon"
              remixicon="RiInformationLine"
              class="ml-auto text-muted-foreground"
            />
          </InputGroupAddon>
        </InputGroup>
        <p class={description}>This is a description of the input group.</p>
      </div>
      <div class={field}>
        <Label for="textarea-header-footer-30">Addon (block-end)</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-header-footer-30" placeholder="Enter your text here..." />
          <InputGroupAddon align="block-end">
            <InputGroupText>0/280 characters</InputGroupText>
            <InputGroupButton variant="default" size="icon-xs" class="ml-auto rounded-full">
              <IconPlaceholder
                lucide="ArrowUpIcon"
                tabler="IconArrowUp"
                hugeicons="ArrowUpIcon"
                phosphor="ArrowUpIcon"
                remixicon="RiArrowUpLine"
              />
              <span class="sr-only">Send</span>
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="textarea-comment-31">Addon (Buttons)</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-comment-31" placeholder="Share your thoughts..." class="min-h-[120px]" />
          <InputGroupAddon align="block-end">
            <InputGroupButton variant="ghost" class="ml-auto" size="sm">Cancel</InputGroupButton>
            <InputGroupButton variant="default" size="sm">Post Comment</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div class={field}>
        <Label for="textarea-code-32">Code Editor</Label>
        <InputGroup>
          <InputGroupTextarea id="textarea-code-32" placeholder="console.log('Hello, world!');" class="min-h-[300px] py-3" />
          <InputGroupAddon align="block-start" class="border-b">
            <InputGroupText class="font-mono font-medium">
              <IconPlaceholder
                lucide="CodeIcon"
                tabler="IconBrandJavascript"
                hugeicons="CodeIcon"
                phosphor="CodeIcon"
                remixicon="RiCodeLine"
              />
              script.js
            </InputGroupText>
            <InputGroupButton size="icon-xs" class="ml-auto">
              <IconPlaceholder
                lucide="RefreshCwIcon"
                tabler="IconRefresh"
                hugeicons="RefreshIcon"
                phosphor="ArrowClockwiseIcon"
                remixicon="RiRefreshLine"
              />
            </InputGroupButton>
            <InputGroupButton size="icon-xs" variant="ghost">
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
            </InputGroupButton>
          </InputGroupAddon>
          <InputGroupAddon align="block-end" class="border-t">
            <InputGroupText>Line 1, Column 1</InputGroupText>
            <InputGroupText class="ml-auto">JavaScript</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </div>
  </Example>
{/snippet}

<ExampleWrapper class="min-w-0">
  {@render InputGroupBasic()}
  {@render InputGroupWithAddons()}
  {@render InputGroupWithButtons()}
  {@render InputGroupWithKbd()}
  {@render InputGroupInCard()}
  {@render InputGroupTextareaExamples()}
</ExampleWrapper>
