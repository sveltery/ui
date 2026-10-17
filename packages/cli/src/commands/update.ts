import { log } from '@clack/prompts';
import { NONE_INSTALLED, openProject, planItems, selectInstalled } from '../items.js';
import { executePlan, filePatch, formatPlan, type Plan, type PlannedFile } from '../plan.js';
import { ask } from '../prompt.js';

export type UpdateOptions = { cwd: string; yes: boolean; install: boolean };

/** Re-adds the installed items. Each changed file shows its diff and asks, unless `yes`. New files and missing packages come without a question. */
export async function update(names: string[], options: UpdateOptions): Promise<Plan> {
  const project = await openProject(options.cwd);
  const items = await selectInstalled(project, names);
  const full = planItems(project, items);
  const plan = { ...full, files: full.files.filter((file) => file.status !== 'identical') };
  if (plan.files.length === 0 && plan.dependencies.length === 0) {
    log.success(items.length === 0 ? NONE_INSTALLED : 'Everything is up to date.');
    return plan;
  }
  log.info(formatPlan(plan, { showIdentical: false }));

  const kept: string[] = [];
  const toWrite: PlannedFile[] = [];
  for (const file of plan.files) {
    if (file.status === 'changed') {
      log.message(filePatch(project.cwd, file).trimEnd());
      if (!options.yes && !(await ask(`Overwrite ${file.path} with the registry version?`, false))) {
        kept.push(file.path);
        continue;
      }
    }
    toWrite.push(file);
  }
  if (kept.length > 0) log.warn(`Kept your changes to:\n${kept.map((path) => `  ${path}`).join('\n')}`);
  const executed = { ...plan, files: toWrite };
  await executePlan(executed, { cwd: project.cwd, install: options.install });
  log.success(`Updated ${toWrite.length} ${toWrite.length === 1 ? 'file' : 'files'}.`);
  return executed;
}
