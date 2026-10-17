<script lang="ts">
  import ChevronDownIcon from '@lucide/svelte/icons/chevron-down';
  import DotIcon from '@lucide/svelte/icons/dot';
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from '$registry/bases/base/ui/breadcrumb';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
</script>

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <DotIcon />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet render(props, _state, content)}
            <button class="flex items-center gap-1" {...props}>{@render content?.()}</button>
          {/snippet}
          Components
          <ChevronDownIcon data-icon="inline-end" class="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Themes</DropdownMenuItem>
            <DropdownMenuItem>GitHub</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </BreadcrumbItem>
    <BreadcrumbSeparator>
      <DotIcon />
    </BreadcrumbSeparator>
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
