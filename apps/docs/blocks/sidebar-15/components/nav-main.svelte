<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '$registry/bases/base/ui/sidebar';

  let { items }: { items: { title: string; url: string; icon: Snippet; isActive?: boolean }[] } = $props();
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

<SidebarMenu>
  {#each items as item (item.title)}
    {#snippet link(props: RenderProps, _state: unknown, children?: Snippet)}
      <a href={item.url} {...props}>{@render children?.()}</a>
    {/snippet}
    <SidebarMenuItem>
      <SidebarMenuButton isActive={item.isActive} render={link}>
        {@render item.icon()}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  {/each}
</SidebarMenu>
