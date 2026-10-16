import { nav } from './content.server';
import { loadSource } from './load';
import { replaceComponentsList } from './markdown';

const examples = import.meta.glob<string>('/examples/**/*.svelte', { query: '?raw', import: 'default' });

/** Upstream's `processMdxForLLMs`: each `<ComponentPreview>` becomes its example's source. */
async function inlinePreviews(markdown: string) {
  const previews = [...markdown.matchAll(/<ComponentPreview\b[^>]*?\bname="([^"]+)"[^>]*\/>/g)];
  const sources = await Promise.all(previews.map(([, name]) => examples[`/examples/${name}.svelte`]?.()));
  return previews.reduce((result, [tag], i) => (sources[i] ? result.replace(tag, `\`\`\`svelte\n${sources[i].trimEnd()}\n\`\`\``) : result), markdown);
}

/** A docs page as markdown for LLMs, like upstream's `/llm` route behind `/docs/<slug>.md`. */
export async function markdownResponse(slug: string) {
  const markdown = await inlinePreviews(replaceComponentsList(await loadSource(slug), nav));
  return new Response(markdown, { headers: { 'content-type': 'text/markdown; charset=utf-8' } });
}
