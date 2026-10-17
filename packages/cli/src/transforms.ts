import { twMerge } from 'cn';
import MagicString from 'magic-string';
import { parse, type AST } from 'svelte/compiler';
import { parseSource, walk, type Node } from './ast.js';
import { iconLibraries } from './icons.js';
import { CliError } from './parse.js';
import type { PresetMenuColor } from './preset/preset.js';
import { iconLibraryNames, type IconLibraryName } from './registry.js';
import { transformDirection } from './rtl.js';

export type SourceFile = { target: string; content: string };
export type TransformContext = {
  iconLibrary: IconLibraryName;
  /** Upstream treats a missing menuColor as `default`. */
  menuColor?: PresetMenuColor;
  /** The project CSS defines `--font-heading`. */
  fontHeading: boolean;
  aliases: { ui: string; components: string };
  /** components.json sets `rtl: true`. */
  rtl: boolean;
};
export type TransformResult = { content: string; dependencies?: string[] };
export type Transform = (file: SourceFile, ctx: TransformContext) => TransformResult;

const PLACEHOLDER = 'IconPlaceholder';

/** Replaces `<IconPlaceholder lucide="CheckIcon" ...>` and its import with the configured library's component. */
export const transformIcons: Transform = (file, ctx) => {
  if (!file.target.endsWith('.svelte') || !file.content.includes(PLACEHOLDER)) return { content: file.content };
  const library = iconLibraries[ctx.iconLibrary];
  const ast = parse(file.content, { filename: file.target, modern: true });
  const s = new MagicString(file.content);
  const icons: string[] = [];
  let importDeclaration: Node | undefined;

  for (const [node] of walk(ast)) {
    if (node.type === 'ImportDeclaration' && (node.specifiers as { local: { name: string } }[]).some((spec) => spec.local.name === PLACEHOLDER)) {
      importDeclaration = node;
    }
    if (node.type !== 'Component' || node.name !== PLACEHOLDER) continue;
    const component = node as unknown as AST.Component;
    const attributes = component.attributes.filter((a): a is AST.Attribute => a.type === 'Attribute');
    const value = attributes.find((a) => a.name === ctx.iconLibrary)?.value;
    const name = Array.isArray(value) && value.length === 1 && value[0]?.type === 'Text' ? value[0].data : undefined;
    if (!name) throw new CliError(`${file.target}: an <${PLACEHOLDER}> has no static "${ctx.iconLibrary}" attribute, so it cannot become a ${ctx.iconLibrary} icon.`);
    if (!icons.includes(name)) icons.push(name);

    const tag = library.tag(name);
    s.overwrite(component.start + 1, component.start + 1 + PLACEHOLDER.length, tag);
    for (const attribute of attributes) {
      if (!(iconLibraryNames as readonly string[]).includes(attribute.name)) continue;
      let start = attribute.start;
      while (/\s/.test(file.content[start - 1] ?? '')) start--;
      s.remove(start, attribute.end);
    }
    if (!file.content.slice(0, component.end).endsWith('/>')) {
      const close = file.content.lastIndexOf(`</${PLACEHOLDER}`, component.end);
      s.overwrite(close + 2, close + 2 + PLACEHOLDER.length, tag.split(' ')[0]!);
    }
  }

  if (importDeclaration) {
    const lineStart = file.content.lastIndexOf('\n', importDeclaration.start) + 1;
    const indent = file.content.slice(lineStart, importDeclaration.start);
    const imports = icons.length > 0 ? [...library.sharedImports, ...icons.map(library.importIcon)] : [];
    s.overwrite(importDeclaration.start, importDeclaration.end, imports.join(`\n${indent}`));
  }
  if (!s.hasChanged()) return { content: file.content };
  return { content: s.toString(), dependencies: library.packages };
};

// Copied from shadcn's transform-menu.ts.
const TRANSLUCENT_CLASSES =
  'animate-none! relative bg-popover/70 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!';

const isTranslucent = (menuColor: PresetMenuColor | undefined) => menuColor?.endsWith('-translucent') ?? false;

/** Class markers that `add` resolves: each maps to its replacement token, or '' to drop it. */
const markers = new Map<string, (ctx: TransformContext) => string>([
  ['cn-menu-target', (ctx) => (ctx.menuColor?.startsWith('inverted') ? 'dark' : '')],
  // The translucent classes replace the string that holds the marker, in replaceMarkers.
  ['cn-menu-translucent', () => ''],
  // transformRtl turns it into rtl:rotate-180 first when the project is RTL.
  ['cn-rtl-flip', () => ''],
  ['cn-font-heading', (ctx) => (ctx.fontHeading ? 'font-heading' : '')],
]);

function replaceMarkers(text: string, ctx: TransformContext): string | undefined {
  const tokens = text.split(/\s+/).filter(Boolean);
  if (!tokens.some((token) => markers.has(token))) return undefined;
  let kept = tokens.map((token) => markers.get(token)?.(ctx) ?? token).filter(Boolean);
  if (tokens.includes('cn-menu-translucent') && isTranslucent(ctx.menuColor)) kept = [twMerge(kept.join(' '), TRANSLUCENT_CLASSES)];
  if (kept.length === 0) return '';
  return `${/^\s/.test(text) ? ' ' : ''}${kept.join(' ')}${/\s$/.test(text) ? ' ' : ''}`;
}

/** Resolves the class markers in string literals, template literal parts and static `class` attribute text. */
export const transformMarkers: Transform = (file, ctx) => {
  const isSvelte = file.target.endsWith('.svelte');
  if (!isSvelte && !/\.[cm]?[jt]s$/.test(file.target)) return { content: file.content };
  if (![...markers.keys()].some((marker) => file.content.includes(marker))) return { content: file.content };
  const { ast, offset } = parseSource(file.target, file.content);
  const s = new MagicString(file.content);
  const edit = (start: number, end: number) => {
    const replacement = replaceMarkers(file.content.slice(start, end), ctx);
    if (replacement === undefined) return;
    if (replacement === '') s.remove(start, end);
    else s.overwrite(start, end, replacement);
  };
  for (const [node] of walk(ast)) {
    const start = node.start - offset;
    const end = node.end - offset;
    if (node.type === 'Literal' && typeof node.value === 'string') edit(start + 1, end - 1);
    else if (node.type === 'TemplateElement') edit(start, end);
    else if (node.type === 'Attribute' && node.name === 'class' && Array.isArray(node.value)) {
      for (const part of node.value as Node[]) if (part.type === 'Text') edit(part.start, part.end);
    }
  }
  return { content: s.toString() };
};

const REGISTRY_IMPORT = /(['"])\$registry\/bases\/base\/(ui|components)\//g;

/** Points a block's `$registry/bases/base/ui/` and `$registry/bases/base/components/` imports at the project's aliases. */
export const transformImports: Transform = (file, ctx) => ({
  content: file.content.replace(REGISTRY_IMPORT, (_, quote: string, folder: 'ui' | 'components') => `${quote}${ctx.aliases[folder]}/`),
});

/** Rewrites physical classes as logical ones in an RTL project, as shadcn's transformRtl does. */
export const transformRtl: Transform = (file, ctx) => ({ content: ctx.rtl ? transformDirection(file.target, file.content) : file.content });

const transforms: Transform[] = [transformImports, transformIcons, transformRtl, transformMarkers];

export function applyTransforms(file: SourceFile, ctx: TransformContext): Required<TransformResult> {
  let content = file.content;
  const dependencies = new Set<string>();
  for (const transform of transforms) {
    const result = transform({ target: file.target, content }, ctx);
    content = result.content;
    for (const dependency of result.dependencies ?? []) dependencies.add(dependency);
  }
  return { content, dependencies: [...dependencies] };
}
