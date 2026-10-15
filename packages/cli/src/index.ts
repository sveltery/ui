#!/usr/bin/env node
import { resolve } from 'node:path';
import { log } from '@clack/prompts';
import { Command } from 'commander';
import { add } from './commands/add.js';
import { init } from './commands/init.js';
import { CliError } from './parse.js';
import { version } from './version.js';

const program = new Command('sveltery').description('Add Sveltery UI components to a Svelte app.').version(version);

program
  .command('init')
  .description('set up components.json, the theme and the base packages')
  .option('-y, --yes', 'use the defaults without prompting', false)
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

try {
  await program.parseAsync();
} catch (error) {
  if (!(error instanceof CliError)) throw error;
  log.error(error.message);
  process.exitCode = 1;
}
