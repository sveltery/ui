import { NONE_INSTALLED, openProject, planItems, selectInstalled } from '../items.js';
import { count, filePatch } from '../plan.js';

/** Prints what the registry would change in the installed items, and returns the text it printed. Writes nothing. */
export async function diff(names: string[], options: { cwd: string }): Promise<string> {
  const project = await openProject(options.cwd);
  const items = await selectInstalled(project, names);
  const { files } = planItems(project, items);
  const changed = files.filter((file) => file.status === 'changed');
  const added = files.filter((file) => file.status === 'new');

  const lines: string[] = [];
  if (changed.length > 0) {
    lines.push(...changed.map((file) => filePatch(project.cwd, file).trimEnd()), '');
    const owners = new Set(changed.map((file) => file.item));
    lines.push(`${count(changed.length, 'file differs', 'files differ')} in ${count(owners.size, 'item', 'items')}`);
  }
  const updateCommand = ['npx @sveltery/ui@latest update', ...names].join(' ');
  if (added.length > 0) lines.push(`${count(added.length, 'file', 'files')} in the registry ${added.length === 1 ? 'is' : 'are'} not in your project yet. \`${updateCommand}\` adds ${added.length === 1 ? 'it' : 'them'}.`);
  if (lines.length === 0) lines.push(items.length === 0 ? NONE_INSTALLED : 'Everything is up to date.');
  const output = lines.join('\n');
  console.log(output);
  return output;
}
