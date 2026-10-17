<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import ArrowUpRightIcon from '@lucide/svelte/icons/arrow-up-right';
  import IconFolderCode from '@tabler/icons-svelte-runes/icons/folder-code';
  import { Button } from '$registry/bases/base/ui/button';
  import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '$registry/bases/base/ui/empty';
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      title: 'No Projects Yet',
      description: "You haven't created any projects yet. Get started by creating your first project.",
      createProject: 'Create Project',
      importProject: 'Import Project',
      learnMore: 'Learn More'
    },
    ar: {
      dir: 'rtl',
      title: 'لا توجد مشاريع بعد',
      description: 'لم تقم بإنشاء أي مشاريع بعد. ابدأ بإنشاء مشروعك الأول.',
      createProject: 'إنشاء مشروع',
      importProject: 'استيراد مشروع',
      learnMore: 'تعرف على المزيد'
    },
    he: {
      dir: 'rtl',
      title: 'אין פרויקטים עדיין',
      description: 'עדיין לא יצרת פרויקטים. התחל על ידי יצירת הפרויקט הראשון שלך.',
      createProject: 'צור פרויקט',
      importProject: 'ייבא פרויקט',
      learnMore: 'למד עוד'
    }
  } as const;

  const language = useLanguage();
  const t = $derived(translations[language.current]);
</script>

{#snippet link(props: HTMLAttributes<HTMLElement>, _state: unknown, children?: Snippet)}
  <!-- svelte-ignore a11y_invalid_attribute -->
  <a href="#" {...props}>{@render children?.()}</a>
{/snippet}

<div class="flex w-full flex-col gap-4">
  <Empty dir={t.dir}>
    <EmptyHeader>
      <EmptyMedia variant="icon">
        <IconFolderCode />
      </EmptyMedia>
      <EmptyTitle>{t.title}</EmptyTitle>
      <EmptyDescription>{t.description}</EmptyDescription>
    </EmptyHeader>
    <EmptyContent class="flex-row justify-center gap-2">
      <Button>{t.createProject}</Button>
      <Button variant="outline">{t.importProject}</Button>
    </EmptyContent>
    <Button variant="link" render={link} class="text-muted-foreground" size="sm" nativeButton={false}>
      {t.learnMore}
      <ArrowUpRightIcon class="rtl:rotate-270" data-icon="inline-end" />
    </Button>
  </Empty>
</div>
