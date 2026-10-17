<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
  import IconFolderCode from '@tabler/icons-svelte-runes/icons/folder-code';
  import { Button } from '$registry/bases/base/ui/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <IconFolderCode />
    </EmptyMedia>
    <EmptyTitle>No Projects Yet</EmptyTitle>
    <EmptyDescription>You haven't created any projects yet. Get started by creating your first project.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent class="flex-row justify-center gap-2">
    <Button>Create Project</Button>
    <Button variant="outline">Import Project</Button>
  </EmptyContent>
  <Button variant="link" render={link} class="text-muted-foreground" size="sm" nativeButton={false}>
    Learn More <ArrowUpRightIcon />
  </Button>
</Empty>
