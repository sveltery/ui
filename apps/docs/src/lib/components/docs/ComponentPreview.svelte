<script lang="ts">
  import type { Component } from 'svelte';
  import CircleAlertIcon from '@lucide/svelte/icons/circle-alert';
  import { cn } from 'cn';
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { Popover, PopoverContent, PopoverTrigger } from '$registry/bases/base/ui/popover';
  import { Separator } from '$registry/bases/base/ui/separator';
  import CodeFigure from './CodeFigure.svelte';
  import { setPreviewLanguage } from './language.svelte';
  import LanguageSelector from './LanguageSelector.svelte';

  let {
    name,
    component: Example,
    source,
    align = 'center',
    hideCode = false,
    direction = 'ltr',
    class: className,
  }: {
    name: string;
    component: Component;
    source: { html: string; peek: string; raw: string };
    align?: 'center' | 'start' | 'end';
    hideCode?: boolean;
    direction?: 'ltr' | 'rtl';
    class?: string;
  } = $props();

  let codeVisible = $state(false);
  // An RTL example reads the language that the selector above it sets, as upstream's `LanguageProvider` gives it.
  // svelte-ignore state_referenced_locally
  const language = direction === 'rtl' ? setPreviewLanguage('ar') : undefined;
</script>

<div data-slot="component-preview" data-name={name} data-not-typeset class={cn('group relative mt-4 mb-12 flex flex-col overflow-hidden rounded-2xl border', className)}>
  {#if language}
    <div class="flex h-16 items-center border-b px-4">
      <LanguageSelector bind:value={language.current} />
      <Popover>
        <PopoverTrigger>
          {#snippet render(props)}
            <Button variant="ghost" size="icon-sm" class="ml-auto size-7" {...props}>
              <CircleAlertIcon />
              <span class="sr-only">Toggle</span>
            </Button>
          {/snippet}
        </PopoverTrigger>
        <PopoverContent side="bottom" align="end" class="w-56 text-xs">
          <div>I used AI to translate the text for demonstration purposes. It's not perfect and may contain errors.</div>
          <Separator class="-mx-2.5 w-auto!" />
          <div data-lang="ar">لقد استخدمت الذكاء الاصطناعي لترجمة النص للأغراض التجريبية فقط. قد لا تكون الترجمة دقيقة وقد تحتوي على أخطاء.</div>
          <Separator class="-mx-2.5 w-auto!" />
          <div data-lang="he">השתמשתי בבינה מלאכותית כדי לתרגם את הטקסט למטרות הדגמה. זה לא מושלם ויכול להכיל שגיאות.</div>
        </PopoverContent>
      </Popover>
    </div>
  {/if}
  <div
    data-slot="preview"
    data-align={align}
    data-pagefind-ignore
    dir={language?.dir}
    data-lang={language?.dir === 'rtl' ? language.current : undefined}
    class="no-scrollbar relative flex max-h-[36rem] min-h-72 w-full justify-center overflow-y-auto p-6 data-[align=center]:items-center-safe data-[align=end]:items-end-safe data-[align=start]:items-start sm:p-10 [&_[data-slot=example-wrapper]]:min-h-0 [&_[data-slot=example-wrapper]]:p-0 [&_[data-slot=example-wrapper]]:flex! [&_[data-slot=example-wrapper]]:flex-col max-sm:[&_[data-slot=example-content]]:p-6 [&>.w-full]:bg-transparent"
  >
    {#if language}
      <DirectionProvider direction={language.dir}>
        <Example />
      </DirectionProvider>
    {:else}
      <Example />
    {/if}
  </div>
  {#if !hideCode}
    <div
      data-slot="code"
      data-code-visible={codeVisible}
      class="relative overflow-hidden **:data-[slot=copy-button]:right-4 **:data-[slot=copy-button]:hidden data-[code-visible=true]:**:data-[slot=copy-button]:flex [&_[data-rehype-pretty-code-figure]]:m-0! [&_[data-rehype-pretty-code-figure]]:rounded-t-none [&_[data-rehype-pretty-code-figure]]:border-t [&_pre]:max-h-72"
    >
      {#if codeVisible}
        {#if language}
          <div class="no-scrollbar relative z-10 overflow-x-auto border-t bg-code p-6 font-mono text-sm text-muted-foreground">
            <pre>{`// You will notice this example uses dir and data-lang attributes.
// This is because this site is not RTL by default.
// In your application, you won't need these.`}</pre>
            <span>// See the <a href="/docs/rtl" class="underline underline-offset-4">RTL guide</a> for more information.</span>
          </div>
        {/if}
        <CodeFigure html={source.html} raw={source.raw} />
      {:else}
        <div class="relative">
          <CodeFigure html={source.peek} raw={source.raw} />
          <div class="absolute inset-0 flex items-center justify-center pb-4">
            <div class="absolute inset-0" style="background: linear-gradient(to top, var(--color-code), color-mix(in oklab, var(--color-code) 60%, transparent), transparent)"></div>
            <button
              type="button"
              class="relative z-10 inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border bg-background px-3 text-sm font-medium whitespace-nowrap text-foreground shadow-none transition-all outline-none hover:bg-muted focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:border-input dark:bg-background dark:text-foreground dark:hover:bg-muted"
              onclick={() => (codeVisible = true)}>View Code</button
            >
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
