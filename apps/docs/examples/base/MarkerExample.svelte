<script lang="ts">
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Marker, MarkerContent, MarkerIcon } from '@sveltery/ui/marker';
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

<ExampleWrapper>
  {@render MarkerExamples()}
  {@render MarkerBorder()}
  {@render MarkerSeparator()}
</ExampleWrapper>
