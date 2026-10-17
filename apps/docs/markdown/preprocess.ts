import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import type { PreprocessorGroup } from 'svelte/compiler';
import { applyTransforms, type TransformContext } from '../../../packages/cli/src/transforms';
import { buildRegistry } from '../registry/build';
import { readRegistryInput } from '../registry/read';
import type { RegistryItem, RegistryOutput } from '../registry/types';
import { highlight, isCollapsible, packageManagerCommands, parseMeta } from './highlight';

/** The Code view shows what `npx @sveltery/ui@latest init -y` then `add` writes: the nova style with Lucide icons. */
const SOURCE_STYLE = 'nova';
const SOURCE_CONFIG: TransformContext = { iconLibrary: 'lucide', fontHeading: false };

/** Components every markdown page can use without importing them, like upstream's mdx-components map. */
const GLOBAL_COMPONENTS = ['CodeBlock', 'ComponentPreview', 'ComponentSource', 'ComponentsList', 'Callout', 'Steps'];

const PREVIEW_PEEK_LINES = 3;

const scrollableTables = (code: string) => code.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="typeset-scroll scroll-fade-x scrollbar-none *:[table]:w-full"><table>$1</table></div>');

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
  const commands = packageManagerCommands(code.trim());
  if (commands) return `<CodeBlock commands={${literal(commands)}} />`;
  const props = { html: await highlight(code, lang ?? 'text', options), raw: code, title: options.title, lang: lang ?? 'text', collapsible: isCollapsible(code, options) };
  return `<CodeBlock {...${literal(props)}} />`;
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
        const [html, peek] = await Promise.all([highlight(raw, 'svelte', {}, 'source'), highlight(raw.split('\n').slice(0, PREVIEW_PEEK_LINES).join('\n'), 'svelte', {}, 'source')]);
        return `<ComponentPreview${attrs} component={${id}} source={${literal({ raw, html, peek })}} />`;
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
        const files = await Promise.all(entries.map(async ({ title, raw, lang }) => ({ title, raw, lang, html: await highlight(raw, lang, {}, 'source') })));
        return `<ComponentSource${attrs} files={${literal(files)}} requires={${literal(requires)}} />`;
      });

      code = scrollableTables(code);

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
