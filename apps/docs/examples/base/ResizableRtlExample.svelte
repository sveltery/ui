<script lang="ts">
  import { Button } from '$registry/bases/base/ui/button';
  import { DirectionProvider } from '$registry/bases/base/ui/direction';
  import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '$registry/bases/base/ui/resizable';

  const translations = {
    en: { dir: 'ltr', values: { one: 'One', two: 'Two', three: 'Three' } },
    ar: { dir: 'rtl', values: { one: 'واحد', two: 'اثنان', three: 'ثلاثة' } },
    he: { dir: 'rtl', values: { one: 'אחד', two: 'שניים', three: 'שלושה' } }
  } as const;

  let language = $state<keyof typeof translations>('ar');
  const dir = $derived(translations[language].dir);
  const t = $derived(translations[language].values);
</script>

<div class="flex w-full max-w-sm flex-col gap-4">
  <div class="flex gap-2">
    {#each Object.keys(translations) as code (code)}
      <Button variant={language === code ? 'default' : 'outline'} size="sm" onclick={() => (language = code as keyof typeof translations)}>
        {code}
      </Button>
    {/each}
  </div>
  <DirectionProvider direction={dir}>
    <ResizablePanelGroup orientation="horizontal" class="max-w-sm rounded-lg border" {dir}>
      <ResizablePanel defaultSize="50%">
        <div class="flex h-[200px] items-center justify-center p-6">
          <span class="font-semibold">{t.one}</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical" {dir}>
          <ResizablePanel defaultSize="25%">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">{t.two}</span>
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="75%">
            <div class="flex h-full items-center justify-center p-6">
              <span class="font-semibold">{t.three}</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  </DirectionProvider>
</div>
