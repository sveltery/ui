// Builds the registry from this checkout, serves it, and drives the packed CLI through a fresh SvelteKit app.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { runnerImport } from 'vite';

const SV = 'sv@1.0.1';
const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const work = mkdtempSync(join(tmpdir(), 'sveltery-e2e-'));
const app = join(work, 'app');
const tarballs = join(work, 'tarballs');

const step = (message) => console.log(`\n▶ ${message}`);
// Async, because the registry server shares this process's event loop.
const run = (command, args, cwd, env = {}) =>
  new Promise((done, fail) => {
    spawn(command, args, { cwd, stdio: 'inherit', env: { ...process.env, ...env } }).on('close', (code) =>
      code === 0 ? done() : fail(new Error(`${command} ${args.join(' ')} exited with ${code}`)),
    );
  });

// Like `run`, but returns what the command printed, which is also echoed.
const capture = (command, args, cwd, env = {}) =>
  new Promise((done, fail) => {
    let output = '';
    const child = spawn(command, args, { cwd, stdio: ['inherit', 'pipe', 'inherit'], env: { ...process.env, ...env } });
    child.stdout.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => {
      process.stdout.write(output);
      if (code === 0) done(output);
      else fail(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });

step('build and serve the registry');
const load = async (path) => (await runnerImport(join(repoRoot, path), { root: repoRoot, configFile: false, logLevel: 'error' })).module;
const { readRegistryInput } = await load('apps/docs/registry/read.ts');
const { buildRegistry } = await load('apps/docs/registry/build.ts');
const registryDir = join(work, 'r');
const server = createServer((request, response) => {
  try {
    const body = readFileSync(join(registryDir, decodeURIComponent(new URL(request.url ?? '/', 'http://x').pathname.replace(/^\/r\//, ''))));
    response.writeHead(200, { 'content-type': 'application/json' }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;
const registry = buildRegistry(readRegistryInput(repoRoot, origin));
for (const [path, json] of registry) {
  mkdirSync(dirname(join(registryDir, path)), { recursive: true });
  writeFileSync(join(registryDir, path), JSON.stringify(json));
}
const env = { SVELTERY_REGISTRY_URL: `${origin}/r` };
console.log(`${registry.size} registry files at ${env.SVELTERY_REGISTRY_URL}`);

let preview;
let browser;
let passed = false;
try {
  step(`create a SvelteKit app with Tailwind using ${SV}`);
  await run('npx', ['--yes', SV, 'create', 'app', '--template', 'minimal', '--types', 'ts', '--no-add-ons', '--no-install'], work);
  await run('npx', ['--yes', SV, 'add', 'tailwindcss=plugins:none', '--no-git-check', '--no-install', '-C', app], work);

  step('pack sveltery and the helper packages');
  const helpers = ['@sveltery/command', '@sveltery/day-picker', '@sveltery/message-scroller', '@sveltery/questionnaire', '@sveltery/resizable'];
  await run('pnpm', [...helpers.flatMap((name) => ['--filter', name]), 'build'], repoRoot);
  await run('pnpm', [...['sveltery', ...helpers].flatMap((name) => ['--filter', name]), 'pack', '--pack-destination', tarballs], repoRoot);
  const tarball = (name) => {
    const prefix = `${name.replace('@', '').replace('/', '-')}-`;
    const file = readdirSync(tarballs).find((entry) => entry.startsWith(prefix) && /^\d/.test(entry.slice(prefix.length)));
    assert.ok(file, `packed ${name}`);
    return `file:${join(tarballs, file)}`;
  };
  const rootManifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const overrides = {
    sveltery: tarball('sveltery'),
    '@sveltery/base': rootManifest.devDependencies['@sveltery/base'],
    ...Object.fromEntries(helpers.map((name) => [name, tarball(name)])),
  };
  const allowBuilds = /^allowBuilds:\n(?: {2}.*\n)+/m.exec(readFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'utf8'))?.[0] ?? '';
  writeFileSync(join(app, 'pnpm-workspace.yaml'), `${allowBuilds}overrides:\n${Object.entries(overrides).map(([name, spec]) => `  ${JSON.stringify(name)}: ${JSON.stringify(spec)}\n`).join('')}`);
  // Nothing is on npm yet, and `pnpm add` asks the registry before it applies an override, so the app declares the packed packages up front.
  const appManifest = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'));
  const { sveltery, ...runtime } = overrides;
  appManifest.devDependencies = { ...appManifest.devDependencies, sveltery };
  appManifest.dependencies = { ...appManifest.dependencies, ...runtime };
  writeFileSync(join(app, 'package.json'), JSON.stringify(appManifest, null, 2));
  await run('pnpm', ['install'], app);

  step('sveltery init -y');
  await run('npm', ['exec', '--yes', `--package=${overrides.sveltery}`, '--', 'sveltery', 'init', '-y'], app, env);
  const config = JSON.parse(readFileSync(join(app, 'components.json'), 'utf8'));
  assert.equal(config.registry, env.SVELTERY_REGISTRY_URL, 'init writes the registry it used');
  const css = readFileSync(join(app, config.tailwind.css), 'utf8');
  await run('npm', ['exec', '--yes', `--package=${overrides.sveltery}`, '--', 'sveltery', 'init', '-y'], app, env);
  assert.equal(readFileSync(join(app, config.tailwind.css), 'utf8'), css, 'a second init leaves the CSS byte-identical');

  step('sveltery add button dialog -y');
  await run('pnpm', ['exec', 'sveltery', 'add', 'button', 'dialog', '-y'], app, env);
  step('sveltery diff and update -y after editing Button.svelte');
  const buttonFile = join(app, config.aliases.ui.replace(/^[$#]lib/, 'src/lib'), 'button/Button.svelte');
  const pristine = readFileSync(buttonFile, 'utf8');
  const [firstLine] = pristine.split('\n');
  writeFileSync(buttonFile, pristine.replace(firstLine, `${firstLine} <!-- edited locally -->`));
  const cli = (...args) => capture('pnpm', ['exec', 'sveltery', ...args], app, env);
  assert.match(await cli('diff'), /^-.*edited locally/m, 'diff shows the edited line');
  await cli('update', '-y');
  assert.equal(readFileSync(buttonFile, 'utf8'), pristine, 'update -y restores the registry version');
  assert.equal((await cli('diff')).trim(), 'Everything is up to date.');

  writeFileSync(
    join(app, 'src/routes/+page.svelte'),
    `<script lang="ts">\n  import { Button } from '${config.aliases.ui}/button/index.js';\n  import { Dialog, DialogTrigger } from '${config.aliases.ui}/dialog/index.js';\n</script>\n<Button>Click</Button>\n<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>\n`,
  );

  step('svelte-check and vite build');
  await run('pnpm', ['run', 'check'], app);
  await run('pnpm', ['exec', 'vite', 'build'], app);

  step('render the Button in Chromium');
  const port = 4300 + Math.floor(Math.random() * 500);
  preview = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(port), '--strictPort'], { cwd: app, stdio: 'inherit' });
  const url = `http://127.0.0.1:${port}/`;
  for (let attempt = 0; ; attempt++) {
    if (await fetch(url).then((response) => response.ok, () => false)) break;
    assert.ok(attempt < 100, `vite preview answered at ${url}`);
    await new Promise((done) => setTimeout(done, 200));
  }
  // CHROMIUM_PATH runs a preinstalled Chromium, as in the repository's Playwright config.
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
  const page = await browser.newPage();
  await page.goto(url);
  const style = await page.getByRole('button', { name: 'Click' }).evaluate((element) => {
    const computed = getComputedStyle(element);
    return { paddingLeft: computed.paddingLeft, backgroundColor: computed.backgroundColor };
  });
  console.log(style);
  assert.equal(style.paddingLeft, '10px', "nova's default button size is px-2.5");
  assert.notEqual(style.backgroundColor, 'rgba(0, 0, 0, 0)', 'the button has a background from the theme');
  passed = true;
  console.log('\ne2e passed');
} finally {
  await browser?.close();
  preview?.kill();
  server.close();
  if (passed) rmSync(work, { recursive: true, force: true });
  else console.error(`\nKept ${work} for inspection.`);
}
