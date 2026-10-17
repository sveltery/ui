import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const docs = join(import.meta.dirname, '..');
const examples = globSync('examples/**/*RtlExample.svelte', { cwd: docs });
const previews = globSync('content/**/*.md', { cwd: docs }).flatMap((page) =>
  [...readFileSync(join(docs, page), 'utf8').matchAll(/<ComponentPreview\b[^>]*\/>/g)].map(([tag]) => ({ page, tag, name: /\bname="([^"]+)"/.exec(tag)?.[1] ?? '' })),
);

// As upstream's `*-rtl` examples call `useTranslation`, an RTL example shows the language the preview's selector picks.
describe.each(examples)('%s', (file) => {
  const source = readFileSync(join(docs, file), 'utf8');

  it('reads its language from the preview', () => {
    expect(source).toContain("import { useLanguage } from '$lib/components/docs/language.svelte';");
  });

  it('renders no language buttons of its own', () => {
    expect(source).not.toMatch(/Object\.(keys|entries)\(translations\)/);
    expect(source).not.toMatch(/\$state<[^>]*\b(translations|Language)\b[^>]*>/);
    expect(source).not.toMatch(/>\s*(en|ar|he)\s*</);
  });

  it('leaves the DirectionProvider to the preview', () => {
    expect(source).not.toContain('<DirectionProvider');
  });
});

describe('RTL previews', () => {
  it.each(previews.filter(({ name }) => name.endsWith('RtlExample')))('$page: $name has the language selector', ({ tag }) => {
    expect(tag).toContain('direction="rtl"');
  });

  it.each(previews.filter(({ tag }) => tag.includes('direction="rtl"')))('$page: $name is an RTL example', ({ name }) => {
    expect(name).toMatch(/RtlExample$/);
  });
});
