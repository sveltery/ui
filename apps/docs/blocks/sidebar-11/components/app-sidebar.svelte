<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@sveltery/ui/collapsible';
  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarRail,
    type SidebarProps,
  } from '@sveltery/ui/sidebar';
  import { IconPlaceholder } from '@sveltery/ui/icons';
  let { ...props }: SidebarProps = $props();
  type TreeItem = string | [name: string, ...items: TreeItem[]];

  const data: { changes: { file: string; state: string }[]; tree: TreeItem[] } = {
    changes: [
      {
        file: 'README.md',
        state: 'M',
      },
      {
        file: 'api/hello/route.ts',
        state: 'U',
      },
      {
        file: 'app/layout.tsx',
        state: 'M',
      },
    ],
    tree: [
      [
        'app',
        [
          'api',
          ['hello', ['route.ts']],
          'page.tsx',
          'layout.tsx',
          ['blog', ['page.tsx']],
        ],
      ],
      [
        'components',
        ['ui', 'button.tsx', 'card.tsx'],
        'header.tsx',
        'footer.tsx',
      ],
      ['lib', ['util.ts']],
      ['public', 'favicon.ico', 'vercel.svg'],
      '.eslintrc.json',
      '.gitignore',
      'next.config.js',
      'tailwind.config.js',
      'package.json',
      'README.md',
    ],
  };

</script>

{#snippet collapsibleTrigger(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <CollapsibleTrigger {...props}>{@render children?.()}</CollapsibleTrigger>
{/snippet}

{#snippet tree(item: TreeItem)}
  {const [name, ...items] = $derived(typeof item === 'string' ? [item] : item)}
  {#if !items.length}
    <SidebarMenuButton isActive={name === 'button.tsx'} class="data-[active=true]:bg-transparent">
      <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="FileIcon" phosphor="FileIcon" remixicon="RiFileLine" />
      {name}
    </SidebarMenuButton>
  {:else}
    <SidebarMenuItem>
      <Collapsible class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90" open={name === 'components' || name === 'ui'}>
        <SidebarMenuButton render={collapsibleTrigger}>
          <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="transition-transform" />
          <IconPlaceholder lucide="FolderIcon" tabler="IconFolder" hugeicons="FolderIcon" phosphor="FolderIcon" remixicon="RiFolderLine" />
          {name}
        </SidebarMenuButton>
        <CollapsibleContent>
          <SidebarMenuSub>
            {#each items as subItem, index (index)}
              {@render tree(subItem)}
            {/each}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  {/if}
{/snippet}

<Sidebar {...props}>
  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Changes</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {#each data.changes as item, index (index)}
            <SidebarMenuItem>
              <SidebarMenuButton>
                <IconPlaceholder lucide="FileIcon" tabler="IconFile" hugeicons="FileIcon" phosphor="FileIcon" remixicon="RiFileLine" />
                {item.file}
              </SidebarMenuButton>
              <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
            </SidebarMenuItem>
          {/each}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
    <SidebarGroup>
      <SidebarGroupLabel>Files</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {#each data.tree as item, index (index)}
            {@render tree(item)}
          {/each}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>
  <SidebarRail />
</Sidebar>
