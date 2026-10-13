import { highlight } from '../../../markdown/highlight';
import { blocks, type Block } from '$blocks/registry';
import type { BlockSource, FileTree } from './types';

const sources = import.meta.glob<string>('/blocks/**/*.svelte', { query: '?raw', import: 'default', eager: true });


/** Writes the imports the way an app that copied the components and the block has them. */
const asCopied = (raw: string) => raw.replace(/'@sveltery\/ui\/([^']+)'/g, "'$lib/components/ui/$1/index.js'").replace(/'\.\/components\//g, "'$lib/components/");

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

export async function blockSource(block: Block): Promise<BlockSource> {
  const prefix = `/blocks/${block.name}/`;
  const entries = Object.entries(sources)
    .filter(([path]) => path.startsWith(prefix))
    .map(([path, raw]) => {
      const file = path.slice(prefix.length);
      return { target: file === 'page.svelte' ? `src/routes/${block.route}/+page.svelte` : `src/lib/${file}`, raw: asCopied(raw) };
    })
    .sort((a, b) => Number(b.target.startsWith('src/routes/')) - Number(a.target.startsWith('src/routes/')) || a.target.localeCompare(b.target));
  const files = await Promise.all(entries.map(async (file) => ({ ...file, html: await highlight(file.raw, 'svelte') })));
  return { ...block, files, tree: tree(files.map((file) => file.target)) };
}

export const blockSources = (names: string[]) =>
  Promise.all(names.flatMap((name) => blocks.filter((block) => block.name === name)).map(blockSource));
