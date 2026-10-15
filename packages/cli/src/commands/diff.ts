import { openProject, planItems, selectInstalled } from '../items.js';
import { filePatch } from '../plan.js';

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

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
  if (added.length > 0) lines.push(`${count(added.length, 'file', 'files')} in the registry ${added.length === 1 ? 'is' : 'are'} not in your project yet. \`sveltery update\` adds ${added.length === 1 ? 'it' : 'them'}.`);
  if (lines.length === 0) lines.push(items.length === 0 ? 'No items are installed. Add one with `sveltery add button`.' : 'Everything is up to date.');
  const output = lines.join('\n');
  console.log(output);
  return output;
}
