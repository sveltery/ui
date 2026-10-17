<!-- Port of TypesetDocsContent in shadcn's apps/v4/app/(app)/(typeset)/components/docs-panel.tsx at d2fba50. -->
<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { Button } from '$registry/bases/base/ui/button';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '$registry/bases/base/ui/tabs';
  import IconSvg from '$lib/create/IconSvg.svelte';
  import { PICKER_ICONS } from '$lib/create/options';
  import { PACKAGE_MANAGERS, packageManager, type PackageManager } from '$lib/package-manager.svelte';
  import { site } from '$lib/site';
  import { PRESET_FONT_DEFINITIONS } from '../../../../../packages/cli/src/preset/index.js';
  import { getBuilder } from './builder.svelte';
  import { headingFont, measureWidth } from './params';

  const builder = getBuilder();
  const params = $derived(builder.params);
  let css = $state<string>();

  onMount(() => {
    packageManager.restore();
    let active = true;
    fetch('/typeset.css')
      .then((response) => response.text())
      .then((text) => active && (css = text));
    return () => (active = false);
  });

  const fonts = $derived([...new Set([params.body, headingFont(params), params.mono])].map((name) => ({ name, ...PRESET_FONT_DEFINITIONS[name] })));
  const presetName = $derived(`typeset-${params.item}`);
  const presetCss = $derived(`.${presetName} {
  --typeset-font-body: var(--font-${params.body});
  --typeset-font-heading: var(--font-${headingFont(params)});
  --typeset-font-mono: var(--font-${params.mono});
  --typeset-size: ${params.scale}px;
  --typeset-leading: ${params.leading};
  --typeset-flow: ${params.flow};
}`);
  const preset = $derived(`/* src/app.css */
@import "tailwindcss";
@import "./typeset.css";

${presetCss}`);
  const usage = $derived(`<div class="typeset ${presetName} max-w-[${measureWidth(params.measure)}]">
  {@html content}
</div>`);
  const installCommand = $derived(`npm install ${fonts.map((font) => font.dependency).join(' ')}`);
  const fontCss = $derived(['/* src/app.css */', ...fonts.map((font) => `@import "${font.dependency}";`), '', ':root {', ...fonts.map((font) => `  --font-${font.name}: ${font.family};`), '}'].join('\n'));

  const prompt = $derived(`Install shadcn/typeset in this project.

Typeset is a single stylesheet that styles rendered markdown: wrap the output in a \`typeset\` container and everything inside (headings, lists, tables, code, blockquotes, math) is styled. Everything outside is untouched.

1. Download ${site.url}/typeset.css and save it as typeset.css next to the project's main CSS file (where Tailwind is imported). If the file already exists, replace it with the downloaded copy.

2. Import it in the main CSS file, after the Tailwind import:

@import "./typeset.css";

3. Install the fonts:

${installCommand}

Then import them in the main CSS file:

${fontCss}

4. Add this preset to the main CSS file, after the typeset import. If a class named .${presetName} already exists, update its values in place. Leave any other typeset-* presets untouched: they are separate surfaces:

${presetCss}

5. Do not apply the class anywhere yet. Search the project for surfaces that render markdown or rich content: mdsvex pages, Svelte markdown components, {@html} with parsed markdown, prose classes, CMS content renderers. Present the candidates you find as a short list and ask the user which surface should use typeset. Then wrap only the surface they pick:

${usage}

If the picked surface already has its own typography (a prose class, styled markdown components), list those styles and let the user decide what to remove before wrapping.

Notes:

- To exclude an embedded component from typeset styles, add the not-typeset class or the data-not-typeset attribute to it.
- Verify on the surface the user picked: headings, lists, tables, and code inside the container should be styled with no classes on the content itself.
- Docs: ${site.url}/docs/typeset`);

  const ADD: Record<PackageManager, string> = { npm: 'npm install', pnpm: 'pnpm add', yarn: 'yarn add', bun: 'bun add' };

  let copied = $state<'css' | 'prompt'>();
  let timer: ReturnType<typeof setTimeout> | undefined;
  onDestroy(() => clearTimeout(timer));

  async function copy(kind: 'css' | 'prompt', text: string) {
    await navigator.clipboard.writeText(text);
    copied = kind;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = undefined), 2000);
  }
</script>

{#snippet section(step: number, title: string, body: import('svelte').Snippet)}
  <section class="flex flex-col gap-2.5">
    <h3 class="text-sm font-medium">{step}. {title}</h3>
    {@render body()}
  </section>
{/snippet}

{#snippet code(text: string, className = '')}
  <div class="relative rounded-lg bg-muted/60">
    <pre class="scrollbar-none overflow-x-auto p-3 font-mono text-sm leading-relaxed {className}">{text}</pre>
  </div>
{/snippet}

{#snippet copyButton(kind: 'css' | 'prompt', text: string | undefined, label: string)}
  <Button variant="outline" class="w-fit" size="sm" disabled={!text} onclick={() => text && copy(kind, text)}>
    <IconSvg icon={copied === kind ? PICKER_ICONS.check : PICKER_ICONS.copy} data-icon="inline-start" />
    {label}
  </Button>
{/snippet}

{#snippet createCss()}
  <p class="text-sm leading-relaxed text-muted-foreground">Copy the stylesheet into a <code class="font-mono">typeset.css</code> file next to your main CSS file, then import it:</p>
  {@render copyButton('css', css, 'Copy typeset.css')}
  {@render code('@import "tailwindcss";\n@import "./typeset.css";')}
{/snippet}
{#snippet addFonts()}
  <div class="rounded-lg bg-muted/60">
    <div class="flex items-center gap-3 px-3 pt-2">
      {#each PACKAGE_MANAGERS as manager (manager)}
        <button
          type="button"
          data-active={manager === packageManager.current}
          class="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground data-[active=true]:text-foreground"
          onclick={() => packageManager.set(manager)}>{manager}</button
        >
      {/each}
    </div>
    <pre data-slot="font-command" class="scrollbar-none overflow-x-auto p-3 font-mono text-xs leading-relaxed">{installCommand.replace('npm install', ADD[packageManager.current])}</pre>
  </div>
  <p class="text-sm leading-relaxed text-muted-foreground">Then import them in your CSS file:</p>
  {@render code(fontCss)}
{/snippet}
{#snippet presetCode()}{@render code(preset)}{/snippet}
{#snippet usageCode()}{@render code(usage)}{/snippet}

<Tabs value="docs" class="flex min-h-0 flex-1 flex-col gap-0">
  <div class="flex items-center justify-between gap-2 border-b px-4 py-3">
    <TabsList>
      <TabsTrigger value="docs">Docs</TabsTrigger>
      <TabsTrigger value="prompt">Prompt</TabsTrigger>
    </TabsList>
  </div>
  <div class="min-h-0 flex-1 scroll-fade scrollbar-none overflow-y-auto p-4 md:p-6">
    <TabsContent value="docs" class="flex flex-col gap-6">
      {@render section(1, 'Create typeset.css', createCss)}
      {@render section(2, 'Add the fonts', addFonts)}
      {@render section(3, 'Create your custom typeset', presetCode)}
      {@render section(4, 'Wrap your content', usageCode)}
    </TabsContent>
    <TabsContent value="prompt" class="flex flex-col gap-2.5">
      <p class="text-sm leading-relaxed text-muted-foreground">One prompt with your picks baked in. Copy it and paste it into your coding agent.</p>
      {@render code(prompt, 'max-h-102 scroll-fade overflow-y-auto whitespace-pre-wrap')}
      {@render copyButton('prompt', prompt, 'Copy Prompt')}
    </TabsContent>
  </div>
</Tabs>
