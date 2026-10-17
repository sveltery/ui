// Converts shadcn's React chart gallery into Svelte pages on @sveltery/recharts and local shadcn helpers.
// Usage: node scripts/convert-shadcn-charts.mjs <shadcn charts dir> <output dir> [--helpers <dir>] [--match <regex>] [--only <name>] [--check]
// Each chart-<name>.tsx becomes <output>/chart-<name>/+page.svelte and +page.ts. The pages import the card, chart and select
// helpers from --helpers (default <output>/shadcn), and every lucide-react icon becomes a component in <helpers>/icons/.
// The converter knows the JSX shapes the gallery uses and throws on anything else, so a new upstream shape fails loudly.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import ts from 'typescript';
import { ATTRIBUTE_ALIASES, EVENT_ALIASES } from '../src/util/reactDomTables.ts';

const RECHARTS = '@sveltery/recharts';
const HELPER_MODULE = /^@\/registry\/new-york-v4\/ui\/(.+)$/;
const SELF = 'packages/recharts/scripts/convert-shadcn-charts.mjs';

// Props that take an element or a render function upstream, and the types of the snippet that replaces them.
const SNIPPETS = {
  Tooltip: { content: { params: ['TooltipContentArgs'], chart: ['TooltipContentArgs'] } },
  Legend: { content: { params: ['SvelteArgs<LegendContentProps>'], recharts: ['SvelteArgs', 'LegendContentProps'] } },
  Line: {
    dot: { params: ['SvelteArgs<DotItemDotProps>'], recharts: ['SvelteArgs', 'DotItemDotProps'] },
    activeDot: { params: ['SvelteArgs<ActiveDotProps>'], recharts: ['SvelteArgs', 'ActiveDotProps'] },
  },
  Bar: { shape: { params: ['SvelteArgs<BarShapeProps>'], recharts: ['SvelteArgs', 'BarShapeProps'] } },
  ChartTooltipContent: {
    formatter: {
      params: ['TooltipValueType', 'TooltipNameType', 'TooltipPayloadEntry', 'number', "TooltipPayloadEntry['payload']"],
      recharts: ['TooltipValueType', 'TooltipNameType', 'TooltipPayloadEntry'],
    },
  },
};
SNIPPETS.ChartTooltip = SNIPPETS.Tooltip;
SNIPPETS.ChartLegend = SNIPPETS.Legend;

const VOID_ELEMENTS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const UNWRAP = (node) => (ts.isParenthesizedExpression(node) ? UNWRAP(node.expression) : node);
const isJsx = (node) => ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node) || ts.isJsxFragment(node);
const isJsxLike = (node) => {
  const n = UNWRAP(node);
  return isJsx(n) || (ts.isConditionalExpression(n) && (isJsxLike(n.whenTrue) || isJsxLike(n.whenFalse)));
};
const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

function returnsJsx(fn) {
  if (!ts.isBlock(fn.body)) return isJsxLike(fn.body);
  let found = false;
  const visit = (node) => {
    if (ts.isFunctionLike(node)) return;
    if (ts.isReturnStatement(node) && node.expression && isJsxLike(node.expression)) found = true;
    ts.forEachChild(node, visit);
  };
  ts.forEachChild(fn.body, visit);
  return found;
}

class Converter {
  constructor(path, helpers) {
    this.name = basename(path, '.tsx');
    this.file = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    this.helpers = helpers;
    this.imports = new Map();
    this.icons = new Set();
    this.setters = new Map();
  }

  fail(node, message) {
    const { line } = this.file.getLineAndCharacterOfPosition(node.getStart(this.file));
    throw new Error(`${this.name}.tsx:${line + 1}: ${message}: ${node.getText(this.file).slice(0, 80)}`);
  }

  use(module, name, type) {
    if (!this.imports.has(module)) this.imports.set(module, new Map());
    const names = this.imports.get(module);
    names.set(name, type && names.get(name) !== false);
  }

  // Re-indents a node's source so its first line sits at `indent` and later lines keep their offset from it.
  reindent(text, node, indent) {
    const start = node.getStart(this.file);
    const lineStart = this.file.text.lastIndexOf('\n', start - 1) + 1;
    const base = /^\s*/.exec(this.file.text.slice(lineStart, start))[0];
    return text
      .split('\n')
      .map((line, i) => (i === 0 ? line : indent + (line.startsWith(base) ? line.slice(base.length) : line.trimStart())))
      .join('\n');
  }

  // A node's TypeScript, with state setters turned into assignments and React-only casts dropped.
  code(node, indent = '') {
    const start = node.getStart(this.file);
    const edits = [];
    const visit = (n) => {
      if (isJsx(n)) this.fail(n, 'JSX where an expression is expected');
      if (ts.isAsExpression(n) && n.type.getText(this.file).startsWith('React.')) {
        edits.push({ start: n.expression.getEnd(), end: n.getEnd(), text: '' });
        return visit(n.expression);
      }
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && this.setters.has(n.expression.text)) {
        if (n.arguments.length !== 1) this.fail(n, 'a state setter call needs one argument');
        edits.push({ start: n.getStart(this.file), end: n.getEnd(), text: `(${this.setters.get(n.expression.text)} = ${this.code(n.arguments[0])})` });
        return;
      }
      if (ts.isIdentifier(n) && this.setters.has(n.text)) {
        edits.push({ start: n.getStart(this.file), end: n.getEnd(), text: `(value) => (${this.setters.get(n.text)} = value)` });
        return;
      }
      if (ts.isPropertyAccessExpression(n) && n.expression.getText(this.file) === 'React') this.fail(n, 'a React API the converter does not know');
      ts.forEachChild(n, visit);
    };
    visit(node);
    const text = edits.sort((a, b) => b.start - a.start).reduce((t, e) => t.slice(0, e.start - start) + e.text + t.slice(e.end - start), node.getText(this.file));
    return this.reindent(text, node, indent);
  }

  convert() {
    const script = [];
    let template;
    for (const statement of this.file.statements) {
      if (ts.isImportDeclaration(statement)) this.importDeclaration(statement);
      else if (ts.isExpressionStatement(statement) && ts.isStringLiteral(statement.expression)) continue;
      else if (ts.isVariableStatement(statement)) {
        // Exported constants are registry metadata (description, iframeHeight, containerClassName), not chart code.
        if (statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) continue;
        script.push(`  ${this.code(statement, '  ')}`);
      } else if (ts.isFunctionDeclaration(statement) && statement.body) {
        template = this.component(statement.body, script);
      } else this.fail(statement, 'a top-level statement the converter does not know');
    }
    if (template === undefined) throw new Error(`${this.name}.tsx has no component.`);
    const lines = [
      '<script lang="ts">',
      `  // Generated by ${SELF} from shadcn's ${this.name}.tsx. Do not edit.`,
      ...this.importLines(),
      '',
      script.join('\n\n'),
      '</script>',
      '',
      '<div class="bg-background *:data-[slot=card]:has-[[data-slot=chart]]:shadow-none">',
      `  ${template}`,
      '</div>',
      '',
    ];
    return lines.join('\n');
  }

  importDeclaration(statement) {
    const source = statement.moduleSpecifier.text;
    const clause = statement.importClause;
    if (source === 'react') return;
    const named = clause?.namedBindings && ts.isNamedImports(clause.namedBindings) ? clause.namedBindings.elements : [];
    if (clause?.name || !named.length) this.fail(statement, 'only named imports are converted');
    for (const element of named) {
      const name = element.name.text;
      const type = clause.isTypeOnly || element.isTypeOnly;
      if (source === 'recharts' || source.startsWith('recharts/')) this.use(RECHARTS, name, type);
      else if (source === 'lucide-react') {
        this.icons.add(name);
        this.use(`./icons/${name}.svelte`, name, false);
      } else if (HELPER_MODULE.test(source)) this.use(`./${HELPER_MODULE.exec(source)[1]}`, name, type);
      else this.fail(statement, 'an import the converter does not know');
    }
  }

  importLines() {
    const lines = [];
    const order = [...this.imports.keys()].sort((a, b) => (a === RECHARTS ? -1 : b === RECHARTS ? 1 : a.localeCompare(b)));
    for (const module of order) {
      const names = this.imports.get(module);
      const specifier = module.startsWith('./') ? this.helpers + module.slice(1) : module;
      if (module.startsWith('./icons/')) {
        lines.push(`  import ${[...names.keys()][0]} from '${specifier}';`);
        continue;
      }
      const list = [...names].map(([name, type]) => (type ? `type ${name}` : name));
      lines.push(`  import { ${list.join(', ')} } from '${specifier}';`);
    }
    return lines;
  }

  component(body, script) {
    let template;
    for (const statement of body.statements) {
      if (ts.isReturnStatement(statement) && statement.expression) {
        template = this.expressionTemplate(statement.expression, '  ');
      } else if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) script.push(this.componentDeclaration(declaration));
      } else this.fail(statement, 'a component statement the converter does not know');
    }
    return template;
  }

  componentDeclaration(declaration) {
    const init = declaration.initializer;
    const callee = init && ts.isCallExpression(init) ? init.expression.getText(this.file) : '';
    if (callee === 'React.useState') {
      const [value, setter] = ts.isArrayBindingPattern(declaration.name) ? declaration.name.elements.map((e) => e.getText(this.file)) : [];
      if (!value || !setter) this.fail(declaration, 'useState without a [value, setter] pair');
      this.setters.set(setter, value);
      const type = init.typeArguments ? `<${init.typeArguments.map((t) => t.getText(this.file)).join(', ')}>` : '';
      return `  let ${value} = $state${type}(${init.arguments.map((a) => this.code(a, '  ')).join(', ')});`;
    }
    if (callee === 'React.useMemo') return `  const ${declaration.name.getText(this.file)} = $derived.by(${this.code(init.arguments[0], '  ')});`;
    return `  const ${declaration.name.getText(this.file)} = $derived(${this.code(init, '  ')});`;
  }

  // An expression in child position or a returned one: JSX, a conditional between JSX, or null.
  expressionTemplate(node, indent) {
    const n = UNWRAP(node);
    if (n.kind === ts.SyntaxKind.NullKeyword) return '';
    if (ts.isJsxFragment(n)) return this.children(n.children, indent).join('');
    if (isJsx(n)) return this.element(n, indent);
    if (ts.isConditionalExpression(n)) {
      const whenFalse = this.expressionTemplate(n.whenFalse, indent);
      return `{#if ${this.code(n.condition, indent)}}${this.expressionTemplate(n.whenTrue, indent)}${whenFalse ? `{:else}${whenFalse}` : ''}{/if}`;
    }
    this.fail(n, 'an expression that does not render JSX');
  }

  // A function body that renders: early `return null` guards, const declarations, then one returned expression.
  bodyTemplate(body, indent) {
    if (!ts.isBlock(body)) return { template: this.expressionTemplate(body, indent), key: this.keyOf(body) };
    const parts = [];
    let close = '';
    let key;
    for (const statement of body.statements) {
      if (ts.isIfStatement(statement) && !statement.elseStatement && this.returnsNull(statement.thenStatement)) {
        parts.push(`{#if !(${this.code(statement.expression, indent)})}`);
        close = `{/if}${close}`;
      } else if (ts.isVariableStatement(statement) && statement.declarationList.flags & ts.NodeFlags.Const) {
        // Declaration tags are not reactive on their own, so anything but a literal goes through $derived.
        for (const d of statement.declarationList.declarations) {
          const value = this.code(d.initializer, indent);
          parts.push(`{const ${d.name.getText(this.file)} = ${ts.isLiteralExpression(d.initializer) ? value : `$derived(${value})`}}`);
        }
      } else if (ts.isReturnStatement(statement) && statement.expression) {
        parts.push(this.expressionTemplate(statement.expression, indent));
        key = this.keyOf(statement.expression);
      } else this.fail(statement, 'a statement in a render function the converter does not know');
    }
    return { template: parts.join('') + close, key };
  }

  returnsNull(statement) {
    const inner = ts.isBlock(statement) && statement.statements.length === 1 ? statement.statements[0] : statement;
    return ts.isReturnStatement(inner) && inner.expression?.kind === ts.SyntaxKind.NullKeyword;
  }

  keyOf(node) {
    const n = UNWRAP(node);
    const opening = ts.isJsxElement(n) ? n.openingElement : ts.isJsxSelfClosingElement(n) ? n : undefined;
    const key = opening?.attributes.properties.find((a) => ts.isJsxAttribute(a) && a.name.getText(this.file) === 'key');
    return key?.initializer && ts.isJsxExpression(key.initializer) ? key.initializer.expression : undefined;
  }

  // JSX children as template pieces, with JSX's whitespace rules applied to text.
  children(nodes, indent) {
    const pieces = [];
    for (const child of nodes) {
      if (ts.isJsxText(child)) {
        const text = jsxText(child.text);
        if (text) pieces.push(text.replace(/[{}<]/g, (c) => `&#${c.charCodeAt(0)};`));
      } else if (ts.isJsxExpression(child)) {
        if (child.expression) pieces.push(this.childExpression(child.expression, indent));
      } else if (ts.isJsxFragment(child)) pieces.push(...this.children(child.children, indent));
      else pieces.push(this.element(child, indent));
    }
    return pieces;
  }

  childExpression(node, indent) {
    const n = UNWRAP(node);
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && isJsxLike(n.right)) {
      return `{#if ${this.code(n.left, indent)}}${this.expressionTemplate(n.right, indent)}{/if}`;
    }
    if (ts.isConditionalExpression(n) && isJsxLike(n)) return this.expressionTemplate(n, indent);
    if (isJsx(n)) return this.expressionTemplate(n, indent);
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.name.text === 'map') {
      const [callback] = n.arguments;
      if (callback && ts.isArrowFunction(callback) && returnsJsx(callback)) return this.each(n.expression.expression, callback, indent);
    }
    return `{${this.code(n, indent)}}`;
  }

  each(list, callback, indent) {
    const [item, index] = callback.parameters.map((p) => p.name.getText(this.file));
    const { template, key } = this.bodyTemplate(callback.body, `${indent}  `);
    const params = new Set([item, index].filter(Boolean));
    const keyUsesOnlyParams = key && [...identifiers(key)].every((name) => params.has(name) || !this.declaredIn(callback.body, name));
    const keyText = keyUsesOnlyParams ? this.code(key) : item;
    return `{#each ${this.code(list, indent)} as ${item}${index ? `, ${index}` : ''} (${keyText})}\n${indent}  ${template}\n${indent}{/each}`;
  }

  declaredIn(body, name) {
    return ts.isBlock(body) && body.statements.some((s) => ts.isVariableStatement(s) && s.declarationList.declarations.some((d) => d.name.getText(this.file) === name));
  }

  element(node, indent, extra = []) {
    if (ts.isJsxFragment(node)) return this.children(node.children, indent).join('');
    const opening = ts.isJsxElement(node) ? node.openingElement : node;
    const tag = opening.tagName.getText(this.file);
    const intrinsic = /^[a-z]/.test(tag);
    const attributes = [];
    const snippets = [];
    for (const attribute of opening.attributes.properties) {
      if (ts.isJsxSpreadAttribute(attribute)) {
        attributes.push(`{...${this.code(attribute.expression, `${indent}  `)}}`);
        continue;
      }
      const name = attribute.name.getText(this.file);
      if (name === 'key') continue;
      const target = intrinsic ? domName(name) : name === 'className' ? 'class' : name;
      const init = attribute.initializer;
      if (!init) attributes.push(target);
      else if (ts.isStringLiteral(init)) attributes.push(/[{}]/.test(init.text) ? `${target}={${JSON.stringify(init.text)}}` : `${target}="${init.text}"`);
      else {
        const value = UNWRAP(init.expression);
        if (isJsx(value)) snippets.push(this.elementSnippet(tag, name, value, `${indent}  `));
        else if ((ts.isArrowFunction(value) || ts.isFunctionExpression(value)) && returnsJsx(value)) snippets.push(this.functionSnippet(tag, name, value, `${indent}  `));
        else if (intrinsic && name === 'style') attributes.push(...this.styleDirectives(value, `${indent}  `));
        else {
          const text = this.code(value, `${indent}  `);
          attributes.push(text === target ? `{${text}}` : `${target}={${text}}`);
        }
      }
    }
    attributes.push(...extra);
    const kids = [...snippets, ...(ts.isJsxElement(node) ? this.children(node.children, `${indent}  `) : [])];
    const open = layoutTag(tag, attributes, indent);
    const space = open.endsWith('\n' + indent) ? '' : ' ';
    if (!kids.length) return intrinsic && !VOID_ELEMENTS.has(tag) && !isSvgContext(node) ? `${open}></${tag}>` : `${open}${space}/>`;
    const block = kids.every((k) => k.startsWith('<') || k.startsWith('{#'));
    const inner = block ? kids.map((k) => `\n${indent}  ${k}`).join('') + `\n${indent}` : kids.join('');
    return `${open}>${inner}</${tag}>`;
  }

  // The parameter types of the snippet that replaces a prop, importing the names the first `count` of them use.
  snippetTypes(tag, prop, node, count) {
    const spec = SNIPPETS[tag]?.[prop];
    if (!spec) this.fail(node, `no snippet type for ${tag} ${prop}`);
    const types = spec.params.slice(0, count);
    const used = (name) => types.some((type) => new RegExp(`\\b${name}\\b`).test(type));
    for (const name of (spec.recharts ?? []).filter(used)) this.use(RECHARTS, name, true);
    for (const name of (spec.chart ?? []).filter(used)) this.use('./chart', name, true);
    return types;
  }

  // An element passed as a prop: cloneElement gives it the parent's props, so they spread over its own.
  elementSnippet(tag, prop, value, indent) {
    const [type] = this.snippetTypes(tag, prop, value, 1);
    if (ts.isJsxElement(value) && value.children.some((c) => !ts.isJsxText(c) || c.text.trim())) this.fail(value, 'an element prop with children');
    const body = this.element(value, `${indent}  `, ['{...props}']);
    return `{#snippet ${prop}(props: ${type})}\n${indent}  ${body}\n${indent}{/snippet}`;
  }

  functionSnippet(tag, prop, fn, indent) {
    const types = this.snippetTypes(tag, prop, fn, fn.parameters.length);
    const { template } = this.bodyTemplate(fn.body, `${indent}  `);
    const params = fn.parameters.map((p, i) => `${this.parameter(p.name, template)}: ${types[i]}`);
    return `{#snippet ${prop}(${params.join(', ')})}\n${indent}  ${template}\n${indent}{/snippet}`;
  }

  // A snippet parameter, less the destructured names only a dropped `key` used.
  parameter(name, template) {
    if (!ts.isObjectBindingPattern(name)) return name.getText(this.file);
    const kept = name.elements.filter((e) => e.dotDotDotToken || new RegExp(`\\b${e.name.getText(this.file)}\\b`).test(template));
    return `{ ${kept.map((e) => e.getText(this.file)).join(', ')} }`;
  }

  styleDirectives(value, indent) {
    const object = ts.isAsExpression(value) ? UNWRAP(value.expression) : value;
    if (!ts.isObjectLiteralExpression(object)) this.fail(value, 'a style that is not an object literal');
    return object.properties.map((p) => {
      if (!ts.isPropertyAssignment(p)) this.fail(p, 'a style entry that is not a plain property');
      const key = ts.isStringLiteral(p.name) ? p.name.text : p.name.getText(this.file);
      if (ts.isNumericLiteral(p.initializer)) this.fail(p, 'a numeric style value');
      return `style:${key.startsWith('--') ? key : kebab(key)}={${this.code(p.initializer, indent)}}`;
    });
  }
}

function domName(name) {
  if (name === 'className') return 'class';
  if (/^on[A-Z]/.test(name)) return `on${EVENT_ALIASES.get(name) ?? name.slice(2).toLowerCase()}`;
  return ATTRIBUTE_ALIASES.get(name) ?? name;
}

function isSvgContext(node) {
  for (let n = node; n; n = n.parent) {
    if (ts.isJsxElement(n) && n.openingElement.tagName.getText() === 'defs') return true;
  }
  return false;
}

function identifiers(node) {
  const names = new Set();
  const visit = (n) => {
    if (ts.isIdentifier(n) && !(ts.isPropertyAccessExpression(n.parent) && n.parent.name === n)) names.add(n.text);
    ts.forEachChild(n, visit);
  };
  visit(node);
  return names;
}

function layoutTag(tag, attributes, indent) {
  const inline = `<${tag}${attributes.map((a) => ` ${a}`).join('')}`;
  if (inline.length + indent.length <= 140 && !inline.includes('\n')) return inline;
  return `<${tag}${attributes.map((a) => `\n${indent}  ${a}`).join('')}\n${indent}`;
}

// Babel's cleanJSXElementLiteralChild: drop lines that hold only whitespace, trim around line breaks, join with spaces.
function jsxText(raw) {
  const lines = raw.split(/\r\n|\n|\r/);
  let lastNonEmpty = 0;
  lines.forEach((line, i) => {
    if (/[^ \t]/.test(line)) lastNonEmpty = i;
  });
  let out = '';
  lines.forEach((line, i) => {
    let text = line.replace(/\t/g, ' ');
    if (i !== 0) text = text.replace(/^[ ]+/, '');
    if (i !== lines.length - 1) text = text.replace(/[ ]+$/, '');
    if (text) out += i !== lastNonEmpty ? `${text} ` : text;
  });
  return out;
}

function icon(name) {
  return `<script lang="ts">
  // Generated by ${SELF}: lucide-react's ${name} on the lucide icon data. Do not edit.
  import { ${name} } from 'lucide';
  import type { SVGAttributes } from 'svelte/elements';
  import LucideIcon from '../LucideIcon.svelte';

  let props: SVGAttributes<SVGSVGElement> = $props();
</script>

<LucideIcon icon={${name}} iconName="${kebab(name)}" {...props} />
`;
}

const args = process.argv.slice(2);
const option = (flag) => {
  const i = args.indexOf(flag);
  if (i < 0) return undefined;
  const [value] = args.splice(i, 2).slice(1);
  return value;
};
const check = args.includes('--check');
const only = option('--only');
const match = new RegExp(option('--match') ?? '^chart-(area|bar|line|tooltip)-');
const [chartsDir, outDir] = args.filter((a) => a !== '--check');
if (!chartsDir || !outDir) throw new Error('Pass the shadcn charts directory and the output directory.');
const helpersDir = option('--helpers') ?? join(outDir, 'shadcn');

const outputs = new Map();
for (const file of readdirSync(chartsDir).filter((f) => f.endsWith('.tsx')).sort()) {
  const name = basename(file, '.tsx');
  if (!match.test(name) || (only && name !== only)) continue;
  const pageDir = join(outDir, name);
  const helpers = relative(pageDir, helpersDir) || '.';
  const converter = new Converter(join(chartsDir, file), helpers.startsWith('.') ? helpers : `./${helpers}`);
  outputs.set(join(pageDir, '+page.svelte'), converter.convert());
  outputs.set(join(pageDir, '+page.ts'), 'export const ssr = false;\n');
  for (const name of converter.icons) outputs.set(join(helpersDir, 'icons', `${name}.svelte`), icon(name));
}

let stale = 0;
for (const [path, text] of outputs) {
  if (check) {
    if (!existsSync(path) || readFileSync(path, 'utf8') !== text) {
      console.error(`${path} is out of date.`);
      stale++;
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, text);
  }
}
if (stale) process.exit(1);
console.log(`${check ? 'Checked' : 'Wrote'} ${outputs.size} files.`);
