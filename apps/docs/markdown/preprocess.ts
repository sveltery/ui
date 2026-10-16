import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import type { PreprocessorGroup } from 'svelte/compiler';
import { applyTransforms, type TransformContext } from '../../../packages/cli/src/transforms';
import { buildRegistry } from '../registry/build';
import { readRegistryInput } from '../registry/read';
import type { RegistryItem, RegistryOutput } from '../registry/types';
import { highlight, packageManagerCommands, parseMeta } from './highlight';

/** The Code view shows what `npx @sveltery/cli@latest init -y` then `add` writes: the nova style with Lucide icons. */
const SOURCE_STYLE = 'nova';
const SOURCE_CONFIG: TransformContext = { iconLibrary: 'lucide', fontHeading: false };

/** Components every markdown page can use without importing them, like upstream's mdx-components map. */
const GLOBAL_COMPONENTS = ['CodeBlock', 'ComponentPreview', 'ComponentSource', 'ComponentsList', 'Callout', 'Steps'];

const LANGUAGES: Record<string, string> = { '.svelte': 'svelte', '.ts': 'ts', '.js': 'js', '.css': 'css', '.json': 'json' };

/** Serializes a value into a JS expression that is safe inside Svelte markup and scripts. */
const literal = (value: unknown) => JSON.stringify(value).replace(/</g, '\\u003c');

async function replaceAsync(input: string, pattern: RegExp, replace: (...match: string[]) => Promise<string>) {
  const replacements = await Promise.all([...input.matchAll(pattern)].map((match) => replace(...match)));
  let i = 0;
  return input.replace(pattern, () => replacements[i++]);
}

const attribute = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1];

/** mdsvex `highlight.highlighter`: renders fenced code as a `<CodeBlock>` with build-time Shiki HTML. */
export async function highlightCodeBlock(code: string, lang: string | null | undefined, meta: string | null | undefined) {
  const options = parseMeta(meta);
  const html = await highlight(code, lang ?? 'text', options);
  const variants = packageManagerCommands(code.trim());
  const commands = variants && Object.fromEntries(await Promise.all(Object.entries(variants).map(async ([pm, command]) => [pm, { raw: command, html: await highlight(command, 'bash') }])));
  return `<CodeBlock html={${literal(html)}} raw={${literal(code)}}${commands ? ` commands={${literal(commands)}}` : ''} />`;
}

/**
 * Runs after mdsvex on `.md` pages. It imports the docs components a page uses, and resolves
 * `<ComponentPreview name>` and `<ComponentSource name>` into components plus highlighted source at build time.
 */
export function docsComponents({ examples, repoRoot }: { examples: string; repoRoot: string }): PreprocessorGroup {
  let built: RegistryOutput | undefined;
  const registry = () => (built ??= buildRegistry(readRegistryInput(repoRoot, 'http://localhost')));
  return {
    name: 'docs-components',
    async markup({ content, filename }) {
      if (!filename?.endsWith('.md')) return;
      const imports: string[] = [];

      if (/<\/Component(Preview|Source)>/.test(content)) throw new Error(`${filename}: write ComponentPreview and ComponentSource as self-closing tags`);

      let code = await replaceAsync(content, /<ComponentPreview\b([^>]*?)\s*\/>/g, async (_tag, attrs) => {
        const name = attribute(attrs, 'name');
        const file = join(examples, `${name}.svelte`);
        if (!name || !existsSync(file)) throw new Error(`${filename}: ComponentPreview example "${name}" not found at ${file}`);
        const raw = readFileSync(file, 'utf8');
        const id = `__example${imports.length}`;
        imports.push(`import ${id} from ${literal(`./${relative(dirname(filename), file)}`)};`);
        return `<ComponentPreview${attrs} component={${id}} source={${literal({ raw, html: await highlight(raw, 'svelte') })}} />`;
      });

      code = await replaceAsync(code, /<ComponentSource\b([^>]*?)\s*\/>/g, async (_tag, attrs) => {
        const name = attribute(attrs, 'name');
        const item = name ? registry().get(`styles/${SOURCE_STYLE}/${name}.json`) : undefined;
        if (!item || !('files' in item)) throw new Error(`${filename}: ComponentSource "${name}" is not a registry item`);
        const requires = (item.registryDependencies ?? []).filter((dependency) => dependency !== 'shared');
        const shared = item.registryDependencies?.includes('shared') ? (registry().get(`styles/${SOURCE_STYLE}/shared.json`) as RegistryItem).files : [];
        const entries = [...item.files, ...shared]
          .map((file) => ({ title: `src/lib/components/ui/${file.target}`, raw: applyTransforms(file, SOURCE_CONFIG).content, lang: LANGUAGES[extname(file.target)] ?? 'text' }))
          .sort((a, b) => Number(a.title.endsWith('index.ts')) - Number(b.title.endsWith('index.ts')));
        const files = await Promise.all(entries.map(async ({ title, raw, lang }) => ({ title, raw, html: await highlight(raw, lang, { title }) })));
        return `<ComponentSource${attrs} files={${literal(files)}} requires={${literal(requires)}} />`;
      });

      for (const component of GLOBAL_COMPONENTS) {
        if (new RegExp(`<${component}\\b`).test(code)) imports.push(`import ${component} from '$lib/components/docs/${component}.svelte';`);
      }
      if (!imports.length) return { code };

      const instance = /<script(?![^>]*\b(?:context="module"|module)\b)[^>]*>/.exec(code);
      if (instance) {
        const at = instance.index + instance[0].length;
        return { code: `${code.slice(0, at)}\n${imports.join('\n')}\n${code.slice(at)}` };
      }
      return { code: `<script>\n${imports.join('\n')}\n</script>\n${code}` };
    },
  };
}
