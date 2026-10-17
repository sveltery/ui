import type { Block } from '#blocks/registry';
import { highlight } from '../../../markdown/highlight';
import { asInstalled } from '../../../markdown/installed';
import type { BlockFiles, FileTree } from './types';

const sources = import.meta.glob<string>(['/blocks/**/*.svelte', '/blocks/*/*.json'], { query: '?raw', import: 'default', eager: true });

/** Writes the code the way an app that copied the components and the block has it. */
const asCopied = (raw: string, path: string) =>
  asInstalled(raw, path)
    .replace(/'\.\/components\//g, "'#lib/components/")
    .replace(/[ \t]*<!-- svelte-ignore [^>]*-->\n?/g, '');

function tree(targets: string[]): FileTree[] {
  const root: FileTree[] = [];
  for (const target of targets) {
    let level = root;
    target.split('/').forEach((name, i, parts) => {
      let node = level.find((entry) => entry.name === name);
      if (!node) {
        node = i === parts.length - 1 ? { name, path: target } : { name, children: [] };
        level.push(node);
      }
      level = node.children ?? [];
    });
  }
  return root;
}

export async function blockFiles(block: Block): Promise<BlockFiles> {
  const prefix = `/blocks/${block.name}/`;
  const entries = Object.entries(sources)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, raw]) => {
      const file = path.slice(prefix.length);
      // Files beside the page, such as its data, stay beside it in the route.
      const target = file === 'page.svelte' ? `src/routes/${block.route}/+page.svelte` : file.includes('/') ? `src/lib/${file}` : `src/routes/${block.route}/${file}`;
      return { target, raw: asCopied(raw, path) };
    })
    .sort((a, b) => Number(b.target.startsWith('src/routes/')) - Number(a.target.startsWith('src/routes/')) || a.target.localeCompare(b.target));
  // The viewer draws its own figure and caption, so keep only the highlighted <pre>.
  const files = await Promise.all(entries.map(async (file) => ({ ...file, html: (await highlight(file.raw, file.target.split('.').pop(), {}, 'source')).match(/<pre[\s\S]*<\/pre>/)![0] })));
  return { files, tree: tree(files.map((file) => file.target)) };
}
