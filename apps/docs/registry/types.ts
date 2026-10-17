import type { PresetMenuAccent, PresetMenuColor } from '../../../packages/cli/src/preset/index.js';

// The registry's served JSON. Items follow shadcn-svelte's registry-item schema, so
// `npx shadcn-svelte add <url>` reads them too. The `sveltery` CLI parses the same shapes.

export const styleNames = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
export type StyleName = (typeof styleNames)[number];

export const baseColors = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;
export type BaseColor = (typeof baseColors)[number];

/** The accent themes a preset layers over a base color, as upstream's `apps/v4/registry/themes.ts`. */
export const accentColors = ['amber', 'blue', 'cyan', 'emerald', 'fuchsia', 'green', 'indigo', 'lime', 'orange', 'pink', 'purple', 'red', 'rose', 'sky', 'teal', 'violet', 'yellow'] as const;
export type AccentColor = (typeof accentColors)[number];

export const iconLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibrary = (typeof iconLibraries)[number];

/** Bumped only for a breaking change to these shapes. The CLI refuses a newer one. */
export const REGISTRY_VERSION = 1;

/**
 * Where a file installs, by type: `registry:ui` under `aliases.ui` and `registry:component` under `aliases.components`, at
 * `target`; `registry:page` and `registry:file` at `target` from the project root, such as `src/routes/login/+page.svelte`.
 * A block's files import `$registry/bases/base/ui/<item>` and `$registry/bases/base/components/<file>`, and `add` rewrites
 * those to the project's aliases.
 */
export type RegistryFile = { type: 'registry:ui' | 'registry:component' | 'registry:page' | 'registry:file'; target: string; content: string };

export type CssVars = { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> };

/** CSS rules keyed by selector or at-rule, as shadcn's `css` field. A leaf is a declaration value. */
export type CssTree = { [key: string]: CssValue };
export type CssValue = string | (string | Record<string, string>)[] | CssTree;

/** What a `registry:base` item merges into components.json. */
export type RegistryBaseConfig = {
  style?: StyleName;
  iconLibrary?: IconLibrary;
  menuColor?: PresetMenuColor;
  menuAccent?: PresetMenuAccent;
  tailwind?: { baseColor?: BaseColor };
};

/** shadcn's font schema. `import` is the `next/font/google` export name; other frameworks install `dependency` from fontsource. */
export type RegistryFont = {
  family: string;
  provider: 'google';
  import: string;
  variable: string;
  weight?: string[];
  subsets?: string[];
  selector?: string;
  dependency?: string;
};

type RegistryItemCommon = {
  $schema: string;
  name: string;
  title?: string;
  description?: string;
  /** npm packages with a caret range, such as `cn@^0.2.2`, or a bare name when no published version is known. */
  dependencies?: string[];
  /** Type packages the `dependencies` need, as `@types/d3-scale@^4.0.9`, installed as dev dependencies. */
  devDependencies?: string[];
  /** Other items in this registry, by name. */
  registryDependencies?: string[];
  files: RegistryFile[];
  cssVars?: CssVars;
  css?: CssTree;
};

/** As upstream, a `registry:base` item may carry `config` and a `registry:font` item must carry `font`. */
export type RegistryItem =
  | (RegistryItemCommon & { type: 'registry:ui' | 'registry:lib' | 'registry:theme' })
  | (RegistryItemCommon & { type: 'registry:block' })
  | (RegistryItemCommon & { type: 'registry:base'; config?: RegistryBaseConfig })
  | (RegistryItemCommon & { type: 'registry:font'; font: RegistryFont });

/** `r/styles/<style>/index.json`, shadcn-svelte's index shape. */
export type StyleIndexEntry = { name: string; type: RegistryItem['type']; registryDependencies: string[]; relativeUrl: string };

/** `r/index.json`: what the CLI reads first. */
export type RegistryManifest = {
  $schema: string;
  name: 'sveltery';
  registryVersion: typeof REGISTRY_VERSION;
  styles: StyleName[];
  baseColors: BaseColor[];
  iconLibraries: IconLibrary[];
  /** Installable items, in name order. Internal items such as `shared` are left out. `meta.links` is what `docs` prints: `docs`, `examples` and, when the item is styled on a Base UI component, `api`. */
  items: { name: string; type: RegistryItem['type']; description?: string; meta?: { links: Record<string, string> } }[];
  /** `registry:block` items, kept out of `items` because a 0.1 CLI rejects their type there. */
  blocks: { name: string; type: 'registry:block'; description?: string }[];
};

/**
 * Served paths, relative to the registry root (`<docs origin>/r`):
 * - `index.json`: RegistryManifest
 * - `styles/<style>/index.json`: StyleIndexEntry[]
 * - `styles/<style>/<name>.json`: RegistryItem with the style's classes inlined
 * - `styles/<style>/<block>.json`: RegistryItem of type `registry:block`, the same for every style
 * - `styles/<style>/font-<font>.json` and `font-heading-<font>.json`: RegistryItem of type `registry:font`, the same for every style
 * - `themes/<baseColor>.json`: RegistryItem of type `registry:theme`, with `cssVars` and no files
 * - `themes/<accentColor>.json`: the same, with only the `light` and `dark` vars the accent overrides
 */
export type RegistryOutput = Map<string, RegistryManifest | StyleIndexEntry[] | RegistryItem>;
