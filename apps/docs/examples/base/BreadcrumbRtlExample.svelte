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
  import { useLanguage } from '$lib/components/docs/language.svelte';

  const translations = {
    en: {
      dir: 'ltr',
      values: {
        home: 'Home',
        components: 'Components',
        documentation: 'Documentation',
        themes: 'Themes',
        github: 'GitHub',
        breadcrumb: 'Breadcrumb'
      }
    },
    ar: {
      dir: 'rtl',
      values: {
        home: 'الرئيسية',
        components: 'المكونات',
        documentation: 'التوثيق',
        themes: 'السمات',
        github: 'جيت هاب',
        breadcrumb: 'مسار التنقل'
      }
    },
    he: {
      dir: 'rtl',
      values: {
        home: 'בית',
        components: 'רכיבים',
        documentation: 'תיעוד',
        themes: 'ערכות נושא',
        github: 'גיטהאב',
        breadcrumb: 'פירורי לחם'
      }
    }
  } as const;

  const language = useLanguage();
  const dir = $derived(translations[language.current].dir);
  const t = $derived(translations[language.current].values);
</script>

<div class="flex w-full flex-col gap-4">
  <Breadcrumb {dir}>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">{t.home}</BreadcrumbLink>
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
            {t.components}
            <ChevronDownIcon data-icon="inline-end" class="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align={dir === 'rtl' ? 'end' : 'start'} data-lang={dir === 'rtl' ? language.current : undefined} {dir}>
            <DropdownMenuGroup>
              <DropdownMenuItem>{t.documentation}</DropdownMenuItem>
              <DropdownMenuItem>{t.themes}</DropdownMenuItem>
              <DropdownMenuItem>{t.github}</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <DotIcon />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage>{t.breadcrumb}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</div>
