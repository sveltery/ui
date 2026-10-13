<script lang="ts">
  import { Button } from '@sveltery/ui/button';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@sveltery/ui/resizable';
  import { Separator } from '@sveltery/ui/separator';
  import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider } from '@sveltery/ui/sidebar';
  import { Tabs, TabsList, TabsTrigger } from '@sveltery/ui/tabs';
  import { ToggleGroup, ToggleGroupItem } from '@sveltery/ui/toggle-group';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { BlockSource, FileTree } from '$lib/blocks/types';
  import CopyButton from '../docs/CopyButton.svelte';

  let { block }: { block: BlockSource } = $props();

  let view = $state<'preview' | 'code'>('preview');
  let selectedFile = $state<string>();
  let size = $state(['100%']);
  let iframeKey = $state(0);
  let panel = $state<ResizablePanel>();
  const activeFile = $derived(selectedFile ?? block.files[0]?.target);
  const file = $derived(block.files.find((entry) => entry.target === activeFile));
  const height = $derived(block.iframeHeight ?? '930px');

  function resize(value: string[]) {
    view = 'preview';
    if (value[0]) panel?.resize(value[0]);
  }
</script>

{#snippet icon(geometry: string, className = '')}
  <!-- eslint-disable-next-line svelte/no-at-html-tags -- static lucide geometry -->
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{@html geometry}</svg>
{/snippet}

{#snippet newTab(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <a {...props} href="/view/{block.name}" target="_blank">{@render children?.()}</a>
{/snippet}

{#snippet folderTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props}>{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet tree(item: FileTree, index: number)}
  {@const itemClass = 'rounded-none pl-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15'}
  <SidebarMenuItem>
    {#if !item.children}
      <SidebarMenuButton isActive={item.path === activeFile} onclick={() => (selectedFile = item.path)} class={itemClass} data-index={index} style="--index: {index * (index === 2 ? 1.2 : 1.3)}rem">
        {@render icon('<path d="m9 18 6-6-6-6" />', 'invisible')}
        {@render icon('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />', 'h-4 w-4')}
        {item.name}
      </SidebarMenuButton>
    {:else}
      <Collapsible class="group/collapsible [&[data-open]>button>svg:first-child]:rotate-90" open>
        <CollapsibleTrigger render={folderTrigger} class={itemClass} style="--index: {index * (index === 1 ? 1 : 1.2)}rem">
          {@render icon('<path d="m9 18 6-6-6-6" />', 'transition-transform')}
          {@render icon('<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />')}
          {item.name}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub class="m-0 w-full translate-x-0 border-none p-0">
            {#each item.children as child (child.name)}
              {@render tree(child, index + 1)}
            {/each}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    {/if}
  </SidebarMenuItem>
{/snippet}

<div
  id={block.name}
  data-slot="block-viewer"
  data-view={view}
  class="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col items-stretch gap-4 overflow-hidden"
  style="--height: {height}"
>
  <div class="hidden w-full items-center gap-2 pl-2 md:pr-6 lg:flex">
    <Tabs bind:value={view}>
      <TabsList class="grid h-8! grid-cols-2 items-center rounded-lg p-1 *:data-[slot=tabs-trigger]:h-6 *:data-[slot=tabs-trigger]:rounded-sm *:data-[slot=tabs-trigger]:px-2 *:data-[slot=tabs-trigger]:text-xs">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </Tabs>
    <Separator orientation="vertical" class="mx-2 h-4!" />
    <a href="#{block.name}" class="flex-1 text-center text-sm font-medium underline-offset-2 hover:underline md:flex-auto md:text-left">{block.description.replace(/\.$/, '')}</a>
    <div class="ml-auto flex items-center gap-2">
      <div class="h-8 items-center gap-1.5 rounded-md border p-[3px] shadow-none">
        <ToggleGroup bind:value={size} onValueChange={resize} class="gap-1 *:data-[slot=toggle-group-item]:size-6! *:data-[slot=toggle-group-item]:rounded-sm!">
          <ToggleGroupItem value="100%" title="Desktop">
            {@render icon('<rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" />')}
          </ToggleGroupItem>
          <ToggleGroupItem value="60%" title="Tablet">
            {@render icon('<rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" />')}
          </ToggleGroupItem>
          <ToggleGroupItem value="30%" title="Mobile">
            {@render icon('<rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" />')}
          </ToggleGroupItem>
          <Separator orientation="vertical" class="h-4!" />
          <Button size="icon" variant="ghost" class="size-6 rounded-sm p-0" render={newTab} nativeButton={false} title="Open in New Tab">
            <span class="sr-only">Open in New Tab</span>
            {@render icon('<path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="10" height="8" x="7" y="8" rx="1" />')}
          </Button>
          <Separator orientation="vertical" class="h-4!" />
          <Button size="icon" variant="ghost" class="size-6 rounded-sm p-0" title="Refresh Preview" onclick={() => iframeKey++}>
            {@render icon('<path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />')}
            <span class="sr-only">Refresh Preview</span>
          </Button>
        </ToggleGroup>
      </div>
    </div>
  </div>
  <div class="flex items-center gap-2 px-2 lg:hidden">
    <div class="line-clamp-1 text-sm font-medium">{block.description}</div>
    <div class="ml-auto shrink-0 font-mono text-xs text-muted-foreground">{block.name}</div>
  </div>
  <div class="flex h-(--height) group-data-[view=code]/block-view-wrapper:hidden">
    <div class="relative grid w-full gap-4">
      <div class="absolute inset-0 right-4 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
      <ResizablePanelGroup orientation="horizontal" class="relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl after:bg-muted/50">
        <ResizablePanel bind:this={panel} class="relative overflow-hidden rounded-xl border bg-background" defaultSize="100%" minSize="30%">
          {#key iframeKey}
            <iframe src="/view/{block.name}" title={block.description} height={height.replace('px', '')} loading="lazy" class="relative z-20 no-scrollbar h-full w-full bg-background"></iframe>
          {/key}
        </ResizablePanel>
        <ResizableHandle class="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
        <ResizablePanel defaultSize="0%" minSize="0%" />
      </ResizablePanelGroup>
    </div>
  </div>
  {#if view === 'code' && file}
    <div class="mr-[14px] flex overflow-hidden rounded-xl border bg-code text-code-foreground md:h-(--height)">
      <div class="w-72">
        <SidebarProvider class="flex min-h-full! flex-col border-r">
          <Sidebar collapsible="none" class="w-full flex-1">
            <SidebarGroupLabel class="h-12 rounded-none border-b px-4 text-sm">Files</SidebarGroupLabel>
            <SidebarGroup class="p-0">
              <SidebarGroupContent>
                <SidebarMenu class="translate-x-0 gap-1.5">
                  {#each block.tree as item (item.name)}
                    {@render tree(item, 1)}
                  {/each}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </Sidebar>
        </SidebarProvider>
      </div>
      <figure data-rehype-pretty-code-figure="" class="mx-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none">
        <figcaption class="flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70" data-language="svelte">
          {file.target}
          <div class="ml-auto flex items-center gap-2">
            <CopyButton value={file.raw} class="static" />
          </div>
        </figcaption>
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- Shiki output highlighted at build time from the block's own files -->
        <div class="no-scrollbar overflow-y-auto [&_[data-rehype-pretty-code-figure]]:m-0 [&_[data-rehype-pretty-code-figure]]:rounded-none [&_[data-rehype-pretty-code-figure]]:border-none">{@html file.html}</div>
      </figure>
    </div>
  {/if}
</div>
