<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@sveltery/ui/sidebar';

  let { items, ...props }: { items: { title: string; url: string; icon: Snippet; badge?: string }[] } & ComponentProps<typeof SidebarGroup> = $props();
</script>

<SidebarGroup {...props}>
  <SidebarGroupContent>
    <SidebarMenu>
      {#each items as item (item.title)}
        {#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
          <a href={item.url} {...props}>{@render children?.()}</a>
        {/snippet}
        <SidebarMenuItem>
          <SidebarMenuButton render={link}>
            {@render item.icon()}
            <span>{item.title}</span>
          </SidebarMenuButton>
          {#if item.badge}
            <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
          {/if}
        </SidebarMenuItem>
      {/each}
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
