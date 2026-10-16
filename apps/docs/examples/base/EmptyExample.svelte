<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Example, ExampleWrapper } from '@sveltery/components/example';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/components/empty';
  import { Button } from '@sveltery/components/button';
  import { IconPlaceholder } from '@sveltery/components/icons';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/components/input-group';
  import { Kbd } from '@sveltery/components/kbd';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, content: Snippet | undefined)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render content?.()}</a>
{/snippet}

{#snippet LearnMore()}
  <Button variant="link" render={link} class="text-muted-foreground" nativeButton={false}>
    Learn more
    <IconPlaceholder
      lucide="ArrowUpRightIcon"
      tabler="IconArrowUpRight"
      hugeicons="ArrowUpRight01Icon"
      phosphor="ArrowUpRightIcon"
      remixicon="RiArrowRightUpLine"
    />
  </Button>
{/snippet}

{#snippet EmptyBasic()}
  <Example title="Basic">
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <Button render={link} nativeButton={false}>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        {@render LearnMore()}
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithMutedBackground()}
  <Example title="With Muted Background">
    <Empty class="bg-muted">
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          No results found for your search. Try adjusting your search terms.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Try again</Button>
        {@render LearnMore()}
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithBorder()}
  <Example title="With Border">
    <Empty class="border">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. Try searching for what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup class="w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
              phosphor="CircleDashedIcon"
              remixicon="RiLoaderLine"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help?
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithIcon()}
  <Example title="With Icon">
    <Empty class="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder
            lucide="FolderIcon"
            tabler="IconFolder"
            hugeicons="Folder01Icon"
            phosphor="FolderIcon"
            remixicon="RiFolderLine"
          />
        </EmptyMedia>
        <EmptyTitle>Nothing to see here</EmptyTitle>
        <EmptyDescription>
          No posts have been created yet. Get started by
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#">creating your first post</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            phosphor="PlusIcon"
            remixicon="RiAddLine"
            data-icon="inline-start"
          />
          New Post
        </Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithMutedBackgroundAlt()}
  <Example title="With Muted Background Alt">
    <Empty class="bg-muted/50">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you're looking for doesn't exist. Try searching for what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup class="w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
              phosphor="CircleDashedIcon"
              remixicon="RiLoaderLine"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help?
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyInCard()}
  <Example title="In Card">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder
            lucide="FolderIcon"
            tabler="IconFolder"
            hugeicons="Folder01Icon"
            phosphor="FolderIcon"
            remixicon="RiFolderLine"
          />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <Button render={link} nativeButton={false}>Create project</Button>
          <Button variant="outline">Import project</Button>
        </div>
        {@render LearnMore()}
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render EmptyBasic()}
  {@render EmptyWithMutedBackground()}
  {@render EmptyWithBorder()}
  {@render EmptyWithIcon()}
  {@render EmptyWithMutedBackgroundAlt()}
  {@render EmptyInCard()}
</ExampleWrapper>
