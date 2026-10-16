<script lang="ts">
  import type { ComponentProps, Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '$registry/bases/base/ui/sidebar';

  let { items, ...props }: { items: { title: string; url: string; icon: Snippet; badge?: string }[] } & ComponentProps<typeof SidebarGroup> = $props();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

<SidebarGroup {...props}>
  <SidebarGroupContent>
    <SidebarMenu>
      {#each items as item (item.title)}
        {#snippet link(hostProps: RenderProps, _state: unknown, children?: Snippet)}
          <a href={item.url} {...hostProps}>{@render children?.()}</a>
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
