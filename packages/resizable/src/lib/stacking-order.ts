const willChangeProps = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;

function parentOf(node: Node): Node | null {
  const { parentNode } = node;
  return parentNode instanceof ShadowRoot ? parentNode.host : parentNode;
}

function ancestorsOf(node: Node | null): Node[] {
  const ancestors: Node[] = [];
  for (; node; node = parentOf(node)) ancestors.push(node);
  return ancestors;
}

function isFlexItem(node: Element): boolean {
  const parent = parentOf(node);
  const display = getComputedStyle(parent instanceof Element ? parent : node).display;
  return display === 'flex' || display === 'inline-flex';
}

function createsStackingContext(node: Element): boolean {
  const style = getComputedStyle(node);
  return (
    style.position === 'fixed' ||
    (style.zIndex !== 'auto' && (style.position !== 'static' || isFlexItem(node))) ||
    +style.opacity < 1 ||
    style.transform !== 'none' ||
    style.mixBlendMode !== 'normal' ||
    style.filter !== 'none' ||
    style.isolation === 'isolate' ||
    willChangeProps.test(style.willChange)
  );
}

function zIndexOf(nodes: Node[]): number {
  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index];
    if (node instanceof Element && createsStackingContext(node)) return Number(getComputedStyle(node).zIndex) || 0;
  }
  return 0;
}

/** Returns 1 when `a` paints in front of `b`, otherwise -1. */
export function compare(a: Element, b: Element): number {
  const ancestors = { a: ancestorsOf(a), b: ancestorsOf(b) };
  let common: Node | undefined;
  while (ancestors.a.at(-1) === ancestors.b.at(-1) && ancestors.a.length) {
    common = ancestors.a.pop();
    ancestors.b.pop();
  }
  const z = { a: zIndexOf(ancestors.a), b: zIndexOf(ancestors.b) };
  if (z.a === z.b && common) {
    const children = common.childNodes;
    for (let index = children.length - 1; index >= 0; index--) {
      if (children[index] === ancestors.a.at(-1)) return 1;
      if (children[index] === ancestors.b.at(-1)) return -1;
    }
  }
  return Math.sign(z.a - z.b);
}
