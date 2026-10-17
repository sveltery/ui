// A relative path, as in fonts.ts.
import { transformDirection } from '../../../packages/cli/src/rtl.js';
import { inlineStyle } from './inline';
import { analyzeSource, type SourceFile } from './source';
import { parseStyleSheet, type StyleSheet } from './styles';
import { styleNames, type StyleName } from './types';

/** A `bases/base/ui` file as the style renders it, and with `rtl`, as upstream's `ui-rtl` build renders it. */
export function renderSource(file: SourceFile, sheet: StyleSheet, style: StyleName, rtl: boolean): string {
  const styled = file.classLiterals.length ? inlineStyle(file, sheet, style) : file.text;
  return rtl ? transformDirection(file.path, styled) : styled;
}

const words = (text: string) => new Set(text.split(/[\s'"`]+/));

/**
 * `@source inline()` naming every class the RTL render of a component adds, in any style. Like the styles'
 * utilities, they exist only in modules Vite transforms, so Tailwind's scan of the source files never sees them.
 */
export function rtlSource(sources: Record<string, string>, styles: Record<StyleName, string>): string {
  const files = Object.entries(sources)
    .filter(([path]) => !path.startsWith('icons/'))
    .map(([path, text]) => analyzeSource(path, text));
  const added = new Set<string>();
  for (const style of styleNames) {
    const sheet = parseStyleSheet(styles[style], style);
    for (const file of files) {
      const ltr = renderSource(file, sheet, style, false);
      const seen = words(ltr);
      for (const word of words(transformDirection(file.path, ltr))) if (word && !seen.has(word)) added.add(word);
    }
  }
  return `@source inline("${[...added].sort().join(' ')}");\n`;
}
