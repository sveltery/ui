<!-- Port of shadcn's apps/v4/app/(view)/preview/typeset (layout.tsx and [name]/page.tsx) and the typeset components preview-provider.tsx and forward-scripts.tsx at d2fba50. -->
<script lang="ts">
  import { loadFont } from '$lib/create/preview/fonts';
  import { site } from '$lib/site';
  import { CHAT_QUESTION } from '$lib/typeset/fixtures';
  import { receiveParams, sendCommand, shortcutCommand } from '$lib/typeset/messages';
  import { DEFAULT_PARAMS, headingFont, parseParams, previewValues } from '$lib/typeset/params';

  let { data } = $props();
  const browser = typeof window !== 'undefined';

  // The page is prerendered without a query, so the parameters are read in the browser.
  let params = $state.raw(browser ? parseParams(new URLSearchParams(location.search)) : DEFAULT_PARAMS);
  let ready = $state(false);

  // Sets the variables before the content shows, so it never paints in the defaults first.
  $effect(() => {
    const style = document.documentElement.style;
    for (const [name, value] of Object.entries(previewValues(params))) style.setProperty(name, value);
    for (const font of new Set([params.body, headingFont(params), params.mono])) loadFont(font).catch(console.error);
    ready = true;
  });

  function receive(event: MessageEvent) {
    params = receiveParams(event) ?? params;
  }

  // The builder around the frame handles its shortcuts, so the frame forwards them.
  function keydown(event: KeyboardEvent) {
    const command = shortcutCommand(event);
    if (!command) return;
    event.preventDefault();
    sendCommand(command);
  }

  // The builder writes the theme; follow it without a reload.
  function syncTheme(event: StorageEvent) {
    if (event.key === 'theme') document.documentElement.classList.toggle('dark', event.newValue === 'dark');
  }
</script>

<svelte:window onmessage={receive} onstorage={syncTheme} />
<svelte:document onkeydown={keydown} />

<svelte:head>
  <title>{data.label} - Typeset - {site.name}</title>
</svelte:head>

{#if ready}
  <div
    class="flex min-h-svh justify-center bg-background px-6 pt-8 pb-24 md:pt-24 md:pb-32"
    style:font-family="var(--preview-font)"
    style:--font-heading="var(--preview-font-heading)"
    style:--font-mono="var(--preview-font-mono)"
  >
    <div class="preview-params w-full" style:font-size="var(--preview-size)" style:max-width="var(--preview-measure)">
      {#if data.name === 'chat'}
        <div class="flex w-full flex-col gap-10">
          <div class="ml-auto w-fit max-w-[65%] rounded-3xl bg-muted px-4 py-2.5">{CHAT_QUESTION}</div>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -- the fixture is static markup from this repo -->
          <div class="typeset w-full">{@html data.html}</div>
        </div>
      {:else}
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- the fixture is static markup from this repo -->
        <div class="typeset w-full">{@html data.html}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  :global(.preview-params .typeset) {
    --typeset-leading: var(--preview-leading);
    --typeset-flow: var(--preview-flow);
  }
</style>
