import * as fs from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE, parseConfig } from '../config.js';
import { CliError } from '../parse.js';
import { aliasPath, readJson } from '../project.js';
import { ask } from '../prompt.js';
import { resolveRegistryUrl } from '../registry.js';
import { transformDirection } from '../rtl.js';

// Ported from shadcn-ui/ui d2fba50 packages/shadcn/src/migrations/migrate-rtl.ts; MIT: THIRD_PARTY_NOTICES.md.

export const migrations = [{ name: 'rtl', description: 'migrate your components to support RTL (right-to-left).' }] as const;

export type MigrateOptions = { cwd: string; yes: boolean; path?: string };

/** Components whose layout the transform cannot fully flip. */
const NEEDS_MANUAL_REVIEW = ['sidebar', 'pagination', 'calendar'];

const SOURCE = /\.(svelte|[cm]?[jt]s)$/;

const filesUnder = (dir: string) =>
  fs
    .readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && SOURCE.test(entry.name) && !join(entry.parentPath, entry.name).split(/[\\/]/).includes('node_modules'))
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)));

/** The files to migrate, relative to the returned base: a glob, a file or a directory under `cwd`, or else the `ui` alias's directory. */
function selectFiles(cwd: string, uiDir: string, path: string | undefined): { base: string; files: string[] } {
  if (path === undefined) {
    const base = join(cwd, uiDir);
    if (!fs.existsSync(base)) throw new CliError(`No components in ${uiDir}. Add some, or pass a path or glob pattern.`);
    return { base, files: filesUnder(base) };
  }
  let selected: { base: string; files: string[] };
  if (path.includes('*')) {
    if (!fs.globSync) throw new CliError('A glob pattern needs Node 22 or later. Pass a file or directory instead.');
    // globSync matches directories too, as in src/**, so keep only files.
    const matches = fs.globSync(path, { cwd, exclude: (name) => name.split(/[\\/]/).includes('node_modules') });
    selected = { base: cwd, files: matches.filter((file) => fs.statSync(resolve(cwd, file)).isFile()) };
  } else {
    const full = resolve(cwd, path);
    const stat = fs.statSync(full, { throwIfNoEntry: false });
    if (!stat) throw new CliError(`File not found: ${path}`);
    selected = stat.isDirectory() ? { base: full, files: filesUnder(full) } : { base: dirname(full), files: [basename(full)] };
  }
  if (selected.files.length === 0) throw new CliError(`No files found matching: ${path}`);
  return selected;
}

/** Sets `rtl: true` in components.json and rewrites installed components with the transform `add` applies to RTL projects. */
export async function migrateRtl(options: MigrateOptions): Promise<{ transformed: string[]; review: string[] }> {
  const { cwd } = options;
  const configPath = join(cwd, CONFIG_FILE);
  if (!fs.existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const raw = readJson(configPath) as Record<string, unknown>;
  const config = parseConfig(raw);
  const { base, files } = selectFiles(cwd, aliasPath(config.aliases.ui), options.path);

  if (!options.yes && !(await ask(`We will migrate ${files.length} file(s) in ${options.path ?? `./${relative(cwd, base)}`} to RTL. Continue?`, true))) {
    log.info('Migration cancelled.');
    return { transformed: [], review: [] };
  }

  // Transform every file before writing anything, so a file the parser rejects is skipped rather than stopping the run halfway.
  const changes: { path: string; file: string; content: string }[] = [];
  for (const file of files) {
    const path = resolve(base, file);
    const content = fs.readFileSync(path, 'utf8');
    try {
      const next = transformDirection(file, content);
      if (next !== content) changes.push({ path, file, content: next });
    } catch (error) {
      log.warn(`Skipped ${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  fs.writeFileSync(configPath, `${JSON.stringify({ ...raw, rtl: true }, null, 2)}\n`);
  log.success(`Updated ${CONFIG_FILE}.`);
  for (const { path, content } of changes) fs.writeFileSync(path, content);
  const transformed = changes.map(({ file }) => file);
  log.success(`Migration complete. ${transformed.length} file(s) transformed.`);

  const review = files.filter((file) => file.split(/[\\/]/).some((part) => NEEDS_MANUAL_REVIEW.includes(part.replace(SOURCE, '').toLowerCase())));
  if (review.length > 0) {
    const docs = new URL('/docs/rtl#manual-migration-optional', resolveRegistryUrl(config.registry)).href;
    log.warn(`The following components may need manual RTL adjustments:\n${review.map((file) => `  - ${file}`).join('\n')}\nSee ${docs} for more information.`);
  }
  return { transformed, review };
}
