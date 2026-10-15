import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { confirm, isCancel, log } from '@clack/prompts';
import { CONFIG_FILE, parseConfig } from '../config.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, missingPackages, planFile, type Plan, type PlannedFile } from '../plan.js';
import { aliasPath, readJson } from '../project.js';
import { openRegistry, parseItemRef, resolveItems, resolveRegistryUrl } from '../registry.js';
import { applyTransforms, type TransformContext } from '../transforms.js';

export type AddOptions = { cwd: string; yes: boolean; overwrite: boolean; all: boolean; dryRun: boolean; install: boolean };

async function ask(message: string, initialValue: boolean): Promise<boolean> {
  const answer = await confirm({ message, initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}

export async function add(args: string[], options: AddOptions): Promise<Plan> {
  const { cwd } = options;
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx sveltery init\` first.`);
  const config = parseConfig(readJson(configPath));

  const registry = await openRegistry(resolveRegistryUrl(config.registry));
  if (!options.all && args.length === 0) throw new CliError('Name the items to add, such as `sveltery add button`, or pass --all.');
  const refs = options.all ? registry.manifest.items.map((item) => parseItemRef(item.name)) : args.map(parseItemRef);
  const items = await resolveItems(registry, config.style, refs);

  const cssPath = join(cwd, config.tailwind.css);
  const ctx: TransformContext = { iconLibrary: config.iconLibrary, fontHeading: existsSync(cssPath) && readFileSync(cssPath, 'utf8').includes('--font-heading') };
  const uiDir = aliasPath(config.aliases.ui);
  const files = new Map<string, PlannedFile>();
  const dependencies: string[] = [];
  for (const item of items) {
    dependencies.push(...(item.dependencies ?? []));
    for (const file of item.files) {
      const result = applyTransforms(file, ctx);
      dependencies.push(...result.dependencies);
      const path = join(uiDir, file.target);
      files.set(path, planFile(cwd, path, result.content));
    }
  }
  const plan: Plan = { files: [...files.values()], dependencies: missingPackages(cwd, dependencies), devDependencies: [] };

  if (options.dryRun) {
    console.log(formatPlan(plan, { showIdentical: true }));
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
  return executed;
}
