// Resolves every icon named by an <IconPlaceholder> or a library-keyed object literal in the repository to SVG data from the framework-agnostic icon packages.
// Run after adding or changing an icon; `--check` fails when the generated module is stale.
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as lucide from 'lucide';
import * as hugeicons from '@hugeicons/core-free-icons';
import { iconNames, libraries } from './icon-names.mjs';

const packageDir = name => join('node_modules', name);
const output = 'packages/ui/src/lib/icons/generated.ts';
const pascal = kebab => kebab.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('');
const kebab = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase();
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const serialize = nodes => nodes.map(([tag, attributes]) => `<${tag}${Object.entries(attributes).map(([key, value]) => ` ${key}="${escape(value)}"`).join('')}/>`).join('');
const svgBody = path => readFileSync(path, 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const svgFiles = (dir, prefix) => {
  const files = new Map();
  for (const entry of readdirSync(dir, { recursive: true })) if (entry.endsWith('.svg')) files.set(`${prefix}${pascal(entry.split('/').at(-1).slice(0, -4))}`, join(dir, entry));
  return files;
};

const stroked = { xmlns: 'http://www.w3.org/2000/svg', width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
const tablerNodes = new Map(Object.entries(JSON.parse(readFileSync(join(packageDir('@tabler/icons'), 'tabler-nodes-outline.json'), 'utf8'))).map(([name, nodes]) => [`Icon${pascal(name)}`, { name, nodes }]));
const tablerFilledNodes = new Map(Object.entries(JSON.parse(readFileSync(join(packageDir('@tabler/icons'), 'tabler-nodes-filled.json'), 'utf8'))).map(([name, nodes]) => [`Icon${pascal(name)}Filled`, { name, nodes }]));
const phosphorFiles = svgFiles(join(packageDir('@phosphor-icons/core'), 'assets/regular'), '');
const remixFiles = svgFiles(join(packageDir('remixicon'), 'icons'), 'Ri');

const resolvers = {
  lucide(name) {
    const node = lucide[name] ?? lucide[name.replace(/Icon$/, '')];
    return node && { attributes: { ...stroked, class: `lucide lucide-${kebab(name.replace(/Icon$/, ''))}` }, body: serialize(node[2]) };
  },
  tabler(name) {
    const filled = tablerFilledNodes.get(name);
    if (filled) return { attributes: { xmlns: stroked.xmlns, width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor', class: `tabler-icon tabler-icon-filled tabler-icon-${filled.name}` }, body: serialize(filled.nodes) };
    const icon = tablerNodes.get(name);
    return icon && { attributes: { ...stroked, class: `tabler-icon tabler-icon-${icon.name}` }, body: serialize(icon.nodes) };
  },
  hugeicons(name) {
    const nodes = hugeicons[name];
    // Upstream shadcn draws Hugeicons at stroke-width 2; it lives on the root so callers can override it.
    const attributes = ({ key: _key, strokeWidth: _strokeWidth, ...rest }) => Object.fromEntries(Object.entries(rest).map(([key, value]) => [kebab(key), value]));
    return nodes && { attributes: { xmlns: stroked.xmlns, width: '24', height: '24', viewBox: '0 0 24 24', fill: 'none', color: 'currentColor', 'stroke-width': '2' }, body: serialize(nodes.map(([tag, rest]) => [tag, attributes(rest)])) };
  },
  phosphor(name) {
    const path = phosphorFiles.get(name.replace(/Icon$/, ''));
    return path && { attributes: { xmlns: stroked.xmlns, width: '24', height: '24', viewBox: '0 0 256 256', fill: 'currentColor' }, body: svgBody(path) };
  },
  remixicon(name) {
    const path = remixFiles.get(name);
    return path && { attributes: { xmlns: stroked.xmlns, width: '24', height: '24', viewBox: '0 0 24 24', fill: 'currentColor', class: 'remixicon' }, body: svgBody(path) };
  },
};

const sources = execFileSync('git', ['ls-files', '-co', '--exclude-standard', '--', 'packages/ui/src', 'apps', 'tests'], { encoding: 'utf8' }).split('\n').filter(path => path.endsWith('.svelte'));
const icons = Object.fromEntries(libraries.map(library => [library, {}]));
for (const path of sources) {
  for (const { group, names } of iconNames(readFileSync(path, 'utf8'))) {
    for (const library of libraries) {
      const name = names[library];
      assert(name, `${path}: IconPlaceholder needs a ${library} name in ${group}`);
      const icon = resolvers[library](name);
      assert(icon, `${path}: ${library} has no icon named ${name}`);
      icons[library][name] = icon;
    }
  }
}

const sorted = Object.fromEntries(libraries.map(library => [library, Object.fromEntries(Object.entries(icons[library]).sort(([a], [b]) => a.localeCompare(b)))]));
const licenses = ['lucide-LICENSE', 'tabler-LICENSE', 'hugeicons-core-LICENSE.md', 'phosphor-LICENSE', 'remix-LICENSE'].map(file => readFileSync(`packages/ui/src/lib/icons/licenses/${file}`, 'utf8').trim()).join('\n\n');
const module = `/*!\n${licenses}\n*/\n// Generated by scripts/generate-icons.mjs from the icons named by every <IconPlaceholder>.\nimport type { IconData, IconLibraryName } from './config.js';\n\nexport const icons: Record<IconLibraryName, Record<string, IconData>> = ${JSON.stringify(sorted, null, 2)};\n`;
if (process.argv.includes('--check')) assert.equal(readFileSync(output, 'utf8'), module, `${output} is stale; run node scripts/generate-icons.mjs`);
else writeFileSync(output, module);
console.log(libraries.map(library => `${library}: ${Object.keys(sorted[library]).length}`).join(', '));
