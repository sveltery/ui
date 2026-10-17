<script lang="ts" module>
  type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ChevronRightIcon from '@lucide/svelte/icons/chevron-right';
  import FileIcon from '@lucide/svelte/icons/file';
  import FolderIcon from '@lucide/svelte/icons/folder';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardHeader } from '$registry/bases/base/ui/card';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';

  const fileTree: FileTreeItem[] = [
    {
      name: 'components',
      items: [
        {
          name: 'ui',
          items: [
            { name: 'button.tsx' },
            { name: 'card.tsx' },
            { name: 'dialog.tsx' },
            { name: 'input.tsx' },
            { name: 'select.tsx' },
            { name: 'table.tsx' },
          ],
        },
        { name: 'login-form.tsx' },
        { name: 'register-form.tsx' },
      ],
    },
    {
      name: 'lib',
      items: [{ name: 'utils.ts' }, { name: 'cn.ts' }, { name: 'api.ts' }],
    },
    {
      name: 'hooks',
      items: [{ name: 'use-media-query.ts' }, { name: 'use-debounce.ts' }, { name: 'use-local-storage.ts' }],
    },
    {
      name: 'types',
      items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }],
    },
    {
      name: 'public',
      items: [{ name: 'favicon.ico' }, { name: 'logo.svg' }, { name: 'images' }],
    },
    { name: 'app.tsx' },
    { name: 'layout.tsx' },
    { name: 'globals.css' },
    { name: 'package.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
    { name: '.gitignore' },
  ];
</script>

{#snippet folderTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="ghost" size="sm" class="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground">
    {@render children?.()}
  </Button>
{/snippet}

{#snippet renderItem(fileItem: FileTreeItem)}
  {#if 'items' in fileItem}
    <Collapsible>
      <CollapsibleTrigger render={folderTrigger}>
        <ChevronRightIcon class="transition-transform group-data-panel-open:rotate-90" />
        <FolderIcon />
        {fileItem.name}
      </CollapsibleTrigger>
      <CollapsibleContent class="mt-1 ml-5 style-lyra:ml-4">
        <div class="flex flex-col gap-1">
          {#each fileItem.items as child (child.name)}
            {@render renderItem(child)}
          {/each}
        </div>
      </CollapsibleContent>
    </Collapsible>
  {:else}
    <Button variant="link" size="sm" class="w-full justify-start gap-2 text-foreground">
      <FileIcon />
      <span>{fileItem.name}</span>
    </Button>
  {/if}
{/snippet}

<Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
  <CardHeader>
    <Tabs value="explorer">
      <TabsList class="w-full">
        <TabsTrigger value="explorer">Explorer</TabsTrigger>
        <TabsTrigger value="settings">Outline</TabsTrigger>
      </TabsList>
    </Tabs>
  </CardHeader>
  <CardContent>
    <div class="flex flex-col gap-1">
      {#each fileTree as item (item.name)}
        {@render renderItem(item)}
      {/each}
    </div>
  </CardContent>
</Card>
