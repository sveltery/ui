import { createHighlighter, type DecorationItem, type ShikiTransformer } from 'shiki';

// The same themes as ui.shadcn.com: fenced code uses apps/v4/source.config.ts, previews and sources use apps/v4/lib/highlight-code.ts.
const KINDS = {
  fence: { themes: { light: 'github-light-default', dark: 'vesper' }, lineNumbers: undefined },
  source: { themes: { light: 'github-light', dark: 'github-dark' }, lineNumbers: true },
} as const;
const langs = ['svelte', 'ts', 'js', 'json', 'jsonc', 'css', 'html', 'bash', 'diff', 'text', 'yaml'];
const highlighter = createHighlighter({ themes: Object.values(KINDS).flatMap(({ themes }) => Object.values(themes)), langs });

const PROMPT_COLLAPSE_LINES = 12;

export type CodeMeta = { title?: string; lineNumbers?: boolean; lines?: number[]; words?: string[]; prompt?: boolean };

export function parseMeta(meta: string | null | undefined): CodeMeta {
  const title = meta?.match(/title="([^"]+)"/)?.[1];
  const rest = (meta ?? '').replace(/title="[^"]*"/, '');
  const lines = [...rest.matchAll(/\{([\d,\s-]+)\}/g)].flatMap(([, ranges]) =>
    ranges.split(',').flatMap((range) => {
      const [start, end = start] = range.trim().split('-').map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }),
  );
  return {
    title,
    lineNumbers: /\bshowLineNumbers\b/.test(rest),
    lines,
    words: [...rest.matchAll(/\/((?:\\\/|[^/])+)\//g)].map(([, word]) => word.replace(/\\\//g, '/')),
    prompt: /(^|\s)prompt(\s|$)/.test(rest),
  };
}

export const isCollapsible = (code: string, meta: CodeMeta) => !!meta.prompt && code.split('\n').length > PROMPT_COLLAPSE_LINES;

const lineAttributes = (meta: CodeMeta): ShikiTransformer => ({
  pre(node) {
    delete node.properties.style;
    delete node.properties.tabindex;
    node.properties['data-language'] = this.options.lang;
    if (meta.prompt) node.properties['data-prompt'] = '';
  },
  code(node) {
    node.properties['data-language'] = this.options.lang;
    if (meta.lineNumbers) node.properties['data-line-numbers'] = '';
  },
  line(node, line) {
    node.properties['data-line'] = '';
    if (meta.lines?.includes(line)) node.properties['data-highlighted-line'] = '';
  },
});

// Shiki throws on intersecting decorations.
function withoutOverlaps(ranges: number[][]) {
  const kept: number[][] = [];
  for (const [start, end] of ranges.sort((a, b) => a[0] - b[0])) if (!kept.length || start >= kept[kept.length - 1][1]) kept.push([start, end]);
  return kept;
}

function wordDecorations(code: string, words: string[] = []): DecorationItem[] {
  const ranges = words.flatMap((word) => [...code.matchAll(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'))].map((match) => [match.index, match.index + word.length]));
  return withoutOverlaps(ranges).map(([start, end]) => ({ start, end, tagName: 'span', properties: { 'data-highlighted-chars': '' } }));
}

export async function highlight(code: string, lang = 'text', meta: CodeMeta = {}, kind: keyof typeof KINDS = 'fence'): Promise<string> {
  const shiki = await highlighter;
  const language = shiki.getLoadedLanguages().includes(lang) ? lang : 'text';
  const source = code.replace(/\n$/, '');
  const options = { ...meta, lineNumbers: KINDS[kind].lineNumbers ?? meta.lineNumbers };
  return shiki.codeToHtml(source, {
    lang: language,
    themes: KINDS[kind].themes,
    defaultColor: false,
    decorations: wordDecorations(source, options.words),
    transformers: [lineAttributes(options)],
  });
}

const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const rewrites: Array<[RegExp, Record<PackageManager, string>]> = [
  [/^npm install /, { npm: 'npm install ', pnpm: 'pnpm add ', yarn: 'yarn add ', bun: 'bun add ' }],
  [/^npx create-/, { npm: 'npx create-', pnpm: 'pnpm create ', yarn: 'yarn create ', bun: 'bunx --bun create-' }],
  [/^npm create /, { npm: 'npm create ', pnpm: 'pnpm create ', yarn: 'yarn create ', bun: 'bun create ' }],
  [/^npx /, { npm: 'npx ', pnpm: 'pnpm dlx ', yarn: 'yarn dlx ', bun: 'bunx --bun ' }],
  [/^npm run /, { npm: 'npm run ', pnpm: 'pnpm ', yarn: 'yarn ', bun: 'bun ' }],
];

/** Returns one command per package manager when `code` is an npm command, as upstream's code-block-command does. */
export function packageManagerCommands(code: string): Record<PackageManager, string> | undefined {
  const rewrite = rewrites.find(([pattern]) => pattern.test(code));
  if (!rewrite) return undefined;
  const [pattern, replacements] = rewrite;
  return Object.fromEntries(PACKAGE_MANAGERS.map((pm) => [pm, code.replace(pattern, replacements[pm])])) as Record<PackageManager, string>;
}
