// Reproducible native SVG geometry. Package renderers remain reference-only dependencies.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
const require = createRequire(import.meta.url);
const manifest = JSON.parse(readFileSync('tests/reference/icon-sources.json', 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
for (const file of manifest.files) assert.equal(hash(readFileSync(file.local)), file.sha256, file.local);
const packages = {};
for (const pin of manifest.packages) {
  let root = dirname(require.resolve(pin.name));
  while (true) {
    try {
      const pkg = JSON.parse(readFileSync(`${root}/package.json`, 'utf8'));
      if (pkg.name === pin.name) { assert.equal(pkg.version, pin.version); packages[pin.name] = await import(pathToFileURL(`${root}/${pkg.module ?? pkg.main}`)); break; }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    root = dirname(root);
  }
}
const libraryPackages = { lucide: 'lucide-react', tabler: '@tabler/icons-react', hugeicons: '@hugeicons/core-free-icons', phosphor: '@phosphor-icons/react', remixicon: '@remixicon/react' };
const document = new JSDOM('').window.document;
const host = document.createElement('div');
const attributes = node => Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]));
function nodes(element) { return [...element.children].map(node => ({ tag: node.localName, attributes: attributes(node), nodes: nodes(node) })); }
function svg(component, props = {}) { host.innerHTML = renderToStaticMarkup(createElement(component, props)); const node = host.querySelector('svg'); assert(node); return { attributes: attributes(node), nodes: nodes(node) }; }
mkdirSync('apps/docs/examples/icons/data', { recursive: true });
const outputs = [];
for (const [library, packageName] of Object.entries(libraryPackages)) {
  const map = readFileSync(`tests/reference/icons/upstream/__${library}__.ts`, 'utf8');
  const names = [...map.matchAll(/export \{ (\w+) \}/g)].map(match => match[1]);
  const icons = {};
  const missing = [];
  for (const name of names) {
    const icon = packages[packageName][name];
    if (!icon) { missing.push(name); continue; }
    if (library === 'hugeicons') {
      // Only MIT core-free geometry is extracted; no Pro React renderer source is copied.
      icons[name] = { attributes: { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', color: 'currentColor', class: '', 'stroke-width': '2', stroke: 'currentColor' }, nodes: svg(() => createElement('svg', null, ...icon.map(([tag, attrs]) => createElement(tag, attrs)))).nodes };
    } else icons[name] = svg(icon);
  }
  const local = `apps/docs/examples/icons/data/${library}.json`;
  const bytes = JSON.stringify(icons, null, 2) + '\n';
  if (process.argv.includes('--check')) assert.equal(readFileSync(local, 'utf8'), bytes, `${library} reproducible geometry`); else writeFileSync(local, bytes);
  outputs.push({ library, local, sha256: hash(bytes), declared: names.length, extracted: Object.keys(icons).length, missing });
}
const fallback = JSON.stringify(svg(packages['lucide-react'].SquareIcon), null, 2) + '\n';
if (process.argv.includes('--check')) assert.equal(readFileSync('apps/docs/examples/icons/data/fallback.json', 'utf8'), fallback); else writeFileSync('apps/docs/examples/icons/data/fallback.json', fallback);
const inventory = { sourceCommit: manifest.commit, generator: { local: 'scripts/generate-icons.mjs', sha256: hash(readFileSync('scripts/generate-icons.mjs')) }, outputs, fallbackSha256: hash(fallback) };
if (process.argv.includes('--check')) assert.deepEqual(JSON.parse(readFileSync('tests/reference/icon-data.json', 'utf8')), inventory); else writeFileSync('tests/reference/icon-data.json', JSON.stringify(inventory, null, 2) + '\n');
console.log(outputs.map(item => `${item.library}: ${item.extracted}/${item.declared} genuine exported icons; ${item.missing.length} absent pinned package exports`).join('\n'));
