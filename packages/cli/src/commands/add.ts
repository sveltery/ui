import { log } from '@clack/prompts';
import { openProject, planItems } from '../items.js';
import { CliError } from '../parse.js';
import { executePlan, formatDetail, formatPlan, type DryRunDetail, type Plan, type PlannedFile } from '../plan.js';
import { ask } from '../prompt.js';
import { parseItemRef, resolveItems } from '../registry.js';

export type AddOptions = { cwd: string; yes: boolean; overwrite: boolean; all: boolean; dryRun: boolean; install: boolean } & DryRunDetail;

export async function add(args: string[], options: AddOptions): Promise<Plan> {
  const project = await openProject(options.cwd);
  const { cwd, config, registry } = project;
  if (!options.all && args.length === 0) throw new CliError('Name the items to add, such as `npx @sveltery/ui@latest add button`, or pass --all.');
  const refs = options.all ? registry.manifest.items.map((item) => parseItemRef(item.name)) : args.map(parseItemRef);
  const items = await resolveItems(registry, config.style, refs);
  const plan = planItems(project, items);

  const detail = options.diff !== undefined || options.view !== undefined;
  if (options.dryRun || detail) {
    console.log(detail ? formatDetail(cwd, plan.files, options) : formatPlan(plan, { showIdentical: true }));
    return plan;
  }
  log.info(formatPlan(plan, { showIdentical: false }));
  if (!options.yes && !(await ask('Continue?', true))) throw new CliError('Cancelled.');

  const skipped: string[] = [];
  const toWrite: PlannedFile[] = [];
  for (const file of plan.files) {
    if (file.status === 'changed' && !options.overwrite && (options.yes || !(await ask(`${file.path} differs from the registry. Overwrite it?`, false)))) {
      skipped.push(file.path);
    } else toWrite.push(file);
  }
  if (skipped.length > 0) log.warn(`Kept your changes to:\n${skipped.map((path) => `  ${path}`).join('\n')}\nPass --overwrite to replace them.`);
  const executed = { ...plan, files: toWrite };
  await executePlan(executed, { cwd, install: options.install });
  log.success(`Added ${items.map((item) => item.name).join(', ')}.`);
  for (const item of items) if (item.docs) log.info(item.docs);
  return executed;
}
