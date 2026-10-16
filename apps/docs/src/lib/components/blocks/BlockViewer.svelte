<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$registry/bases/base/ui/collapsible';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';
  import { Separator } from '$registry/bases/base/ui/separator';
  import { Sidebar, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarProvider } from '$registry/bases/base/ui/sidebar';
  import { Tabs, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import { ToggleGroup, ToggleGroupItem } from '$registry/bases/base/ui/toggle-group';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Block } from '#blocks/registry';
  import type { BlockFiles, FileTree } from '$lib/blocks/types';
  import CopyButton from '../docs/CopyButton.svelte';

  let { block }: { block: Block } = $props();

  let view = $state<'preview' | 'code'>('preview');
  let selectedFile = $state<string>();
  let size = $state(['100%']);
  let iframeKey = $state(0);
  let panel = $state<ResizablePanel>();
  let source = $state<Promise<BlockFiles>>();
  const height = $derived(block.iframeHeight ?? '930px');

  /** Fetches the highlighted files once the toolbar is first reached, so the Code view is ready when it opens. */
  const loadSource = () => (source ??= fetch(`/view/${block.name}/source.json`).then((response) => response.json()));

  const treeItemClass = 'rounded-none pl-(--index) whitespace-nowrap hover:bg-muted-foreground/15 focus:bg-muted-foreground/15 focus-visible:bg-muted-foreground/15 active:bg-muted-foreground/15 data-[active=true]:bg-muted-foreground/15';

  function resize(value: string[]) {
    view = 'preview';
    if (value[0]) panel?.resize(value[0]);
  }
</script>

{#snippet chevron(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
{/snippet}

{#snippet languageIcon(language: string)}
  {#if language === 'json'}
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12.043 23.968c.479-.004.953-.029 1.426-.094a11.805 11.805 0 0 0 3.146-.863 12.404 12.404 0 0 0 3.793-2.542 11.977 11.977 0 0 0 2.44-3.427 11.794 11.794 0 0 0 1.02-3.476c.149-1.16.135-2.346-.045-3.499a11.96 11.96 0 0 0-.793-2.788 11.197 11.197 0 0 0-.854-1.617c-1.168-1.837-2.861-3.314-4.81-4.3a12.835 12.835 0 0 0-2.172-.87h-.005c.119.063.24.132.345.201.12.074.239.146.351.225a8.93 8.93 0 0 1 1.559 1.33c1.063 1.145 1.797 2.548 2.218 4.041.284.982.434 1.998.495 3.017.044.743.044 1.491-.047 2.229-.149 1.27-.554 2.51-1.228 3.596a7.475 7.475 0 0 1-1.903 2.084c-1.244.928-2.877 1.482-4.436 1.114a3.916 3.916 0 0 1-.748-.258 4.692 4.692 0 0 1-.779-.45 6.08 6.08 0 0 1-1.244-1.105 6.507 6.507 0 0 1-1.049-1.747 7.366 7.366 0 0 1-.494-2.54c-.03-1.273.225-2.553.854-3.67a6.43 6.43 0 0 1 1.663-1.918c.225-.178.464-.333.704-.479l.016-.007a5.121 5.121 0 0 0-1.441-.12 4.963 4.963 0 0 0-1.228.24c-.359.12-.704.27-1.019.45a6.146 6.146 0 0 0-.733.494c-.211.18-.42.36-.615.555-1.123 1.153-1.768 2.682-2.022 4.256-.15.973-.15 1.96-.091 2.95.105 1.395.391 2.787.945 4.062a8.518 8.518 0 0 0 1.348 2.173 8.14 8.14 0 0 0 3.132 2.23 7.934 7.934 0 0 0 2.113.54c.074.015.149.015.209.015zm-2.934-.398a4.102 4.102 0 0 1-.45-.228 8.5 8.5 0 0 1-2.038-1.534c-1.094-1.137-1.827-2.566-2.247-4.08a15.184 15.184 0 0 1-.495-3.172 12.14 12.14 0 0 1 .046-2.082c.135-1.257.495-2.501 1.124-3.58a6.889 6.889 0 0 1 1.783-2.053 6.23 6.23 0 0 1 1.633-.9 5.363 5.363 0 0 1 3.522-.045c.029 0 .029 0 .045.03.015.015.045.015.06.03.045.016.104.045.165.074.239.12.479.271.704.42a6.294 6.294 0 0 1 2.097 2.502c.42.914.615 1.934.631 2.938.014 1.079-.18 2.157-.645 3.146a6.42 6.42 0 0 1-2.638 2.832c.09.03.18.045.271.075.225.044.449.074.688.074 1.468.045 2.892-.66 3.94-1.647.195-.18.375-.375.54-.585.225-.27.435-.54.614-.823.239-.375.435-.75.614-1.154a8.112 8.112 0 0 0 .509-1.664c.196-1.004.211-2.022.149-3.026-.135-2.022-.673-4.045-1.842-5.724a9.054 9.054 0 0 0-.555-.719 9.868 9.868 0 0 0-1.063-1.034 8.477 8.477 0 0 0-1.363-.915 9.927 9.927 0 0 0-1.692-.598l-.3-.06c-.209-.03-.42-.044-.634-.06a8.453 8.453 0 0 0-1.015.016c-.704.045-1.412.16-2.112.337C5.799 1.227 2.863 3.566 1.3 6.67A11.834 11.834 0 0 0 .238 9.801a11.81 11.81 0 0 0-.104 3.775c.12 1.02.374 2.023.778 2.977.227.57.511 1.124.825 1.648 1.094 1.783 2.683 3.236 4.51 4.24.688.39 1.408.69 2.157.944.226.074.45.15.689.21z" /></svg>
  {:else if language === 'ts' || language === 'js'}
    <svg viewBox="0 0 24 24" class="fill-foreground" aria-hidden="true"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" /></svg>
  {:else}
    {@render fileIcon()}
  {/if}
{/snippet}

{#snippet fileIcon(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /></svg>
{/snippet}

{#snippet folder(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" /></svg>
{/snippet}

{#snippet monitor(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
{/snippet}

{#snippet tablet(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" ry="2" /><line x1="12" x2="12.01" y1="18" y2="18" /></svg>
{/snippet}

{#snippet smartphone(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
{/snippet}

{#snippet fullscreen(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><rect width="10" height="8" x="7" y="8" rx="1" /></svg>
{/snippet}

{#snippet rotate(className = '')}
  <svg viewBox="0 0 24 24" class={className} fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
{/snippet}

{#snippet newTab(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <a {...props} href="/view/{block.name}" target="_blank" rel="noopener">{@render children?.()}</a>
{/snippet}

{#snippet folderTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <SidebarMenuButton {...props}>{@render children?.()}</SidebarMenuButton>
{/snippet}

{#snippet tree(item: FileTree, index: number, activeFile: string)}
  <SidebarMenuItem>
    {#if !item.children}
      <SidebarMenuButton isActive={item.path === activeFile} onclick={() => (selectedFile = item.path)} class={treeItemClass} data-index={index} style="--index: {index * (index === 2 ? 1.2 : 1.3)}rem">
        {@render chevron('invisible')}
        {@render fileIcon('h-4 w-4')}
        {item.name}
      </SidebarMenuButton>
    {:else}
      <Collapsible class="group/collapsible [&[data-open]>button>svg:first-child]:rotate-90" open>
        <CollapsibleTrigger render={folderTrigger} class={treeItemClass} style="--index: {index * (index === 1 ? 1 : 1.2)}rem">
          {@render chevron('transition-transform')}
          {@render folder()}
          {item.name}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub class="m-0 w-full translate-x-0 border-none p-0">
            {#each item.children as child (child.name)}
              {@render tree(child, index + 1, activeFile)}
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
  class="group/block-view-wrapper flex min-w-0 scroll-mt-24 flex-col-reverse items-stretch gap-4 overflow-hidden md:flex-col"
  style="--height: {height}"
>
  <div class="hidden w-full items-center gap-2 pl-2 md:pr-6 lg:flex" onpointerenter={loadSource} onfocusin={loadSource}>
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
            {@render monitor()}
          </ToggleGroupItem>
          <ToggleGroupItem value="60%" title="Tablet">
            {@render tablet()}
          </ToggleGroupItem>
          <ToggleGroupItem value="30%" title="Mobile">
            {@render smartphone()}
          </ToggleGroupItem>
          <Separator orientation="vertical" class="h-4!" />
          <Button size="icon" variant="ghost" class="size-6 rounded-sm p-0" render={newTab} nativeButton={false} title="Open in New Tab">
            <span class="sr-only">Open in New Tab</span>
            {@render fullscreen()}
          </Button>
          <Separator orientation="vertical" class="h-4!" />
          <Button size="icon" variant="ghost" class="size-6 rounded-sm p-0" title="Refresh Preview" onclick={() => iframeKey++}>
            {@render rotate()}
            <span class="sr-only">Refresh Preview</span>
          </Button>
        </ToggleGroup>
      </div>
    </div>
  </div>
  <div class="flex h-(--height) group-data-[view=code]/block-view-wrapper:hidden">
    <div class="relative grid w-full gap-4">
      <div class="absolute inset-0 right-4 [background-image:radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:20px_20px] dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]"></div>
      <ResizablePanelGroup orientation="horizontal" class="relative z-10 after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-xl after:bg-surface/50">
        <ResizablePanel bind:this={panel} class="relative overflow-hidden rounded-lg border bg-background md:rounded-xl" defaultSize="100%" minSize="30%">
          {#key iframeKey}
            <iframe src="/view/{block.name}" title={block.description} loading="lazy" class="relative z-20 no-scrollbar h-full w-full bg-background"></iframe>
          {/key}
        </ResizablePanel>
        <ResizableHandle class="relative hidden w-3 bg-transparent p-0 after:absolute after:top-1/2 after:right-0 after:h-8 after:w-[6px] after:translate-x-[-1px] after:-translate-y-1/2 after:rounded-full after:bg-border after:transition-all after:hover:h-10 md:block" />
        <ResizablePanel defaultSize="0%" minSize="0%" />
      </ResizablePanelGroup>
    </div>
  </div>
  {#if source}
    <div class="mr-[14px] flex overflow-hidden rounded-xl border bg-code text-code-foreground group-data-[view=preview]/block-view-wrapper:hidden md:h-(--height)">
      {#await source then { files, tree: items }}
        {const activeFile = $derived(selectedFile ?? files[0].target)}
        {const file = $derived(files.find((entry) => entry.target === activeFile)!)}
        {const language = $derived(file.target.split('.').pop()!)}
        <div class="w-72">
          <SidebarProvider class="flex min-h-full! flex-col border-r">
            <Sidebar collapsible="none" class="w-full flex-1">
              <SidebarGroupLabel class="h-12 rounded-none border-b px-4 text-sm">Files</SidebarGroupLabel>
              <SidebarGroup class="p-0">
                <SidebarGroupContent>
                  <SidebarMenu class="translate-x-0 gap-1.5">
                    {#each items as item (item.name)}
                      {@render tree(item, 1, activeFile)}
                    {/each}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </Sidebar>
          </SidebarProvider>
        </div>
        <figure data-rehype-pretty-code-figure="" class="mx-0! mt-0 flex min-w-0 flex-1 flex-col rounded-xl border-none">
          <figcaption class="flex h-12 shrink-0 items-center gap-2 border-b px-4 py-2 text-code-foreground [&_svg]:size-4 [&_svg]:text-code-foreground [&_svg]:opacity-70" data-language={language}>
            {@render languageIcon(language)}
            {file.target}
            <div class="ml-auto flex items-center gap-2">
              <CopyButton value={file.raw} class="static" />
            </div>
          </figcaption>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- Shiki output highlighted at build time from the block's own files -->
          <div class="no-scrollbar overflow-y-auto">{@html file.html}</div>
        </figure>
      {/await}
    </div>
  {/if}
  <div class="flex items-center gap-2 px-2 lg:hidden">
    <div class="line-clamp-1 text-sm font-medium">{block.description}</div>
    <div class="ml-auto shrink-0 font-mono text-xs text-muted-foreground">{block.name}</div>
  </div>
</div>
