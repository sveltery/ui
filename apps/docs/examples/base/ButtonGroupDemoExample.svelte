<script lang="ts">
  import ArchiveIcon from '@lucide/svelte/icons/archive';
  import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
  import CalendarPlusIcon from '@lucide/svelte/icons/calendar-plus';
  import ClockIcon from '@lucide/svelte/icons/clock';
  import ListFilterIcon from '@lucide/svelte/icons/list-filter';
  import MailCheckIcon from '@lucide/svelte/icons/mail-check';
  import MoreHorizontalIcon from '@lucide/svelte/icons/ellipsis';
  import TagIcon from '@lucide/svelte/icons/tag';
  import Trash2Icon from '@lucide/svelte/icons/trash';
  import { Button } from '$registry/bases/base/ui/button';
  import { ButtonGroup } from '$registry/bases/base/ui/button-group';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
  } from '$registry/bases/base/ui/dropdown-menu';

  let label = $state('personal');
</script>

<ButtonGroup>
  <ButtonGroup class="hidden sm:flex">
    <Button variant="outline" size="icon" aria-label="Go Back">
      <ArrowLeftIcon />
    </Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Archive</Button>
    <Button variant="outline">Report</Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline">Snooze</Button>
    <DropdownMenu>
      <DropdownMenuTrigger>
        {#snippet render(props, _state, content)}
          <Button variant="outline" size="icon" aria-label="More Options" {...props}>{@render content?.()}</Button>
        {/snippet}
        <MoreHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" class="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <MailCheckIcon />
            Mark as Read
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ArchiveIcon />
            Archive
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <ClockIcon />
            Snooze
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CalendarPlusIcon />
            Add to Calendar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ListFilterIcon />
            Add to List
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <TagIcon />
              Label As...
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup bind:value={label}>
                <DropdownMenuRadioItem value="personal">Personal</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="work">Work</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive">
            <Trash2Icon />
            Trash
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </ButtonGroup>
</ButtonGroup>
