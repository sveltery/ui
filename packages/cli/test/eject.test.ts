// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { confirm } from '@clack/prompts';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { eject } from '../src/commands/eject.js';

vi.mock('node:child_process', async (importOriginal) => ({ ...(await importOriginal<typeof import('node:child_process')>()), spawnSync: vi.fn(() => ({ status: 0 })) }));
vi.mock('@clack/prompts', async (importOriginal) => ({ ...(await importOriginal<typeof import('@clack/prompts')>()), confirm: vi.fn() }));

const packaged = readFileSync(new URL('../tailwind.css', import.meta.url), 'utf8').trim();
const config = {
  style: 'nova',
  iconLibrary: 'lucide',
  menuColor: 'default',
  tailwind: { css: 'src/app.css', baseColor: 'neutral' },
  aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
  typescript: true,
};
const css = "@import 'tailwindcss';\n@import 'tw-animate-css';\n@import '@sveltery/ui/tailwind.css';\n@custom-variant dark (&:is(.dark *));\n";

let cwd: string;
const originalIsTTY = process.stdin.isTTY;
const read = (path: string) => readFileSync(join(cwd, path), 'utf8');
const writePackage = (devDependencies: Record<string, string>) => writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies }));

beforeEach(() => {
  vi.mocked(spawnSync).mockClear();
  vi.mocked(confirm).mockReset();
  process.stdin.isTTY = true;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-eject-'));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'components.json'), JSON.stringify(config));
  writeFileSync(join(cwd, 'src/app.css'), css);
  writePackage({ '@sveltery/ui': '^0.2.0' });
});
afterEach(() => {
  rmSync(cwd, { recursive: true, force: true });
  process.stdin.isTTY = originalIsTTY;
});

test('inlines the packaged tailwind.css in place of its import and removes the package with the project package manager', async () => {
  writeFileSync(join(cwd, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\n");
  expect(await eject({ cwd, yes: true, silent: false })).toBe('src/app.css');
  expect(read('src/app.css')).toBe(`@import 'tailwindcss';\n@import 'tw-animate-css';\n/* ejected from @sveltery/ui@0.2.0 */\n${packaged}\n\n@custom-variant dark (&:is(.dark *));\n`);
  expect(vi.mocked(spawnSync).mock.calls.map(([command, args]) => [command, args])).toEqual([['pnpm', ['remove', '@sveltery/ui']]]);
});

test('prefers the copy installed in node_modules', async () => {
  mkdirSync(join(cwd, 'node_modules/@sveltery/ui'), { recursive: true });
  writeFileSync(join(cwd, 'node_modules/@sveltery/ui/tailwind.css'), '@custom-variant installed (&:is(.installed *));\n');
  await eject({ cwd, yes: true, silent: false });
  expect(read('src/app.css')).toContain('/* ejected from @sveltery/ui@0.2.0 */\n@custom-variant installed (&:is(.installed *));\n\n@custom-variant dark');
});

test('skips the removal when package.json does not list the package', async () => {
  writePackage({});
  await eject({ cwd, yes: true, silent: false });
  expect(read('src/app.css')).toContain('/* ejected from @sveltery/ui@unknown */');
  expect(spawnSync).not.toHaveBeenCalled();
});

test('asks first, defaulting to no, and a no changes nothing', async () => {
  vi.mocked(confirm).mockResolvedValueOnce(false);
  expect(await eject({ cwd, yes: false, silent: false })).toBeUndefined();
  expect(vi.mocked(confirm).mock.calls[0]![0]).toMatchObject({ message: 'Proceed?', initialValue: false });
  expect([read('src/app.css'), vi.mocked(spawnSync).mock.calls]).toEqual([css, []]);
});

test('stops when there is nothing to eject or no components.json', async () => {
  await eject({ cwd, yes: true, silent: false });
  await expect(eject({ cwd, yes: true, silent: false })).rejects.toThrow('Could not find @import "@sveltery/ui/tailwind.css" in src/app.css. Nothing to eject.');
  rmSync(join(cwd, 'components.json'));
  await expect(eject({ cwd, yes: true, silent: false })).rejects.toThrow(`No components.json in ${cwd}. Run \`npx @sveltery/ui@latest init\` first.`);
});
