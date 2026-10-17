import { globSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { asInstalled } from './installed';

const docs = join(import.meta.dirname, '..');
const sources = globSync(['examples/**/*.svelte', 'blocks/**/*.svelte'], { cwd: docs });

describe('asInstalled', () => {
  it('imports the components where `add` writes them', () => {
    const code = asInstalled(readFileSync(join(docs, 'examples/base/ButtonExample.svelte'), 'utf8'), 'ButtonExample.svelte');
    expect(code).toContain("import { Example, ExampleWrapper } from '$lib/components/example';");
    expect(code).toContain("import { Button, buttonVariants } from '$lib/components/ui/button';");
    expect(code).toContain("import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';");
    expect(code).not.toContain('IconPlaceholder');
  });

  it.each(sources)('leaves no registry import in %s', (file) => {
    expect(asInstalled(readFileSync(join(docs, file), 'utf8'), file)).not.toContain('$registry/');
  });
});
