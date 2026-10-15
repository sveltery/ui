import { cn } from 'cn';
import { CN_TOKEN, type ClassLiteral, type SourceFile } from './source';
import type { StyleSheet } from './styles';
import type { StyleName } from './types';

/** Resolved when `add` runs, because they depend on the user's config rather than on the style. */
export const markers: ReadonlySet<string> = new Set(['cn-menu-target', 'cn-menu-translucent', 'cn-rtl-flip', 'cn-font-heading']);

const isToken = (word: string) => /^cn-[a-z0-9-]+$/.test(word);

/** Style utilities first, the component's own classes after, merged so the later ones win as `@layer components` lets them. */
function resolveClasses(value: string, sheet: StyleSheet) {
  const style: string[] = [];
  const own: string[] = [];
  for (const word of value.split(/\s+/).filter(Boolean)) {
    if (!isToken(word)) own.push(word);
    else if (markers.has(word)) own.push(word);
    else {
      const utilities = sheet.utilities.get(word);
      if (utilities) style.push(utilities);
    }
  }
  return style.length ? cn(style.join(' '), own.join(' ')) : own.join(' ');
}

function encode(classes: string, { kind, quote }: ClassLiteral, path: string) {
  if (kind === 'attribute') {
    if (classes.includes(quote) || /[{}]/.test(classes)) throw new Error(`${path}: a utility in a class attribute holds ${quote} or a brace: ${classes}`);
    return classes;
  }
  if (quote === '`') return '`' + classes.replace(/[\\`]|\$\{/g, '\\$&') + '`';
  // A utility such as `[&_svg:not([class*='size-'])]:size-4` holds a quote, so swap to the other one when that avoids escaping.
  const other = quote === "'" ? '"' : "'";
  const chosen = classes.includes(quote) && !classes.includes(other) ? other : quote;
  return chosen + classes.replaceAll('\\', '\\\\').replaceAll(chosen, `\\${chosen}`) + chosen;
}

/**
 * Replaces the `cn-*` tokens in `file`'s class strings with the style's utilities. Every other
 * byte of the file stays as it was.
 */
export function inlineStyle(file: SourceFile, sheet: StyleSheet, style: StyleName): string {
  let out = '';
  let from = 0;
  for (const literal of [...file.classLiterals].sort((a, b) => a.start - b.start)) {
    out += file.text.slice(from, literal.start) + encode(resolveClasses(literal.value, sheet), literal, file.path);
    from = literal.end;
  }
  out += file.text.slice(from);

  const stray = [...out.matchAll(new RegExp(CN_TOKEN, 'g'))].find((match) => !markers.has(match[0]));
  if (stray) throw new Error(`${style}/${file.path}: cn-* token left outside a class string: ${stray[0]}`);
  return out;
}
