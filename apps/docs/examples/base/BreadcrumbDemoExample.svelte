<script lang="ts">
  import {
    Breadcrumb,
    BreadcrumbEllipsis,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from '$registry/bases/base/ui/breadcrumb';
  import { Button } from '$registry/bases/base/ui/button';
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
      <BreadcrumbLink>
        {#snippet render(props, _state, content)}
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" {...props}>{@render content?.()}</a>
        {/snippet}
        Home
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <DropdownMenu>
        <DropdownMenuTrigger>
          {#snippet render(props, _state, content)}
            <Button size="icon-sm" variant="ghost" {...props}>{@render content?.()}</Button>
          {/snippet}
          <BreadcrumbEllipsis />
          <span class="sr-only">Toggle menu</span>
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
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink>
        {#snippet render(props, _state, content)}
          <!-- svelte-ignore a11y_invalid_attribute -->
          <a href="#" {...props}>{@render content?.()}</a>
        {/snippet}
        Components
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
