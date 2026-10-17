<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { CodeBlock, CodeBlockActions, CodeBlockContent, CodeBlockCopyButton, CodeBlockHeader, CodeBlockLine, CodeBlockTitle, useHighlightedCode } from '$registry/bases/base/ui/code-block';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { IconPlaceholder } from '$registry/bases/base/ui/icons';

  const translations = {
    en: {
      dir: 'ltr',
      description: 'Install the packages, then start the dev server.',
      title: 'Terminal',
    },
    ar: {
      dir: 'rtl',
      description: 'ثبّت الحزم، ثم شغّل خادم التطوير.',
      title: 'الطرفية',
    },
    he: {
      dir: 'rtl',
      description: 'התקן את החבילות, ואז הפעל את שרת הפיתוח.',
      title: 'מסוף',
    },
  } as const;

  const code = `pnpm add ai @ai-sdk/react zod
pnpm dev`;

  let language = $state<keyof typeof translations>('ar');
  const t = $derived(translations[language]);
  const highlighted = useHighlightedCode(() => code, () => 'bash');
</script>

<div class="flex w-full max-w-md flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as lang (lang)}
      <Button variant={language === lang ? 'default' : 'outline'} size="sm" onclick={() => (language = lang as keyof typeof translations)}>
        {lang}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={t.dir}>
    <div class="flex w-full flex-col gap-3 text-sm" dir={t.dir}>
      <p>{t.description}</p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <IconPlaceholder lucide="TerminalIcon" tabler="IconTerminal" hugeicons="ComputerTerminal01Icon" phosphor="TerminalIcon" remixicon="RiTerminalBoxLine" />
            {t.title}
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {#each highlighted.lines as line, index (index)}
            <!-- eslint-disable-next-line svelte/no-at-html-tags -- useHighlightedCode escapes the code -->
            <CodeBlockLine>{@html line}</CodeBlockLine>
          {/each}
        </CodeBlockContent>
      </CodeBlock>
    </div>
  </DirectionProvider>
</div>
