import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asInstalled } from './installed';

const docs = join(import.meta.dirname, '..');
const page = readFileSync(join(docs, 'content/docs/components/data-table.md'), 'utf8');
const examples = join(docs, 'examples/base/data-table');
const files = ['data-table-actions', 'data-table-amount', 'data-table-checkbox', 'data-table-column-header', 'data-table-email-button', 'data-table-pagination', 'data-table-view-options'].map((name) => `${name}.svelte`);

function fenced(title: string) {
  return blocks(title)[0];
}

function blocks(title: string) {
  const fence = new RegExp('```\\w+ [^\\n]*title="' + title.replaceAll('/', '\\/').replaceAll('.', '\\.') + '"[^\\n]*\\n([\\s\\S]*?)\\n```', 'g');
  return [...page.matchAll(fence)].map((match) => match[1]);
}

const importStatement = /^import\s+(?:type\s+)?([\s\S]*?)\s+from\s+'([^']+)';\n/gm;

function split(code: string) {
  const imports = new Map<string, Set<string>>();
  for (const [, clause, module] of code.matchAll(importStatement)) {
    const names = imports.get(module) ?? new Set<string>();
    for (const name of clause.replace(/[{}]/g, ',').split(',')) {
      const trimmed = name.trim().replace(/^type\s+/, '');
      if (trimmed) names.add(trimmed);
    }
    imports.set(module, names);
  }
  const lines = code
    .replace(importStatement, '')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && line !== '// ...' && line !== '<!-- ... -->');
  return { imports, lines };
}

describe('the Data Table guide shows the example files as they install', () => {
  it.each(files)('%s', (file) => {
    const source = readFileSync(join(examples, file), 'utf8');
    expect(fenced(`src/routes/payments/${file}`)).toBe(asInstalled(source, file).trimEnd());
  });

  it('shows the features file', () => {
    const source = readFileSync(join(examples, 'data-table-features.ts'), 'utf8');
    expect(fenced('src/routes/payments/data-table-features.ts')).toBe(source.trimEnd());
  });
});

// The guide builds data-table.svelte and columns.ts one step at a time, so no single block is the finished file.
// Each block must still be a slice of the finished file in examples/, which the type check and the browser tests cover.
describe('the Data Table guide steps add up to the finished files', () => {
  const finished = {
    'data-table.svelte': split(asInstalled(readFileSync(join(examples, 'data-table.svelte'), 'utf8'), 'data-table.svelte')),
    // The first columns.ts block is the starting point that later steps replace, so only the later blocks are slices.
    'columns.ts': split(asInstalled(readFileSync(join(examples, 'columns.ts'), 'utf8'), 'columns.ts'))
  };

  it.each([
    ['data-table.svelte', 0, 4],
    ['columns.ts', 1, 4]
  ] as const)('every %s block from index %i is a slice of the finished file', (file, from, count) => {
    const steps = blocks(`src/routes/payments/${file}`).slice(from);
    expect(steps).toHaveLength(count);
    const end = finished[file];
    for (const step of steps) {
      const { imports, lines } = split(step);
      for (const [module, names] of imports) {
        for (const name of names) expect(end.imports.get(module), `${name} from ${module}`).toContain(name);
      }
      let position = 0;
      for (const line of lines) {
        const found = end.lines.indexOf(line, position);
        expect(found, `"${line}" in order in ${file}`).toBeGreaterThanOrEqual(0);
        position = found + 1;
      }
    }
  });
});
