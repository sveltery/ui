import { parse } from 'svelte/compiler';

/** A string that holds a `cn-*` token, located in the file it came from. */
export type ClassLiteral = {
  /** Span of the replaceable text. Quotes included for a JS string, excluded for a `class="..."` attribute. */
  start: number;
  end: number;
  quote: "'" | '"' | '`';
  kind: 'js' | 'attribute';
  /** The text a reader of the file sees: cooked for JS, raw for an attribute. */
  value: string;
};

/** What the registry needs to know about one `.svelte` or `.ts` file, found once and reused for every style. */
export type SourceFile = {
  path: string;
  text: string;
  classLiterals: ClassLiteral[];
  /** Every module specifier the file imports or re-exports. */
  imports: string[];
};

export const CN_TOKEN = /(?<![\w-])cn-[a-z0-9-]+(?![\w-])/;

// Svelte's parser reads TypeScript only inside a <script>, so a .ts file is wrapped in one and its offsets shifted back.
const WRAP_START = '<script module lang="ts">\n';
const WRAP_END = '\n</script>';

type Node = { type: string; start: number; end: number; [key: string]: unknown };
const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null && typeof (value as Node).type === 'string';

export function analyzeSource(path: string, text: string): SourceFile {
  const wrapped = path.endsWith('.ts');
  const offset = wrapped ? WRAP_START.length : 0;
  let ast;
  try {
    ast = parse(wrapped ? WRAP_START + text + WRAP_END : text, { modern: true });
  } catch (error) {
    throw new Error(`${path}: ${error instanceof Error ? error.message : error}`, { cause: error });
  }

  const classLiterals: ClassLiteral[] = [];
  const imports: string[] = [];
  const seen = new Set<unknown>();

  const addLiteral = (kind: ClassLiteral['kind'], start: number, end: number, value: string) => {
    if (!CN_TOKEN.test(value)) return;
    const quote = kind === 'js' ? text[start - offset] : text[start - offset - 1];
    if (quote !== "'" && quote !== '"' && quote !== '`') throw new Error(`${path}: class string at offset ${start - offset} is not quoted`);
    classLiterals.push({ start: start - offset, end: end - offset, quote, kind, value });
  };

  const visit = (value: unknown): void => {
    if (Array.isArray(value)) return value.forEach(visit);
    if (!isNode(value) || seen.has(value)) return;
    seen.add(value);
    const { type } = value;
    if (type === 'Literal' && typeof value.value === 'string') {
      addLiteral('js', value.start, value.end, value.value);
    } else if (type === 'TemplateLiteral' && (value.expressions as unknown[]).length === 0) {
      const [quasi] = value.quasis as { value: { cooked: string } }[];
      addLiteral('js', value.start, value.end, quasi!.value.cooked);
    } else if (type === 'Attribute' && value.name === 'class' && Array.isArray(value.value)) {
      const [only, ...rest] = value.value as Node[];
      if (only?.type === 'Text' && rest.length === 0) addLiteral('attribute', only.start, only.end, only.raw as string);
    }
    if (/^(Import|ExportNamed|ExportAll)/.test(type) && isNode(value.source) && typeof value.source.value === 'string') imports.push(value.source.value);
    for (const child of Object.values(value)) visit(child);
  };
  visit([ast.module, ast.instance, ast.fragment]);

  return { path, text, classLiterals, imports };
}
