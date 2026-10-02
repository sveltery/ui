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
  for (const path of ['apps/docs/registry/bases/base/ui/dialog', 'apps/docs/registry/bases/base/ui/button', 'apps/docs/registry/bases/base/ui/textarea', 'apps/docs/registry/bases/base/ui/skeleton', 'apps/docs/registry/bases/base/ui/kbd', 'apps/docs/registry/bases/base/ui/table', 'apps/docs/registry/bases/base/ui/card', 'apps/docs/registry/bases/base/ui/label', 'apps/docs/registry/bases/base/ui/shared', 'apps/docs/registry/styles/style-nova.css', 'packages/ui/LICENSE', 'packages/ui/THIRD_PARTY_NOTICES.md']) {
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
    const basePinRoute = join(consumer, 'src/routes/base-pin/+page.svelte');
    mkdirSync(dirname(basePinRoute), { recursive: true });
    let basePinFixture = readFileSync(join(repo, 'apps/docs/examples/base/BasePinExample.svelte'), 'utf8');
    if (mode === 'copy') {
      basePinFixture = basePinFixture.replaceAll('@sveltery/ui/button', '$lib/components/ui/button').replaceAll('@sveltery/ui/dialog', '$lib/components/ui/dialog').replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea');
    }
    writeFileSync(basePinRoute, basePinFixture);
    const buttonRoute = join(consumer, 'src/routes/button/+page.svelte');
    mkdirSync(dirname(buttonRoute), { recursive: true });
    writeFileSync(buttonRoute, readFileSync(join(repo, 'scripts/button-consumer.svelte'), 'utf8'));
    const textareaRoute = join(consumer, 'src/routes/textarea/+page.svelte');
    mkdirSync(dirname(textareaRoute), { recursive: true });
    writeFileSync(textareaRoute, readFileSync(join(repo, 'scripts/textarea-consumer.svelte'), 'utf8'));
    const skeletonRoute = join(consumer, 'src/routes/skeleton/+page.svelte');
    mkdirSync(dirname(skeletonRoute), { recursive: true });
    writeFileSync(skeletonRoute, readFileSync(join(repo, 'scripts/skeleton-consumer.svelte'), 'utf8'));
    const kbdRoute = join(consumer, 'src/routes/kbd/+page.svelte');
    mkdirSync(dirname(kbdRoute), { recursive: true });
    let kbdFixture = readFileSync(join(repo, 'apps/docs/src/routes/kbd/+page.svelte'), 'utf8').replace('../../../examples/base/KbdExample.svelte', './KbdExample.svelte');
    let kbdExample = readFileSync(join(repo, 'apps/docs/examples/base/KbdExample.svelte'), 'utf8');
    if (mode === 'copy') {
      kbdFixture = kbdFixture.replaceAll('@sveltery/ui/kbd', '$lib/components/ui/kbd');
      kbdExample = kbdExample.replaceAll('@sveltery/ui/kbd', '$lib/components/ui/kbd');
    }
    writeFileSync(kbdRoute, kbdFixture);
    writeFileSync(join(dirname(kbdRoute), 'KbdExample.svelte'), kbdExample);
    const tableRoutes = [
      ['table', 'apps/docs/examples/base/TableExample.svelte'],
      ['table-probe', 'apps/docs/examples/base/TableProbe.svelte'],
    ];
    for (const [route, source] of tableRoutes) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/table', '$lib/components/ui/table');
      writeFileSync(routePath, content);
    }
    const tableTypesPath = join(consumer, 'src/routes/table-types.ts');
    const tableTypes = readFileSync(join(repo, 'tests/types-table.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/table/index.js', mode === 'copy' ? '$lib/components/ui/table' : '@sveltery/ui/table');
    writeFileSync(tableTypesPath, tableTypes);
    const cardRoute = join(consumer, 'src/routes/card/+page.svelte');
    mkdirSync(dirname(cardRoute), { recursive: true });
    writeFileSync(cardRoute, readFileSync(join(repo, 'scripts/card-consumer.svelte'), 'utf8'));
    const cardTypes = readFileSync(join(repo, 'tests/card-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/card/index.js', mode === 'copy' ? '$lib/components/ui/card' : '@sveltery/ui/card');
    writeFileSync(join(consumer, 'src/routes/card-types.ts'), cardTypes);
    for (const [route, source] of [['label', 'apps/docs/examples/base/LabelExample.svelte'], ['label-probe', 'apps/docs/examples/base/LabelProbe.svelte']]) {
      const routePath = join(consumer, `src/routes/${route}/+page.svelte`);
      mkdirSync(dirname(routePath), { recursive: true });
      let content = readFileSync(join(repo, source), 'utf8');
      if (mode === 'copy') content = content.replaceAll('@sveltery/ui/label', '$lib/components/ui/label').replaceAll('@sveltery/ui/textarea', '$lib/components/ui/textarea');
      writeFileSync(routePath, content);
    }
    writeFileSync(join(consumer, 'src/routes/label-types.ts'), readFileSync(join(repo, 'tests/label-types.ts'), 'utf8').replace('../apps/docs/registry/bases/base/ui/label/index.js', mode === 'copy' ? '$lib/components/ui/label' : '@sveltery/ui/label'));
    const consumerManifestPath = join(consumer, 'package.json');
    const consumerManifest = JSON.parse(readFileSync(consumerManifestPath, 'utf8'));
    consumerManifest.dependencies['class-variance-authority'] = '0.7.1';
    writeFileSync(consumerManifestPath, `${JSON.stringify(consumerManifest, null, 2)}\n`);
    if (mode === 'copy') {
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/button'), join(consumer, 'src/lib/components/ui/button'), { recursive: true });
      writeFileSync(buttonRoute, readFileSync(buttonRoute, 'utf8').replace('@sveltery/ui/button', '$lib/components/ui/button'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/textarea'), join(consumer, 'src/lib/components/ui/textarea'), { recursive: true });
      writeFileSync(textareaRoute, readFileSync(textareaRoute, 'utf8').replace('@sveltery/ui/textarea', '$lib/components/ui/textarea'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/skeleton'), join(consumer, 'src/lib/components/ui/skeleton'), { recursive: true });
      writeFileSync(skeletonRoute, readFileSync(skeletonRoute, 'utf8').replaceAll('@sveltery/ui/skeleton', '$lib/components/ui/skeleton').replaceAll('@sveltery/ui/card', '$lib/components/ui/card'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/kbd'), join(consumer, 'src/lib/components/ui/kbd'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/table'), join(consumer, 'src/lib/components/ui/table'), { recursive: true });
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/card'), join(consumer, 'src/lib/components/ui/card'), { recursive: true });
      writeFileSync(cardRoute, readFileSync(cardRoute, 'utf8').replaceAll('@sveltery/ui/card', '$lib/components/ui/card'));
      cpSync(join(temporary, 'sveltery-ui/apps/docs/registry/bases/base/ui/label'), join(consumer, 'src/lib/components/ui/label'), { recursive: true });
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
    const check = (remote) => {
      run('pnpm', ['check'], consumer);
      run('pnpm', ['build'], consumer);
      if (browser) {
        execFileSync('pnpm', ['exec', 'playwright', 'test', '--config', 'scripts/installation-playwright.config.ts'], {
          cwd: repo, stdio: 'inherit', env: { ...process.env, SVELTERY_INSTALLATION_CONSUMER: consumer, SVELTERY_INSTALLATION_REMOTE: remote ? '1' : '0' },
        });
      }
      console.log(`Fresh ${mode} ${remote ? 'experimental remote-field fixture' : 'documented consumer'}: types, SSR/client build${browser ? ' and secured browser' : ''} PASS`);
    };
    check(false);
    // Remote fields are a separate experimental test fixture, not part of the
    // documented consumer scaffold or the production docs application.
    const svelteConfig = join(consumer, 'svelte.config.js');
    const documentedConfig = readFileSync(svelteConfig, 'utf8').replace('export default', "/** @type {import('@sveltejs/kit').Config} */\nconst documentedConfig =");
    writeFileSync(svelteConfig, `${documentedConfig}
export default { ...documentedConfig, compilerOptions: { ...documentedConfig.compilerOptions, experimental: { ...documentedConfig.compilerOptions?.experimental, async: true } }, kit: { ...documentedConfig.kit, experimental: { ...documentedConfig.kit?.experimental, remoteFunctions: true } } };
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
    check(true);
  }
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
