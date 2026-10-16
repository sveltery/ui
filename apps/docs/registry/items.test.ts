// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { planItems } from './items';

const manifest = {
  dependencies: { cn: '0.2.2', tilde: '~1.4.0', pre: '2.0.0-rc.1' },
  peerDependencies: { '@sveltery/base': '*', '@sveltery/command': '*', 'date-fns': '^4.4.0', ranged: '>=1 <2' },
  devDependencies: { '@sveltery/base': 'github:sveltery/base#abc', '@sveltery/command': 'workspace:*', ranged: '1.2.3' },
};
const sources = {
  'foo/Foo.svelte': `<script lang="ts">
  import { cn } from 'cn';
  import Bar from '../bar/Bar.svelte';
  import { render } from '../shared/render.js';
  import { Icon } from '../icons/index.js';
  import type { HTMLAttributes } from 'svelte/elements';
  import { mount } from 'svelte';
  import { Dialog } from '@sveltery/base/dialog';
  import { local } from './local.js';
  import { Command } from '@sveltery/command';
  import { format } from 'date-fns';
  import 'tilde';
</script>`,
  'foo/local.ts': `export { x } from 'pre'; export * from 'ranged';`,
  'foo/Foo.test.ts': `import { describe } from 'vitest';`,
  'bar/Bar.svelte': `<div></div>`,
  'shared/render.ts': `export const render = 1;`,
  'icons/generated.ts': `export const x = 1;`,
  'index.ts': `export * from './foo/index.js';`,
};

describe('planItems', () => {
  const plans = planItems(sources, manifest, { '@sveltery/command': '1.2.0' });
  const summary = plans.map(({ name, type, title, files, dependencies, registryDependencies }) => ({ name, type, title, files: files.map((file) => file.path), dependencies, registryDependencies }));

  it('makes one item per component folder, in name order, and turns shared into a lib item', () => {
    expect(summary.map(({ name, type, title }) => [name, type, title])).toEqual([
      ['bar', 'registry:ui', 'Bar'],
      ['foo', 'registry:ui', 'Foo'],
      ['shared', 'registry:lib', 'Shared'],
    ]);
  });

  it('lists the files of an item, leaving out tests', () => {
    expect(summary[1]!.files).toEqual(['foo/Foo.svelte', 'foo/local.ts']);
  });

  it('derives registry dependencies from ../ imports, without icons', () => {
    expect(summary[1]!.registryDependencies).toEqual(['bar', 'shared']);
    expect(summary[0]!.registryDependencies).toEqual([]);
  });

  it('derives npm dependencies from bare imports and re-exports, with a range per manifest spec', () => {
    expect(summary[1]!.dependencies).toEqual([
      '@sveltery/base',
      '@sveltery/command@^1.2.0',
      'cn@^0.2.2',
      'date-fns@^4.4.0',
      'pre@^2.0.0-rc.1',
      'ranged@^1.2.3',
      'tilde@^1.4.0',
    ]);
  });

  it('throws when a file imports a folder that is not an item', () => {
    expect(() => planItems({ 'a/A.ts': `import { y } from '../styles/y.js';` }, {}, {})).toThrow('a/A.ts: imports ../styles/, which is not a registry item');
  });

  it('throws when a workspace dependency has no version', () => {
    expect(() => planItems({ 'a/A.ts': `import 'w';` }, { devDependencies: { w: 'workspace:*' } }, {})).toThrow('w is a workspace dependency but has no workspace version');
  });
});
