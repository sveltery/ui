// A relative path, as in fonts.ts.
import { transformDirection } from '../../../packages/cli/src/rtl.js';
import { inlineStyle } from './inline';
import { analyzeSource } from './source';
import { parseStyleSheet, type StyleSheet } from './styles';
import { styleNames, type StyleName } from './types';

/** A `bases/base/ui` file as the style renders it, and with `rtl`, as upstream's `ui-rtl` build renders it. */
export function renderSource(path: string, text: string, sheet: StyleSheet, style: StyleName, rtl: boolean): string {
  const file = analyzeSource(path, text);
  const styled = file.classLiterals.length ? inlineStyle(file, sheet, style) : text;
  return rtl ? transformDirection(path, styled) : styled;
}

const words = (text: string) => new Set(text.split(/[\s'"`]+/));

/**
 * `@source inline()` naming every class the RTL render of a component adds, in any style. Like the styles'
 * utilities, they exist only in modules Vite transforms, so Tailwind's scan of the source files never sees them.
 */
export function rtlSource(sources: Record<string, string>, styles: Record<StyleName, string>): string {
  const added = new Set<string>();
  for (const style of styleNames) {
    const sheet = parseStyleSheet(styles[style], style);
    for (const [path, text] of Object.entries(sources)) {
      if (path.startsWith('icons/')) continue;
      const ltr = words(renderSource(path, text, sheet, style, false));
      for (const word of words(renderSource(path, text, sheet, style, true))) if (word && !ltr.has(word)) added.add(word);
    }
  }
  return `@source inline("${[...added].sort().join(' ')}");\n`;
}
