import { createHighlighter, type ShikiTransformer } from 'shiki';

// The same themes as ui.shadcn.com (apps/v4/source.config.ts).
const themes = { light: 'github-light-default', dark: 'vesper' } as const;
const langs = ['svelte', 'ts', 'js', 'json', 'jsonc', 'css', 'html', 'bash', 'diff', 'text', 'yaml'];
const highlighter = createHighlighter({ themes: Object.values(themes), langs });

export type CodeMeta = { title?: string; lineNumbers?: boolean };

export function parseMeta(meta: string | null | undefined): CodeMeta {
  return {
    title: meta?.match(/title="([^"]+)"/)?.[1],
    lineNumbers: /\bshowLineNumbers\b/.test(meta ?? ''),
  };
}

const lineAttributes: ShikiTransformer = {
  pre(node) {
    delete node.properties.style;
    delete node.properties.tabindex;
  },
  code(node) {
    node.properties['data-language'] = this.options.lang;
    if ((this.options.meta as CodeMeta | undefined)?.lineNumbers) node.properties['data-line-numbers'] = '';
  },
  line(node) {
    node.properties['data-line'] = '';
  },
};

/** Highlights code into a `<figure>` styled like upstream's rehype-pretty-code output. */
export async function highlight(code: string, lang = 'text', meta: CodeMeta = {}): Promise<string> {
  const shiki = await highlighter;
  const language = shiki.getLoadedLanguages().includes(lang) ? lang : 'text';
  const pre = shiki.codeToHtml(code.replace(/\n$/, ''), {
    lang: language,
    themes,
    defaultColor: false,
    meta: meta as Record<string, unknown>,
    transformers: [lineAttributes],
  });
  const title = meta.title ? `<figcaption data-rehype-pretty-code-title>${escapeHtml(meta.title)}</figcaption>` : '';
  return `<figure data-rehype-pretty-code-figure>${title}${pre}</figure>`;
}

const PACKAGE_MANAGERS = ['pnpm', 'npm', 'yarn', 'bun'] as const;
export type PackageManager = (typeof PACKAGE_MANAGERS)[number];

const rewrites: Array<[RegExp, Record<PackageManager, string>]> = [
  [/^npm install /, { npm: 'npm install ', pnpm: 'pnpm add ', yarn: 'yarn add ', bun: 'bun add ' }],
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

export function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
