import { parse } from 'svelte/compiler';

// Ported from shadcn-ui/ui d2fba50 packages/registry/src/transformers/transform-rtl.ts; MIT: THIRD_PARTY_NOTICES.md.

// Order matters: negative before positive, corners before sides, with-value before without.
const RTL_MAPPINGS: [string, string][] = [
  ['-ml-', '-ms-'],
  ['-mr-', '-me-'],
  ['ml-', 'ms-'],
  ['mr-', 'me-'],
  ['pl-', 'ps-'],
  ['pr-', 'pe-'],
  ['-left-', '-start-'],
  ['-right-', '-end-'],
  ['left-', 'start-'],
  ['right-', 'end-'],
  ['inset-l-', 'inset-inline-start-'],
  ['inset-r-', 'inset-inline-end-'],
  ['rounded-tl-', 'rounded-ss-'],
  ['rounded-tr-', 'rounded-se-'],
  ['rounded-bl-', 'rounded-es-'],
  ['rounded-br-', 'rounded-ee-'],
  ['rounded-l-', 'rounded-s-'],
  ['rounded-r-', 'rounded-e-'],
  ['border-l-', 'border-s-'],
  ['border-r-', 'border-e-'],
  ['border-l', 'border-s'],
  ['border-r', 'border-e'],
  ['text-left', 'text-start'],
  ['text-right', 'text-end'],
  ['scroll-ml-', 'scroll-ms-'],
  ['scroll-mr-', 'scroll-me-'],
  ['scroll-pl-', 'scroll-ps-'],
  ['scroll-pr-', 'scroll-pe-'],
  ['float-left', 'float-start'],
  ['float-right', 'float-end'],
  ['clear-left', 'clear-start'],
  ['clear-right', 'clear-end'],
  ['origin-top-left', 'origin-top-start'],
  ['origin-top-right', 'origin-top-end'],
  ['origin-bottom-left', 'origin-bottom-start'],
  ['origin-bottom-right', 'origin-bottom-end'],
  ['origin-left', 'origin-start'],
  ['origin-right', 'origin-end'],
];

/** Kept, with an `rtl:` copy of the opposite sign. */
const RTL_TRANSLATE_X_MAPPINGS: [string, string][] = [
  ['-translate-x-', 'translate-x-'],
  ['translate-x-', '-translate-x-'],
];

/** No logical equivalent, so they get an `rtl:*-reverse`. */
const RTL_REVERSE_MAPPINGS: [string, string][] = [
  ['space-x-', 'space-x-reverse'],
  ['divide-x-', 'divide-x-reverse'],
];

const RTL_SWAP_MAPPINGS: [string, string][] = [
  ['cursor-w-resize', 'cursor-e-resize'],
  ['cursor-e-resize', 'cursor-w-resize'],
];

const RTL_LOGICAL_SIDE_SLIDE_MAPPINGS: [variant: string, physical: string, logical: string][] = [
  ['data-[side=inline-start]', 'slide-in-from-right', 'slide-in-from-end'],
  ['data-[side=inline-start]', 'slide-out-to-right', 'slide-out-to-end'],
  ['data-[side=inline-end]', 'slide-in-from-left', 'slide-in-from-start'],
  ['data-[side=inline-end]', 'slide-out-to-left', 'slide-out-to-start'],
];

/** Marks an icon that points along the inline axis. */
export const RTL_FLIP_MARKER = 'cn-rtl-flip';

/** Components whose `side` prop and default become logical. */
const RTL_SIDE_PROP_COMPONENTS = ['ContextMenuContent', 'ContextMenuSubContent', 'DropdownMenuSubContent'];
const RTL_SIDE_PROP_MAPPINGS: Record<string, string> = { right: 'inline-end', left: 'inline-start' };

/** A tooltip on the physical left keeps its arrow on the physical right. */
const POSITIONING_PREFIXES = ['-left-', '-right-', 'left-', 'right-'];

/** `[variant, name, alpha]` of a class, as shadcn's transform-css-vars splits it. */
export function splitClassName(className: string): [variant: string | null, name: string, alpha: string | null] {
  if (!className.includes('/') && !className.includes(':')) return [null, className, null];
  let lastColonIndex = -1;
  let depth = 0;
  for (let i = className.length - 1; i >= 0; i--) {
    const char = className[i];
    if (char === ']') depth++;
    else if (char === '[') depth--;
    else if (char === ':' && depth === 0) {
      lastColonIndex = i;
      break;
    }
  }
  const variant = lastColonIndex === -1 ? null : className.slice(0, lastColonIndex);
  const nameWithAlpha = className.slice(lastColonIndex + 1);
  // A named group such as /alert-dialog-content is part of the variant, so a slash here is an alpha.
  const slash = nameWithAlpha.lastIndexOf('/');
  if (slash === -1) return [variant, nameWithAlpha, null];
  return [variant, nameWithAlpha.slice(0, slash), nameWithAlpha.slice(slash + 1)];
}

const join = (variant: string | null, value: string, modifier: string | null) => `${variant ? `${variant}:` : ''}${value}${modifier ? `/${modifier}` : ''}`;

/** Maps one class string from physical to logical classes. Not idempotent: a second pass adds the `rtl:` copies again. */
export function applyRtlMapping(input: string): string {
  return input
    .split(' ')
    .flatMap((className) => {
      if (className.startsWith('rtl:') || className.startsWith('ltr:')) return [className];
      if (className === RTL_FLIP_MARKER) return ['rtl:rotate-180'];
      const [variant, value, modifier] = splitClassName(className);
      if (!value) return [className];

      for (const [physical, opposite] of RTL_TRANSLATE_X_MAPPINGS) {
        if (value.startsWith(physical)) return [className, `rtl:${join(variant, value.replace(physical, opposite), modifier)}`];
      }
      for (const [prefix, reverse] of RTL_REVERSE_MAPPINGS) {
        if (value.startsWith(prefix)) return [className, `rtl:${join(variant, reverse, null)}`];
      }
      for (const [physical, swapped] of RTL_SWAP_MAPPINGS) {
        if (value === physical) return [className, `rtl:${join(variant, swapped, null)}`];
      }
      for (const [side, physical, logical] of RTL_LOGICAL_SIDE_SLIDE_MAPPINGS) {
        if (variant?.includes(side) && value.startsWith(physical)) return [join(variant, value.replace(physical, logical), modifier)];
      }

      const physicalSide = variant?.includes('data-[side=left]') || variant?.includes('data-[side=right]');
      let mapped = value;
      for (const [physical, logical] of RTL_MAPPINGS) {
        if (physicalSide && POSITIONING_PREFIXES.some((prefix) => physical.startsWith(prefix))) continue;
        if (!value.startsWith(physical)) continue;
        // Without a trailing '-' the class must match whole, so border-ring is not border-r.
        if (!physical.endsWith('-') && value !== physical) continue;
        mapped = value.replace(physical, logical);
        break;
      }
      return [join(variant, mapped, modifier)];
    })
    .join(' ');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- an ESTree or Svelte AST node, read field by field after its type is checked
type Node = { type: string; start: number; end: number; [key: string]: any };
type StringLiteral = Node & { type: 'Literal'; value: string; raw: string };
type Edit = { start: number; end: number; text: string };

const isNode = (value: unknown): value is Node => typeof value === 'object' && value !== null && typeof (value as Node).type === 'string';
const isString = (node: unknown): node is StringLiteral => isNode(node) && node.type === 'Literal' && typeof node.value === 'string';
const isCall = (node: unknown, name?: string): node is Node => isNode(node) && node.type === 'CallExpression' && (!name || (node.callee.type === 'Identifier' && node.callee.name === name));

/** `node` and every node under it, in source order, each with the functions it sits in, outermost first. */
function* descendants(value: unknown, functions: Node[] = []): Generator<{ node: Node; functions: Node[] }> {
  if (Array.isArray(value)) {
    for (const item of value) yield* descendants(item, functions);
    return;
  }
  if (!isNode(value)) return;
  yield { node: value, functions };
  const inner = value.type === 'FunctionDeclaration' ? [...functions, value] : functions;
  for (const [key, child] of Object.entries(value)) if (key !== 'metadata' && key !== 'parent') yield* descendants(child, inner);
}
const nodes = (value: unknown) => [...descendants(value)].map(({ node }) => node);

/** The strings of a call argument: itself, a ternary's operands, and with `binary`, a binary or logical expression's operands. */
function argumentStrings(arg: Node, { binary }: { binary: boolean }): StringLiteral[] {
  const operands =
    arg.type === 'ConditionalExpression' ? [arg.test, arg.consequent, arg.alternate] : binary && /^(Binary|Logical|Assignment)Expression$/.test(arg.type) ? [arg.left, arg.right] : [arg];
  return operands.filter(isString);
}

const propertyName = (property: Node) => (property.key.type === 'Identifier' ? property.key.name : property.key.value);
/** The `key: value` members of the object literals at and under `node`. */
const properties = (node: unknown) => nodes(node).filter((n) => n.type === 'ObjectExpression').flatMap((object) => (object.properties as Node[]).filter((p) => p.type === 'Property' && !p.computed));

/** A static attribute's only text, as in `class="..."` or `side="right"`. */
function staticText(attribute: Node): Node | undefined {
  const value = attribute.value;
  return Array.isArray(value) && value.length === 1 && value[0].type === 'Text' ? value[0] : undefined;
}

/** The class strings shadcn's transform visits, in Svelte's spelling: `class` for `className`. */
function classStrings(root: unknown): (StringLiteral | Node)[] {
  const strings: (StringLiteral | Node)[] = [];
  for (const node of nodes(root)) {
    // cva(base, { variants: { name: { value: '...' } } })
    if (isCall(node, 'cva')) {
      const [base, options] = node.arguments as Node[];
      if (isString(base)) strings.push(base);
      if (options?.type !== 'ObjectExpression') continue;
      const variants = (options.properties as Node[]).find((p) => p.type === 'Property' && propertyName(p) === 'variants');
      for (const variant of variants?.value.type === 'ObjectExpression' ? (variants.value.properties as Node[]) : []) {
        if (variant.value?.type !== 'ObjectExpression') continue;
        for (const property of properties(variant.value)) if (isString(property.value)) strings.push(property.value);
      }
    }
    if (node.type !== 'Attribute') continue;
    if (node.name === 'class') {
      const text = staticText(node);
      if (text) strings.push(text);
      // class={...}: the arguments of its first cn() call.
      const cn = Array.isArray(node.value) ? undefined : nodes(node.value).find((n) => isCall(n, 'cn'));
      for (const arg of (cn?.arguments as Node[]) ?? []) strings.push(...argumentStrings(arg, { binary: true }));
    }
    // classNames={{ ... }}: the arguments of each property's call, then its own string unless it is named variant.
    if (node.name === 'classNames' && !Array.isArray(node.value)) {
      for (const property of properties(node.value)) {
        if (isCall(property.value)) for (const arg of property.value.arguments as Node[]) strings.push(...argumentStrings(arg, { binary: false }));
        if (isString(property.value) && propertyName(property) !== 'variant') strings.push(property.value);
      }
    }
  }
  return [...new Set(strings)];
}

/** `side="right"` on a listed component, and a `side = 'right'` default inside one: the file's own component, or a function declaration of a listed name. */
function sideStrings(root: unknown, component: string | undefined): (StringLiteral | Node)[] {
  const strings: (StringLiteral | Node)[] = [];
  for (const { node, functions } of descendants(root)) {
    if (node.type === 'Component' && RTL_SIDE_PROP_COMPONENTS.includes(node.name)) {
      const side = (node.attributes as Node[]).find((a) => a.type === 'Attribute' && a.name === 'side');
      const text = side && staticText(side);
      if (text) strings.push(text);
    }
    if (node.type !== 'ObjectPattern' && node.type !== 'ArrayPattern') continue;
    const elements = node.type === 'ObjectPattern' ? (node.properties as Node[]).map((p) => (p.type === 'Property' ? p.value : p)) : (node.elements as (Node | null)[]);
    const owner = functions.at(-1)?.id?.name ?? component;
    if (!owner || !RTL_SIDE_PROP_COMPONENTS.includes(owner)) continue;
    for (const element of elements) {
      if (element?.type === 'AssignmentPattern' && element.left.type === 'Identifier' && element.left.name === 'side' && isString(element.right)) strings.push(element.right);
    }
  }
  return strings;
}

const quoted = (value: string, quote: string) => quote + value.replaceAll('\\', '\\\\').replaceAll(quote, `\\${quote}`) + quote;

// Svelte's parser reads TypeScript only inside a <script>, so a .ts file is wrapped in one and its offsets shifted back.
const WRAP_START = '<script module lang="ts">\n';
const WRAP_END = '\n</script>';

/**
 * Rewrites a `.svelte` or `.ts` component file for right-to-left layouts: physical classes become logical ones,
 * `cn-rtl-flip` becomes `rtl:rotate-180`, and the listed menus' `side` becomes `inline-start` or `inline-end`.
 * Anything else is returned as it is. Like upstream, it is not idempotent, so run it once on LTR source.
 */
export function transformDirection(path: string, source: string): string {
  const isSvelte = path.endsWith('.svelte');
  if (!isSvelte && !/\.[cm]?[jt]s$/.test(path)) return source;
  const offset = isSvelte ? 0 : WRAP_START.length;
  const ast = parse(isSvelte ? source : WRAP_START + source + WRAP_END, { modern: true });
  const root = [ast.module, ast.instance, ast.fragment];
  const component = isSvelte ? path.split('/').at(-1)!.replace(/\.svelte$/, '') : undefined;

  const edits: Edit[] = [];
  const edit = (node: Node, map: (value: string) => string | undefined) => {
    const start = node.start - offset;
    const end = node.end - offset;
    if (isString(node)) {
      const next = map(node.value);
      if (next !== undefined && next !== node.value) edits.push({ start, end, text: quoted(next, node.raw[0]!) });
    } else {
      const next = map(node.raw);
      if (next !== undefined && next !== node.raw) edits.push({ start, end, text: next });
    }
  };
  for (const node of classStrings(root)) edit(node, applyRtlMapping);
  for (const node of sideStrings(root, component)) edit(node, (value) => RTL_SIDE_PROP_MAPPINGS[value]);

  let out = source;
  for (const { start, end, text } of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, start) + text + out.slice(end);
  return out;
}
