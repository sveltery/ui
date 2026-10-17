import MagicString from 'magic-string';
import { importWith, lineRange, parseSource, walk, type ImportDeclaration as ImportNode, type ImportSpecifier as Specifier, type Node } from '../ast.js';
import { iconLibraries, kebab } from '../icons.js';
import { iconLibraryNames, type IconLibraryName, type RegistryItem } from '../registry.js';

/** One registry icon under each library's name, read from an `<IconPlaceholder>`. */
export type IconNames = Partial<Record<IconLibraryName, string>>;

/** An icon a migration left as it was, and why. */
export type Skipped = { icon: string; reason: string };

/** The library names of every `<IconPlaceholder>` in the registry's items, repeats included. */
export function iconIndex(items: RegistryItem[]): IconNames[] {
  return items
    .flatMap((item) => item.files)
    .flatMap((file) => [...file.content.matchAll(/<IconPlaceholder\s([^>]*?)\/?>/g)])
    .map(([, attributes = '']) => Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value])))
    .map((names) => Object.fromEntries(iconLibraryNames.flatMap((library) => (names[library] ? [[library, names[library]]] : []))));
}

/** Each `from` icon's import, mapped to the `to` icon the registry pairs it with most often. Components pair some icons differently, such as a chevron that is a selector in one. */
function iconMap(icons: IconNames[], from: IconLibraryName, to: IconLibraryName): Map<string, string> {
  const votes = new Map<string, Map<string, number>>();
  for (const names of icons) {
    if (!names[from] || !names[to]) continue;
    const { module, imported } = importOf(from, names[from]);
    const key = `${module}\0${imported}`;
    const counts = votes.get(key) ?? new Map<string, number>();
    counts.set(names[to], (counts.get(names[to]) ?? 0) + 1);
    votes.set(key, counts);
  }
  return new Map([...votes].map(([key, counts]) => [key, [...counts].reduce((best, entry) => (entry[1] > best[1] ? entry : best))[0]]));
}

/** How a library's icon is imported: `default`, or the named export. */
function importOf(library: IconLibraryName, name: string): { module: string; imported: string } {
  const [, defaultName, namedName, module = ''] = /^import (?:(\w+)|\{ (\w+) \}) from '([^']+)';$/.exec(iconLibraries[library].importIcon(name)) ?? [];
  return { module, imported: defaultName ? 'default' : namedName! };
}

/** How a library's icon is written in markup: a plain component, or a wrapper such as `<HugeiconsIcon icon={...}>` with default attributes. */
function usageOf(library: IconLibraryName): { wrapper?: string; iconAttribute?: string; defaults: [string, string][] } {
  const [tag = '', ...attributes] = iconLibraries[library].tag('ICON').split(' ');
  const pairs = attributes.map((attribute) => attribute.split(/=(.*)/s).slice(0, 2) as [string, string]);
  if (tag === 'ICON') return { defaults: pairs };
  return { wrapper: tag, iconAttribute: pairs.find(([, value]) => value === '{ICON}')?.[0], defaults: pairs.filter(([, value]) => value !== '{ICON}') };
}

type Attribute = Node & { name: string };
type Component = Node & { name: string; attributes: Attribute[] };

/**
 * Swaps the `from` library's icons for the `to` library's in a .svelte, .ts or .js file: their imports, their tags, and
 * references in attribute values. An icon with no equivalent, or used in a way that cannot be swapped, stays and is reported.
 */
export function migrateIconsInSource(target: string, content: string, from: IconLibraryName, to: IconLibraryName, icons: IconNames[]): { content: string; skipped: Skipped[] } {
  if (!/\.(svelte|[cm]?[jt]s)$/.test(target) || from === to) return { content, skipped: [] };
  const { ast, offset } = parseSource(target, content);
  const nodes = [...walk(ast)];
  const at = (node: Node) => [node.start - offset, node.end - offset] as const;
  const targets = iconMap(icons, from, to);
  // `@lucide/svelte` also exports each icon by name, with and without the Icon suffix.
  const keyOf = (module: string, imported: string) =>
    from === 'lucide' && module === '@lucide/svelte' ? `@lucide/svelte/icons/${kebab(imported).replace(/-icon$/, '')}\0default` : `${module}\0${imported}`;
  const source = usageOf(from);
  const targetUsage = usageOf(to);
  const s = new MagicString(content);
  const skipped: Skipped[] = [];
  const migrated: string[] = [];
  const touched: { node: ImportNode; kept: Specifier[] }[] = [];
  const unwrapped = new Set<Node>();

  const isComponent = (node: Node, name: string): node is Component => node.type === 'Component' && node.name === name;
  const selfClosing = (node: Node) => content.slice(0, at(node)[1]).endsWith('/>');
  const outsideImports = (ancestors: Node[]) => !ancestors.some((node) => node.type === 'ImportDeclaration');

  for (const [node] of nodes) {
    if (node.type !== 'ImportDeclaration') continue;
    const declaration = node as ImportNode;
    if (declaration.importKind === 'type' || !iconLibraries[from].isIconModule(declaration.source.value)) continue;
    const kept: Specifier[] = [];
    for (const specifier of declaration.specifiers) {
      const imported = specifier.type === 'ImportDefaultSpecifier' ? 'default' : specifier.imported?.name;
      const local = specifier.local.name;
      const icon = imported === 'default' ? local : (imported ?? local);
      const name = imported === undefined || specifier.importKind === 'type' ? undefined : targets.get(keyOf(declaration.source.value, imported));
      const keep = (reason: string) => {
        kept.push(specifier);
        if (specifier.importKind !== 'type' && specifier.type !== 'ImportNamespaceSpecifier') skipped.push({ icon, reason });
      };
      if (!name) {
        keep(`no ${to} equivalent found`);
        continue;
      }
      const tags = nodes.filter(([candidate]) => isComponent(candidate, local)).map(([tag]) => tag as Component);
      const wrapped: Component[] = [];
      const references: Node[] = [];
      let complex = false;
      for (const [identifier, ancestors] of nodes) {
        if (identifier.type !== 'Identifier' || identifier.name !== local || !outsideImports(ancestors)) continue;
        const [parent, attribute, element] = [ancestors.at(-1), ancestors.at(-2), ancestors.at(-3)];
        const inAttribute = parent?.type === 'ExpressionTag' && attribute?.type === 'Attribute';
        if (source.wrapper) {
          if (inAttribute && (attribute as Attribute).name === source.iconAttribute && element && isComponent(element, source.wrapper) && selfClosing(element)) wrapped.push(element);
          else complex = true;
        } else if (inAttribute) references.push(identifier);
        else complex = true;
      }
      if (complex) {
        keep('unsupported usage (e.g. referenced outside markup)');
        continue;
      }
      if (targetUsage.wrapper && (references.length > 0 || tags.some((tag) => !selfClosing(tag)))) {
        keep(`cannot be wrapped in <${targetUsage.wrapper} />`);
        continue;
      }

      if (!migrated.includes(name)) migrated.push(name);
      for (const reference of references) s.overwrite(...at(reference), name);
      for (const element of wrapped) unwrapped.add(element);
      for (const element of [...tags, ...wrapped]) rewriteElement(element, name);
    }
    if (kept.length < declaration.specifiers.length) touched.push({ node: declaration, kept });
  }

  function rewriteElement(element: Component, name: string) {
    const [start, end] = at(element);
    const tag = element.name;
    const written = new Set(element.attributes.map((attribute) => attribute.name));
    for (const attribute of element.attributes) {
      const text = content.slice(...at(attribute));
      const isIcon = attribute.name === source.iconAttribute && source.wrapper !== undefined;
      if (!isIcon && !source.defaults.some(([key, value]) => text === `${key}=${value}`)) continue;
      let cut = at(attribute)[0];
      while (/\s/.test(content[cut - 1] ?? '')) cut--;
      s.remove(cut, at(attribute)[1]);
      written.delete(attribute.name);
    }
    const defaults = targetUsage.defaults.filter(([key]) => !written.has(key)).map(([key, value]) => ` ${key}=${value}`);
    const opening = targetUsage.wrapper ? `${targetUsage.wrapper} ${targetUsage.iconAttribute}={${name}}` : name;
    s.overwrite(start + 1, start + 1 + tag.length, `${opening}${defaults.join('')}`);
    if (!selfClosing(element)) {
      const close = content.lastIndexOf(`</${tag}`, end);
      s.overwrite(close + 2, close + 2 + tag.length, opening.split(' ')[0]!);
    }
  }

  if (migrated.length === 0) return { content, skipped };

  if (source.wrapper && !nodes.some(([node]) => isComponent(node, source.wrapper!) && !unwrapped.has(node))) {
    for (const [node] of nodes) {
      if (node.type !== 'ImportDeclaration') continue;
      const declaration = node as ImportNode;
      const kept = declaration.specifiers.filter((specifier) => specifier.local.name !== source.wrapper);
      if (kept.length < declaration.specifiers.length && iconLibraries[from].sharedImports.some((line) => line.includes(`'${declaration.source.value}'`))) touched.push({ node: declaration, kept });
    }
  }

  const imports = [...iconLibraries[to].sharedImports, ...migrated.map(iconLibraries[to].importIcon)].filter((line) => !content.includes(line));
  const [first] = touched.sort((a, b) => a.node.start - b.node.start);
  const [firstStart] = at(first!.node);
  const lineStart = content.lastIndexOf('\n', firstStart - 1) + 1;
  const indent = content.slice(lineStart, firstStart);
  s.appendLeft(lineStart, imports.map((line) => `${indent}${line}\n`).join(''));
  for (const { node, kept } of touched) {
    const [start, end] = at(node);
    if (kept.length === 0) s.remove(...lineRange(content, [start, end]));
    else s.overwrite(start, end, importWith(node, kept, (part) => content.slice(...at(part))));
  }
  return { content: s.toString(), skipped };
}
