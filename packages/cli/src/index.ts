#!/usr/bin/env node
import { resolve } from 'node:path';
import { log } from '@clack/prompts';
import { Command } from 'commander';
import { add } from './commands/add.js';
import { apply } from './commands/apply.js';
import { build } from './commands/build.js';
import { diff } from './commands/diff.js';
import { docs } from './commands/docs.js';
import { eject } from './commands/eject.js';
import { info } from './commands/info.js';
import { init } from './commands/init.js';
import { migrate } from './commands/migrate.js';
import { presetDecode, presetOpen, presetResolve, presetUrl } from './commands/preset.js';
import { search } from './commands/search.js';
import { update } from './commands/update.js';
import { view } from './commands/view.js';
import { CliError } from './parse.js';
import { cliPackage, version } from './version.js';

const program = new Command('sveltery').description('Add Sveltery UI components to a Svelte app.').version(version);

program
  .command('init')
  .description('set up components.json, the theme and the base packages')
  .option('-y, --yes', 'use the defaults without prompting', false)
  .option('-p, --preset [preset]', 'use a preset: a name such as nova, a preset code, or an /init URL')
  .option('--style <name>', 'the component style')
  .option('--icons <library>', 'the icon library')
  .option('--base-color <name>', 'the base color of the theme')
  .option('--css <path>', 'the CSS file that imports Tailwind')
  .option('--rtl', 'enable RTL support')
  .option('--no-rtl', 'disable RTL support')
  .option('--cwd <path>', 'the project root', '.')
  .option('--no-install', 'do not install packages')
  .action(async (options) => void (await init({ ...options, cwd: resolve(options.cwd) })));

program
  .command('apply')
  .description('apply a preset to a project that ran init')
  .argument('[preset]', 'the preset: a name such as nova, a preset code, or an /init URL')
  .option('--preset <preset>', 'the preset, as an option')
  .option('--only [parts]', 'apply only parts of the preset: theme, font')
  .option('-y, --yes', 'do not ask to continue', false)
  .option('-s, --silent', 'do not print the plan or the package manager output', false)
  .option('--no-install', 'do not install packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (preset: string | undefined, options) => void (await apply(preset, { ...options, cwd: resolve(options.cwd) })));

program
  .command('add')
  .description('add components to the project')
  .argument('[items...]', 'item names, @namespace/item names, or URLs of registry items')
  .option('-y, --yes', 'do not ask to continue; changed files are skipped unless --overwrite is set', false)
  .option('-o, --overwrite', 'overwrite changed files', false)
  .option('-a, --all', 'add every item', false)
  .option('--dry-run', 'show the plan and stop', false)
  .option('--diff [path]', 'show the diff of each file that would change, or of the file matching path; implies --dry-run')
  .option('--view [path]', 'show the contents of each file that would be written, or of the file matching path; implies --dry-run')
  .option('--no-install', 'do not install packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await add(items, { ...options, cwd: resolve(options.cwd) })));

program
  .command('diff')
  .description('show how the registry versions of installed items differ from your files')
  .argument('[items...]', 'item names or URLs; every installed item of the registry when omitted')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await diff(items, { cwd: resolve(options.cwd) })));

program
  .command('update')
  .description('re-add installed items, showing each changed file\'s diff and asking before it overwrites')
  .argument('[items...]', 'item names or URLs; every installed item of the registry when omitted')
  .option('-y, --yes', 'overwrite changed files without asking', false)
  .option('--no-install', 'do not install packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await update(items, { ...options, cwd: resolve(options.cwd) })));

program
  .command('search')
  .alias('list')
  .description('search items from registries')
  .argument('[registries...]', 'the registry addresses to search. Supports namespaces, GitHub sources and URLs. When omitted, searches @sveltery and all registries configured in components.json.')
  .option('-q, --query <query>', 'query string')
  .option('-t, --type <type>', 'filter by item type, e.g. ui, block. Comma-separated for multiple.')
  .option('-l, --limit <number>', 'maximum number of items to display', '100')
  .option('-o, --offset <number>', 'number of items to skip', '0')
  .option('--json', 'output as JSON.', false)
  .option('--cwd <path>', 'the project root', '.')
  .action(async (registries: string[], options) => void (await search(registries, { ...options, cwd: resolve(options.cwd) })));

program
  .command('view')
  .description('view items from the registry')
  .argument('<items...>', 'item names, @namespace/item names, or URLs of registry items')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await view(items, { cwd: resolve(options.cwd) })));

program
  .command('build')
  .description('build components for a registry')
  .argument('[registry]', 'path to registry.json file', './registry.json')
  .option('-o, --output <path>', 'destination directory for json files', './static/r')
  .option('-c, --cwd <path>', 'the working directory', '.')
  .action((registry: string, options) => void build(registry, options));

program
  .command('docs')
  .description('get docs, api references and usage examples for components')
  .argument('<components...>', 'component names')
  .option('--json', 'output as JSON.', false)
  .option('--cwd <path>', 'the project root', '.')
  .action(async (components: string[], options) => void (await docs(components, { ...options, cwd: resolve(options.cwd) })));

program
  .command('info')
  .description('get information about your project')
  .option('--json', 'output as JSON.', false)
  .option('--cwd <path>', 'the project root', '.')
  .action(async (options) => void (await info({ ...options, cwd: resolve(options.cwd) })));

const preset = program
  .command('preset')
  .description('manage presets')
  .action(() => preset.outputHelp());

preset
  .command('decode')
  .description('decode a preset code')
  .argument('<code>', 'the preset code to decode')
  .option('--json', 'output as JSON.', false)
  .action((code: string, options) => void presetDecode(code, options));

preset
  .command('url')
  .description('get the create URL for a preset code')
  .argument('<code>', 'the preset code')
  .action((code: string) => void presetUrl(code));

preset
  .command('open')
  .description('open a preset code in the browser')
  .argument('<code>', 'the preset code')
  .action(async (code: string) => void (await presetOpen(code)));

preset
  .command('resolve')
  .alias('info')
  .description('resolve a preset from your project')
  .option('--json', 'output as JSON.', false)
  .option('--cwd <path>', 'the project root', '.')
  .action((options) => void presetResolve({ ...options, cwd: resolve(options.cwd) }));

program
  .command('eject')
  .description(`inline ${cliPackage}/tailwind.css into your CSS file and remove the ${cliPackage} dependency`)
  .option('-y, --yes', 'do not ask to continue', false)
  .option('-s, --silent', 'do not print the warnings or the package manager output', false)
  .option('--cwd <path>', 'the project root', '.')
  .action(async (options) => void (await eject({ ...options, cwd: resolve(options.cwd) })));

program
  .command('migrate')
  .description('run a migration')
  .argument('[migration]', 'the migration to run')
  .argument('[path]', 'a file, directory or glob pattern to migrate')
  .option('-l, --list', 'list all migrations', false)
  .option('-y, --yes', 'skip the confirmation prompt', false)
  .option('-f, --from <name>', 'the base color or icon library to migrate from')
  .option('-t, --to <name>', 'the base color or icon library to migrate to')
  .option('--no-install', 'do not install or remove packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (migration: string | undefined, path: string | undefined, options) => void (await migrate(migration, { ...options, path, cwd: resolve(options.cwd) })));

try {
  await program.parseAsync();
} catch (error) {
  if (!(error instanceof CliError)) throw error;
  log.error(error.message);
  process.exitCode = 1;
}
