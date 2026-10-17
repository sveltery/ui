#!/usr/bin/env node
import { resolve } from 'node:path';
import { log } from '@clack/prompts';
import { Command } from 'commander';
import { add } from './commands/add.js';
import { diff } from './commands/diff.js';
import { init } from './commands/init.js';
import { presetDecode, presetOpen, presetResolve, presetUrl } from './commands/preset.js';
import { list } from './commands/list.js';
import { update } from './commands/update.js';
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

try {
  await program.parseAsync();
} catch (error) {
  if (!(error instanceof CliError)) throw error;
  log.error(error.message);
  process.exitCode = 1;
}
