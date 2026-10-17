import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from 'svelte/compiler';
import { describe, expect, it } from 'vitest';
import { ATTRIBUTE_ALIASES } from '../../src/util/reactDomTables.js';

const SRC = join(import.meta.dirname, '../../src');

function filesEndingWith(dir: string, suffix: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return filesEndingWith(path, suffix);
    return entry.name.endsWith(suffix) ? [path] : [];
  });
}

const FILES = filesEndingWith(SRC, '.svelte');

const SVG_ELEMENTS = new Set([
  'g',
  'rect',
  'path',
  'defs',
  'clipPath',
  'circle',
  'ellipse',
  'line',
  'polyline',
  'polygon',
  'text',
  'tspan',
  'linearGradient',
  'radialGradient',
  'stop',
  'pattern',
  'mask',
  'filter',
  'use',
  'symbol',
  'marker',
  'foreignObject',
]);

type AstNode = { type: string; [key: string]: unknown };
type Visit = (node: AstNode, ancestors: AstNode[], siblings: AstNode[], index: number) => void;

function isNode(value: unknown): value is AstNode {
  return typeof value === 'object' && value !== null && typeof (value as AstNode).type === 'string';
}

/** Walks every template node, giving each its element ancestors and the fragment it sits in. */
function walkTemplate(node: AstNode, visit: Visit, ancestors: AstNode[] = []): void {
  for (const [key, value] of Object.entries(node)) {
    if (key === 'expression' || key === 'attributes' || key === 'metadata') continue;
    if (isNode(value) && value.type === 'Fragment') {
      const nodes = value.nodes as AstNode[];
      const inner = node.type === 'RegularElement' ? [...ancestors, node] : ancestors;
      nodes.forEach((child, index) => {
        visit(child, inner, nodes, index);
        walkTemplate(child, visit, inner);
      });
    }
  }
}

function parseFile(path: string) {
  return parse(readFileSync(path, 'utf8'), { modern: true }) as unknown as AstNode & { fragment: AstNode; options: { namespace?: string } | null };
}

function inSvg(ancestors: AstNode[], namespace: string | undefined): boolean {
  if (ancestors.some((a) => a.name === 'text')) return false;
  return namespace === 'svg' || ancestors.some((a) => a.name === 'svg');
}

function isBlank(node: AstNode): boolean {
  return node.type === 'Text' && (node.data as string).trim() === '';
}

/** Svelte drops comments before it collapses whitespace, so a comment does not count as a sibling. */
function isInvisible(node: AstNode): boolean {
  return isBlank(node) || node.type === 'Comment';
}

function callee(expression: AstNode): AstNode {
  const call = (expression.type === 'ChainExpression' ? expression.expression : expression) as AstNode;
  return call.callee as AstNode;
}

describe('shell conventions', () => {
  it('finds the shell components and walks into their templates', () => {
    expect(FILES.length).toBeGreaterThan(40);
    const seen = new Set<string>();
    for (const path of FILES) walkTemplate(parseFile(path), (node) => seen.add(node.type === 'RegularElement' ? (node.name as string) : node.type));
    expect([...seen].filter((name) => ['svg', 'div', 'clipPath', 'g', 'RenderTag', 'Component', 'IfBlock', 'EachBlock'].includes(name)).sort()).toEqual([
      'Component',
      'EachBlock',
      'IfBlock',
      'RenderTag',
      'clipPath',
      'div',
      'g',
      'svg',
    ]);
  });

  // React prop names on a DOM element are written verbatim by Svelte, so className or strokeWidth would reach the DOM as is.
  it('writes DOM attribute names, never React prop names, on DOM elements', () => {
    const offenders: string[] = [];
    for (const path of FILES) {
      walkTemplate(parseFile(path), (node) => {
        if (node.type !== 'RegularElement') return;
        for (const attribute of node.attributes as AstNode[]) {
          if (attribute.type !== 'Attribute') continue;
          const name = attribute.name as string;
          if (name === 'className' || /^on[A-Z]/.test(name) || ATTRIBUTE_ALIASES.has(name)) offenders.push(`${relative(SRC, path)}: <${node.name as string} ${name}>`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });

  // Foo.svelte and Foo.svelte.ts resolve to the same import path, so one silently shadows the other.
  it('never puts a .svelte.ts module next to a component of the same name', () => {
    expect(FILES.filter((path) => existsSync(`${path}.ts`)).map((path) => relative(SRC, path))).toEqual([]);
  });

  // A vendored X.ts holds upstream's framework-free half and X.svelte.ts the hooks; one name in both means a stub was left behind.
  it('never exports a name from both a vendored module and the .svelte.ts beside it', () => {
    const vendored = new Set(readFileSync(join(SRC, '../scripts/vendored.txt'), 'utf8').split('\n'));
    const exported = (path: string) => [...readFileSync(path, 'utf8').matchAll(/^export (?:declare )?(?:const|let|function|type|interface|class|enum) (\w+)/gm)].map((m) => m[1]);
    const pairs = filesEndingWith(SRC, '.svelte.ts')
      .map((path) => [path, path.replace(/\.svelte\.ts$/, '.ts')] as const)
      .filter(([, ts]) => vendored.has(`src/${relative(SRC, ts)}`));
    expect(pairs.length).toBeGreaterThan(0);
    const shared = pairs.flatMap(([svelte, ts]) => exported(svelte).filter((name) => exported(ts).includes(name)).map((name) => `${relative(SRC, svelte)}: ${name}`));
    expect(shared).toEqual([]);
  });

  // An SVG element outside an <svg> in the same template is created in the HTML namespace and never draws.
  it('declares the svg namespace in every component that renders SVG elements outside an <svg>', () => {
    const offenders: string[] = [];
    for (const path of FILES) {
      const ast = parseFile(path);
      walkTemplate(ast, (node, ancestors) => {
        if (node.type !== 'RegularElement' || !SVG_ELEMENTS.has(node.name as string)) return;
        if (ast.options?.namespace !== 'svg' && !ancestors.some((a) => a.name === 'svg')) offenders.push(`${relative(SRC, path)}: <${node.name as string}>`);
      });
    }
    expect(offenders).toEqual([]);
  });

  // Upstream's render props are elements or functions; RenderProp.svelte is the one place that renders a user snippet that is not children.
  it('renders only children snippets outside util/RenderProp.svelte', () => {
    const offenders: string[] = [];
    for (const path of FILES) {
      if (relative(SRC, path) === join('util', 'RenderProp.svelte')) continue;
      walkTemplate(parseFile(path), (node) => {
        if (node.type !== 'RenderTag') return;
        const target = callee(node.expression as AstNode);
        const name = target.type === 'Identifier' ? target.name : target.type === 'MemberExpression' ? (target.property as AstNode).name : undefined;
        if (name !== 'children') offenders.push(`${relative(SRC, path)}: {@render ${String(name)}}`);
      });
    }
    expect(offenders).toEqual([]);
  });

  // Svelte keeps one space between sibling nodes outside SVG, and React renders no text there, so siblings must touch.
  it('leaves no whitespace text between sibling template nodes outside SVG', () => {
    const offenders: string[] = [];
    for (const path of FILES) {
      const ast = parseFile(path);
      walkTemplate(ast, (node, ancestors, siblings, index) => {
        if (!isBlank(node) || inSvg(ancestors, ast.options?.namespace)) return;
        // Svelte trims whitespace at the edges of a fragment.
        if (siblings.slice(0, index).every(isInvisible) || siblings.slice(index + 1).every(isInvisible)) return;
        const line = readFileSync(path, 'utf8').slice(0, node.start as number).split('\n').length;
        offenders.push(`${relative(SRC, path)}:${line}`);
      });
    }
    expect(offenders).toEqual([]);
  });
});
