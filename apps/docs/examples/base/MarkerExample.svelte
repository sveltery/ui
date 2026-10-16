<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@sveltery/components/accordion';
  import { Button } from '@sveltery/components/button';
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from '@sveltery/components/drawer';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { Spinner } from '@sveltery/components/spinner';
  import { Marker, MarkerContent, MarkerIcon } from '@sveltery/components/marker';

  const drawerFiles = ['app/chat/page.tsx', 'components/message.tsx', 'lib/ai.ts'];
</script>

{#snippet MarkerExamples()}
  <Example title="Markers" class="gap-8">
    <Marker>
      <MarkerContent>A default marker</MarkerContent>
    </Marker>
    <Marker>
      <MarkerIcon>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileDescription"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </MarkerIcon>
      <MarkerContent>Marker with icon</MarkerContent>
    </Marker>
    <Marker role="status">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent>Marker with a spinner</MarkerContent>
    </Marker>
    <Marker role="status">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent class="shimmer">Marker with shimmer effect</MarkerContent>
    </Marker>
    <Marker role="status">
      <MarkerContent class="shimmer">Thinking...</MarkerContent>
    </Marker>
    <Marker>
      {#snippet render(props, _state, children)}
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a {...props} href="#">{@render children?.()}</a>
      {/snippet}
      <MarkerIcon>
        <IconPlaceholder
          lucide="GitBranchIcon"
          tabler="IconGitBranch"
          hugeicons="GitBranchIcon"
          phosphor="GitBranchIcon"
          remixicon="RiGitBranchLine"
        />
      </MarkerIcon>
      <MarkerContent>Marker as a link</MarkerContent>
    </Marker>
    <Marker>
      {#snippet render(props, _state, children)}
        <button {...props} type="button" class={[props.class, 'transition-colors hover:text-foreground']}>
          {@render children?.()}
        </button>
      {/snippet}
      <MarkerIcon>
        <IconPlaceholder
          lucide="ClockIcon"
          tabler="IconClock"
          hugeicons="Clock01Icon"
          phosphor="ClockIcon"
          remixicon="RiTimeLine"
        />
      </MarkerIcon>
      <MarkerContent class="flex-1">
        <div>Marker as a button</div>
      </MarkerContent>
      <MarkerIcon>
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
        />
      </MarkerIcon>
    </Marker>
    <Marker>
      <MarkerIcon>
        <IconPlaceholder
          lucide="CircleUserIcon"
          tabler="IconUserCircle"
          hugeicons="UserCircleIcon"
          phosphor="UserCircleIcon"
          remixicon="RiUserSmileLine"
        />
      </MarkerIcon>
      <MarkerContent>Rhea joined the chat</MarkerContent>
    </Marker>
    <Marker class="justify-center">
      <MarkerContent>
        <strong class="font-medium">Olivia Rose</strong> left the chat
      </MarkerContent>
    </Marker>
    <Marker class="flex-col">
      <MarkerIcon>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileDescription"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </MarkerIcon>
      <MarkerContent>Marker with icon at the top</MarkerContent>
    </Marker>
  </Example>
{/snippet}

{#snippet MarkerBorder()}
  <Example title="Border" class="gap-3">
    <Marker variant="border">
      <MarkerIcon>
        <IconPlaceholder
          lucide="GitBranchIcon"
          tabler="IconGitBranch"
          hugeicons="GitBranchIcon"
          phosphor="GitBranchIcon"
          remixicon="RiGitBranchLine"
        />
      </MarkerIcon>
      <MarkerContent>Switched to release-candidate</MarkerContent>
    </Marker>
    <Marker variant="border">
      <MarkerIcon>
        <IconPlaceholder
          lucide="SearchIcon"
          tabler="IconSearch"
          hugeicons="Search01Icon"
          phosphor="MagnifyingGlassIcon"
          remixicon="RiSearchLine"
        />
      </MarkerIcon>
      <MarkerContent>Reviewed 8 related files</MarkerContent>
    </Marker>
    <Marker variant="border">
      <MarkerIcon>
        <IconPlaceholder
          lucide="FileTextIcon"
          tabler="IconFileDescription"
          hugeicons="File01Icon"
          phosphor="FileTextIcon"
          remixicon="RiFileTextLine"
        />
      </MarkerIcon>
      <MarkerContent>Opened implementation notes</MarkerContent>
    </Marker>
  </Example>
{/snippet}

{#snippet MarkerSeparator()}
  <Example title="Separator" class="gap-8">
    <Marker variant="separator">
      <MarkerContent>Worked for 42s</MarkerContent>
    </Marker>
    <Marker variant="separator" role="status">
      <MarkerIcon>
        <Spinner />
      </MarkerIcon>
      <MarkerContent>Compacting conversation</MarkerContent>
    </Marker>
    <Marker variant="separator" role="status">
      <MarkerContent class="shimmer">Reading 4 files</MarkerContent>
    </Marker>
    <Marker variant="separator">
      <MarkerIcon>
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
        />
      </MarkerIcon>
      <MarkerContent>Conversation compacted</MarkerContent>
    </Marker>
    <Marker variant="separator">
      <MarkerContent>
        With a
        <!-- svelte-ignore a11y_invalid_attribute -->
        <a href="#">link to learn more</a>
      </MarkerContent>
    </Marker>
    <Marker variant="separator">
      <MarkerContent>
        <Button variant="outline">
          <IconPlaceholder
            lucide="GitBranchIcon"
            tabler="IconGitBranch"
            hugeicons="GitBranchIcon"
            phosphor="GitBranchIcon"
            remixicon="RiGitBranchLine"
          />
          Button
        </Button>
      </MarkerContent>
    </Marker>
  </Example>
{/snippet}

{#snippet MarkerAccordion()}
  <Example title="Accordion" containerClass="min-h-72">
    <Accordion>
      <AccordionItem value="1">
        <AccordionTrigger>
          <Marker>
            <MarkerIcon>
              <IconPlaceholder
                lucide="ClockIcon"
                tabler="IconClock"
                hugeicons="Clock01Icon"
                phosphor="ClockIcon"
                remixicon="RiTimeLine"
              />
            </MarkerIcon>
            <MarkerContent>Worked for 42s</MarkerContent>
          </Marker>
        </AccordionTrigger>
        <AccordionContent>
          <p class="text-sm text-muted-foreground">
            The user asked for a list of all the files in the current directory. The assistant responded with a
            list of all the files in the current directory.
          </p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </Example>
{/snippet}

{#snippet MarkerDrawer()}
  <Example title="Drawer">
    <Drawer swipeDirection="right">
      <Marker variant="separator">
        <DrawerTrigger>
          {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="SearchIcon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
            data-icon="inline-start"
          />
          Explored 4 files
        </DrawerTrigger>
      </Marker>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>File Activity</DrawerTitle>
          <DrawerDescription>Files read while preparing the response.</DrawerDescription>
        </DrawerHeader>
        <div class="grid gap-3 px-4 text-sm">
          {#each drawerFiles as file (file)}
            <div class="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span class="truncate">{file}</span>
              <span class="text-muted-foreground">read</span>
            </div>
          {/each}
        </div>
        <DrawerFooter>
          <DrawerClose>
            {#snippet render(props, _state, content)}<Button variant="outline" {...props}>{@render content?.()}</Button>{/snippet}
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render MarkerExamples()}
  {@render MarkerBorder()}
  {@render MarkerSeparator()}
  {@render MarkerAccordion()}
  {@render MarkerDrawer()}
</ExampleWrapper>
