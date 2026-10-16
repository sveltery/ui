<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '$registry/bases/base/ui/breadcrumb';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardHeader } from '$registry/bases/base/ui/card';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '$registry/bases/base/ui/dropdown-menu';
  import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '$registry/bases/base/ui/item';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';
  // The host element's typed event handlers do not fit the element this snippet renders, so only `class` is typed.
  type RenderProps = Pick<HTMLAttributes<HTMLElement>, 'class'>;
</script>

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
                <Button {...props} size="icon-sm" variant="ghost">{@render content?.()}</Button>
              {/snippet}
              <IconPlaceholder lucide="MoreHorizontalIcon" tabler="IconDots" hugeicons="MoreHorizontalCircle01Icon" phosphor="DotsThreeIcon" remixicon="RiMoreLine" />
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
      <Item variant="muted">
        {#snippet render(props: RenderProps, _state: unknown, content?: Snippet)}
          <a {...props} href="#">{@render content?.()}</a>
        {/snippet}
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="GaugeIcon" tabler="IconGauge" hugeicons="Settings01Icon" phosphor="GaugeIcon" remixicon="RiDashboardLine" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Change transfer limit</ItemTitle>
          <ItemDescription>Adjust how much you can send from your balance.</ItemDescription>
        </ItemContent>
        <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="size-4 shrink-0 text-muted-foreground" />
      </Item>
      <Item variant="muted">
        {#snippet render(props: RenderProps, _state: unknown, content?: Snippet)}
          <a {...props} href="#">{@render content?.()}</a>
        {/snippet}
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="CalendarIcon" tabler="IconCalendar" hugeicons="Calendar03Icon" phosphor="CalendarIcon" remixicon="RiCalendarLine" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Scheduled transfers</ItemTitle>
          <ItemDescription>Set up a transfer to send at a later date.</ItemDescription>
        </ItemContent>
        <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="size-4 shrink-0 text-muted-foreground" />
      </Item>
      <Item variant="muted">
        {#snippet render(props: RenderProps, _state: unknown, content?: Snippet)}
          <a {...props} href="#">{@render content?.()}</a>
        {/snippet}
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="RepeatIcon" tabler="IconRepeat" hugeicons="RepeatIcon" phosphor="RepeatIcon" remixicon="RiRepeatLine" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Direct Debits</ItemTitle>
          <ItemDescription>Set up and manage regular payments.</ItemDescription>
        </ItemContent>
        <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="size-4 shrink-0 text-muted-foreground" />
      </Item>
      <Item variant="muted">
        {#snippet render(props: RenderProps, _state: unknown, content?: Snippet)}
          <a {...props} href="#">{@render content?.()}</a>
        {/snippet}
        <ItemMedia variant="icon">
          <IconPlaceholder lucide="RefreshCwIcon" tabler="IconRefresh" hugeicons="RepeatIcon" phosphor="ArrowsClockwiseIcon" remixicon="RiRefreshLine" />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Recurring card payments</ItemTitle>
          <ItemDescription>Manage your repeated card transactions.</ItemDescription>
        </ItemContent>
        <IconPlaceholder lucide="ChevronRightIcon" tabler="IconChevronRight" hugeicons="ArrowRight01Icon" phosphor="CaretRightIcon" remixicon="RiArrowRightSLine" class="size-4 shrink-0 text-muted-foreground" />
      </Item>
    </ItemGroup>
  </CardContent>
</Card>
