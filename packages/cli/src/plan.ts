import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { FILE_HEADERS_ONLY, formatPatch, structuredPatch } from 'diff';
import { detect, resolveCommand } from 'package-manager-detector';
import { CliError } from './parse.js';
import { declaredPackages } from './project.js';

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

/** The unified diff from the project's copy of a `changed` file to the registry's version, with `a/` and `b/` headers. */
export function filePatch(cwd: string, file: PlannedFile): string {
  const path = file.path.replaceAll('\\', '/');
  return formatPatch(structuredPatch(`a/${path}`, `b/${path}`, readFileSync(join(cwd, file.path), 'utf8'), file.content, '', '', { context: 3 }), FILE_HEADERS_ONLY);
}

/** `@scope/name@^1.0.0` → `@scope/name`. */
export const packageName = (spec: string) => (spec.lastIndexOf('@') > 0 ? spec.slice(0, spec.lastIndexOf('@')) : spec);

/** The specs whose package the project does not declare yet. */
export function missingPackages(cwd: string, specs: string[]): string[] {
  const declared = declaredPackages(cwd);
  return [...new Set(specs)].filter((spec) => !declared.has(packageName(spec)));
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
