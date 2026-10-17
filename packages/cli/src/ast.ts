import { parse } from 'svelte/compiler';

export type Node = { type: string; start: number; end: number; [key: string]: unknown };

/** Every node under `value`, in source order, with its ancestors, nearest last. */
export function* walk(value: unknown, ancestors: Node[] = [], seen = new WeakSet<object>()): Generator<[Node, Node[]]> {
  if (typeof value !== 'object' || value === null || seen.has(value)) return;
  seen.add(value);
  const isNode = typeof (value as Node).type === 'string' && typeof (value as Node).start === 'number';
  if (isNode) yield [value as Node, ancestors];
  const below = isNode ? [...ancestors, value as Node] : ancestors;
  for (const child of Object.values(value)) yield* walk(child, below, seen);
}

const SCRIPT_OPEN = '<script lang="ts">';

/**
 * A .svelte file, or a TypeScript or JavaScript module, which svelte/compiler parses as the body of a script tag.
 * Subtract `offset` from an AST position to get the position in `content`.
 */
export function parseSource(target: string, content: string): { ast: ReturnType<typeof parse>; offset: number } {
  const isSvelte = target.endsWith('.svelte');
  return { ast: parse(isSvelte ? content : `${SCRIPT_OPEN}${content}</script>`, { filename: target, modern: true }), offset: isSvelte ? 0 : SCRIPT_OPEN.length };
}

export type ImportSpecifier = Node & { local: Node & { name: string }; imported?: Node & { name?: string; value?: unknown }; importKind?: string };
export type ImportDeclaration = Node & { source: Node & { value: string }; specifiers: ImportSpecifier[]; importKind?: string };

/** An import declaration's text with only `kept` of its specifiers, each as written. `text` reads a node's source. */
export function importWith(declaration: ImportDeclaration, kept: ImportSpecifier[], text: (node: Node) => string): string {
  const defaults = kept.filter((specifier) => specifier.type !== 'ImportSpecifier').map(text);
  const named = kept.filter((specifier) => specifier.type === 'ImportSpecifier').map(text);
  const clause = [...defaults, ...(named.length > 0 ? [`{ ${named.join(', ')} }`] : [])].join(', ');
  return `import ${declaration.importKind === 'type' ? 'type ' : ''}${clause} from ${text(declaration.source)};`;
}

/** The range that removes a statement: its whole line when nothing else is on it. */
export function lineRange(content: string, [start, end]: readonly [number, number]): [number, number] {
  const lineStart = content.lastIndexOf('\n', start - 1) + 1;
  return [content.slice(lineStart, start).trim() === '' ? lineStart : start, content[end] === '\n' ? end + 1 : end];
}
