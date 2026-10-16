<!--
  Port of shadcn's apps/v4/app/(app)/(create)/components/customizer.tsx, the pickers it renders, main-menu.tsx,
  copy-preset.tsx, random-button.tsx and reset-button.tsx at af983e8.
-->
<script lang="ts">
  import { onMount } from 'svelte';
  import { MediaQuery } from 'svelte/reactivity';
  import { Menu } from '@sveltery/base/menu';
  import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@sveltery/ui/alert-dialog';
  import { Button } from '@sveltery/ui/button';
  import { Card, CardContent, CardFooter, CardHeader } from '@sveltery/ui/card';
  import { FieldGroup, FieldSeparator } from '@sveltery/ui/field';
  import { mode } from '$lib/theme.svelte';
  import { PRESET_FONT_DEFINITIONS, PRESET_MENU_ACCENTS, PRESET_RADII, type PresetFont, type PresetTheme } from 'sveltery/preset';
  import { loadFont } from './preview/fonts';
  import { BASE_COLORS, isTranslucent, themesForBaseColor, type DesignConfig } from './config';
  import { getDesigner } from './designer.svelte';
  import GetCode from './GetCode.svelte';
  import IconSvg from './IconSvg.svelte';
  import OpenPreset from './OpenPreset.svelte';
  import Picker from './Picker.svelte';
  import PickerOptions from './PickerOptions.svelte';
  import { FONT_GROUPS, ICON_LIBRARIES, ICON_LIBRARY_ORDER, MENU_ACCENT_LABELS, MENU_COLOR_LABELS, PICKER_ICONS, RADIUS_LABELS, STYLES, THEME_LABELS, type OptionGroup } from './options';

  let { cli, swatches }: { cli: string; swatches: Partial<Record<PresetTheme, string>> } = $props();

  const designer = getDesigner();
  const config = $derived(designer.config);
  const phone = new MediaQuery('max-width: 767px', false);
  const mobile = $derived(phone.current);
  let card = $state<HTMLElement>();
  let openPreset = $state(false);
  let resetOpen = $state(false);
  let copied = $state(false);
  let copiedTimer: ReturnType<typeof setTimeout> | undefined;

  const STYLE_ORDER = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
  const styleGroups = [{ options: STYLE_ORDER.map((style) => ({ value: style, label: STYLES[style].label })) }];
  const baseColorGroups = [{ options: BASE_COLORS.map((color) => ({ value: color, label: THEME_LABELS[color] })) }];
  const iconLibraryGroups = [{ options: ICON_LIBRARY_ORDER.map((library) => ({ value: library, label: ICON_LIBRARIES[library].label })) }];

  /** The base color first, then the accents, as upstream's theme and chart color menus. */
  const themeGroups = $derived.by((): OptionGroup<PresetTheme>[] => {
    const [baseColor, ...accents] = themesForBaseColor(config.baseColor);
    const option = (theme: PresetTheme) => ({ value: theme, label: THEME_LABELS[theme] });
    return [{ options: [option(baseColor!)] }, { options: accents.map(option) }];
  });

  const bodyFont = $derived(PRESET_FONT_DEFINITIONS[config.font]);
  const headingFont = $derived(config.fontHeading === 'inherit' ? bodyFont : PRESET_FONT_DEFINITIONS[config.fontHeading]);
  const headingGroups = $derived<OptionGroup<DesignConfig['fontHeading']>[]>([{ options: [{ value: 'inherit', label: bodyFont.title }] }, ...FONT_GROUPS]);

  // Lyra and Sera are square, so the radius picker locks to None for them, as upstream.
  const radiusLocked = $derived(config.style === 'lyra' || config.style === 'sera');
  const radiusGroups = $derived.by(() => {
    const [first, ...rest] = PRESET_RADII.map((radius) => ({ value: radius, label: RADIUS_LABELS[radius], disabled: config.style === 'rhea' && radius === 'large' }));
    return [{ options: [first!] }, { options: rest }];
  });

  const menuInverted = $derived(config.menuColor === 'inverted' || config.menuColor === 'inverted-translucent');
  const menuTranslucent = $derived(isTranslucent(config.menuColor));
  // Going back to a solid menu restores the accent it had before it turned translucent.
  let solidMenuAccent = $state(designer.config.menuAccent);
  $effect(() => {
    if (!menuTranslucent) solidMenuAccent = config.menuAccent;
  });
  const menuColor = (inverted: boolean, translucent: boolean): DesignConfig['menuColor'] => `${inverted ? 'inverted' : 'default'}${translucent ? '-translucent' : ''}` as DesignConfig['menuColor'];
  const menuColorPatch = (choice: 'default' | 'inverted') => ({ menuColor: menuColor(choice === 'inverted', menuTranslucent) });
  const menuSurfacePatch = (choice: 'solid' | 'translucent') => {
    const translucent = choice === 'translucent';
    return { menuColor: menuColor(menuInverted, translucent), menuAccent: translucent ? ('subtle' as const) : solidMenuAccent };
  };

  const menuAccentGroups = $derived([{ options: PRESET_MENU_ACCENTS.map((accent) => ({ value: accent, label: MENU_ACCENT_LABELS[accent], disabled: accent === 'bold' && menuTranslucent })) }]);

  // The triggers show each font in its own face, so load the faces they name.
  $effect(() => {
    const fonts = new Set<PresetFont>([config.font]);
    if (config.fontHeading !== 'inherit') fonts.add(config.fontHeading);
    for (const font of fonts) loadFont(font).catch(console.error);
  });

  async function copyPreset() {
    await navigator.clipboard.writeText(`--preset ${designer.code}`);
    copied = true;
    clearTimeout(copiedTimer);
    copiedTimer = setTimeout(() => (copied = false), 2000);
  }

  function confirmReset() {
    designer.reset();
    resetOpen = false;
  }

  const editable = (target: EventTarget | null) =>
    (target instanceof HTMLElement && target.isContentEditable) || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement;

  // Upstream's shortcuts: R shuffles, Shift+R resets (twice to confirm), D toggles the mode, O opens a preset.
  onMount(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || editable(event.target)) return;
      if (event.key === 'r' && !event.shiftKey) designer.shuffle();
      else if (event.key === 'R' && event.shiftKey) {
        if (resetOpen) confirmReset();
        else resetOpen = true;
      } else if (event.key === 'd' || event.key === 'D') mode.toggle();
      else if (event.key === 'o' && !event.shiftKey) openPreset = true;
      else return;
      event.preventDefault();
    };
    document.addEventListener('keydown', keydown);
    return () => document.removeEventListener('keydown', keydown);
  });

  const footerButton = 'touch-manipulation bg-transparent! px-2! py-0! text-sm! transition-none select-none hover:bg-muted! pointer-coarse:h-10!';
  const menuItem =
    'group/dropdown-menu-item relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium outline-hidden select-none **:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100 data-disabled:pointer-events-none data-disabled:opacity-50 dark:focus:bg-neutral-700/80 pointer-coarse:gap-3 pointer-coarse:py-2.5 pointer-coarse:pl-3 pointer-coarse:text-base';
</script>

{#snippet swatch(color: string | undefined)}
  <div style:--color={color} class="size-4 rounded-full bg-(--color)"></div>
{/snippet}

{#snippet shortcut(keys: string)}
  <span class="ml-auto text-xs tracking-widest text-neutral-400! group-focus/dropdown-menu-item:text-neutral-100">{keys}</span>
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
              <Menu.Item class={menuItem} onclick={() => (openPreset = true)}>Open Preset... {@render shortcut('O')}</Menu.Item>
              <Menu.Item class={menuItem} onclick={() => designer.shuffle()}>Shuffle {@render shortcut('R')}</Menu.Item>
              <Menu.Item class={menuItem} onclick={() => mode.toggle()}>Light/Dark {@render shortcut('D')}</Menu.Item>
            </Menu.Group>
            <Menu.Separator class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700" />
            <Menu.Group>
              <Menu.Item class={menuItem} onclick={() => (resetOpen = true)}>Reset {@render shortcut('⇧R')}</Menu.Item>
            </Menu.Group>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </CardHeader>
  <CardContent class="no-scrollbar min-h-0 flex-1 overflow-x-auto overflow-y-hidden md:overflow-y-auto">
    <FieldGroup class="flex-row gap-2.5 py-px **:data-[slot=field-separator]:-mx-4 **:data-[slot=field-separator]:w-auto md:flex-col md:gap-3.25">
      <Picker label="Style" field="style" display={STYLES[config.style].label} {mobile} anchor={card}>
        {#snippet icon()}<IconSvg icon={STYLES[config.style].icon} class="size-4" />{/snippet}
        <PickerOptions value={config.style} groups={styleGroups} {mobile} onselect={(style) => designer.set({ style })} onpreview={(style) => designer.preview({ style })} />
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker label="Base Color" field="baseColor" display={THEME_LABELS[config.baseColor]} {mobile} anchor={card}>
        {#snippet icon()}{@render swatch(swatches[config.baseColor])}{/snippet}
        <PickerOptions value={config.baseColor as (typeof BASE_COLORS)[number]} groups={baseColorGroups} {mobile} onselect={(baseColor) => designer.set({ baseColor })} onpreview={(baseColor) => designer.preview({ baseColor })} />
      </Picker>
      <Picker label="Theme" field="theme" display={THEME_LABELS[config.theme]} {mobile} anchor={card} class="max-h-92">
        {#snippet icon()}{@render swatch(swatches[config.theme])}{/snippet}
        <PickerOptions value={config.theme} groups={themeGroups} {mobile} onselect={(theme) => designer.set({ theme })} onpreview={(theme) => designer.preview({ theme })} />
      </Picker>
      <Picker label="Chart Color" field="chartColor" display={THEME_LABELS[config.chartColor]} {mobile} anchor={card} class="max-h-92">
        {#snippet icon()}{@render swatch(swatches[config.chartColor])}{/snippet}
        <PickerOptions value={config.chartColor} groups={themeGroups} {mobile} onselect={(chartColor) => designer.set({ chartColor })} onpreview={(chartColor) => designer.preview({ chartColor })} />
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker label="Heading" field="fontHeading" display={headingFont.title} {mobile} anchor={card} class="max-h-96">
        {#snippet icon()}<span style:font-family={headingFont.family}>Aa</span>{/snippet}
        <PickerOptions value={config.fontHeading} groups={headingGroups} {mobile} onselect={(fontHeading) => designer.set({ fontHeading })} onpreview={(fontHeading) => designer.preview({ fontHeading })} />
      </Picker>
      <Picker label="Font" field="font" display={bodyFont.title} {mobile} anchor={card} class="max-h-96">
        {#snippet icon()}<span style:font-family={bodyFont.family}>Aa</span>{/snippet}
        <PickerOptions value={config.font} groups={FONT_GROUPS} {mobile} onselect={(font) => designer.set({ font })} onpreview={(font) => designer.preview({ font })} />
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker label="Icon Library" field="iconLibrary" display={ICON_LIBRARIES[config.iconLibrary].label} {mobile} anchor={card}>
        {#snippet icon()}<IconSvg icon={ICON_LIBRARIES[config.iconLibrary].icon} class="size-4" />{/snippet}
        <PickerOptions value={config.iconLibrary} groups={iconLibraryGroups} {mobile} onselect={(iconLibrary) => designer.set({ iconLibrary })} onpreview={(iconLibrary) => designer.preview({ iconLibrary })} />
      </Picker>
      <Picker label="Radius" field="radius" display={RADIUS_LABELS[radiusLocked ? 'none' : config.radius]} disabled={radiusLocked} {mobile} anchor={card}>
        {#snippet icon()}<IconSvg icon={PICKER_ICONS.radius} class="size-4 rotate-90" />{/snippet}
        <PickerOptions value={radiusLocked ? 'none' : config.radius} groups={radiusGroups} {mobile} onselect={(radius) => designer.set({ radius })} onpreview={(radius) => designer.preview({ radius })} />
      </Picker>
      <FieldSeparator class="hidden md:block" />
      <Picker label="Menu" field="menuColor" display={MENU_COLOR_LABELS[config.menuColor]} {mobile} anchor={card}>
        {#snippet icon()}<IconSvg icon={PICKER_ICONS.menu} class="size-4" />{/snippet}
        <PickerOptions
          value={menuInverted ? 'inverted' : 'default'}
          groups={[{ label: 'Color', options: [{ value: 'default', label: 'Default' }, { value: 'inverted', label: 'Inverted', disabled: mode.current === 'dark' }] }]}
          {mobile}
          onselect={(choice) => designer.set(menuColorPatch(choice))}
          onpreview={(choice) => designer.preview(menuColorPatch(choice))}
        />
        <Menu.Separator class="-mx-1.5 my-1.5 h-px bg-neutral-600 dark:bg-neutral-700" />
        <PickerOptions
          value={menuTranslucent ? 'translucent' : 'solid'}
          groups={[{ label: 'Appearance', options: [{ value: 'solid', label: 'Solid' }, { value: 'translucent', label: 'Translucent' }] }]}
          {mobile}
          onselect={(choice) => designer.set(menuSurfacePatch(choice))}
          onpreview={(choice) => designer.preview(menuSurfacePatch(choice))}
        />
      </Picker>
      <Picker label="Menu Accent" field="menuAccent" display={MENU_ACCENT_LABELS[config.menuAccent]} {mobile} anchor={card}>
        {#snippet icon()}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="size-4 text-foreground" aria-hidden="true">
            <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-accent={config.menuAccent} class="fill-muted-foreground/30 data-[accent=bold]:fill-foreground">
              <path d="M19 12.1294L12.9388 18.207C11.1557 19.9949 10.2641 20.8889 9.16993 20.9877C8.98904 21.0041 8.80705 21.0041 8.62616 20.9877C7.53195 20.8889 6.64039 19.9949 4.85726 18.207L2.83687 16.1811C1.72104 15.0622 1.72104 13.2482 2.83687 12.1294M19 12.1294L10.9184 4.02587M19 12.1294H2.83687M10.9184 4.02587L2.83687 12.1294M10.9184 4.02587L8.89805 2" />
              <path d="M22 20C22 21.1046 21.1046 22 20 22C18.8954 22 18 21.1046 18 20C18 18.8954 20 17 20 17C20 17 22 18.8954 22 20Z" />
            </g>
          </svg>
        {/snippet}
        <PickerOptions value={config.menuAccent} groups={menuAccentGroups} {mobile} onselect={(menuAccent) => designer.set({ menuAccent })} onpreview={(menuAccent) => designer.preview({ menuAccent })} />
      </Picker>
    </FieldGroup>
  </CardContent>
  <CardFooter class="flex min-w-0 gap-2 md:flex-col md:rounded-b-none md:**:[button,a]:w-full">
    <Button variant="outline" onclick={copyPreset} title={copied ? 'Copied' : `--preset ${designer.code}`} class="{footerButton} min-w-0 flex-1 md:flex-none">
      <span class="block min-w-0 truncate">{copied ? 'Copied' : `--preset ${designer.code}`}</span>
    </Button>
    <OpenPreset bind:open={openPreset} {mobile} class="max-w-20 min-w-0 flex-1 sm:max-w-none md:flex-none" />
    <Button variant="outline" onclick={() => designer.shuffle()} class="{footerButton} max-w-20 min-w-0 flex-1 sm:max-w-none md:flex-none">
      <span class="w-full truncate text-center font-medium">Shuffle</span>
    </Button>
  </CardFooter>
  <CardFooter class="-mt-3 hidden min-w-0 gap-2 md:flex md:flex-col md:**:[button,a]:w-full">
    <GetCode {cli} />
  </CardFooter>
</Card>

<AlertDialog bind:open={resetOpen}>
  <AlertDialogContent size="sm">
    <AlertDialogHeader>
      <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
      <AlertDialogDescription>This will reset all customization options to their default values.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onclick={confirmReset}>Reset</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
