import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import * as util from 'node:util';
import { importsTailwind } from './css.js';
import { CliError } from './parse.js';

export function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new CliError(`Could not read ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

const ENV_FILES = ['.env.local', '.env.development.local', '.env.development', '.env'];

/** The environment `${VAR}` placeholders in `registries` read: the process environment, then the project's env files in shadcn's order, earlier ones first. */
export function loadEnv(cwd: string): Record<string, string | undefined> {
  // util.parseEnv arrived in Node 20.12. Before that, only the process environment counts.
  const files = ENV_FILES.map((file) => join(cwd, file)).filter((path) => existsSync(path) && util.parseEnv !== undefined);
  return Object.assign({}, ...files.reverse().map((path) => util.parseEnv(readFileSync(path, 'utf8'))), process.env);
}

/** Every package the project's package.json declares, in any dependency field, with its range. */
export function declaredPackages(cwd: string): Map<string, string> {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) throw new CliError(`No package.json in ${cwd}. Run the CLI in your app's root, or pass --cwd.`);
  const manifest = readJson(path) as Record<string, unknown>;
  const fields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  return new Map(fields.flatMap((field) => Object.entries((manifest[field] ?? {}) as Record<string, unknown>).map(([name, range]) => [name, String(range)] as const)));
}

/** The major version a range pins, or undefined for ranges such as `latest` or `workspace:*`. */
const majorOf = (range: string) => /^[\^~>=v\s]*(\d+)/.exec(range)?.[1];

export function checkProject(cwd: string): void {
  const packages = declaredPackages(cwd);
  const requireMajor = (name: string, major: string, fix: string) => {
    const range = packages.get(name);
    const found = range === undefined ? undefined : majorOf(range);
    if (range === undefined || (found !== undefined && found !== major)) {
      throw new CliError(`Sveltery needs ${name} ${major}${range === undefined ? ', and package.json does not list it' : `, and package.json has ${range}`}. ${fix}`);
    }
  };
  requireMajor('svelte', '5', 'See https://svelte.dev/docs/svelte/v5-migration-guide.');
  requireMajor('tailwindcss', '4', 'Run `npx sv add tailwindcss`, then run init again.');
  if (!packages.has('@sveltejs/kit') && !packages.has('vite')) throw new CliError('Sveltery needs a SvelteKit or Vite project, and package.json lists neither @sveltejs/kit nor vite.');
}

function cssFilesUnder(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .filter((path) => path.endsWith('.css') && !path.split(/[\\/]/).includes('node_modules'))
    .sort()
    .map((path) => join(dir, path));
}

/** The stylesheet that imports Tailwind: `--css`, else `src/app.css`, else the first CSS file under `src/` that imports it. Relative to `cwd`. */
export function findCssFile(cwd: string, flag: string | undefined): string {
  if (flag !== undefined) {
    const path = resolve(cwd, flag);
    if (!existsSync(path)) throw new CliError(`${flag} does not exist.`);
    if (!importsTailwind(readFileSync(path, 'utf8'))) throw new CliError(`${flag} does not contain @import "tailwindcss". Run \`npx sv add tailwindcss\`, or pass the CSS file that imports Tailwind.`);
    return relative(cwd, path);
  }
  const candidates = [join(cwd, 'src/app.css'), ...cssFilesUnder(join(cwd, 'src'))];
  const found = candidates.find((path) => existsSync(path) && importsTailwind(readFileSync(path, 'utf8')));
  if (!found) throw new CliError('Found no CSS file under src/ with @import "tailwindcss". Run `npx sv add tailwindcss`, or pass --css <file>.');
  return relative(cwd, found);
}

/** `#lib` when package.json maps it through `imports`, as SvelteKit 3 apps do, else `$lib`. */
export function libAlias(cwd: string): '$lib' | '#lib' {
  const manifest = readJson(join(cwd, 'package.json')) as { imports?: Record<string, unknown> };
  return manifest.imports?.['#lib/*'] !== undefined ? '#lib' : '$lib';
}

const LIB_PATTERN = './src/lib/*';

// package.json with SvelteKit 3's `"#lib/*": "./src/lib/*"` given a `./src/lib/*/index.js` fallback, or undefined when
// the mapping is anything else. Vite resolves `#lib/components/ui/button` to the directory's index, but TypeScript does
// not look in a directory behind `imports`; it does try each target of an array.
export function withLibIndexFallback(cwd: string): string | undefined {
  const raw = readFileSync(join(cwd, 'package.json'), 'utf8');
  const manifest = JSON.parse(raw) as { imports?: Record<string, unknown> };
  if (manifest.imports?.['#lib/*'] !== LIB_PATTERN) return undefined;
  manifest.imports['#lib/*'] = [LIB_PATTERN, './src/lib/*/index.js'];
  const indent = /^[ \t]+(?=")/m.exec(raw)?.[0] ?? '  ';
  return `${JSON.stringify(manifest, null, indent)}\n`;
}

/**
 * Where an alias points, relative to `cwd`: the directory it names, and the root of the workspace package it is in, which
 * is `''` for the project itself. `$lib` and `#lib` name `src/lib`, `./` and `../` paths are relative to `cwd`, and any other
 * alias, such as `@workspace/ui/components`, is a path that a package of the workspace exports, as upstream resolves it.
 */
export function resolveAlias(cwd: string, alias: string): { path: string; packageDir: string } {
  if (/^[$#]lib(\/|$)/.test(alias)) return { path: join('src/lib', alias.slice('$lib'.length)), packageDir: '' };
  if (alias.startsWith('./') || alias.startsWith('../')) return { path: join(alias), packageDir: '' };
  const exported = resolveWorkspaceExport(cwd, alias);
  if (exported) return exported;
  throw new CliError(
    `Cannot place files for the alias "${alias}". Use a path under $lib or #lib, such as $lib/components/ui, one relative to the project root, such as ./src/ui, or a path that a workspace package exports, such as @workspace/ui/components.`,
  );
}

/** The directory an alias such as `$lib/components/ui` names, relative to `cwd`. */
export const aliasPath = (cwd: string, alias: string) => resolveAlias(cwd, alias).path;

/** The `packages` list of pnpm-workspace.yaml, read line by line as upstream's `parsePnpmWorkspacePackages` does. */
export function pnpmWorkspacePackages(content: string): string[] {
  const patterns: string[] = [];
  let inPackages = false;
  let packagesIndent = 0;
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const key = /^(\s*)([A-Za-z0-9_-]+)\s*:/.exec(line);
    if (key) {
      packagesIndent = key[1]!.length;
      inPackages = key[2] === 'packages';
      continue;
    }
    const entry = inPackages ? /^(\s*)-\s*(.+?)\s*(?:#.*)?$/.exec(line) : null;
    if (entry && entry[1]!.length > packagesIndent) patterns.push(entry[2]!.trim().replace(/^["']|["']$/g, ''));
  }
  return patterns;
}

/** The workspace patterns `dir` declares, in pnpm-workspace.yaml or in the `workspaces` of package.json. */
function workspacePatterns(dir: string): string[] {
  const patterns: string[] = [];
  const pnpm = join(dir, 'pnpm-workspace.yaml');
  if (existsSync(pnpm)) patterns.push(...pnpmWorkspacePackages(readFileSync(pnpm, 'utf8')));
  const manifest = join(dir, 'package.json');
  if (existsSync(manifest)) {
    const { workspaces } = (readJson(manifest) ?? {}) as { workspaces?: unknown };
    const list = Array.isArray(workspaces) ? workspaces : (workspaces as { packages?: unknown } | undefined)?.packages;
    if (Array.isArray(list)) patterns.push(...list.filter((pattern): pattern is string => typeof pattern === 'string' && !pattern.startsWith('!')));
  }
  return [...new Set(patterns)];
}

/** The closest directory at or above `cwd` that declares workspaces. The search stops at the git root. */
function findWorkspaceRoot(cwd: string): string | undefined {
  for (let dir = resolve(cwd); ; dir = dirname(dir)) {
    if (workspacePatterns(dir).length > 0) return dir;
    if (existsSync(join(dir, '.git')) || dirname(dir) === dir) return undefined;
  }
}

const subdirectories = (dir: string) =>
  existsSync(dir) ? readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory() && entry.name !== 'node_modules').map((entry) => join(dir, entry.name)) : [];

/** The directories a workspace pattern such as `packages/*` matches. `*` matches within one segment and `**` at any depth. */
function expandPattern(root: string, pattern: string): string[] {
  let dirs = [root];
  for (const segment of pattern.split('/').filter((part) => part !== '' && part !== '.')) {
    if (segment === '**') {
      const deep = (dir: string): string[] => [dir, ...subdirectories(dir).flatMap(deep)];
      dirs = dirs.flatMap(deep);
    } else if (segment.includes('*')) {
      const matcher = new RegExp(`^${segment.split('*').map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&')).join('[^/]*')}$`);
      dirs = dirs.flatMap((dir) => subdirectories(dir).filter((path) => matcher.test(basename(path))));
    } else dirs = dirs.map((dir) => join(dir, segment)).filter((dir) => existsSync(dir));
  }
  return dirs;
}

/** Files whose presence makes a workspace an app, from upstream's `getMonorepoTargets`. `*` stands for any extension. */
const FRAMEWORK_CONFIG_FILES = ['next.config.*', 'vite.config.*', 'astro.config.*', 'remix.config.*', 'nuxt.config.*', 'svelte.config.*', 'gatsby-config.*', 'angular.json'];

/** Whether `dir` holds a framework's config file, such as vite.config.ts, which is how upstream's `getProjectInfo` tells an app from a package. */
export const hasFrameworkConfig = (dir: string) =>
  readdirSync(dir).some((name) => FRAMEWORK_CONFIG_FILES.some((file) => (file.endsWith('*') ? name.startsWith(file.slice(0, -1)) : name === file)));

/** The workspaces of the monorepo at `root` that have a components.json or a framework config, relative to it, as upstream's `getMonorepoTargets` finds them. Empty when `root` declares no workspaces. */
export function monorepoTargets(root: string): string[] {
  const dirs = new Set(workspacePatterns(root).flatMap((pattern) => expandPattern(root, pattern)));
  return [...dirs]
    .filter((dir) => existsSync(join(dir, 'package.json')) && (existsSync(join(dir, 'components.json')) || hasFrameworkConfig(dir)))
    .map((dir) => relative(root, dir).replaceAll('\\', '/'))
    .sort();
}

/** Upstream's message for a command run at a monorepo root: the command to run in each workspace instead. */
export const formatMonorepoMessage = (command: string, targets: string[]) =>
  [`It looks like you are running ${command} from a monorepo root.`, 'To use Sveltery UI in a specific workspace, use the --cwd flag:', '', ...targets.map((target) => `  npx @sveltery/ui@latest ${command} --cwd ${target}`)].join('\n');

/** The first `./` path in an `exports` value, looking through conditions and fallback arrays in order. */
function exportTarget(value: unknown): string | undefined {
  if (typeof value === 'string') return value.startsWith('./') ? value : undefined;
  const values = Array.isArray(value) ? value : value !== null && typeof value === 'object' ? Object.values(value) : [];
  for (const entry of values) {
    const target = exportTarget(entry);
    if (target !== undefined) return target;
  }
  return undefined;
}

/**
 * The directory that `specifier` names through the `exports` of a workspace package, relative to `cwd`, as upstream's
 * `resolveWorkspacePackageExport` finds it. `@workspace/ui/components` matches `"./components/*": "./src/components/*\/index.ts"`
 * with an empty wildcard, so it names `src/components` in that package.
 */
function resolveWorkspaceExport(cwd: string, specifier: string): { path: string; packageDir: string } | undefined {
  const segments = specifier.split('/');
  const name = specifier.startsWith('@') ? segments.slice(0, 2).join('/') : segments[0]!;
  const root = findWorkspaceRoot(cwd);
  if (root === undefined) return undefined;
  const packageRoot = workspacePatterns(root)
    .flatMap((pattern) => expandPattern(root, pattern))
    .find((dir) => existsSync(join(dir, 'package.json')) && (readJson(join(dir, 'package.json')) as { name?: unknown } | null)?.name === name);
  if (packageRoot === undefined) return undefined;
  const { exports } = readJson(join(packageRoot, 'package.json')) as { exports?: unknown };
  if (exports === null || typeof exports !== 'object' || Array.isArray(exports)) return undefined;
  const entries = Object.entries(exports)
    .filter(([key]) => key === '.' || key.startsWith('./'))
    .map(([key, value]) => ({ base: `${name}/${key.slice(2).replace(/\*$/, '')}`.replace(/\/+$/, ''), wildcard: key.includes('*'), target: exportTarget(value) }));
  const located = (target: string) => ({ path: relative(cwd, join(packageRoot, target)), packageDir: relative(cwd, packageRoot) });

  const exact = entries.find((entry) => !entry.wildcard && entry.base === specifier && entry.target !== undefined);
  if (exact) return located(exact.target!.replace(/\/index\.[^/]+$/, ''));
  // The longest pattern wins, as in Node.
  for (const entry of entries.filter((entry) => entry.wildcard && entry.target !== undefined).sort((a, b) => b.base.length - a.base.length)) {
    const [prefix, suffix = ''] = entry.target!.split('*');
    if (specifier === entry.base) return located(prefix!.replace(/\/$/, ''));
    if (specifier.startsWith(`${entry.base}/`)) return located(`${prefix}${specifier.slice(entry.base.length + 1)}${suffix}`.replace(/\.[^/.]+$/, ''));
  }
  return undefined;
}

/** What `info` reports about the app, from its package.json and files. Versions are `null` when the package is not declared. */
export type ProjectInfo = {
  framework: 'SvelteKit' | 'Vite' | 'Manual';
  frameworkName: 'sveltekit' | 'vite' | 'manual';
  /** SvelteKit's version, or Vite's for a Vite app. */
  frameworkVersion: string | null;
  svelteVersion: string | null;
  tailwindVersion: string | null;
  srcDirectory: boolean;
  tailwindCss: string | null;
  /** `$lib` or `#lib` in a SvelteKit app. */
  importAlias: string | null;
};

/** The installed version when `node_modules` has the package, else the first version in the declared range, else the range as written (`latest`). */
function packageVersion(cwd: string, name: string, range: string | undefined): string | null {
  if (range === undefined) return null;
  const installed = join(cwd, 'node_modules', name, 'package.json');
  if (existsSync(installed)) {
    const { version } = readJson(installed) as { version?: unknown };
    if (typeof version === 'string') return version;
  }
  return /\d+\.\d+\.\d+/.exec(range)?.[0] ?? range;
}

/** The project's facts, or null when `cwd` has no package.json. `configCss` is the `tailwind.css` of an existing components.json. */
export function inspectProject(cwd: string, configCss: string | undefined): ProjectInfo | null {
  if (!existsSync(join(cwd, 'package.json'))) return null;
  const packages = declaredPackages(cwd);
  const version = (name: string) => packageVersion(cwd, name, packages.get(name));
  const kit = packages.has('@sveltejs/kit');
  const [framework, frameworkName, frameworkVersion] = kit
    ? (['SvelteKit', 'sveltekit', version('@sveltejs/kit')] as const)
    : packages.has('vite')
      ? (['Vite', 'vite', version('vite')] as const)
      : (['Manual', 'manual', null] as const);
  let tailwindCss: string | null = null;
  if (configCss !== undefined && existsSync(join(cwd, configCss))) tailwindCss = configCss;
  else {
    try {
      tailwindCss = findCssFile(cwd, undefined);
    } catch (error) {
      if (!(error instanceof CliError)) throw error;
    }
  }
  return {
    framework,
    frameworkName,
    frameworkVersion,
    svelteVersion: version('svelte'),
    tailwindVersion: version('tailwindcss'),
    srcDirectory: existsSync(join(cwd, 'src')),
    tailwindCss,
    importAlias: kit ? libAlias(cwd) : null,
  };
}
