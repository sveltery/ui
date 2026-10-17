#!/usr/bin/env node
// Builds the Pagefind index for the built site. Docs pages that render on each request have no HTML to crawl, so they are indexed from their markdown source.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import * as pagefind from 'pagefind';

const site = '.svelte-kit/cloudflare';
const { index } = await pagefind.createIndex();
const crawled = await index.addDirectory({ path: site });
const errors = [...crawled.errors];

const unrendered = readdirSync(`${site}/docs`, { recursive: true })
  .filter((file) => file.endsWith('.md') && !existsSync(`${site}/docs/${file.replace(/\.md$/, '.html')}`))
  .map((file) => file.replace(/\.md$/, ''));
for (const slug of unrendered) {
  const source = [`content/docs/${slug}.md`, `content/docs/${slug}/index.md`].find((path) => existsSync(path));
  const [, frontmatter, body] = readFileSync(source, 'utf8').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const title = frontmatter.match(/^title: (.*)$/m)[1];
  const content = body.replace(/<[A-Z]\w*[^>]*\/>/g, '');
  const added = await index.addCustomRecord({ url: `/docs/${slug}`, content: `${title}\n\n${content}`, language: 'en', meta: { title } });
  errors.push(...added.errors);
}
errors.push(...(await index.writeFiles({ outputPath: `${site}/pagefind` })).errors);
await pagefind.close();
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Pagefind: ${crawled.page_count} pages and ${unrendered.length} markdown records (${unrendered.join(', ')})`);
