<script lang="ts">
  import { cn } from 'cn';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { InputGroup, InputGroupAddon, InputGroupInput } from '@sveltery/ui/input-group';
  import { Kbd } from '@sveltery/ui/kbd';
</script>

{#snippet LearnMore()}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" class={cn(buttonVariants({ variant: 'link' }), 'text-muted-foreground')}>
    Learn more
    <IconPlaceholder
      lucide="ArrowUpRightIcon"
      tabler="IconArrowUpRight"
      hugeicons="ArrowUpRight01Icon"
      phosphor="ArrowUpRightIcon"
      remixicon="RiArrowRightUpLine"
    />
  </a>
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
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" class={buttonVariants()}>Create project</a>
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
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" class={buttonVariants()}>Create project</a>
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
