export type TocItem = { title: string; url: string; depth: number };

type MdNode = { type: string; depth?: number; value?: string; url?: string; children?: MdNode[]; data?: Record<string, unknown> };

// mdsvex escapes code before remark plugins run, so decode it back for titles and slugs.
const decode = (value: string) => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#123;/g, '{').replace(/&#125;/g, '}').replace(/&amp;/g, '&');
const text = (node: MdNode): string => (node.value !== undefined ? decode(node.value) : (node.children ?? []).map(text).join(''));
const hasLink = (node: MdNode): boolean => node.type === 'link' || (node.children ?? []).some(hasLink);

/** github-slugger's rule, which upstream's fumadocs uses: keep letters, marks, numbers, `_`, `-` and spaces. */
export const slugify = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');

const span = (properties: Record<string, unknown>, children: MdNode[]): MdNode => ({ type: 'emphasis', children, data: { hName: 'span', hProperties: properties } });

/** Upstream's HeadingAnchor: the heading text links to itself and shows a `#` on hover. */
const anchor = (id: string, children: MdNode[]): MdNode => ({
  type: 'link',
  url: `#${id}`,
  data: { hProperties: { className: ['group', 'no-underline'] } },
  children: [span({ className: ['underline-offset-4', 'group-hover:underline'] }, children), span({ ariaHidden: 'true', className: ['ml-2', 'text-muted-foreground', 'opacity-0', 'group-hover:opacity-100'] }, [{ type: 'text', value: '#' }])],
});

/**
 * Gives h2 to h6 an id and a self link, and exposes h2 to h4 as `metadata.toc`. A heading inside
 * `<Steps>` is a step title, like upstream's `<Step>`, so it gets neither an id nor a toc entry.
 */
export function headings() {
  return (tree: MdNode, file: { data: { fm?: Record<string, unknown> } }) => {
    const toc: TocItem[] = [];
    const seen = new Map<string, number>();
    let inSteps = false;
    for (const node of tree.children ?? []) {
      if (node.type === 'html') inSteps = /^<Steps\b/.test(node.value ?? '') || (inSteps && !/^<\/Steps>/.test(node.value ?? ''));
      if (node.type !== 'heading' || !node.depth || node.depth < 2 || inSteps) continue;
      const title = text(node);
      const base = slugify(title);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count ? `${base}-${count}` : base;
      node.data = { ...node.data, hProperties: { id } };
      // A link cannot contain a link, so a heading that already has one keeps its id without the self link.
      if (!hasLink(node)) node.children = [anchor(id, node.children ?? [])];
      if (node.depth <= 4) toc.push({ title, url: `#${id}`, depth: node.depth });
    }
    file.data.fm = { ...file.data.fm, toc };
  };
}
