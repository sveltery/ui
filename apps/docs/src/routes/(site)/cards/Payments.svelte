<script lang="ts">
  import { ArrowRight01Icon, Calendar03Icon, MoreHorizontalCircle01Icon, RefreshIcon, Settings01Icon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon } from '@hugeicons/svelte';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
  } from '$registry/bases/base/ui/breadcrumb';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardHeader } from '$registry/bases/base/ui/card';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';
  import {
    Item,
    ItemContent,
    ItemDescription,
    ItemGroup,
    ItemMedia,
    ItemTitle
  } from '$registry/bases/base/ui/item';
</script>

{#snippet link(props: Pick<HTMLAttributes<HTMLElement>, 'class'>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<Card>
  <CardHeader class="flex flex-col gap-3">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet render(props, _state, content)}
                <Button size="icon-sm" variant="ghost" aria-label="Account options" {...props}>
                  {@render content?.()}
                </Button>
              {/snippet}
              <HugeiconsIcon icon={MoreHorizontalCircle01Icon} strokeWidth={2} />
              <span class="sr-only">Account options</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Statements</DropdownMenuItem>
                <DropdownMenuItem>Documents</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Payments</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  </CardHeader>
  <CardContent>
    <ItemGroup>
      <div role="listitem" class="w-full">
        <Item variant="muted" render={link}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Change transfer limit</ItemTitle>
            <ItemDescription>Adjust how much you can send from your balance.</ItemDescription>
          </ItemContent>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} class="size-4 shrink-0 text-muted-foreground" />
        </Item>
      </div>
      <div role="listitem" class="w-full">
        <Item variant="muted" render={link}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Scheduled transfers</ItemTitle>
            <ItemDescription>Set up a transfer to send at a later date.</ItemDescription>
          </ItemContent>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} class="size-4 shrink-0 text-muted-foreground" />
        </Item>
      </div>
      <div role="listitem" class="w-full">
        <Item variant="muted" render={link}>
          <ItemMedia variant="icon">
            <HugeiconsIcon icon={RefreshIcon} strokeWidth={2} />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Recurring card payments</ItemTitle>
            <ItemDescription>Manage your repeated card transactions.</ItemDescription>
          </ItemContent>
          <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} class="size-4 shrink-0 text-muted-foreground" />
        </Item>
      </div>
    </ItemGroup>
  </CardContent>
</Card>
