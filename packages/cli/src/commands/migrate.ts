import * as fs from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE, parseConfig, type Config } from '../config.js';
import { mergeTheme } from '../css.js';
import { iconLibraries } from '../icons.js';
import { OLD_PACKAGES, transformCn, type CnIssue, type OldPackage } from '../migrations/cn.js';
import { baseColorMigration, type SkippedToken } from '../migrations/base-color.js';
import { iconIndex, migrateIconsInSource, type Skipped } from '../migrations/icons.js';
import { CliError } from '../parse.js';
import { executePlan, missingPackages, removePackage } from '../plan.js';
import { aliasPath, declaredPackages, readJson } from '../project.js';
import { ask, choose } from '../prompt.js';
import { baseColors, fetchItem, fetchTheme, iconLibraryNames, openRegistry, resolveRegistryUrl } from '../registry.js';
import { baseDependencies } from './init.js';

export type MigrateOptions = { cwd: string; yes: boolean; install: boolean; path?: string; from?: string; to?: string };

/** The migrations `migrate` runs, in shadcn's order. shadcn's `radix` migration is React-only. */
export const migrations: { name: string; description: string; run: (options: MigrateOptions) => Promise<unknown> }[] = [
  { name: 'cn', description: 'migrate clsx and tailwind-merge to cn.', run: migrateCn },
  { name: 'icons', description: 'migrate your ui components to a different icon library.', run: migrateIcons },
  { name: 'base-color', description: 'migrate your theme to a different base color.', run: migrateBaseColor },
];

/** Runs the named migration, or lists them all when `list` is set or no name is given. */
export async function migrate(name: string | undefined, options: MigrateOptions & { list: boolean }): Promise<unknown> {
  if (name === 'radix') throw new CliError('shadcn/ui\'s radix migration moves @radix-ui/react-* imports to the radix-ui package. A Svelte project has no such imports, so Sveltery UI has no radix migration.');
  const migration = migrations.find((entry) => entry.name === name);
  if (name !== undefined && !options.list && !migration) throw new CliError(`Unknown migration "${name}". Run \`npx @sveltery/ui@latest migrate --list\` to see the migrations.`);
  if (options.list || !migration) {
    log.info(`Available migrations:\n${migrations.map((entry) => `- ${entry.name}: ${entry.description}`).join('\n')}`);
    return undefined;
  }
  return migration.run(options);
}

const SOURCE = /\.(svelte|[cm]?[jt]s)$/;
const IGNORED = new Set(['node_modules', '.git', '.svelte-kit', '.vercel', '.netlify', '.output', 'dist', 'build', 'coverage']);

const filesUnder = (dir: string) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE.test(entry.name) && !relative(dir, entry.parentPath).split(/[\\/]/).some((part) => IGNORED.has(part)))
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)))
    .sort();

/** The files to migrate, relative to the returned base: a glob, a file or a directory under `cwd`, or else every source file under `fallback`. */
function selectFiles(cwd: string, fallback: string, path: string | undefined): { base: string; files: string[] } {
  if (path === undefined) {
    const base = join(cwd, fallback);
    if (!fs.existsSync(base)) throw new CliError(`No components in ${fallback}. Add some, or pass a path or glob pattern.`);
    return { base, files: filesUnder(base) };
  }
  let selected: { base: string; files: string[] };
  if (path.includes('*')) {
    if (!fs.globSync) throw new CliError('A glob pattern needs Node 22 or later. Pass a file or directory instead.');
    // `exclude` keeps `**` out of ignored directories. A pattern that names one still matches inside it, hence the second filter.
    const files = fs
      .globSync(path, { cwd, withFileTypes: true, exclude: (entry) => IGNORED.has(entry.name) })
      .filter((entry) => entry.isFile())
      .map((entry) => relative(cwd, resolve(cwd, entry.parentPath, entry.name)));
    selected = { base: cwd, files: files.filter((file) => !file.split(/[\\/]/).some((part) => IGNORED.has(part))).sort() };
  } else {
    const full = resolve(cwd, path);
    const stat = fs.statSync(full, { throwIfNoEntry: false });
    if (!stat) throw new CliError(`File not found: ${path}`);
    selected = stat.isDirectory() ? { base: full, files: filesUnder(full) } : { base: dirname(full), files: [basename(full)] };
  }
  if (selected.files.length === 0) throw new CliError(`No files found matching: ${path}`);
  return selected;
}

function readConfig(cwd: string): { raw: Record<string, unknown>; config: Config } {
  const path = join(cwd, CONFIG_FILE);
  if (!fs.existsSync(path)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const raw = readJson(path) as Record<string, unknown>;
  return { raw, config: parseConfig(raw) };
}

const writeConfig = (cwd: string, raw: Record<string, unknown>) => fs.writeFileSync(join(cwd, CONFIG_FILE), `${JSON.stringify(raw, null, 2)}\n`);

/** `--from` and `--to`, prompting for a missing one unless `yes`, which takes the project's current value as the source. */
async function fromAndTo<T extends string>(options: MigrateOptions, [kind, plural]: [string, string], names: readonly T[], current: T): Promise<{ from: T; to: T }> {
  for (const name of [options.from, options.to]) {
    if (name !== undefined && !(names as readonly string[]).includes(name)) throw new CliError(`Unknown ${kind}: ${name}. Available ${plural}: ${names.join(', ')}.`);
  }
  const choices = names.map((name) => ({ value: name, label: name }));
  const from = (options.from as T | undefined) ?? (options.yes ? current : await choose(`Which ${kind} would you like to migrate from?`, choices, current));
  if (options.to === undefined && options.yes) throw new CliError(`Pass the ${kind} to migrate to with --to.`);
  const to = (options.to as T | undefined) ?? (await choose(`Which ${kind} would you like to migrate to?`, choices, from));
  if (from === to) throw new CliError(`You cannot migrate to the same ${kind}. Please choose a different ${kind}.`);
  return { from, to };
}

async function confirmed(options: MigrateOptions, message: string): Promise<boolean> {
  if (options.yes || (await ask(message, true))) return true;
  log.info('Migration cancelled.');
  return false;
}

function warnSkipped(skipped: { name: string; reason: string }[], noun: string) {
  const unique = [...new Map(skipped.map(({ name, reason }) => [name, reason])).entries()];
  if (unique.length === 0) return;
  log.warn(`Skipped ${unique.length} ${noun}${unique.length === 1 ? '' : 's'}. These were left untouched:\n${unique.map(([name, reason]) => `  - ${name}: ${reason}`).join('\n')}`);
}

/** Swaps the icon library in the installed components, or in `path`, and without `path` records the new library in components.json. */
export async function migrateIcons(options: MigrateOptions): Promise<{ changed: string[]; skipped: Skipped[] }> {
  const { cwd } = options;
  const { raw, config } = readConfig(cwd);
  const { base, files } = selectFiles(cwd, aliasPath(config.aliases.ui), options.path);
  const { from, to } = await fromAndTo(options, ['icon library', 'libraries'], iconLibraryNames, config.iconLibrary);
  if (!(await confirmed(options, `We will migrate ${files.length} files in ${options.path ?? `./${relative(cwd, base)}`} from ${from} to ${to}. Continue?`))) return { changed: [], skipped: [] };

  const registry = await openRegistry(resolveRegistryUrl(config.registry));
  const names = [...registry.manifest.items, ...registry.manifest.blocks].map((item) => item.name);
  const icons = iconIndex(await Promise.all(names.map((name) => fetchItem(registry, config.style, { kind: 'name', name }))));
  await executePlan({ files: [], dependencies: missingPackages(cwd, iconLibraries[to].packages), devDependencies: [] }, { cwd, install: options.install });

  const changed: string[] = [];
  const skipped: Skipped[] = [];
  const unparsed: { name: string; reason: string }[] = [];
  for (const file of files) {
    const path = join(base, file);
    const content = fs.readFileSync(path, 'utf8');
    const result = migrateIconsInSource(file, content, from, to, icons);
    skipped.push(...result.skipped);
    if (result.unparsed) unparsed.push({ name: relative(cwd, path), reason: result.unparsed });
    if (result.content === content) continue;
    fs.writeFileSync(path, result.content);
    changed.push(relative(cwd, path));
  }
  log.success(`Migration complete. ${changed.length} ${changed.length === 1 ? 'file' : 'files'} changed.`);
  // A scoped run leaves the project-wide setting alone.
  if (options.path === undefined && raw.iconLibrary !== to) {
    writeConfig(cwd, { ...raw, iconLibrary: to });
    log.info(`Updated iconLibrary in ${CONFIG_FILE} to ${to}.`);
  }
  warnSkipped(
    skipped.map(({ icon, reason }) => ({ name: icon, reason })),
    'icon',
  );
  warnSkipped(unparsed, 'file');
  return { changed, skipped };
}

/** Changes the theme tokens that still hold the old base color's values in the CSS file, and records the new base color in components.json. */
export async function migrateBaseColor(options: MigrateOptions): Promise<{ skipped: SkippedToken[] } | undefined> {
  const { cwd } = options;
  const { raw, config } = readConfig(cwd);
  const cssPath = join(cwd, config.tailwind.css);
  if (!fs.existsSync(cssPath)) throw new CliError(`${config.tailwind.css}, the CSS file in ${CONFIG_FILE}, does not exist.`);
  const { from, to } = await fromAndTo({ ...options, from: options.from ?? config.tailwind.baseColor }, ['base color', 'base colors'], baseColors, config.tailwind.baseColor);
  if (!(await confirmed(options, `We will migrate ./${config.tailwind.css} from ${from} to ${to}. Continue?`))) return undefined;

  const registry = await openRegistry(resolveRegistryUrl(config.registry));
  const [source, target] = await Promise.all([fetchTheme(registry, from), fetchTheme(registry, to)]);
  const css = fs.readFileSync(cssPath, 'utf8');
  const { vars, skipped } = baseColorMigration(css, source.cssVars ?? {}, target.cssVars ?? {});
  if (Object.keys(vars.light).length > 0 || Object.keys(vars.dark).length > 0) fs.writeFileSync(cssPath, mergeTheme(css, vars, []));
  log.success('Migration complete.');
  const tailwind = raw.tailwind as Record<string, unknown>;
  if (tailwind.baseColor !== to) {
    writeConfig(cwd, { ...raw, tailwind: { ...tailwind, baseColor: to } });
    log.info(`Updated baseColor in ${CONFIG_FILE} to ${to}.`);
  }
  warnSkipped(
    skipped.map(({ token, reason }) => ({ name: token, reason })),
    'token',
  );
  return { skipped };
}

const majorOf = (range: string | undefined) => (range === undefined || /^(?:workspace|file|link|git|https?):/i.test(range) ? undefined : Number(/(?:^|[^0-9])(\d+)(?:\.|$)/.exec(range)?.[1] ?? NaN) || undefined);

function warnUnsupported(issues: (CnIssue & { file: string })[]) {
  if (issues.length === 0) return;
  log.warn(`Manual review required for ${issues.length} item${issues.length === 1 ? '' : 's'}:\n${issues.map((issue) => `  - ${issue.file}${issue.symbol ? ` (${issue.symbol})` : ''}: ${issue.reason}`).join('\n')}`);
}

/** Moves the project's source files, or `path`, from clsx, tailwind-merge and cnfast to cn. Needs only package.json. */
export async function migrateCn(options: MigrateOptions): Promise<{ changed: string[]; removed: OldPackage[] }> {
  const { cwd } = options;
  const declared = declaredPackages(cwd);
  const { base, files } = selectFiles(cwd, '.', options.path);
  const results = files.map((file) => {
    const path = join(base, file);
    const content = fs.readFileSync(path, 'utf8');
    return { file: relative(cwd, path), path, content, result: transformCn(file, content) };
  });
  const changed = results.filter(({ content, result }) => result.content !== content);
  const unsupported = results.flatMap(({ file, result }) => result.unsupported.map((issue) => ({ ...issue, file })));
  const migrated = new Set(results.flatMap(({ result }) => result.migrated));
  if (changed.length === 0) {
    log.info('No supported clsx, tailwind-merge or cnfast usage found.');
    warnUnsupported(unsupported);
    return { changed: [], removed: [] };
  }
  if (migrated.has('tailwind-merge') && ((majorOf(declared.get('tailwindcss')) ?? 4) < 4 || (majorOf(declared.get('tailwind-merge')) ?? 3) < 3)) {
    throw new CliError('The cn migration requires Tailwind CSS v4 and tailwind-merge v3. Tailwind CSS v3 projects should continue using tailwind-merge v2.');
  }
  const review = unsupported.length > 0 ? ` and leave ${unsupported.length} item(s) for manual review` : '';
  if (!(await confirmed(options, `We will migrate ${changed.length} file(s) to cn${review}. Continue?`))) return { changed: [], removed: [] };

  // Installed first, so a failed install leaves the source files as they were.
  await executePlan({ files: [], dependencies: missingPackages(cwd, baseDependencies.filter((spec) => spec.startsWith('cn@'))), devDependencies: [] }, { cwd, install: options.install });
  for (const { path, result } of changed) fs.writeFileSync(path, result.content);
  log.success(`Migrated ${changed.length} ${changed.length === 1 ? 'file' : 'files'}.`);

  const retained = new Set(results.flatMap(({ result }) => result.remaining));
  const removable = options.path === undefined ? OLD_PACKAGES.filter((name) => migrated.has(name) && !retained.has(name) && declared.has(name)) : [];
  const removed: OldPackage[] = [];
  if (options.install) {
    for (const name of removable) {
      try {
        await removePackage(cwd, name, { silent: false });
        removed.push(name);
      } catch {
        log.warn(`Could not remove ${name}. Remove it manually after reviewing the migration.`);
      }
    }
  }
  if (options.path !== undefined) log.info('Kept clsx, tailwind-merge and cnfast dependencies because this was a scoped migration.');
  warnUnsupported(unsupported);
  return { changed: changed.map(({ file }) => file), removed };
}
