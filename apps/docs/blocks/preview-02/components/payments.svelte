<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@sveltery/ui/breadcrumb';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardHeader } from '@sveltery/ui/card';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@sveltery/ui/dropdown-menu';
  import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@sveltery/ui/item';
  import { IconPlaceholder } from '@sveltery/ui/icons';
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
                <Button {...(props as Record<string, unknown>)} size="icon-sm" variant="ghost">{@render content?.()}</Button>
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
        {#snippet render(props, _state, content)}
          <a {...(props as Record<string, unknown>)} href="#">{@render content?.()}</a>
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
        {#snippet render(props, _state, content)}
          <a {...(props as Record<string, unknown>)} href="#">{@render content?.()}</a>
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
        {#snippet render(props, _state, content)}
          <a {...(props as Record<string, unknown>)} href="#">{@render content?.()}</a>
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
        {#snippet render(props, _state, content)}
          <a {...(props as Record<string, unknown>)} href="#">{@render content?.()}</a>
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
