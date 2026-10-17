import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { importsTailwind } from './css.js';
import { CliError } from './parse.js';

export function readJson(path: string): unknown {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    throw new CliError(`Could not read ${path}: ${error instanceof Error ? error.message : String(error)}`);
  }
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

/** The directory an alias such as `$lib/components/ui` names, relative to `cwd`. */
export function aliasPath(alias: string): string {
  if (/^[$#]lib(\/|$)/.test(alias)) return join('src/lib', alias.slice('$lib'.length));
  if (alias.startsWith('./') || alias.startsWith('../')) return join(alias);
  throw new CliError(`Cannot place files for the alias "${alias}". Use a path under $lib or #lib, such as $lib/components/ui, or one relative to the project root, such as ./src/ui.`);
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
