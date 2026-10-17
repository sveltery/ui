import MagicString from 'magic-string';
import { importWith, lineRange, tryParseSource, walk, type ImportDeclaration as ImportNode, type ImportSpecifier as Specifier, type Node } from '../ast.js';

export const OLD_PACKAGES = ['clsx', 'tailwind-merge', 'cnfast'] as const;
export type OldPackage = (typeof OLD_PACKAGES)[number];

/** Something the migration left for the user to change by hand. A file that does not parse has no package. */
export type CnIssue = { packageName?: OldPackage; symbol?: string; reason: string };

export type CnResult = { content: string; migrated: OldPackage[]; remaining: OldPackage[]; unsupported: CnIssue[] };

type OldModule = 'clsx' | 'clsx/lite' | 'tailwind-merge';
type CnModule = 'cn' | 'cn/lite' | 'cn/config';
type PendingImport = { module: CnModule; imported: string; local: string; typeOnly: boolean };

const OLD_MODULES: readonly string[] = ['clsx', 'clsx/lite', 'tailwind-merge'];
const TAILWIND_ROOT_EXPORTS = new Set(['twMerge', 'twJoin', 'ClassNameValue']);
const TAILWIND_CONFIG_EXPORTS = new Map([
  ['extendTailwindMerge', 'extendTailwindMerge'],
  ['createTailwindMerge', 'createTwMerge'],
  ['getDefaultConfig', 'defaultConfig'],
  ['fromTheme', 'fromTheme'],
  ['validators', 'validators'],
  ['mergeConfigs', 'mergeConfigs'],
  ['ConfigExtension', 'ConfigExtension'],
  ['DefaultClassGroupIds', 'DefaultClassGroupIds'],
  ['DefaultThemeGroupIds', 'DefaultThemeGroupIds'],
]);

const packageOf = (module: string): OldPackage => (module === 'cnfast' ? 'cnfast' : module.startsWith('clsx') ? 'clsx' : 'tailwind-merge');

/** Where an old export lives in `cn`, or undefined when `cn` has no compatible export. */
function targetOf(module: OldModule, imported: string, typeOnly: boolean): Omit<PendingImport, 'local' | 'typeOnly'> | undefined {
  if (module === 'clsx') return { module: 'cn', imported: imported === 'default' ? 'clsx' : imported };
  if (module === 'clsx/lite') {
    if ((imported === 'clsx' || imported === 'default') && !typeOnly) return { module: 'cn/lite', imported: 'clsx' };
    return ['ClassValue', 'ClassArray', 'ClassDictionary'].includes(imported) ? { module: 'cn', imported } : undefined;
  }
  if (TAILWIND_ROOT_EXPORTS.has(imported)) return { module: 'cn', imported };
  const config = TAILWIND_CONFIG_EXPORTS.get(imported);
  return config === undefined ? undefined : { module: 'cn/config', imported: config };
}

type Identifier = Node & { name: string };
type Literal = Node & { value: unknown };
type Call = Node & { callee: Node; arguments: Node[] };
type Binding = { local: string; imported: string; module: OldModule; specifier: Specifier; declaration: ImportNode; typeOnly: boolean };

const paramName = (param: Node): string | undefined =>
  param.type === 'Identifier' ? (param as Identifier).name : param.type === 'RestElement' || param.type === 'AssignmentPattern' ? paramName((param.argument ?? param.left) as Node) : undefined;

const isFunction = (node: Node) => ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(node.type);

/**
 * Port of shadcn's `transformCnSource` for ES modules and Svelte components: moves clsx, tailwind-merge and cnfast imports
 * to `cn`, turns `twMerge(clsx(...))` into `cn(...)`, and replaces an exported `cn` helper built that way with a re-export.
 */
export function transformCn(target: string, content: string): CnResult {
  const unchanged = { content, migrated: [], remaining: remainingPackages(content), unsupported: [] };
  if (!/\.(svelte|[cm]?[jt]s)$/.test(target) || !/clsx|tailwind-merge|cnfast/.test(content)) return unchanged;
  const parsed = tryParseSource(target, content);
  if ('reason' in parsed) return { ...unchanged, unsupported: [{ reason: parsed.reason }] };
  const { ast, offset } = parsed;
  const nodes = [...walk(ast)];
  const ancestorsOf = new Map(nodes);
  const at = (node: Node) => [node.start - offset, node.end - offset] as const;
  const text = (node: Node) => content.slice(...at(node));
  const s = new MagicString(content);
  const migrated = new Set<OldPackage>();
  const unsupported: CnIssue[] = [];
  const pending: PendingImport[] = [];
  const replaced: (readonly [number, number])[] = [];
  const inReplaced = (node: Node) => replaced.some(([start, end]) => at(node)[0] >= start && at(node)[1] <= end);
  const programs = [ast.module, ast.instance].flatMap((script) => (script ? [script.content as unknown as Node & { body: Node[] }] : []));
  const removeStatement = (node: Node) => s.remove(...lineRange(content, at(node)));

  const sourceOf = (node: Node): Literal | undefined => {
    if (node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration' || node.type === 'ExportAllDeclaration' || node.type === 'ImportExpression') return (node.source as Literal | null) ?? undefined;
    const call = node as Call;
    if (node.type === 'CallExpression' && call.callee.type === 'Identifier' && (call.callee as Identifier).name === 'require') return call.arguments[0] as Literal | undefined;
    return undefined;
  };

  for (const [node] of nodes) {
    const source = sourceOf(node);
    if (source?.type !== 'Literal' || typeof source.value !== 'string') continue;
    if (source.value === 'cnfast') {
      s.overwrite(at(source)[0] + 1, at(source)[1] - 1, 'cn');
      migrated.add('cnfast');
    } else if (OLD_MODULES.includes(source.value) && node.type !== 'ImportDeclaration') {
      const packageName = packageOf(source.value);
      if (node.type === 'ImportExpression') unsupported.push({ packageName, reason: 'dynamic imports require manual migration' });
      else if (node.type === 'CallExpression') unsupported.push({ packageName, reason: 'CommonJS requires require manual migration' });
      else {
        const specifiers = (node.specifiers as Specifier[] | undefined) ?? [];
        if (specifiers.length === 0) unsupported.push({ packageName, reason: 'export-from declarations require manual migration' });
        for (const specifier of specifiers) unsupported.push({ packageName, symbol: text(specifier.local), reason: 'export-from declarations require manual migration' });
      }
    }
  }

  const bindings: Binding[] = [];
  let quote = "'";
  for (const [node] of nodes) {
    if (node.type !== 'ImportDeclaration') continue;
    const declaration = node as ImportNode;
    const module = declaration.source.value as OldModule;
    if (!OLD_MODULES.includes(module)) continue;
    if (bindings.length === 0) quote = content[at(declaration.source)[0]] ?? quote;
    if (declaration.specifiers.length === 0) unsupported.push({ packageName: packageOf(module), reason: 'side-effect imports are left unchanged' });
    for (const specifier of declaration.specifiers) {
      if (specifier.type === 'ImportNamespaceSpecifier') {
        unsupported.push({ packageName: packageOf(module), symbol: specifier.local.name, reason: 'namespace imports cannot be migrated safely' });
        continue;
      }
      const imported = specifier.type === 'ImportDefaultSpecifier' ? 'default' : specifier.imported?.type === 'Identifier' ? (specifier.imported as Identifier).name : String((specifier.imported as Literal).value);
      if (specifier.imported?.type === 'Literal') {
        unsupported.push({ packageName: packageOf(module), symbol: imported, reason: 'string-named imports cannot be migrated safely' });
        continue;
      }
      bindings.push({ local: specifier.local.name, imported, module, specifier, declaration, typeOnly: declaration.importKind === 'type' || specifier.importKind === 'type' });
    }
  }

  const isClsx = (binding: Binding) => binding.module.startsWith('clsx') && (binding.imported === 'default' || binding.imported === 'clsx') && !binding.typeOnly;
  const isTwMerge = (binding: Binding) => binding.module === 'tailwind-merge' && binding.imported === 'twMerge' && !binding.typeOnly;
  // A parameter of an enclosing function with the same name hides the import.
  const shadowed = (node: Node) =>
    ancestorsOf.get(node)?.some((ancestor) => isFunction(ancestor) && (ancestor.params as Node[]).some((param) => paramName(param) === (node as Identifier).name)) ?? false;
  const isCall = (node: Node | undefined, test: (binding: Binding) => boolean): node is Call =>
    node?.type === 'CallExpression' &&
    (node as Call).callee.type === 'Identifier' &&
    !shadowed((node as Call).callee) &&
    bindings.some((binding) => test(binding) && binding.local === ((node as Call).callee as Identifier).name);
  const identifiers = (name: string) => nodes.filter(([node]) => node.type === 'Identifier' && (node as Identifier).name === name && !shadowed(node));

  // A helper such as `export function cn(...inputs) { return twMerge(clsx(inputs)); }`, referenced only by exports, becomes `export { cn } from 'cn'`.
  const removedExports = new Set<Node>();
  for (const statement of programs.flatMap((program) => program.body)) {
    const declaration = statement.type === 'ExportNamedDeclaration' || statement.type === 'ExportDefaultDeclaration' ? (statement.declaration as Node | null) : statement;
    if (!declaration) continue;
    const declarators = (declaration.declarations as (Node & { id: Node; init: Node | null })[] | undefined) ?? [];
    const [name, fn] =
      declaration.type === 'FunctionDeclaration' && declaration.id
        ? [declaration.id as Identifier, declaration]
        : declaration.type === 'VariableDeclaration' && declarators.length === 1 && declarators[0]!.id.type === 'Identifier' && declarators[0]!.init && isFunction(declarators[0]!.init)
          ? [declarators[0]!.id as Identifier, declarators[0]!.init]
          : [];
    if (!name || !fn) continue;
    const params = fn.params as (Node & { argument?: Identifier })[];
    const body = fn.body as Node & { body?: (Node & { argument?: Node })[] };
    const rest = params.length === 1 && params[0]!.type === 'RestElement' && params[0]!.argument?.type === 'Identifier' ? params[0]!.argument.name : undefined;
    const expression = body.type !== 'BlockStatement' ? body : body.body?.length === 1 && body.body[0]!.type === 'ReturnStatement' ? body.body[0]!.argument : undefined;
    const inner = isCall(expression, isTwMerge) && expression.arguments.length === 1 ? expression.arguments[0] : undefined;
    const argument = isCall(inner, isClsx) && inner.arguments.length === 1 ? inner.arguments[0]! : undefined;
    const spread = argument?.type === 'SpreadElement' ? (argument.argument as Node) : argument;
    if (rest === undefined || spread?.type !== 'Identifier' || (spread as Identifier).name !== rest) continue;

    const references = identifiers(name.name).filter(([node]) => node !== name);
    if (!references.every(([, ancestors]) => ancestors.at(-1)?.type === 'ExportSpecifier')) continue;
    const exported = [
      ...(statement.type === 'ExportNamedDeclaration' ? [name.name] : statement.type === 'ExportDefaultDeclaration' ? ['default'] : []),
      ...references.map(([, ancestors]) => {
        const specifier = ancestors.at(-1)!;
        removedExports.add(specifier);
        const exportedNode = specifier.exported as Identifier | Literal;
        return exportedNode.type === 'Identifier' ? (exportedNode as Identifier).name : String((exportedNode as Literal).value);
      }),
    ];
    if (exported.length === 0) continue;
    s.overwrite(...at(statement), `export { ${exported.map((exportedName) => (exportedName === 'cn' ? 'cn' : `cn as ${exportedName}`)).join(', ')} } from ${quote}cn${quote};`);
    replaced.push(at(statement));
    migrated.add('clsx').add('tailwind-merge');
  }
  for (const [node] of nodes) {
    const specifiers = node.type === 'ExportNamedDeclaration' && !node.source ? (node.specifiers as Node[]) : [];
    const kept = specifiers.filter((specifier) => !removedExports.has(specifier));
    if (kept.length === specifiers.length) continue;
    if (kept.length === 0) removeStatement(node);
    else s.overwrite(...at(node), `export { ${kept.map(text).join(', ')} };`);
  }

  const compositions: { call: Call; args: string }[] = [];
  for (const [node, ancestors] of nodes) {
    if (!isCall(node, isTwMerge) || inReplaced(node) || ancestors.some((ancestor) => compositions.some(({ call }) => call === ancestor))) continue;
    if (!node.arguments.some((argument) => isCall(argument, isClsx))) continue;
    const args = node.arguments.flatMap((argument) => {
      if (!isCall(argument, isClsx)) return [text(argument)];
      return argument.arguments.map((inner) => {
        if (inner.type !== 'Identifier') return text(inner);
        const fn = ancestorsOf.get(inner)?.findLast(isFunction);
        const isRest = (fn?.params as (Node & { argument?: Identifier })[] | undefined)?.some((param) => param.type === 'RestElement' && param.argument?.name === (inner as Identifier).name);
        return isRest ? `...${text(inner)}` : text(inner);
      });
    });
    compositions.push({ call: node, args: args.join(', ') });
  }
  if (compositions.length > 0) {
    const names = new Set(nodes.flatMap(([node]) => (node.type === 'Identifier' ? [(node as Identifier).name] : [])));
    const local = ['cn', 'cnMerge', ...Array.from({ length: names.size }, (_, i) => `cnMerge${i + 2}`)].find((candidate) => !names.has(candidate))!;
    for (const { call, args } of compositions) {
      s.overwrite(...at(call), `${local}(${args})`);
      replaced.push(at(call));
    }
    pending.push({ module: 'cn', imported: 'cn', local, typeOnly: false });
    migrated.add('clsx').add('tailwind-merge');
  }

  const isLive = (local: string) => identifiers(local).some(([node, ancestors]) => !inReplaced(node) && !ancestors.some((ancestor) => ancestor.type === 'ImportDeclaration'));
  const unsupportedReason = (binding: Binding) => {
    const references = identifiers(binding.local).filter(([, ancestors]) => !ancestors.some((ancestor) => ancestor.type === 'ImportDeclaration'));
    if (binding.imported === 'validators') {
      const callable = references.some(([node, ancestors]) => {
        const [parent, grandparent] = [ancestors.at(-1), ancestors.at(-2)];
        if (parent?.type === 'MemberExpression' && parent.object === node && grandparent?.type === 'CallExpression' && grandparent.callee === parent) return true;
        return parent?.type === 'VariableDeclarator' && (parent.id as Node).type === 'ObjectPattern' && parent.init === node;
      });
      if (callable) return 'callable validators are not supported by cn';
    }
    if (binding.imported === 'createTailwindMerge' && references.some(([node, ancestors]) => ancestors.at(-1)?.type === 'CallExpression' && (ancestors.at(-1) as Call).callee === node && (ancestors.at(-1) as Call).arguments.length > 1)) {
      return 'variadic createTailwindMerge calls are not supported by cn';
    }
    return undefined;
  };

  const removedSpecifiers = new Set<Specifier>();
  for (const binding of bindings) {
    const packageName = packageOf(binding.module);
    if (binding.imported === 'default' && packageName === 'tailwind-merge') {
      unsupported.push({ packageName, symbol: binding.local, reason: 'tailwind-merge has no compatible default import mapping' });
      continue;
    }
    const target = targetOf(binding.module, binding.imported, binding.typeOnly);
    const reason = target ? unsupportedReason(binding) : /^experimental/i.test(binding.imported) ? 'experimentalParseClassName is not supported by cn' : 'no compatible cn export is available';
    if (!target || reason) {
      unsupported.push({ packageName, symbol: binding.imported, reason: reason! });
      continue;
    }
    if (isLive(binding.local)) pending.push({ ...target, local: binding.local, typeOnly: binding.typeOnly });
    removedSpecifiers.add(binding.specifier);
    migrated.add(packageName);
  }

  const touched = [...new Set(bindings.filter((binding) => removedSpecifiers.has(binding.specifier)).map((binding) => binding.declaration))];
  const modules = [...new Set(pending.map((entry) => entry.module))];
  const imports = modules.map((module) => {
    const specifiers = [...new Set(pending.filter((entry) => entry.module === module).map((entry) => `${entry.typeOnly ? 'type ' : ''}${entry.imported}${entry.local === entry.imported ? '' : ` as ${entry.local}`}`))];
    return `import { ${specifiers.join(', ')} } from ${quote}${module}${quote};`;
  });
  const anchor = touched[0] ?? programs[0]?.body[0];
  if (imports.length > 0 && anchor) {
    const lineStart = content.lastIndexOf('\n', at(anchor)[0] - 1) + 1;
    const indent = content.slice(lineStart, at(anchor)[0]);
    s.appendLeft(lineStart, imports.map((line) => `${indent}${line}\n`).join(''));
  }
  for (const declaration of touched) {
    const kept = declaration.specifiers.filter((specifier) => !removedSpecifiers.has(specifier));
    if (kept.length === 0) {
      removeStatement(declaration);
      continue;
    }
    s.overwrite(...at(declaration), importWith(declaration, kept, text));
  }

  if (!s.hasChanged()) return { ...unchanged, unsupported: dedupe(unsupported) };
  // Removing a module's leading imports would leave the blank line that followed them at the top.
  const transformed = content.startsWith('\n') ? s.toString() : s.toString().replace(/^\n+/, '');
  return { content: transformed, migrated: [...migrated], remaining: remainingPackages(transformed), unsupported: dedupe(unsupported) };
}

function dedupe(issues: CnIssue[]): CnIssue[] {
  return issues.filter((issue, index) => issues.findIndex((other) => other.packageName === issue.packageName && other.symbol === issue.symbol && other.reason === issue.reason) === index);
}

/** The old packages a file still imports or requires. */
export function remainingPackages(content: string): OldPackage[] {
  return OLD_PACKAGES.filter((name) => new RegExp(`(?:from\\s*|import\\s*\\(|require\\s*\\()\\s*["']${name}(?:/lite)?["']`).test(content));
}
