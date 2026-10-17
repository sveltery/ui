import MagicString from 'magic-string';
import { parse } from 'svelte/compiler';
import { CliError } from './parse.js';

type Node = { type: string; start: number; end: number; [key: string]: unknown };
type Specifier = Node & { importKind?: string; exportKind?: string };
type Comment = { type: 'Line' | 'Block'; value: string; start: number; end: number };

/** Where a registry file goes in a JavaScript project: `.ts` becomes `.js`, so `state.svelte.ts` becomes `state.svelte.js`. */
export const jsTarget = (target: string) => target.replace(/\.ts$/, '.js');

const SCRIPT_OPEN = '<script lang="ts">';
const SCRIPT_CLOSE = '</script>';
/** Node keys that hold only a type: `: T`, `<T>` and `(): T`. */
const TYPE_KEYS = ['typeAnnotation', 'typeParameters', 'typeArguments', 'returnType'];
const DECLARATIONS = ['TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSDeclareFunction', 'TSModuleDeclaration'];
/** Expressions whose type part follows the value: `x as T`, `x satisfies T`, `x!` and `f<T>`. */
const SUFFIXED = ['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'TSInstantiationExpression'];
const CLASS_MODIFIERS = ['accessibility', 'readonly', 'declare', 'abstract', 'override', 'definite', 'implements'];

// A svelte `Fragment` has a type but no position.
const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null && typeof (value as Node).type === 'string';

/**
 * The file as JavaScript, the way shadcn's transformJsx strips a `.tsx` file: `.ts` modules and `<script lang="ts">` blocks lose their types,
 * the script tags lose `lang="ts"` and `generics`, and the rest keeps its formatting.
 * Undefined for a module that only declares types, such as `types.ts`.
 */
export function stripTypes(target: string, content: string): string | undefined {
  const isSvelte = target.endsWith('.svelte');
  if (!isSvelte && !target.endsWith('.ts')) return content;
  const source = isSvelte ? content : `${SCRIPT_OPEN}${content}${SCRIPT_CLOSE}`;
  const ast = parse(source, { filename: target, modern: true });
  const s = new MagicString(source);
  const removed = new Set<Node>();
  const firstStatements = [ast.instance, ast.module].map((script) => (script?.content as unknown as { body: Node[] } | undefined)?.body[0]);
  const unsupported = (node: Node, what: string) => new CliError(`${target}: cannot write ${what} as JavaScript (line ${source.slice(0, node.start).split('\n').length}).`);

  // Removes a statement with its leading comments and, when nothing else shares them, its indentation and line break.
  const removeStatement = (node: Node) => {
    removed.add(node);
    // The first statement's comments are usually the file's license header.
    const docs = firstStatements.includes(node) ? [] : ((node.leadingComments ?? []) as Comment[]);
    let start = docs[0]?.start ?? node.start;
    let end = node.end;
    while (start > 0 && /[ \t]/.test(source[start - 1]!)) start--;
    if (start > 0 && source[start - 1] !== '\n') start = docs[0]?.start ?? node.start;
    let after = end;
    while (/[ \t]/.test(source[after] ?? '')) after++;
    if (source[after] === '\n') end = after + 1;
    // A statement between two blank lines takes one of them along.
    if (source.slice(start - 2, start) === '\n\n' && source[end] === '\n') end++;
    s.remove(start, end);
  };

  // Removes the type-only specifiers of an import or export, or the whole statement when only types remain.
  const removeSpecifiers = (node: Node, kind: 'importKind' | 'exportKind') => {
    const specifiers = node.specifiers as Specifier[];
    const named = specifiers.filter((spec) => spec.type === 'ImportSpecifier' || spec.type === 'ExportSpecifier');
    const types = named.filter((spec) => spec[kind] === 'type');
    if (types.length === 0) return;
    if (types.length === specifiers.length) return removeStatement(node);
    if (types.length === named.length) {
      // `import Default, { type A } from 'x'` keeps the default import.
      const before = specifiers[specifiers.indexOf(named[0]!) - 1]!;
      s.remove(before.end, source.indexOf('}', named.at(-1)!.end) + 1);
      return;
    }
    for (const spec of types) {
      const next = named[named.indexOf(spec) + 1];
      if (next) s.remove(spec.start, next.start);
      else s.remove(named[named.indexOf(spec) - 1]!.end, spec.end);
    }
  };

  const visit = (node: Node, parent?: Node): void => {
    if (DECLARATIONS.includes(node.type)) return removeStatement(parent?.type === 'ExportNamedDeclaration' ? parent : node);
    if (node.type === 'ImportDeclaration') return node.importKind === 'type' ? removeStatement(node) : removeSpecifiers(node, 'importKind');
    if (node.type === 'ExportAllDeclaration' && node.exportKind === 'type') return removeStatement(node);
    if (node.type === 'ExportNamedDeclaration' && !node.declaration) return node.exportKind === 'type' ? removeStatement(node) : removeSpecifiers(node, 'exportKind');
    if (SUFFIXED.includes(node.type)) {
      const expression = node.expression as Node;
      s.remove(expression.end, node.end);
      return visit(expression, node);
    }
    if (node.type === 'TSTypeAssertion') {
      const expression = node.expression as Node;
      s.remove(node.start, expression.start);
      return visit(expression, node);
    }
    if (node.type.startsWith('TS') || node.type === 'Decorator') throw unsupported(node, node.type);
    for (const modifier of CLASS_MODIFIERS) {
      const value = node[modifier];
      if (value === true || typeof value === 'string' || (Array.isArray(value) && value.length > 0)) throw unsupported(node, `\`${modifier}\` on a class member`);
    }

    for (const key of TYPE_KEYS) if (isNode(node[key])) s.remove(node[key].start, node[key].end);
    if (node.type === 'Identifier' && node.optional === true) {
      const mark = node.start + (node.name as string).length;
      if (source[mark] === '?') s.remove(mark, mark + 1);
    }
    for (const [key, value] of Object.entries(node)) {
      if (TYPE_KEYS.includes(key) || key === 'leadingComments' || key === 'trailingComments') continue;
      for (const child of Array.isArray(value) ? value : [value]) if (isNode(child)) visit(child, node);
    }
  };

  for (const script of [ast.instance, ast.module]) {
    if (!script) continue;
    for (const attribute of script.attributes) {
      if (attribute.type !== 'Attribute' || (attribute.name !== 'lang' && attribute.name !== 'generics')) continue;
      let start = attribute.start;
      while (/\s/.test(source[start - 1]!)) start--;
      s.remove(start, attribute.end);
    }
  }
  visit(ast as unknown as Node);

  if (isSvelte) return s.toString();
  const body = (ast.instance!.content as unknown as { body: Node[] }).body;
  if (body.length > 0 && body.every((statement) => removed.has(statement))) return undefined;
  return s.slice(SCRIPT_OPEN.length, source.length - SCRIPT_CLOSE.length);
}
