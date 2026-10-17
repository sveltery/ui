import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asInstalled } from './installed';

const docs = join(import.meta.dirname, '..');
const page = readFileSync(join(docs, 'content/docs/components/data-table.md'), 'utf8');
const files = ['data-table-actions', 'data-table-checkbox', 'data-table-column-header', 'data-table-email-button', 'data-table-pagination', 'data-table-view-options'].map((name) => `${name}.svelte`);

function fenced(title: string) {
  const match = page.match(new RegExp('```\\w+ [^\\n]*title="' + title.replaceAll('/', '\\/').replaceAll('.', '\\.') + '"[^\\n]*\\n([\\s\\S]*?)\\n```'));
  return match?.[1];
}

describe('the Data Table guide shows the example files as they install', () => {
  it.each(files)('%s', (file) => {
    const source = readFileSync(join(docs, 'examples/base/data-table', file), 'utf8');
    expect(fenced(`src/routes/payments/${file}`)).toBe(asInstalled(source, file).trimEnd());
  });

  it('shows the features file', () => {
    const source = readFileSync(join(docs, 'examples/base/data-table/data-table-features.ts'), 'utf8');
    expect(fenced('src/routes/payments/data-table-features.ts')).toBe(source.trimEnd());
  });
});
