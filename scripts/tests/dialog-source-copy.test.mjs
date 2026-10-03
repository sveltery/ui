// Authored delivery regression: execute the actual documented minimum source copy.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

test('documented minimum Dialog source-copy closure type-checks and builds without the UI package or injected helpers', { timeout: 300000 }, () => {
  const repository = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  const guide = readFileSync(join(repository, 'docs/installation.md'), 'utf8');
  const files = [...guide.matchAll(/<!-- consumer-file: ([\w./+-]+) -->\n```[^\n]*\n([\s\S]*?)\n```/gu)];
  assert.equal(files.length, 9);
  const commands = guide.match(/<!-- consumer-copy -->\n```sh\n([\s\S]*?)\n```/u)?.[1];
  assert(commands);
  const archive = readFileSync(join(repository, '.vendor/sveltery-base-0.0.0.tgz'));
  const pin = JSON.parse(readFileSync(join(repository, 'scripts/base.lock.json'), 'utf8'));
  assert.equal(createHash('sha256').update(archive).digest('hex'), pin.sha256);
  const temporary = mkdtempSync(join(tmpdir(), 'sveltery-dialog-minimum-copy-'));
  const consumer = join(temporary, 'dialog-app');
  const source = join(temporary, 'sveltery-ui');
  const run = (command, args) => {
    try { execFileSync(command, args, { cwd: consumer, encoding: 'utf8', timeout: 180000, maxBuffer: 32 * 1024 * 1024 }); }
    catch (error) { throw new Error(`${command} ${args.join(' ')} failed\n${error.stdout ?? ''}\n${error.stderr ?? ''}`, { cause: error }); }
  };
  try {
    mkdirSync(consumer); mkdirSync(join(consumer, 'vendor'));
    writeFileSync(join(consumer, 'vendor/sveltery-base-0.0.0.tgz'), archive);
    for (const [, path, content] of files) {
      const destination = join(consumer, path); mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, `${content}\n`);
    }
    // Make the pinned checkout available to the documented commands, but do not
    // pre-populate the consumer with any registry family or dependency.
    for (const path of ['apps/docs/registry/bases/base/ui', 'apps/docs/registry/styles', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md']) {
      const destination = join(source, path); mkdirSync(dirname(destination), { recursive: true });
      cpSync(join(repository, path), destination, { recursive: true });
    }
    run('bash', ['-euo', 'pipefail', '-c', commands]);
    assert.deepEqual(readdirSync(join(consumer, 'src/lib/components/ui')).sort(), ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'button', 'dialog', 'icons', 'shared']);
    const manifestPath = join(consumer, 'package.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    delete manifest.dependencies['@sveltery/ui'];
    writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
    const cssPath = join(consumer, 'src/app.css');
    writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace('@sveltery/ui/nova.css', './lib/styles/nova.css').replace('@sveltery/ui/themes.css', './lib/styles/themes.css').replace('@sveltery/ui/styles.css', './lib/styles/styles.css').replace('../node_modules/@sveltery/ui/dist', './lib/components/ui'));
    const pagePath = join(consumer, 'src/routes/+page.svelte');
    writeFileSync(pagePath, readFileSync(pagePath, 'utf8').replace('@sveltery/ui/dialog', '$lib/components/ui/dialog'));
    run('pnpm', ['install']); run('pnpm', ['install', '--frozen-lockfile']);
    assert(!Object.hasOwn(JSON.parse(readFileSync(manifestPath, 'utf8')).dependencies, '@sveltery/ui'));
    run('pnpm', ['check']); run('pnpm', ['build']);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
});
