import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const browser = process.argv.includes('--browser');
assert(process.argv.slice(2).every(arg => arg === '--browser'), 'Only --browser is supported');
const guide = readFileSync(join(repo, 'docs/installation.md'), 'utf8');
const files = [...guide.matchAll(/<!-- consumer-file: ([\w./+-]+) -->\n```[^\n]*\n([\s\S]*?)\n```/gu)];
assert.equal(files.length, 9, 'Expected the nine documented scaffold files');
const remoteFixtureFiles = ['schema.ts', 'form.remote.ts', '+page.svelte', 'type-contract.ts'];
const copyCommands = guide.match(/<!-- consumer-copy -->\n```sh\n([\s\S]*?)\n```/u)?.[1];
assert(copyCommands, 'Expected the documented source-copy commands');
const temporary = mkdtempSync(join(tmpdir(), 'sveltery-installation-'));
const run = (command, args, cwd) => execFileSync(command, args, { cwd, stdio: 'inherit' });
try {
  const artifacts = join(temporary, 'artifacts');
  mkdirSync(artifacts);
  run('pnpm', ['--filter', '@sveltery/ui', 'build'], repo);
  run('pnpm', ['--filter', '@sveltery/ui', 'pack', '--pack-destination', artifacts], repo);
  cpSync(join(repo, '.vendor/sveltery-base-0.0.0.tgz'), join(artifacts, 'sveltery-base-0.0.0.tgz'));
  for (const path of ['apps/docs/registry/bases/base/ui/dialog', 'apps/docs/registry/bases/base/ui/button', 'apps/docs/registry/bases/base/ui/textarea', 'apps/docs/registry/bases/base/ui/shared', 'apps/docs/registry/styles/style-nova.css', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md']) {
    const destination = join(temporary, 'sveltery-ui', path);
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(join(repo, path), destination, { recursive: true });
  }
  for (const mode of ['package', 'copy']) {
    const consumer = join(temporary, mode);
    mkdirSync(consumer);
    cpSync(artifacts, join(consumer, 'vendor'), { recursive: true });
    for (const [, path, content] of files) {
      const destination = join(consumer, path);
      mkdirSync(dirname(destination), { recursive: true });
      writeFileSync(destination, `${content}\n`);
    }
    // Remote fields are a separate experimental test fixture, not part of the
    // documented consumer scaffold or the production docs application.
    rmSync(join(consumer, 'svelte.config.js'));
    writeFileSync(join(consumer, 'vite.config.ts'), `import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
export default defineConfig({ plugins: [tailwindcss(), sveltekit({ adapter: adapter(), compilerOptions: { experimental: { async: true } }, experimental: { remoteFunctions: true } })] });
`);
    const remoteRoute = join(consumer, 'src/routes/remote-fields');
    mkdirSync(remoteRoute, { recursive: true });
    for (const file of remoteFixtureFiles) {
      let content = readFileSync(join(repo, 'apps/docs/remote-fields-fixture/src/routes', file), 'utf8');
      if (mode === 'copy') {
        content = content.replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea').replaceAll('@sveltery/ui/button', '$lib/components/ui/button');
      }
      writeFileSync(join(remoteRoute, file), content);
    }
    const buttonRoute = join(consumer, 'src/routes/button/+page.svelte');
    mkdirSync(dirname(buttonRoute), { recursive: true });
    writeFileSync(buttonRoute, readFileSync(join(repo, 'scripts/button-consumer.svelte'), 'utf8'));
    const textareaRoute = join(consumer, 'src/routes/textarea/+page.svelte');
    mkdirSync(dirname(textareaRoute), { recursive: true });
    writeFileSync(textareaRoute, readFileSync(join(repo, 'scripts/textarea-consumer.svelte'), 'utf8'));
    const consumerManifestPath = join(consumer, 'package.json');
    const consumerManifest = JSON.parse(readFileSync(consumerManifestPath, 'utf8'));
    consumerManifest.dependencies['class-variance-authority'] = '0.7.1';
    writeFileSync(consumerManifestPath, `${JSON.stringify(consumerManifest, null, 2)}\n`);
    if (mode === 'copy') {
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/button'), join(consumer, 'src/lib/components/ui/button'), { recursive: true });
      writeFileSync(buttonRoute, readFileSync(buttonRoute, 'utf8').replace('@sveltery/ui/button', '$lib/components/ui/button'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/textarea'), join(consumer, 'src/lib/components/ui/textarea'), { recursive: true });
      writeFileSync(textareaRoute, readFileSync(textareaRoute, 'utf8').replace('@sveltery/ui/textarea', '$lib/components/ui/textarea'));
      run('bash', ['-euo', 'pipefail', '-c', copyCommands], consumer);
      const manifestPath = join(consumer, 'package.json');
      const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
      delete manifest.dependencies['@sveltery/ui'];
      writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
      const cssPath = join(consumer, 'src/app.css');
      writeFileSync(cssPath, readFileSync(cssPath, 'utf8').replace('@sveltery/ui/nova.css', './lib/styles/nova.css').replace('../node_modules/@sveltery/ui/dist', './lib/components/ui'));
      const pagePath = join(consumer, 'src/routes/+page.svelte');
      writeFileSync(pagePath, readFileSync(pagePath, 'utf8').replace('@sveltery/ui/dialog', '$lib/components/ui/dialog'));
    }
    run('pnpm', ['install'], consumer);
    run('pnpm', ['install', '--frozen-lockfile'], consumer);
    run('pnpm', ['check'], consumer);
    run('pnpm', ['build'], consumer);
    if (browser) {
      execFileSync('pnpm', ['exec', 'playwright', 'test', '--config', 'scripts/installation-playwright.config.ts'], {
        cwd: repo, stdio: 'inherit', env: { ...process.env, SVELTERY_INSTALLATION_CONSUMER: consumer },
      });
    }
    console.log(`Fresh documented ${mode} consumer with isolated remote-field fixture: install, frozen lock, types, SSR/client build${browser ? ' and secured browser' : ''} PASS`);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
