// The registry's served JSON. Items follow shadcn-svelte's registry-item schema, so
// `npx shadcn-svelte add <url>` reads them too. The `sveltery` CLI parses the same shapes.

export const styleNames = ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea'] as const;
export type StyleName = (typeof styleNames)[number];

export const baseColors = ['neutral', 'stone', 'zinc', 'mauve', 'olive', 'mist', 'taupe'] as const;
export type BaseColor = (typeof baseColors)[number];

export const iconLibraries = ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon'] as const;
export type IconLibrary = (typeof iconLibraries)[number];

/** Bumped only for a breaking change to these shapes. The CLI refuses a newer one. */
export const REGISTRY_VERSION = 1;

/** Every file installs under the project's `aliases.ui` directory, at `target`. */
export type RegistryFile = { type: 'registry:ui'; target: string; content: string };

export type CssVars = { theme?: Record<string, string>; light?: Record<string, string>; dark?: Record<string, string> };

export type RegistryItem = {
  $schema: string;
  name: string;
  type: 'registry:ui' | 'registry:lib' | 'registry:theme';
  title?: string;
  description?: string;
  /** npm packages with a caret range, such as `cn@^0.2.2`, or a bare name when no published version is known. */
  dependencies?: string[];
  /** Other items in this registry, by name. */
  registryDependencies?: string[];
  files: RegistryFile[];
  cssVars?: CssVars;
};

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
  /** Installable items, in name order. Internal items such as `shared` are left out. */
  items: { name: string; type: RegistryItem['type']; description?: string }[];
};

/**
 * Served paths, relative to the registry root (`<docs origin>/r`):
 * - `index.json`: RegistryManifest
 * - `styles/<style>/index.json`: StyleIndexEntry[]
 * - `styles/<style>/<name>.json`: RegistryItem with the style's classes inlined
 * - `themes/<baseColor>.json`: RegistryItem of type `registry:theme`, with `cssVars` and no files
 */
export type RegistryOutput = Map<string, RegistryManifest | StyleIndexEntry[] | RegistryItem>;
