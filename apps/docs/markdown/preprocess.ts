import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, relative } from 'node:path';
import type { PreprocessorGroup } from 'svelte/compiler';
import { highlight, packageManagerCommands, parseMeta } from './highlight';

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
export function docsComponents({ examples, ui }: { examples: string; ui: string }): PreprocessorGroup {
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
        const dir = join(ui, name ?? '');
        if (!name || !existsSync(dir)) throw new Error(`${filename}: ComponentSource "${name}" not found at ${dir}`);
        const names = readdirSync(dir).filter((file) => LANGUAGES[extname(file)]);
        const sources = names.map((file) => readFileSync(join(dir, file), 'utf8'));
        // `../shared/*` helpers are copied with the component. Other `../<folder>` imports are components it needs.
        const imports = [...new Set(sources.flatMap((raw) => [...raw.matchAll(/from '\.\.\/([^/']+)\/([^']+)'/g)].map((match) => `${match[1]}/${match[2]}`)))];
        const shared = imports.filter((path) => path.startsWith('shared/')).map((path) => ({ path, raw: readFileSync(join(ui, path.replace(/\.js$/, existsSync(join(ui, path)) ? '.js' : '.ts')), 'utf8') }));
        const requires = [...new Set(imports.filter((path) => !path.startsWith('shared/')).map((path) => path.split('/')[0]))].sort();
        const entries = [
          ...names.map((file, i) => ({ title: `src/lib/components/ui/${name}/${file}`, raw: sources[i], lang: LANGUAGES[extname(file)] })),
          ...shared.map(({ path, raw }) => ({ title: `src/lib/components/ui/${path}`, raw, lang: 'js' })),
        ].sort((a, b) => Number(a.title.endsWith('index.ts')) - Number(b.title.endsWith('index.ts')));
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
