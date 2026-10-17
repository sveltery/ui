import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { FILE_HEADERS_ONLY, formatPatch, structuredPatch } from 'diff';
import { detect, resolveCommand } from 'package-manager-detector';
import { CliError } from './parse.js';
import { declaredPackages } from './project.js';

export const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export type FileStatus = 'new' | 'identical' | 'changed';
/** `path` is relative to the project root. `item` names the registry item the file belongs to. */
export type PlannedFile = { path: string; content: string; status: FileStatus; item?: string };
/** Everything a command will change. Commands build one, then `executePlan` applies it. */
export type Plan = { files: PlannedFile[]; dependencies: string[]; devDependencies: string[] };

export function planFile(cwd: string, path: string, content: string): PlannedFile {
  const absolute = join(cwd, path);
  if (!existsSync(absolute)) return { path, content, status: 'new' };
  return { path, content, status: readFileSync(absolute, 'utf8') === content ? 'identical' : 'changed' };
}

/** The unified diff from the project's copy of a file to the registry's version, with `a/` and `b/` headers. A `new` file diffs from `/dev/null`. */
export function filePatch(cwd: string, file: PlannedFile): string {
  const path = file.path.replaceAll('\\', '/');
  const isNew = file.status === 'new';
  const before = isNew ? '' : readFileSync(join(cwd, file.path), 'utf8');
  return formatPatch(structuredPatch(isNew ? '/dev/null' : `a/${path}`, `b/${path}`, before, file.content, '', '', { context: 3 }), FILE_HEADERS_ONLY);
}

/** What `add --diff [path]` or `add --view [path]` shows. A string is a path filter, `true` means no filter. */
export type DryRunDetail = { diff?: string | true; view?: string | true };

const OVERVIEW_LIMIT = 5;

/**
 * The text of `add --diff` or `--view`, which both stop before writing. Without a path, `--diff` shows each file that would change and `--view` every file, five at most.
 * With a path, both show the files whose path matches it: an exact match, else every path that contains it.
 */
export function formatDetail(cwd: string, files: PlannedFile[], detail: DryRunDetail): string {
  const mode = detail.diff !== undefined ? 'diff' : 'view';
  const filter = detail[mode] ?? true;
  const posix = (file: PlannedFile) => file.path.replaceAll('\\', '/');
  const matching = (path: string) => {
    const exact = files.filter((file) => posix(file) === path);
    return exact.length > 0 ? exact : files.filter((file) => posix(file).includes(path));
  };
  const candidates = filter !== true ? matching(filter) : mode === 'diff' ? files.filter((file) => file.status !== 'identical') : files;
  if (candidates.length === 0) return filter !== true ? `No file matching "${filter}" found.` : mode === 'diff' ? 'No changes.' : 'No files.';

  const shown = filter === true ? candidates.slice(0, OVERVIEW_LIMIT) : candidates;
  const blocks = shown.map((file) => {
    if (mode === 'view') {
      const lines = file.content.replace(/\n$/, '').split('\n');
      return `${file.path} (${file.status}, ${count(lines.length, 'line', 'lines')})\n${lines.join('\n')}`;
    }
    return file.status === 'identical' ? `${file.path} is identical to the registry version.` : filePatch(cwd, file).trimEnd();
  });
  if (shown.length < candidates.length) blocks.push(`Showing ${shown.length} of ${candidates.length} files. Use --${mode} <path> to show one file.`);
  return blocks.join('\n\n');
}

/** `@scope/name@^1.0.0` → `@scope/name`. */
export const packageName = (spec: string) => (spec.lastIndexOf('@') > 0 ? spec.slice(0, spec.lastIndexOf('@')) : spec);

/** The specs whose package the project does not declare yet. A package listed twice keeps its first spec. */
export function missingPackages(cwd: string, specs: string[]): string[] {
  const declared = declaredPackages(cwd);
  const byName = new Map<string, string>();
  for (const spec of specs) if (!byName.has(packageName(spec))) byName.set(packageName(spec), spec);
  return [...byName].filter(([name]) => !declared.has(name)).map(([, spec]) => spec);
}

const marks: Record<FileStatus, string> = { new: '+', changed: '~', identical: '=' };

export function formatPlan(plan: Plan, { showIdentical }: { showIdentical: boolean }): string {
  const files = plan.files.filter((file) => showIdentical || file.status !== 'identical');
  const lines = files.length > 0 ? ['Files:', ...files.map((file) => `  ${marks[file.status]} ${file.path} (${file.status})`)] : ['Files: none to write'];
  if (plan.dependencies.length > 0) lines.push('Packages:', ...plan.dependencies.map((spec) => `  ${spec}`));
  if (plan.devDependencies.length > 0) lines.push('Dev packages:', ...plan.devDependencies.map((spec) => `  ${spec}`));
  return lines.join('\n');
}

export async function executePlan(plan: Plan, { cwd, install: shouldInstall }: { cwd: string; install: boolean }): Promise<void> {
  for (const file of plan.files) {
    if (file.status === 'identical') continue;
    const absolute = join(cwd, file.path);
    mkdirSync(dirname(absolute), { recursive: true });
    writeFileSync(absolute, file.content);
  }
  if (!shouldInstall) return;
  const agent = (await detect({ cwd }))?.agent ?? 'npm';
  for (const [specs, dev] of [
    [plan.dependencies, false],
    [plan.devDependencies, true],
  ] as const) {
    if (specs.length === 0) continue;
    const resolved = resolveCommand(agent, 'add', [...(dev ? ['-D'] : []), ...specs]);
    if (!resolved) throw new CliError(`Do not know how to install packages with ${agent}. Install these yourself: ${specs.join(' ')}`);
    const result = spawnSync(resolved.command, resolved.args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
    if (result.status !== 0) throw new CliError(`\`${resolved.command} ${resolved.args.join(' ')}\` failed. Install these yourself: ${specs.join(' ')}`);
  }
}
