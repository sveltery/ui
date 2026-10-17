import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import type { Plugin } from 'vite';
import { inlineStyle } from './inline';
import { analyzeSource } from './source';
import { parseStyleSheet, type StyleSheet } from './styles';
import { styleNames, type StyleName } from './types';

/** `tokens` keeps the `cn-*` tokens for the scoped sheets to resolve, as the Create preview needs. */
export type Variant = StyleName | 'tokens';

const TAG = /\?style=([a-z]+)$/;
/** Only code imports further modules; any other file loads untagged, as its query would change how Vite loads it. */
const CODE = /\.(svelte|[cm]?[jt]s)$/;

/**
 * Renders registry components the way the CLI installs them: each module under `registry/bases/`, `blocks/` and
 * `examples/` is loaded once per variant, tagged `?style=<variant>`, and the components under
 * `registry/bases/base/ui` get their `cn-*` tokens inlined by `inlineStyle`. A module inherits its importer's tag;
 * an untagged importer takes the variant of the first `zones` directory it is in, or `nova`. An import that names
 * its own tag, such as a docs page in another style importing its examples, keeps it. `shared` modules stay
 * untagged: the toast manager is one instance, so a toast raised from an example in any style reaches the site's `Toaster`.
 */
export function registryStyles({ root, zones }: { root: string; zones: Record<string, Variant> }): Plugin {
  const ui = join(root, 'registry/bases/base/ui/');
  const shared = new Set([join(ui, 'toast/toast.ts')]);
  const tagged = ['registry/bases/', 'blocks/', 'examples/'].map((dir) => join(root, dir));
  const zoneDirs = Object.entries(zones).map(([dir, variant]) => [join(root, dir), variant] as const);
  const sheets = new Map<StyleName, { css: string; sheet: StyleSheet }>();

  const sheetPath = (style: StyleName) => join(root, `registry/styles/scoped/${style}.css`);
  const sheet = (style: StyleName) => {
    const css = readFileSync(sheetPath(style), 'utf8');
    const cached = sheets.get(style);
    if (cached?.css === css) return cached.sheet;
    const parsed = parseStyleSheet(css, style);
    sheets.set(style, { css, sheet: parsed });
    return parsed;
  };

  const variantOf = (importer: string): Variant => {
    const tag = TAG.exec(importer)?.[1];
    if (tag) return tag as Variant;
    return zoneDirs.find(([dir]) => importer.startsWith(dir))?.[1] ?? 'nova';
  };

  return {
    name: 'sveltery:registry-styles',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      // The dependency scan cannot load tagged ids, and it only needs the bare files.
      const tag = TAG.exec(source)?.[1] as Variant | undefined;
      if (!importer || ('scan' in options && options.scan) || (source.includes('?') && !tag)) return null;
      const resolved = await this.resolve(source.replace(TAG, ''), importer, { ...options, skipSelf: true });
      if (!resolved || resolved.external || resolved.id.includes('?') || !CODE.test(resolved.id) || !tagged.some((dir) => resolved.id.startsWith(dir)) || shared.has(resolved.id)) return resolved;
      return { ...resolved, id: `${resolved.id}?style=${tag ?? variantOf(importer)}` };
    },
    transform(code, id) {
      const variant = TAG.exec(id)?.[1] as Variant | undefined;
      if (!variant || variant === 'tokens' || !id.startsWith(ui) || id.startsWith(join(ui, 'icons/'))) return;
      if (!styleNames.includes(variant)) throw new Error(`${id}: unknown style ${variant}`);
      const file = analyzeSource(relative(ui, id.replace(TAG, '')), code);
      if (!file.classLiterals.length) return;
      this.addWatchFile(sheetPath(variant));
      return { code: inlineStyle(file, sheet(variant), variant), map: null };
    },
  };
}
