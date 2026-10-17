import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE, parseConfig } from '../config.js';
import { CliError } from '../parse.js';
import { removePackage } from '../plan.js';
import { declaredPackages, readJson } from '../project.js';
import { ask } from '../prompt.js';
import { cliPackage } from '../version.js';

export type EjectOptions = { cwd: string; yes: boolean; silent: boolean };

const TAILWIND_IMPORT = new RegExp(`@import\\s+["']${cliPackage.replace('/', '\\/')}\\/tailwind\\.css["'];?[ \\t]*\\n?`);

/** The project's installed copy, else the one that ships with this CLI. */
function packagedTailwindCss(cwd: string): string {
  const installed = join(cwd, 'node_modules', cliPackage, 'tailwind.css');
  return readFileSync(existsSync(installed) ? installed : new URL('../../tailwind.css', import.meta.url), 'utf8');
}

/** Replaces the CSS file's `@sveltery/ui/tailwind.css` import with the file's contents, then removes the package. Returns the CSS path, relative to `cwd`, or undefined when cancelled. */
export async function eject(options: EjectOptions): Promise<string | undefined> {
  const { cwd, silent } = options;
  const configPath = join(cwd, CONFIG_FILE);
  if (!existsSync(configPath)) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
  const cssPath = parseConfig(readJson(configPath)).tailwind.css;
  if (!existsSync(join(cwd, cssPath))) throw new CliError(`${cssPath}, the CSS file in ${CONFIG_FILE}, does not exist.`);
  const css = readFileSync(join(cwd, cssPath), 'utf8');
  if (!TAILWIND_IMPORT.test(css)) throw new CliError(`Could not find @import "${cliPackage}/tailwind.css" in ${cssPath}. Nothing to eject.`);

  const range = declaredPackages(cwd).get(cliPackage);
  const version = range?.replace(/^[\^~]/, '').trim() || 'unknown';
  if (!silent) log.warn(`This action is not reversible. Future ${cliPackage} updates to tailwind.css will not apply automatically.`);
  if (!options.yes) {
    log.message(`This will:\n  - Inline ${cliPackage}/tailwind.css into ${cssPath}\n  - Remove the ${cliPackage} dependency`);
    if (!(await ask('Proceed?', false))) return undefined;
  }

  writeFileSync(join(cwd, cssPath), css.replace(TAILWIND_IMPORT, () => `/* ejected from ${cliPackage}@${version} */\n${packagedTailwindCss(cwd).trim()}\n\n`));
  if (range !== undefined) await removePackage(cwd, cliPackage, { silent });
  else if (!silent) log.warn(`The ${cliPackage} package was not found in package.json. Skipped removal.`);
  log.success(`Ejected ${cliPackage}/tailwind.css into ${cssPath}.`);
  return cssPath;
}
