import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { log } from '@clack/prompts';
import { CONFIG_FILE } from '../config.js';
import { installedRoots, openProject } from '../items.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, type Plan } from '../plan.js';
import { ask } from '../prompt.js';
import { planInit } from './init.js';
import { createUrl, resolvePresetUrl } from './preset.js';

export const APPLY_PARTS = ['theme', 'font'] as const;
export type ApplyPart = (typeof APPLY_PARTS)[number];

/** `only` is the `--only` flag: absent, a list of parts, or `true` when the flag has no value. */
export type ApplyOptions = { cwd: string; preset?: string; only?: string | true; yes: boolean; silent: boolean; install: boolean };

const ONLY_HELP = `Use one or more of: ${APPLY_PARTS.join(', ')}.\nExample: npx @sveltery/ui@latest apply <preset> --only theme,font.`;

/** Comma-separated parts, with `fonts` for `font`, each once. */
export function parseOnly(value: string): ApplyPart[] {
  const aliases: Record<string, ApplyPart> = { theme: 'theme', font: 'font', fonts: 'font' };
  const parts = value
    .split(',')
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  if (parts.length === 0 || parts.some((part) => !aliases[part])) throw new CliError(`Invalid value for --only: ${value}.\n${ONLY_HELP}`);
  return [...new Set(parts.map((part) => aliases[part]!))];
}

/** The `only` param of an `/init` URL, which picks parts the same way `--only` does. */
function onlyOfUrl(preset: string): string | undefined {
  if (!/^https?:\/\//.test(preset)) return undefined;
  const url = new URL(preset);
  return url.pathname === '/init' ? (url.searchParams.get('only') ?? undefined) : undefined;
}

function presetOf(positional: string | undefined, flag: string | undefined): string | undefined {
  const [fromArgument, fromFlag] = [positional?.trim() || undefined, flag?.trim() || undefined];
  if (fromArgument && fromFlag && fromArgument !== fromFlag) throw new CliError('Received two different presets. Pass the preset as the argument or with --preset, not both.');
  return fromFlag ?? fromArgument;
}

const initCommand = (preset: string | undefined) => `npx @sveltery/ui@latest init${preset === undefined ? '' : ` --preset ${/[^\w./:-]/.test(preset) ? JSON.stringify(preset) : preset}`}`;

/**
 * Applies a preset to a project that ran `init`: the same settings, theme and fonts `init --preset` writes. Without `only`, it
 * then re-adds the installed items, overwriting them, so a new style or icon library reaches them.
 */
export async function apply(positional: string | undefined, options: ApplyOptions): Promise<Plan> {
  const { cwd } = options;
  const preset = presetOf(positional, options.preset);
  if (options.only === true) throw new CliError(`Missing value for --only.\n${ONLY_HELP}`);
  const explicitOnly = options.only === undefined ? undefined : parseOnly(options.only);
  if (explicitOnly && preset === undefined) throw new CliError('Missing preset for --only.\nUse: npx @sveltery/ui@latest apply <preset> --only theme,font.');
  if (!existsSync(join(cwd, CONFIG_FILE))) throw new CliError(`No ${CONFIG_FILE} in ${cwd}. The apply command only works in a project that ran init. Run \`${initCommand(preset)}\` first.`);
  const project = await openProject(cwd);

  if (preset === undefined) {
    log.info(`Build your custom preset on ${createUrl(project.registry.url)}.\nThen run \`npx @sveltery/ui@latest apply --preset <preset>\` with the preset code or URL from the page.`);
    return { files: [], dependencies: [], devDependencies: [] };
  }
  const url = new URL(resolvePresetUrl(project.registry.url, preset));
  const urlOnly = onlyOfUrl(preset);
  const only = explicitOnly ?? (urlOnly === undefined ? undefined : parseOnly(urlOnly));
  if (only) url.searchParams.set('only', only.join(','));
  const reinstall = only ? [] : (await installedRoots(project)).map((item) => item.name);

  if (!options.yes) {
    const rows = Array.from({ length: Math.ceil(reinstall.length / 8) }, (_, i) => `  - ${reinstall.slice(i * 8, i * 8 + 8).join(', ')}`);
    log.warn(
      [
        only ? 'Applying the selected preset parts will update your project configuration and styles.' : 'Applying a new preset will overwrite existing UI components, fonts, and CSS variables.',
        'Commit or stash your changes before continuing so you can easily go back.',
        ...(only ? [] : ['', 'The following components will be re-installed:', ...(rows.length > 0 ? rows : ['  - No installed UI components were detected.'])]),
      ].join('\n'),
    );
    if (!(await ask('Would you like to continue?', false))) throw new CliError('Cancelled.');
  }

  const { plan } = (await planInit({ cwd, yes: true, install: options.install, preset: url.href }, reinstall))!;
  if (!options.silent) log.info(formatPlan(plan, { showIdentical: false }));
  await executePlan(plan, { cwd, install: options.install, silent: options.silent });
  log.success('Preset applied successfully.');
  return plan;
}
