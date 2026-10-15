import { fetchAllItems, isInstalled, openProject } from '../items.js';

export type ListEntry = { name: string; type: string; installed: boolean };

/** Prints every item in the registry's manifest, marking the installed ones, and returns the entries. */
export async function list(options: { cwd: string; json: boolean }): Promise<ListEntry[]> {
  const project = await openProject(options.cwd);
  const items = await fetchAllItems(project);
  const entries = items.map((item) => ({ name: item.name, type: item.type, installed: isInstalled(project, item) }));
  if (options.json) {
    console.log(JSON.stringify(entries, null, 2));
    return entries;
  }
  const nameWidth = Math.max(...entries.map((entry) => entry.name.length));
  const typeWidth = Math.max(...entries.map((entry) => entry.type.length));
  for (const entry of entries) console.log(`${entry.name.padEnd(nameWidth)}  ${entry.type.padEnd(typeWidth)}${entry.installed ? '  installed' : ''}`.trimEnd());
  return entries;
}
