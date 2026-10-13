<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';

  let {
    items,
    ...props
  }: {
    items: {
      title: string;
      url: string;
      icon: Snippet;
    }[];
  } & Omit<ComponentProps<typeof SidebarGroup>, 'children'> = $props();
</script>

<SidebarGroup {...props}>
  <SidebarGroupContent>
    <SidebarMenu>
      {#each items as item (item.title)}
        {#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
          <a href={item.url} {...props}>{@render children?.()}</a>
        {/snippet}
        <SidebarMenuItem>
          <SidebarMenuButton size="sm" render={link}>
            {@render item.icon()}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      {/each}
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
