// The Create page's one piece of state. Upstream spreads it over nuqs search params (lib/search-params.ts), a locks
// context (hooks/use-locks.tsx) and a preview override context (components/preview-override.tsx) at af983e8.
import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import { encodePreset, type PresetCode } from 'sveltery/preset';
import { DEFAULT_PREVIEW_ITEM } from './preview/message';
import { configFromCode, DEFAULT_CONFIG, normalizeConfig, resetConfig, shuffleConfig, type DesignConfig, type DesignField } from './config';

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
  item = $state<PreviewItem>(DEFAULT_PREVIEW_ITEM as PreviewItem);
  /** Fields that Shuffle leaves alone. */
  readonly locks = new SvelteSet<DesignField>();
  /** A hovered option, shown in the preview only. It never reaches the URL. */
  hovered = $state.raw<Partial<DesignConfig> | null>(null);

  readonly code: PresetCode = $derived(encodePreset(this.config));
  /** What the preview shows: the config with any hovered option on top. */
  readonly previewed: DesignConfig = $derived(this.hovered ? normalizeConfig({ ...this.config, ...this.hovered }) : this.config);

  #previewTimer: ReturnType<typeof setTimeout> | undefined;

  /** Reads `?preset=` and `?item=`. A missing or unreadable code keeps the default, as upstream's `b0`. */
  load(params: URLSearchParams) {
    this.config = configFromCode(params.get('preset') ?? '') ?? DEFAULT_CONFIG;
    const item = params.get('item');
    if (isPreviewItem(item)) this.item = item;
  }

  /** The query that reopens this setup. The item is left out when it is the default, as upstream. */
  get search(): string {
    const params = new URLSearchParams({ preset: this.code });
    if (this.item !== DEFAULT_PREVIEW_ITEM) params.set('item', this.item);
    return `?${params}`;
  }

  set(patch: Partial<DesignConfig>) {
    this.clearPreview();
    this.config = normalizeConfig({ ...this.config, ...patch });
  }

  open(code: PresetCode) {
    this.set(configFromCode(code) ?? this.config);
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
}

/** The page sets one Designer; every customizer part reads it. */
export const [getDesigner, setDesigner] = createContext<Designer>();
