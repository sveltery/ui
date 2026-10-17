#!/usr/bin/env node
import { resolve } from 'node:path';
import { log } from '@clack/prompts';
import { Command } from 'commander';
import { add } from './commands/add.js';
import { diff } from './commands/diff.js';
import { init } from './commands/init.js';
import { list } from './commands/list.js';
import { migrate } from './commands/migrate.js';
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
  .option('--no-install', 'do not install packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await add(items, { ...options, cwd: resolve(options.cwd) })));

program
  .command('diff')
  .description('show how the registry versions of installed items differ from your files')
  .argument('[items...]', 'item names; every installed item when omitted')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await diff(items, { cwd: resolve(options.cwd) })));

program
  .command('update')
  .description('re-add installed items, showing each changed file\'s diff and asking before it overwrites')
  .argument('[items...]', 'item names; every installed item when omitted')
  .option('-y, --yes', 'overwrite changed files without asking', false)
  .option('--no-install', 'do not install packages')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await update(items, { ...options, cwd: resolve(options.cwd) })));

program
  .command('list')
  .description('list the registry\'s items and mark the installed ones')
  .option('--json', 'print the items as JSON', false)
  .option('--cwd <path>', 'the project root', '.')
  .action(async (options) => void (await list({ ...options, cwd: resolve(options.cwd) })));

program
  .command('view')
  .description('view items from the registry')
  .argument('<items...>', 'item names, or URLs of registry items')
  .option('--cwd <path>', 'the project root', '.')
  .action(async (items: string[], options) => void (await view(items, { cwd: resolve(options.cwd) })));

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
