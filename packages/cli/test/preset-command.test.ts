// @vitest-environment node
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { decodePresetCode, openInBrowser, presetDecode, presetOpen, presetResolve, presetUrl } from '../src/commands/preset.js';

const site = 'https://ui.example.test';
let cwd: string;
beforeEach(() => {
  process.env.SVELTERY_REGISTRY_URL = `${site}/r`;
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-preset-'));
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

function printed(run: () => unknown) {
  const log = vi.spyOn(console, 'log').mockImplementation(() => {});
  try {
    run();
    return log.mock.calls.map(([line]) => line).join('\n');
  } finally {
    log.mockRestore();
  }
}

describe('preset decode', () => {
  test('prints every setting of the code, and the Create page link', () => {
    expect(printed(() => presetDecode('b4xFeBLg4O', { json: false }))).toBe(`  code         b4xFeBLg4O
  version      b
  style        sera
  baseColor    taupe
  theme        taupe
  chartColor   taupe
  iconLibrary  lucide
  font         noto-sans
  fontHeading  playfair-display
  radius       default
  menuAccent   subtle
  menuColor    default
  url          ${site}/create?preset=b4xFeBLg4O`);
  });

  test('--json prints the code, its version, the values, what was derived and the URL', () => {
    expect(JSON.parse(printed(() => presetDecode('b0', { json: true })))).toEqual({
      code: 'b0',
      version: 'b',
      values: { style: 'nova', baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral', iconLibrary: 'lucide', font: 'inter', fontHeading: 'inherit', radius: 'default', menuAccent: 'subtle', menuColor: 'default' },
      derived: [],
      url: `${site}/create?preset=b0`,
    });
  });

  test('derives the chart color of an older code from its theme, and marks it', () => {
    expect(decodePresetCode('a2Lk9Qz').derived).toEqual(['chartColor']);
    expect(decodePresetCode('a2Lk9Qz').values).toMatchObject({ theme: 'stone', chartColor: 'lime', fontHeading: 'inherit' });
    const output = printed(() => presetDecode('a2Lk9Qz', { json: false }));
    expect(output).toContain('  chartColor   lime*\n');
    expect(output).toContain('  version      a\n');
    expect(output.endsWith('\n\n  * Compatibility value for older preset versions.')).toBe(true);
  });

  test.each(['', 'b', 'zz', 'b!!', 'bzzzzzzzzzz'])('rejects the code "%s"', (code) => {
    expect(() => decodePresetCode(code)).toThrow(`Invalid preset code: ${code}`);
  });
});

describe('preset url', () => {
  test('prints the Create page URL on the registry origin', () => {
    expect(printed(() => presetUrl('b4xFeBLg4O'))).toBe(`${site}/create?preset=b4xFeBLg4O`);
  });

  test('rejects an invalid code', () => {
    expect(() => presetUrl('nope!')).toThrow('Invalid preset code: nope!');
  });
});

describe('preset open', () => {
  test('says what it opens, then opens the URL', async () => {
    const open = vi.fn(async () => {});
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      await presetOpen('b0', open);
      expect(log.mock.calls.map(([line]) => line)).toEqual([`\n  Opening ${site}/create?preset=b0 in your browser.\n`]);
    } finally {
      log.mockRestore();
    }
    expect(open).toHaveBeenCalledExactlyOnceWith(`${site}/create?preset=b0`);
  });

  test('reports an opener that fails', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    try {
      await expect(presetOpen('b0', async () => Promise.reject(new Error('boom')))).rejects.toThrow('Failed to open preset URL: boom');
    } finally {
      log.mockRestore();
    }
  });

  test('opens nothing for an invalid code', async () => {
    const open = vi.fn(async () => {});
    await expect(presetOpen('zz', open)).rejects.toThrow('Invalid preset code: zz');
    expect(open).not.toHaveBeenCalled();
  });
});

describe.skipIf(process.platform !== 'linux')('openInBrowser', () => {
  const originalPath = process.env.PATH;
  afterEach(() => void (process.env.PATH = originalPath));

  test('runs xdg-open with the URL', async () => {
    const bin = join(cwd, 'bin');
    mkdirSync(bin);
    writeFileSync(join(bin, 'xdg-open'), `#!/bin/sh\nprintf '%s' "$1" > "${cwd}/opened"\n`);
    chmodSync(join(bin, 'xdg-open'), 0o755);
    process.env.PATH = bin;
    await openInBrowser(`${site}/create?preset=b0`);
    for (let attempt = 0; !existsSync(join(cwd, 'opened')) && attempt < 100; attempt++) await new Promise((done) => setTimeout(done, 20));
    expect(readFileSync(join(cwd, 'opened'), 'utf8')).toBe(`${site}/create?preset=b0`);
  });

  test('rejects when there is no opener', async () => {
    process.env.PATH = join(cwd, 'empty');
    await expect(openInBrowser(site)).rejects.toThrow('ENOENT');
  });
});

describe('preset resolve', () => {
  const config = {
    style: 'nova',
    iconLibrary: 'lucide',
    menuColor: 'default',
    menuAccent: 'subtle',
    tailwind: { css: 'src/app.css', baseColor: 'neutral' },
    aliases: { components: '$lib/components', ui: '$lib/components/ui', utils: '$lib/utils', lib: '$lib', hooks: '$lib/hooks' },
    typescript: true,
  };
  const css = `@import '@fontsource-variable/inter';
:root { --primary: oklch(0.205 0 0); --chart-1: oklch(0.87 0 0); --radius: 0.625rem; }
.dark { --primary: oklch(0.922 0 0); --chart-1: oklch(0.87 0 0); }
@theme inline { --font-sans: 'Inter Variable', sans-serif; --font-heading: var(--font-sans); }
`;
  const project = (cssText = css) => {
    mkdirSync(join(cwd, 'src'));
    writeFileSync(join(cwd, 'components.json'), JSON.stringify(config));
    writeFileSync(join(cwd, 'src/app.css'), cssText);
  };

  test('says there is no components.json, or prints null', () => {
    expect(printed(() => presetResolve({ cwd, json: false }))).toBe('No components.json found.');
    expect(printed(() => presetResolve({ cwd, json: true }))).toBe('null');
  });

  test('prints the preset the project shows, with the Create page link', () => {
    project();
    expect(printed(() => presetResolve({ cwd, json: false }))).toBe(`  code         b0
  version      b
  style        nova
  baseColor    neutral
  theme        neutral
  chartColor   neutral
  iconLibrary  lucide
  font         inter
  fontHeading  inherit
  radius       default
  menuAccent   subtle
  menuColor    default
  url          ${site}/create?preset=b0`);
  });

  test('--json prints the code, the values and the fallbacks', () => {
    project("@import 'tailwindcss';\n");
    expect(JSON.parse(printed(() => presetResolve({ cwd, json: true })))).toEqual({
      code: 'b2fA',
      values: { style: 'nova', baseColor: 'neutral', theme: 'neutral', chartColor: 'neutral', iconLibrary: 'lucide', font: 'geist', fontHeading: 'inherit', radius: 'default', menuAccent: 'subtle', menuColor: 'default' },
      fallbacks: ['theme', 'chartColor', 'font', 'fontHeading', 'radius'],
    });
  });

  test('rejects an invalid components.json', () => {
    writeFileSync(join(cwd, 'components.json'), JSON.stringify({ ...config, style: 'bogus' }));
    expect(() => presetResolve({ cwd, json: false })).toThrow('components.json is invalid.');
  });
});
