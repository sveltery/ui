<script lang="ts" module>
  type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@sveltery/ui/card';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  import { Label } from '@sveltery/ui/label';

  const fileTree: FileTreeItem[] = [
    {
      name: 'components',
      items: [
        {
          name: 'ui',
          items: [
            { name: 'button.svelte' },
            { name: 'card.svelte' },
            { name: 'dialog.svelte' },
            { name: 'input.svelte' },
            { name: 'select.svelte' },
            { name: 'table.svelte' },
          ],
        },
        { name: 'login-form.svelte' },
        { name: 'register-form.svelte' },
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
    { name: 'app.svelte' },
    { name: 'layout.svelte' },
    { name: 'globals.css' },
    { name: 'package.json' },
    { name: 'tsconfig.json' },
    { name: 'README.md' },
    { name: '.gitignore' },
  ];

  let settingsOpen = $state(false);
</script>

{#snippet folderTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="ghost" size="sm" class="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground">
    {@render children?.()}
  </Button>
{/snippet}

{#snippet settingsTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <Button {...props} variant="outline" size="icon">
    {@render children?.()}
  </Button>
{/snippet}

{#snippet renderItem(fileItem: FileTreeItem)}
  {#if 'items' in fileItem}
    <Collapsible>
      <CollapsibleTrigger render={folderTrigger}>
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          class="transition-transform group-data-panel-open:rotate-90"
        />
        <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="Folder01Icon" phosphor="FolderIcon" remixicon="RiFolderLine" />
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
      <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="File01Icon" phosphor="FileIcon" remixicon="RiFileLine" />
      <span>{fileItem.name}</span>
    </Button>
  {/if}
{/snippet}

<ExampleWrapper>
  <Example title="File Tree" class="items-center">
    <Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
      <CardHeader>
        <div class="flex w-full rounded-lg bg-muted p-[3px] text-sm font-medium">
          <span class="flex-1 rounded-md bg-background px-2 py-1 text-center">Explorer</span>
          <span class="flex-1 px-2 py-1 text-center text-muted-foreground">Outline</span>
        </div>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-1">
          {#each fileTree as item (item.name)}
            {@render renderItem(item)}
          {/each}
        </div>
      </CardContent>
    </Card>
  </Example>

  <Example title="Settings" class="items-center">
    <Card class="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>Set the corner radius of the element.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible bind:open={settingsOpen} class="flex items-start gap-2">
          <div class="grid w-full grid-cols-2 gap-2">
            <div class="grid gap-2">
              <Label for="radius-x" class="sr-only">Radius X</Label>
              <input id="radius-x" placeholder="0" value="0" class="h-8 rounded-lg border border-border px-2" />
            </div>
            <div class="grid gap-2">
              <Label for="radius-y" class="sr-only">Radius Y</Label>
              <input id="radius-y" placeholder="0" value="0" class="h-8 rounded-lg border border-border px-2" />
            </div>
            <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
              <div class="grid gap-2">
                <Label for="radius-tl" class="sr-only">Radius X</Label>
                <input id="radius-tl" placeholder="0" value="0" class="h-8 rounded-lg border border-border px-2" />
              </div>
              <div class="grid gap-2">
                <Label for="radius-br" class="sr-only">Radius Y</Label>
                <input id="radius-br" placeholder="0" value="0" class="h-8 rounded-lg border border-border px-2" />
              </div>
            </CollapsibleContent>
          </div>
          <CollapsibleTrigger render={settingsTrigger}>
            {#if settingsOpen}
              <IconPlaceholder lucide="MinimizeIcon" tabler="IconMinimize" hugeicons="MinusSignIcon" phosphor="MinusIcon" remixicon="RiSubtractLine" />
            {:else}
              <IconPlaceholder lucide="MaximizeIcon" tabler="IconMaximize" hugeicons="PlusSignIcon" phosphor="PlusIcon" remixicon="RiAddLine" />
            {/if}
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  </Example>
</ExampleWrapper>
