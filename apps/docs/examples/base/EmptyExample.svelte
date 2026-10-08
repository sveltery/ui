<script lang="ts">
  // Four selected immutable Empty bodies; helpers, controls and icon geometry remain canonical. MIT: tests/reference/LICENSE.
  import type { Snippet } from 'svelte';
  import type { ButtonHostProps, ButtonState } from '@sveltery/base/button';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@sveltery/ui/empty';
  import { Button } from '@sveltery/ui/button';
  import { IconPlaceholder } from '@sveltery/ui/icons';
</script>

<!-- Render element href follows all merged string/symbol props, as in the genuine source render anchor. -->
{#snippet anchor(props: ButtonHostProps, _state: ButtonState, children: Snippet | undefined)}
  <!-- svelte-ignore a11y_invalid_attribute (Exact immutable source placeholder anchor.) -->
  <a {...props} href="#">{@render children?.()}</a>
{/snippet}
<!-- Private text snippets retain the source JSX text followed by its separate U+0020 child. -->
{#snippet learnMoreText()}Learn more{/snippet}
{#snippet postDescriptionText()}No posts have been created yet. Get started by{/snippet}

{#snippet EmptyBasic()}
  <Example title="Basic">
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle><EmptyDescription>You haven&apos;t created any projects yet. Get started by creating your first project.</EmptyDescription>
      </EmptyHeader><EmptyContent>
        <div class="flex gap-2"><Button render={anchor} nativeButton={false}>Create project</Button><Button variant="outline">Import project</Button></div><Button variant="link" render={anchor} class="text-muted-foreground" nativeButton={false}>{@render learnMoreText()} <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" /></Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithMutedBackground()}
  <Example title="With Muted Background">
    <Empty class="bg-muted">
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle><EmptyDescription>No results found for your search. Try adjusting your search terms.</EmptyDescription>
      </EmptyHeader><EmptyContent>
        <Button>Try again</Button><Button variant="link" render={anchor} class="text-muted-foreground" nativeButton={false}>{@render learnMoreText()} <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" /></Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyWithIcon()}
  <Example title="With Icon">
    <Empty class="border">
      <EmptyHeader>
        <EmptyMedia variant="icon"><IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="Folder01Icon" phosphor="FolderIcon" remixicon="RiFolderLine" /></EmptyMedia><EmptyTitle>Nothing to see here</EmptyTitle><EmptyDescription>{@render postDescriptionText()} <!-- svelte-ignore a11y_invalid_attribute (Exact immutable source placeholder anchor.) --><a href="#">creating your first post</a>.</EmptyDescription>
      </EmptyHeader><EmptyContent>
        <Button variant="outline"><IconPlaceholder lucide="PlusIcon" tabler="IconPlus" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" data-icon="inline-start" />New Post</Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

{#snippet EmptyInCard()}
  <Example title="In Card">
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon"><IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="Folder01Icon" phosphor="FolderIcon" remixicon="RiFolderLine" /></EmptyMedia><EmptyTitle>No projects yet</EmptyTitle><EmptyDescription>You haven&apos;t created any projects yet. Get started by creating your first project.</EmptyDescription>
      </EmptyHeader><EmptyContent>
        <div class="flex gap-2"><Button render={anchor} nativeButton={false}>Create project</Button><Button variant="outline">Import project</Button></div><Button variant="link" render={anchor} class="text-muted-foreground" nativeButton={false}>{@render learnMoreText()} <IconPlaceholder lucide="ArrowUpRightIcon" tabler="IconArrowUpRight" hugeicons="ArrowUpRight01Icon" phosphor="ArrowUpRightIcon" remixicon="RiArrowRightUpLine" /></Button>
      </EmptyContent>
    </Empty>
  </Example>
{/snippet}

<ExampleWrapper>
  {@render EmptyBasic()}{@render EmptyWithMutedBackground()}{@render EmptyWithIcon()}{@render EmptyInCard()}
</ExampleWrapper>
