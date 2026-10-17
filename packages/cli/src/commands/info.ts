import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { CONFIG_FILE, parseConfig, type Config } from '../config.js';
import { inspectProject, aliasPath, readJson, type ProjectInfo } from '../project.js';
import { openRegistry, resolveRegistryUrl } from '../registry.js';
import { resolveProjectPreset, type ResolvedPreset } from '../resolve-preset.js';
import { createUrl } from './preset.js';

export type Info = {
  project: ProjectInfo | null;
  config: {
    style: string;
    iconLibrary: string;
    menuColor: string;
    menuAccent: string | null;
    aliases: Config['aliases'];
    resolvedPaths: { cwd: string; tailwindCss: string; utils: string; components: string; lib: string; hooks: string; ui: string };
    registry: string;
  } | null;
  preset: ResolvedPreset | null;
  components: string[];
  links: Record<string, string>;
};

/** Items in the registry's manifest that have a folder under `aliases.ui`, which is where every `registry:ui` item puts its files. */
async function installedItems(uiDir: string, registryUrl: string): Promise<string[]> {
  if (!existsSync(uiDir)) return [];
  const folders = readdirSync(uiDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  if (folders.length === 0) return [];
  const known = new Set((await openRegistry(registryUrl)).manifest.items.map((item) => item.name));
  return folders.map((entry) => entry.name).filter((name) => known.has(name)).sort();
}

export async function collectInfo(cwd: string): Promise<Info> {
  const configPath = join(cwd, CONFIG_FILE);
  const config = existsSync(configPath) ? parseConfig(readJson(configPath)) : null;
  const registryUrl = resolveRegistryUrl(config?.registry);
  const origin = new URL(registryUrl).origin;
  const resolve = (alias: string) => join(cwd, aliasPath(alias));
  const uiDir = config ? resolve(config.aliases.ui) : '';
  return {
    project: inspectProject(cwd, config?.tailwind.css),
    config: config && {
      style: config.style,
      iconLibrary: config.iconLibrary,
      menuColor: config.menuColor,
      menuAccent: config.menuAccent ?? null,
      aliases: config.aliases,
      resolvedPaths: {
        cwd,
        tailwindCss: join(cwd, config.tailwind.css),
        utils: resolve(config.aliases.utils),
        components: resolve(config.aliases.components),
        lib: resolve(config.aliases.lib),
        hooks: resolve(config.aliases.hooks),
        ui: uiDir,
      },
      registry: registryUrl,
    },
    preset: config && resolveProjectPreset(config, cwd),
    components: config ? await installedItems(uiDir, registryUrl) : [],
    links: {
      docs: `${origin}/docs`,
      components: `${origin}/docs/components/[component].md`,
      ui: `${registryUrl}/styles/${config?.style ?? 'nova'}/[component].json`,
      schema: `${origin}/schema.json`,
    },
  };
}

const yesNo = (value: boolean) => (value ? 'Yes' : 'No');

function entries(values: Record<string, string>): string[] {
  const width = Math.max(...Object.keys(values).map((key) => key.length));
  return Object.entries(values).map(([key, value]) => `  ${key.padEnd(width + 2)}${value}`);
}

export function formatPreset(preset: ResolvedPreset, createPage: string): string[] {
  const { values, fallbacks } = preset;
  const show = (key: keyof typeof values) => `${values[key]}${fallbacks.includes(key) ? '*' : ''}`;
  const lines = entries({
    code: preset.code,
    version: preset.code[0]!,
    style: values.style,
    baseColor: show('baseColor'),
    theme: show('theme'),
    chartColor: show('chartColor'),
    iconLibrary: show('iconLibrary'),
    font: show('font'),
    fontHeading: show('fontHeading'),
    radius: show('radius'),
    menuAccent: show('menuAccent'),
    menuColor: show('menuColor'),
    url: `${createPage}?preset=${preset.code}`,
  });
  if (fallbacks.length > 0) lines.push('', '  * Uses preset defaults for values the project does not show.');
  return lines;
}

export function formatInfo(info: Info): string {
  const { project, config, preset, components, links } = info;
  const lines = ['Project'];
  lines.push(
    ...(project
      ? entries({
          framework: `${project.framework} (${project.frameworkName})`,
          frameworkVersion: project.frameworkVersion ?? '-',
          svelteVersion: project.svelteVersion ?? '-',
          tailwindVersion: project.tailwindVersion ?? '-',
          srcDirectory: yesNo(project.srcDirectory),
          tailwindCss: project.tailwindCss ?? '-',
          importAlias: project.importAlias ?? '-',
        })
      : ['  No project info detected.']),
    '',
    'Configuration',
  );
  if (config) {
    lines.push(
      ...entries({ style: config.style, iconLibrary: config.iconLibrary, menuColor: config.menuColor, menuAccent: config.menuAccent ?? '-', registry: config.registry }),
      '',
      'Preset',
      ...formatPreset(preset!, createUrl(config.registry)),
      '',
      'Aliases',
      ...entries(config.aliases),
      '',
      'Resolved Paths',
      ...entries(config.resolvedPaths),
    );
  } else {
    lines.push('  No components.json found.');
  }
  lines.push('', 'Installed Components', components.length > 0 ? `  ${components.join(', ')}` : '  No components installed.', '', 'Links', ...entries(links), '');
  return lines.join('\n');
}

/** Prints the project's facts, its components.json and the preset they add up to, and returns them. */
export async function info(options: { cwd: string; json: boolean }): Promise<Info> {
  const result = await collectInfo(options.cwd);
  console.log(options.json ? JSON.stringify(result, null, 2) : formatInfo(result));
  return result;
}
