// The Create page's one piece of state. Upstream spreads it over nuqs search params (lib/search-params.ts), a locks
// context (hooks/use-locks.tsx) and a preview override context (components/preview-override.tsx) at af983e8.
import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import { encodePreset, type PresetCode } from '../../../../../packages/cli/src/preset/index.js';
import { DEFAULT_PREVIEW_ITEM } from './preview/message';
import { configFromCode, DEFAULT_CONFIG, isTranslucent, normalizeConfig, resetConfig, shuffleConfig, type DesignConfig, type DesignField } from './config';

/** The blocks the preview can show, with upstream's switcher labels. */
export const PREVIEW_ITEMS = [
  { label: '01', value: 'preview-02' },
  { label: '02', value: 'preview' },
  { label: '03', value: 'preview-03' },
] as const;
export type PreviewItem = (typeof PREVIEW_ITEMS)[number]['value'];

const isPreviewItem = (value: string | null): value is PreviewItem => PREVIEW_ITEMS.some((item) => item.value === value);

// Every pointer move over a picker item re-arms this timer, so a preview applies only once the pointer settles.
const PREVIEW_DELAY_MS = 50;

export class Designer {
  /** The committed config. The URL's `preset` and the CLI command both derive from it. */
  config = $state.raw<DesignConfig>(DEFAULT_CONFIG);
  item = $state<PreviewItem>(DEFAULT_PREVIEW_ITEM);
  /** Fields that Shuffle leaves alone. */
  readonly locks = new SvelteSet<DesignField>();
  /** A hovered option, shown in the preview only. It never reaches the URL. */
  hovered = $state.raw<Partial<DesignConfig> | null>(null);

  readonly code: PresetCode = $derived(encodePreset(this.config));
  // Kept as a code so a hover that lands on the shown config is equal and does not post to the frame again.
  readonly #previewCode: PresetCode = $derived(this.hovered ? encodePreset(normalizeConfig({ ...this.config, ...this.hovered })) : this.code);
  /** What the preview shows: the config with any hovered option on top. */
  readonly previewed: DesignConfig = $derived(configFromCode(this.#previewCode)!);

  #previewTimer: ReturnType<typeof setTimeout> | undefined;
  #solidMenuAccent: DesignConfig['menuAccent'] = DEFAULT_CONFIG.menuAccent;

  /** Reads `?preset=` and `?item=`. A missing or unreadable code keeps the default, as upstream's `b0`. */
  load(params: URLSearchParams) {
    this.#commit(configFromCode(params.get('preset') ?? '') ?? DEFAULT_CONFIG);
    const item = params.get('item');
    this.item = isPreviewItem(item) ? item : DEFAULT_PREVIEW_ITEM;
  }

  /** `current` with `preset` and `item` set to this setup. Other parameters stay. The item is left out when it is the default, as upstream. */
  search(current: string): string {
    // eslint-disable-next-line svelte/prefer-svelte-reactivity -- a local copy built and read in one call
    const params = new URLSearchParams(current);
    params.set('preset', this.code);
    if (this.item === DEFAULT_PREVIEW_ITEM) params.delete('item');
    else params.set('item', this.item);
    return `?${params}`;
  }

  set(patch: Partial<DesignConfig>) {
    this.clearPreview();
    this.#commit(normalizeConfig({ ...this.config, ...patch }));
  }

  /** The accent a translucent menu goes back to when it turns solid again. */
  get solidMenuAccent() {
    return this.#solidMenuAccent;
  }

  #commit(config: DesignConfig) {
    this.config = config;
    if (!isTranslucent(config.menuColor)) this.#solidMenuAccent = config.menuAccent;
  }

  open(code: PresetCode) {
    this.set(configFromCode(code)!);
  }

  shuffle() {
    this.set(shuffleConfig(this.config, this.locks));
  }

  reset() {
    this.set(resetConfig(this.config));
  }

  toggleLock(field: DesignField) {
    if (!this.locks.delete(field)) this.locks.add(field);
  }

  preview(patch: Partial<DesignConfig>) {
    clearTimeout(this.#previewTimer);
    this.#previewTimer = setTimeout(() => (this.hovered = patch), PREVIEW_DELAY_MS);
  }

  /** Reverts a hover preview at once. */
  clearPreview() {
    clearTimeout(this.#previewTimer);
    this.hovered = null;
  }

  destroy() {
    clearTimeout(this.#previewTimer);
  }
}

/** The page sets one Designer; every customizer part reads it. */
export const [getDesigner, setDesigner] = createContext<Designer>();
