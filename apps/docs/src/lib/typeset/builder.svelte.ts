// The Typeset builder's one piece of state. Upstream spreads it over nuqs search params (lib/search-params.ts), a
// locks context (hooks/use-locks.tsx), an undo stack (hooks/use-history.tsx), Shuffle and Reset (hooks/use-shuffle.tsx)
// and a preview override context (components/preview-override.tsx) at d2fba50.
import { createContext } from 'svelte';
import { SvelteSet } from 'svelte/reactivity';
import { DEFAULT_PARAMS, FONTS, parseParams, sameParams, serializeParams, TYPESET_FLOWS, TYPESET_LEADINGS, TYPESET_MEASURES, TYPESET_SIZES, type LockableParam, type TypesetParams } from './params';

// Every pointer move over a picker item re-arms this timer, so a preview applies only once the pointer settles.
const PREVIEW_DELAY_MS = 50;

const pick = <T>(items: readonly T[]) => items[Math.floor(Math.random() * items.length)]!;

export class TypesetBuilder {
  /** The committed parameters. The URL and the Get Code panel derive from them. */
  params = $state.raw<TypesetParams>(DEFAULT_PARAMS);
  /** Parameters that Shuffle leaves alone. */
  readonly locks = new SvelteSet<LockableParam>();
  /** A hovered option, shown in the preview only. It never reaches the URL or the undo stack. */
  hovered = $state.raw<Partial<TypesetParams> | null>(null);
  /** What the preview shows: the parameters with any hovered option on top. */
  readonly previewed: TypesetParams = $derived(this.hovered ? { ...this.params, ...this.hovered } : this.params);

  #entries: TypesetParams[] = [DEFAULT_PARAMS];
  #index = $state(0);
  #last = $state(0);
  readonly canUndo = $derived(this.#index > 0);
  readonly canRedo = $derived(this.#index < this.#last);

  #previewTimer: ReturnType<typeof setTimeout> | undefined;

  /** Reads the query and starts a new undo stack from it. */
  load(search: URLSearchParams) {
    this.params = parseParams(search);
    this.#entries = [this.params];
    this.#index = this.#last = 0;
  }

  /** The query for the committed parameters, without the ones at their default. */
  get search() {
    return serializeParams(this.params);
  }

  /** Commits a change as a new undo step, dropping any steps that were undone. */
  set(patch: Partial<TypesetParams>) {
    this.clearPreview();
    const next = { ...this.params, ...patch };
    if (sameParams(next, this.params)) return;
    this.params = next;
    this.#entries = [...this.#entries.slice(0, this.#index + 1), next];
    this.#index = this.#last = this.#entries.length - 1;
  }

  undo() {
    if (this.canUndo) this.#restore(this.#index - 1);
  }

  redo() {
    if (this.canRedo) this.#restore(this.#index + 1);
  }

  #restore(index: number) {
    this.clearPreview();
    this.#index = index;
    this.params = this.#entries[index]!;
  }

  /** Picks new fonts, size, measure and rhythm. The specimen and locked parameters stay. */
  shuffle() {
    const text = FONTS.filter((font) => font.type !== 'mono').map((font) => font.id);
    const mono = FONTS.filter((font) => font.type === 'mono').map((font) => font.id);
    const next: Partial<TypesetParams> = {
      body: pick(text),
      heading: pick(['inherit', ...text] as const),
      mono: pick(mono),
      scale: pick(TYPESET_SIZES).value,
      measure: pick(TYPESET_MEASURES).value,
      leading: pick(TYPESET_LEADINGS).value,
      flow: pick(TYPESET_FLOWS).value,
    };
    for (const param of this.locks) delete next[param];
    this.set(next);
  }

  /** Every parameter back to its default, the specimen included, as upstream. */
  reset() {
    this.set(DEFAULT_PARAMS);
  }

  toggleLock(param: LockableParam) {
    if (!this.locks.delete(param)) this.locks.add(param);
  }

  preview(patch: Partial<TypesetParams>) {
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

/** The page sets one builder; every part of the customizer and preview reads it. */
export const [getBuilder, setBuilder] = createContext<TypesetBuilder>();
