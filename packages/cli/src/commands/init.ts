import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isCancel, log, select } from '@clack/prompts';
import { CONFIG_FILE, defaultAliases, parseConfig, stylePresets, type Config } from '../config.js';
import { mergeTheme } from '../css.js';
import { iconLibraries } from '../icons.js';
import { CliError } from '../parse.js';
import { executePlan, formatPlan, missingPackages, planFile, type Plan } from '../plan.js';
import { checkProject, findCssFile, libAlias, readJson } from '../project.js';
import { baseColors, fetchTheme, iconLibraryNames, openRegistry, resolveRegistryUrl, styleNames } from '../registry.js';
import { version } from '../version.js';

export type InitOptions = { cwd: string; yes: boolean; install: boolean; style?: string; icons?: string; baseColor?: string; css?: string };

/** Packages every copied component relies on, at the ranges packages/ui uses. */
export const baseDependencies = ['cn@^0.2.2', 'class-variance-authority@^0.7.1', 'tw-animate-css@^1.4.0'];

function pick<T extends string>(flag: string, value: string | undefined, options: readonly T[]): T | undefined {
  if (value === undefined) return undefined;
  if (!(options as readonly string[]).includes(value)) throw new CliError(`Unknown ${flag} "${value}". Choose one of: ${options.join(', ')}.`);
  return value as T;
}

const valid = <T extends string>(value: unknown, options: readonly T[]) => ((options as readonly unknown[]).includes(value) ? (value as T) : undefined);

async function ask<T extends string>(message: string, options: { value: T; label: string; hint?: string }[], initialValue: T): Promise<T> {
  const answer = await select<T>({ message, options: options as Parameters<typeof select<T>>[0]['options'], initialValue });
  if (isCancel(answer)) throw new CliError('Cancelled.');
  return answer;
}

export async function init(options: InitOptions): Promise<Plan> {
  const { cwd } = options;
  checkProject(cwd);
  const configPath = join(cwd, CONFIG_FILE);
  const existing = (existsSync(configPath) ? readJson(configPath) : {}) as Record<string, unknown>;
  if (typeof existing !== 'object' || existing === null || Array.isArray(existing)) throw new CliError(`${CONFIG_FILE} must hold a JSON object.`);
  const existingTailwind = (existing.tailwind ?? {}) as Record<string, unknown>;

  const styleFlag = pick('style', options.style, styleNames);
  const iconsFlag = pick('icon library', options.icons, iconLibraryNames);
  const baseColorFlag = pick('base color', options.baseColor, baseColors);

  const styleDefault = valid(existing.style, styleNames) ?? 'nova';
  const style =
    styleFlag ??
    (options.yes ? styleDefault : await ask('Which style?', styleNames.map((name) => ({ value: name, label: stylePresets[name].title, hint: stylePresets[name].hint })), styleDefault));
  const iconDefault = valid(existing.iconLibrary, iconLibraryNames) ?? stylePresets[style].iconLibrary;
  const iconLibrary = iconsFlag ?? (options.yes ? iconDefault : await ask('Which icon library?', iconLibraryNames.map((name) => ({ value: name, label: name })), iconDefault));
  const baseColorDefault = valid(existingTailwind.baseColor, baseColors) ?? stylePresets[style].baseColor;
  const baseColor = baseColorFlag ?? (options.yes ? baseColorDefault : await ask('Which base color?', baseColors.map((name) => ({ value: name, label: name })), baseColorDefault));

  const existingCss = typeof existingTailwind.css === 'string' && existsSync(join(cwd, existingTailwind.css)) ? existingTailwind.css : undefined;
  const cssPath = findCssFile(cwd, options.css ?? existingCss);

  const registry = await openRegistry(resolveRegistryUrl(typeof existing.registry === 'string' ? existing.registry : undefined));
  if (!registry.manifest.styles.includes(style)) throw new CliError(`The registry at ${registry.url} does not serve the ${style} style.`);
  const theme = await fetchTheme(registry, baseColor);

  const existingAliases = typeof existing.aliases === 'object' && existing.aliases !== null ? (existing.aliases as Record<string, unknown>) : {};
  const config: Config = parseConfig({
    $schema: new URL('/schema.json', registry.url).href,
    style,
    iconLibrary,
    menuColor: 'default',
    tailwind: { css: cssPath, baseColor },
    aliases: { ...defaultAliases(libAlias(cwd)), ...Object.fromEntries(Object.entries(existingAliases).filter(([, value]) => typeof value === 'string')) },
    registry: registry.url,
    typescript: true,
  });
  // Known keys first in a fixed order, then the user's own keys, so a second run writes the same bytes.
  const written = {
    ...config,
    tailwind: { ...existingTailwind, ...config.tailwind },
    aliases: { ...existingAliases, ...config.aliases },
    ...Object.fromEntries(Object.entries(existing).filter(([key]) => !(key in config))),
  };

  const plan: Plan = {
    files: [
      planFile(cwd, CONFIG_FILE, `${JSON.stringify(written, null, 2)}\n`),
      planFile(cwd, cssPath, mergeTheme(readFileSync(join(cwd, cssPath), 'utf8'), theme.cssVars ?? {})),
    ],
    dependencies: missingPackages(cwd, [...baseDependencies, ...iconLibraries[iconLibrary].packages]),
    devDependencies: missingPackages(cwd, [`@sveltery/cli@^${version}`]),
  };
  log.info(formatPlan(plan, { showIdentical: false }));
  await executePlan(plan, { cwd, install: options.install });
  log.success(`Ready. Add a component with \`npx @sveltery/cli@latest add button\`.`);
  return plan;
}
