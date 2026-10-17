<!-- Port of shadcn's apps/v4/app/(app)/(typeset)/components/customizer.tsx, main-menu.tsx and random-button.tsx at d2fba50. -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { ArrowHorizontalIcon, ParagraphSpacingIcon, TextSmallcapsIcon } from '@hugeicons/core-free-icons';
  import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/svelte';
  import { Menu } from '@sveltery/base/menu';
  import { Button } from '$registry/bases/base/ui/button';
  import { Card, CardContent, CardFooter, CardHeader } from '$registry/bases/base/ui/card';
  import { FieldGroup, FieldSeparator } from '$registry/bases/base/ui/field';
  import IconSvg from '$lib/create/IconSvg.svelte';
  import { PICKER_ICONS, type OptionGroup } from '$lib/create/options';
  import { loadFont } from '$lib/create/preview/fonts';
  import { mode } from '$lib/theme.svelte';
  import type { PresetFont } from '../../../../../packages/cli/src/preset/index.js';
  import { getBuilder } from './builder.svelte';
  import GetCode from './GetCode.svelte';
  import { findFont, FONTS, TYPESET_FLOWS, TYPESET_LEADINGS, TYPESET_MEASURES, TYPESET_SIZES, type TypesetParams } from './params';
  import Picker from './Picker.svelte';

  const builder = getBuilder();
  const params = $derived(builder.params);
  const phone = new MediaQuery('max-width: 767px', false);
  let card = $state<HTMLElement>();
  let mac = $state(false);

  const LineHeightIcon: IconSvgElement = [
    ['path', { d: 'M4.5 3.5H19.5', stroke: 'currentColor', strokeLinecap: 'round', strokeWidth: '1.5', key: '0' }],
    ['path', { d: 'M4.5 20.5H19.5', stroke: 'currentColor', strokeLinecap: 'round', strokeWidth: '1.5', key: '1' }],
    [
      'path',
      {
        d: 'M17 17L14.8905 11.4741C13.9109 8.90801 13.4211 7.625 12.625 7.625C11.8289 7.625 11.3391 8.90801 10.3595 11.4741L8.25 17',
        stroke: 'currentColor',
        strokeLinecap: 'round',
        strokeWidth: '1.5',
        key: '2',
      },
    ],
    ['path', { d: 'M9.5 13H15.75', stroke: 'currentColor', strokeLinecap: 'round', strokeWidth: '1.5', key: '3' }],
  ];

  const options = <Value extends string>(entries: readonly { value: Value; label: string }[]): OptionGroup<Value>[] => [{ options: entries.map(({ value, label }) => ({ value, label })) }];
  const fontGroups: OptionGroup<PresetFont>[] = (['sans', 'serif', 'mono'] as const).map((type) => ({
    label: `${type[0]!.toUpperCase()}${type.slice(1)}`,
    options: FONTS.filter((font) => font.type === type).map((font) => ({ value: font.id, label: font.label })),
  }));

  const body = $derived(findFont(params.body)!);
  const heading = $derived(params.heading === 'inherit' ? body : findFont(params.heading)!);
  const mono = $derived(findFont(params.mono)!);
  const headingGroups = $derived<OptionGroup<TypesetParams['heading']>[]>([{ options: [{ value: 'inherit', label: body.label }] }, ...fontGroups]);

  // The triggers show each font in its own face, so load the faces they name.
  $effect(() => {
    for (const font of new Set([body.id, heading.id, mono.id])) loadFont(font).catch(console.error);
  });

  onMount(() => (mac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent)));

  const footerButton = 'touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!';
  const menuItem =
    'group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base';
  const separator = '-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700';
</script>

{#snippet shortcut(keys: string)}
  <span class="ml-auto text-xs tracking-widest text-neutral-400! group-focus/dropdown-menu-item:text-neutral-100">{keys}</span>
{/snippet}

{#snippet hugeicon(icon: IconSvgElement)}
  <HugeiconsIcon {icon} strokeWidth={2} class="size-4.5" />
{/snippet}

{#snippet sample(family: string)}
  <span style:font-family={family}>Aa</span>
{/snippet}

<Card {@attach (node) => void (card = node)} size="sm" class="dark isolate z-10 max-h-full min-h-0 w-full self-start rounded-2xl bg-card/90 backdrop-blur-xl md:w-(--customizer-width)">
  <CardHeader class="hidden items-center justify-between gap-2 border-b md:flex">
    <Menu.Root>
      <Menu.Trigger
        class="relative flex w-full shrink-0 touch-manipulation items-center justify-between gap-2 rounded-lg px-1.75 py-2 ring-1 ring-foreground/10 select-none hover:bg-muted focus-visible:ring-1 focus-visible:ring-foreground/50 focus-visible:outline-none data-popup-open:bg-muted"
      >
        <span class="font-medium">Menu</span>
        <IconSvg icon={PICKER_ICONS.mainMenu} class="size-5" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner class="isolate z-50 outline-none" side="right" align="start" alignOffset={-8} sideOffset={20}>
          <Menu.Popup class="cn-menu-target no-scrollbar z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) translate-y-2 overflow-x-hidden overflow-y-auto rounded-xl border-0 bg-neutral-950/80 p-1.5 text-neutral-100 ring-1 ring-neutral-950/80 backdrop-blur-xl outline-none md:w-52 dark:bg-neutral-800/90 dark:ring-neutral-700/50">
            <Menu.Group>
              <Menu.Item class={menuItem} onclick={() => builder.shuffle()}>Shuffle {@render shortcut('R')}</Menu.Item>
              <Menu.Item class={menuItem} onclick={() => mode.toggle()}>Light/Dark {@render shortcut('D')}</Menu.Item>
            </Menu.Group>
            <Menu.Separator class={separator} />
            <Menu.Group>
              <Menu.Item class={menuItem} disabled={!builder.canUndo} onclick={() => builder.undo()}>Undo {@render shortcut(mac ? '⌘Z' : 'Ctrl+Z')}</Menu.Item>
              <Menu.Item class={menuItem} disabled={!builder.canRedo} onclick={() => builder.redo()}>Redo {@render shortcut(mac ? '⇧⌘Z' : 'Ctrl+Shift+Z')}</Menu.Item>
              <Menu.Separator class={separator} />
              <Menu.Item class={menuItem} onclick={() => builder.reset()}>Reset {@render shortcut('⇧R')}</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
        <!-- Catches clicks over the preview iframe, which would otherwise swallow them and leave the menu open. -->
        <div class="absolute inset-y-0 right-0 left-54 z-40 bg-transparent"></div>
      </Menu.Portal>
    </Menu.Root>
  </CardHeader>
  <CardContent class="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden max-md:px-0 md:overflow-y-auto">
    <FieldGroup class="flex-row gap-2.5 py-px **:data-[slot=field-separator]:-mx-4 **:data-[slot=field-separator]:w-auto max-md:px-3 md:flex-col md:gap-3.25">
      <!-- Below about 60ch the viewport already limits the width, so Measure would change nothing. -->
      <Picker
        label="Measure"
        param="measure"
        class="max-[28rem]:hidden"
        display={TYPESET_MEASURES.find((option) => option.value === params.measure)!.label}
        value={params.measure}
        groups={options(TYPESET_MEASURES)}
        mobile={phone.current}
        anchor={card}
        onselect={(measure) => builder.set({ measure })}
      >
        {#snippet icon()}{@render hugeicon(ArrowHorizontalIcon)}{/snippet}
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker
        label="Heading"
        param="heading"
        font
        display={heading.label}
        value={params.heading}
        groups={headingGroups}
        mobile={phone.current}
        anchor={card}
        popupClass="max-h-96"
        onselect={(value) => builder.set({ heading: value })}
      >
        {#snippet icon()}{@render sample(heading.family)}{/snippet}
      </Picker>
      <Picker label="Body" param="body" font display={body.label} value={params.body} groups={fontGroups} mobile={phone.current} anchor={card} popupClass="max-h-96" onselect={(value) => builder.set({ body: value })}>
        {#snippet icon()}{@render sample(body.family)}{/snippet}
      </Picker>
      <Picker label="Mono" param="mono" font display={mono.label} value={params.mono} groups={fontGroups} mobile={phone.current} anchor={card} popupClass="max-h-96" onselect={(value) => builder.set({ mono: value })}>
        {#snippet icon()}{@render sample(mono.family)}{/snippet}
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker
        label="Size"
        param="scale"
        display={TYPESET_SIZES.find((option) => option.value === params.scale)!.label}
        value={params.scale}
        groups={options(TYPESET_SIZES)}
        mobile={phone.current}
        anchor={card}
        onselect={(scale) => builder.set({ scale })}
      >
        {#snippet icon()}{@render hugeicon(TextSmallcapsIcon)}{/snippet}
      </Picker>
      <Picker
        label="Leading"
        param="leading"
        display={TYPESET_LEADINGS.find((option) => option.value === params.leading)!.label}
        value={params.leading}
        groups={options(TYPESET_LEADINGS)}
        mobile={phone.current}
        anchor={card}
        onselect={(leading) => builder.set({ leading })}
      >
        {#snippet icon()}{@render hugeicon(LineHeightIcon)}{/snippet}
      </Picker>
      <Picker
        label="Flow"
        param="flow"
        display={TYPESET_FLOWS.find((option) => option.value === params.flow)!.label}
        value={params.flow}
        groups={options(TYPESET_FLOWS)}
        mobile={phone.current}
        anchor={card}
        onselect={(flow) => builder.set({ flow })}
      >
        {#snippet icon()}{@render hugeicon(ParagraphSpacingIcon)}{/snippet}
      </Picker>
      <!-- The group is a size container, so trailing padding cannot widen its scroll area; this spacer does. -->
      <div aria-hidden="true" class="w-0.5 shrink-0 md:hidden"></div>
    </FieldGroup>
  </CardContent>
  <CardFooter class="flex min-w-0 flex-row-reverse gap-2 border-t md:flex-col md:**:[button]:w-full">
    <Button variant="outline" onclick={() => builder.shuffle()} class="{footerButton} min-w-0 flex-1 md:flex-none">
      <span class="w-full truncate text-center font-medium">Shuffle</span>
    </Button>
    <GetCode class="{footerButton} min-w-0 flex-1 md:flex-none xl:hidden" />
  </CardFooter>
</Card>
