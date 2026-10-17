import type { DocPage, Frontmatter, NavSection } from './types';

/** Sidebar sections, in upstream's folder order. A page's section is its folder under `content/docs`. */
const SECTIONS: Record<string, string> = { components: 'Components', '': 'Get Started', forms: 'Forms', registry: 'Registry' };

/** The sidebar's Sections group, like upstream's `TOP_LEVEL_SECTIONS`. */
const TOP_LEVEL = ['/docs', '/docs/components', '/docs/installation', '/docs/theming', '/docs/cli', '/docs/typeset', '/docs/registry', '/docs/forms', '/docs/changelog'];

const metadata = import.meta.glob<Frontmatter>(['/content/docs/**/*.md', '!**/README.md'], { eager: true, import: 'metadata' });

type Entry = DocPage & { section: string; order: number; index: boolean };

const entries: Entry[] = Object.entries(metadata).map(([file, fm]) => {
  const path = file.replace(/^\/content\/docs\//, '').replace(/\.md$/, '');
  const slug = path.replace(/(^|\/)index$/, '');
  const section = path.includes('/') ? path.split('/')[0] : '';
  if (!(section in SECTIONS)) throw new Error(`${file}: folder "${section}" is not a section in content.server.ts`);
  if (!fm?.title || !fm.description) throw new Error(`${file}: frontmatter needs a title and a description`);
  return { href: slug ? `/docs/${slug}` : '/docs', title: fm.title, description: fm.description, section, order: fm.order ?? Infinity, index: slug === section };
});

const byOrder = (a: Entry, b: Entry) => a.order - b.order || a.title.localeCompare(b.title);
const page = ({ href, title, description }: Entry): DocPage => ({ href, title, description });

/**
 * The sidebar. Each section lists its pages by `order`, then title. A folder's `index.md` is the
 * section's own link instead of a list item, except in Get Started where it is the introduction.
 */
export const nav: NavSection[] = Object.entries(SECTIONS).map(([id, title]) => {
  const inSection = entries.filter((entry) => entry.section === id).sort(byOrder);
  const index = id ? inSection.find((entry) => entry.index) : undefined;
  return { title, href: index?.href, pages: inSection.filter((entry) => entry !== index).map(page) };
});

/** Every page in reading order, which is also the previous and next order. */
export const pages: DocPage[] = nav.flatMap((section) => {
  const index = section.href ? entries.find((entry) => entry.href === section.href) : undefined;
  return [...(index ? [page(index)] : []), ...section.pages];
});

/** The top-level pages, in sidebar order. */
export const sections: DocPage[] = TOP_LEVEL.map((href) => {
  const entry = entries.find((candidate) => candidate.href === href);
  if (!entry) throw new Error(`content.server.ts: section "${href}" has no page in content/docs`);
  return page(entry);
});
