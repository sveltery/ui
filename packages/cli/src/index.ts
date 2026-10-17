#!/usr/bin/env node
import { resolve } from 'node:path';
import { log } from '@clack/prompts';
import { Command } from 'commander';
import { add } from './commands/add.js';
import { build } from './commands/build.js';
import { diff } from './commands/diff.js';
import { init } from './commands/init.js';
import { search } from './commands/search.js';
import { update } from './commands/update.js';
import { view } from './commands/view.js';
import { CliError } from './parse.js';
import { version } from './version.js';

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
  .option('--cwd <path>', 'the project root', '.')
  .option('--no-install', 'do not install packages')
  .action(async (options) => void (await init({ ...options, cwd: resolve(options.cwd) })));

program
  .command('add')
  .description('add components to the project')
  .argument('[items...]', 'item names, or URLs of registry items')
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
  .argument('[registries...]', 'the registries to search; the only one is @sveltery, the default')
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
  .argument('<items...>', 'item names, or URLs of registry items')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await view(items, { cwd: resolve(options.cwd) })));

program
  .command('build')
  .description('build components for a registry')
  .argument('[registry]', 'path to registry.json file', './registry.json')
  .option('-o, --output <path>', 'destination directory for json files', './static/r')
  .option('-c, --cwd <path>', 'the working directory', '.')
  .action((registry: string, options) => void build(registry, options));

try {
  await program.parseAsync();
} catch (error) {
  if (!(error instanceof CliError)) throw error;
  log.error(error.message);
  process.exitCode = 1;
}
