// A block-level CSS reader. It understands exactly what the style and theme sheets use: at-rules,
// nested rules and declarations. It does not interpret selectors or values.

export type CssNode =
  | { kind: 'decl'; prop: string; value: string }
  | { kind: 'at'; name: string; prelude: string; children: CssNode[] | null }
  | { kind: 'rule'; selector: string; children: CssNode[] };

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Splits `css` at the top-level `;`, `{` and `}` of each block, ignoring those inside quotes, parens and brackets. */
export function parseCss(css: string, file: string): CssNode[] {
  const text = stripComments(css);
  let pos = 0;

  function fail(message: string): never {
    const line = text.slice(0, pos).split('\n').length;
    throw new Error(`${file}:${line}: ${message}`);
  }

  function readBlock(top: boolean): CssNode[] {
    const nodes: CssNode[] = [];
    let current = '';
    let quote = '';
    let depth = 0;
    while (pos < text.length) {
      const ch = text[pos]!;
      if (quote) {
        if (ch === '\\') current += text[pos++]!;
        else if (ch === quote) quote = '';
      } else if (ch === '"' || ch === "'") quote = ch;
      else if (ch === '(' || ch === '[') depth++;
      else if (ch === ')' || ch === ']') depth--;
      else if (depth === 0 && (ch === ';' || ch === '{' || ch === '}')) {
        pos++;
        const head = current.trim();
        current = '';
        if (ch === '{') {
          if (!head) fail('block without a selector');
          const children = readBlock(false);
          nodes.push(head.startsWith('@') ? atNode(head, children) : { kind: 'rule', selector: head, children });
        } else {
          if (head) nodes.push(head.startsWith('@') ? atNode(head, null) : declNode(head));
          if (ch === '}') {
            if (top) fail('unmatched }');
            return nodes;
          }
        }
        continue;
      }
      current += text[pos++]!;
    }
    if (!top) fail('unclosed block');
    if (current.trim()) fail(`trailing text "${current.trim().slice(0, 40)}"`);
    return nodes;
  }

  function atNode(head: string, children: CssNode[] | null): CssNode {
    const [, name = '', prelude = ''] = /^@([\w-]+)\s*([\s\S]*)$/.exec(head) ?? [];
    return { kind: 'at', name, prelude: prelude.trim(), children };
  }

  function declNode(head: string): CssNode {
    const colon = head.indexOf(':');
    if (colon < 0) fail(`expected a declaration, got "${head.slice(0, 40)}"`);
    return { kind: 'decl', prop: head.slice(0, colon).trim(), value: head.slice(colon + 1).trim() };
  }

  return readBlock(true);
}

export const declarations = (nodes: CssNode[]) =>
  nodes.flatMap((node) => (node.kind === 'decl' ? [node] : []));
