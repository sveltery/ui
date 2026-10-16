<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '$registry/bases/base/ui/sidebar';

  let { items }: { items: { title: string; url: string; icon?: Snippet }[] } = $props();
</script>

<SidebarGroup>
  <SidebarGroupContent class="flex flex-col gap-2">
    <SidebarMenu>
      <SidebarMenuItem class="flex items-center gap-2">
        <SidebarMenuButton
          tooltip="Quick Create"
          class="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
        >
          <IconPlaceholder lucide="CirclePlusIcon" tabler="IconCirclePlusFilled" hugeicons="PlusSignCircleIcon" phosphor="PlusCircleIcon" remixicon="RiAddCircleFill" />
          <span>Quick Create</span>
        </SidebarMenuButton>
        <Button size="icon" class="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
          <IconPlaceholder lucide="MailIcon" tabler="IconMail" hugeicons="Mail01Icon" phosphor="EnvelopeIcon" remixicon="RiMailLine" />
          <span class="sr-only">Inbox</span>
        </Button>
      </SidebarMenuItem>
    </SidebarMenu>
    <SidebarMenu>
      {#each items as item (item.title)}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip={item.title}>
            {@render item.icon?.()}
            <span>{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      {/each}
    </SidebarMenu>
  </SidebarGroupContent>
</SidebarGroup>
