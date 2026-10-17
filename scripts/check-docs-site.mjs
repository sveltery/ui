#!/usr/bin/env node
// Checks the built docs site in apps/docs/.svelte-kit/cloudflare for what a static file can't do that its route could.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';

const site = 'apps/docs/.svelte-kit/cloudflare';
const files = readdirSync(site, { recursive: true }).map((file) => `/${file}`);

// Cloudflare's asset worker matches a _headers path with * standing for any characters, and its first value for a header replaces the asset's own.
const rules = [];
for (const line of readFileSync(`${site}/_headers`, 'utf8').split('\n')) {
  if (!line.trim() || line.startsWith('#')) continue;
  if (!/^\s/u.test(line)) rules.push({ path: new RegExp(`^${line.trim().split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\/]/gu, '\\$&')).join('.*')}$`, 'u'), set: {} });
  else if (!line.trim().startsWith('!')) {
    const [name, ...value] = line.trim().split(':');
    rules.at(-1).set[name.toLowerCase()] ??= value.join(':').trim();
  }
}
const header = (path, name) => rules.find((rule) => rule.path.test(path) && name in rule.set)?.set[name];

const markdown = files.filter((file) => file.endsWith('.md'));
assert(markdown.length > 0, 'no prerendered .md files');
for (const file of markdown) assert.equal(header(file, 'content-type'), 'text/markdown; charset=utf-8', `${file}: content type`);

// A prerendered page answers a form post with its static HTML, so a demo whose form posts back must render on each request.
for (const file of files.filter((file) => file.endsWith('.html'))) {
  assert(!readFileSync(`${site}${file}`, 'utf8').includes('action="?/'), `${file}: a form posts back to a prerendered page`);
}
// Search reads only the Pagefind index, so every docs page needs a record in it, whether or not it was prerendered.
const indexed = new Set(readdirSync(`${site}/pagefind/fragment`).map((file) => {
  const fragment = gunzipSync(readFileSync(`${site}/pagefind/fragment/${file}`)).toString('utf8');
  return JSON.parse(fragment.slice(fragment.indexOf('{'))).url.replace(/\.html$/u, '');
}));
for (const file of markdown.filter((file) => file.startsWith('/docs'))) assert(indexed.has(file.replace(/\.md$/u, '')), `${file}: page missing from the search index`);

console.log(`Docs site: PASS (${markdown.length} markdown files, ${files.filter((file) => file.endsWith('.html')).length} pages)`);
