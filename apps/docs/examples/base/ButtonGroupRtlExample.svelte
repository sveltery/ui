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
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
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

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        archive: 'Archive',
        report: 'Report',
        snooze: 'Snooze',
        markAsRead: 'Mark as Read',
        addToCalendar: 'Add to Calendar',
        addToList: 'Add to List',
        labelAs: 'Label As...',
        personal: 'Personal',
        work: 'Work',
        other: 'Other',
        trash: 'Trash'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        archive: 'أرشفة',
        report: 'تقرير',
        snooze: 'تأجيل',
        markAsRead: 'وضع علامة كمقروء',
        addToCalendar: 'إضافة إلى التقويم',
        addToList: 'إضافة إلى القائمة',
        labelAs: 'تصنيف كـ...',
        personal: 'شخصي',
        work: 'عمل',
        other: 'آخر',
        trash: 'سلة المهملات'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        archive: 'ארכיון',
        report: 'דוח',
        snooze: 'דחה',
        markAsRead: 'סמן כנקרא',
        addToCalendar: 'הוסף ליומן',
        addToList: 'הוסף לרשימה',
        labelAs: 'תייג כ...',
        personal: 'אישי',
        work: 'עבודה',
        other: 'אחר',
        trash: 'פח'
      }
    }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  let label = $state('personal');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
  const lang = $derived(dir === 'rtl' ? language : undefined);
</script>

<div class="flex w-full flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <div {dir}>
      <ButtonGroup>
        <ButtonGroup class="hidden sm:flex">
          <Button variant="outline" size="icon" aria-label="Go Back">
            <ArrowLeftIcon class="rtl:rotate-180" />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">{t.archive}</Button>
          <Button variant="outline">{t.report}</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">{t.snooze}</Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              {#snippet render(props, _state, content)}
                <Button variant="outline" size="icon" aria-label="More Options" {...props}>{@render content?.()}</Button>
              {/snippet}
              <MoreHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} data-lang={lang} {dir} class="w-40">
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <MailCheckIcon />
                  {t.markAsRead}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArchiveIcon />
                  {t.archive}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <ClockIcon />
                  {t.snooze}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CalendarPlusIcon />
                  {t.addToCalendar}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListFilterIcon />
                  {t.addToList}
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <TagIcon />
                    {t.labelAs}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent {dir} data-lang={lang}>
                    <DropdownMenuRadioGroup bind:value={label}>
                      <DropdownMenuRadioItem value="personal">{t.personal}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="work">{t.work}</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="other">{t.other}</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  {t.trash}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
      </ButtonGroup>
    </div>
  </DirectionProvider>
</div>
