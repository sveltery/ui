// Builds the registry from this checkout, serves it, and drives the packed CLI through a fresh SvelteKit app.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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

// Like `run`, but returns what the command printed, which is also echoed. A failure carries it as `output`.
const capture = (command, args, cwd, env = {}) =>
  new Promise((done, fail) => {
    let output = '';
    const child = spawn(command, args, { cwd, stdio: ['inherit', 'pipe', 'inherit'], env: { ...process.env, ...env } });
    child.stdout.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => {
      process.stdout.write(output);
      if (code === 0) done(output);
      else fail(Object.assign(new Error(`${command} ${args.join(' ')} exited with ${code}`), { output }));
    });
  });

step('build and serve the registry');
// The docs tsconfig extends the one `svelte-kit sync` generates, and the registry modules are compiled with it.
await run('pnpm', ['exec', 'svelte-kit', 'sync'], join(repoRoot, 'apps/docs'));
const load = async (path) => (await runnerImport(join(repoRoot, path), { root: repoRoot, configFile: false, logLevel: 'error' })).module;
const { readRegistryInput } = await load('apps/docs/registry/read.ts');
const { buildRegistry } = await load('apps/docs/registry/build.ts');
const { respondInit } = await load('apps/docs/src/routes/init/handler.ts');
const registryDir = join(work, 'r');
const readServed = async (path) => {
  try {
    return new Response(readFileSync(join(registryDir, path.replace(/^\/r\//, ''))), { headers: { 'content-type': 'application/json' } });
  } catch {
    return new Response(null, { status: 404 });
  }
};
const server = createServer(async (request, response) => {
  if (request.url?.startsWith('/init')) {
    const init = await respondInit(new URL(request.url, origin), readServed);
    response.writeHead(init.status, { 'content-type': 'application/json' }).end(await init.text());
    return;
  }
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

  step('pack @sveltery/ui and the helper packages');
  const helpers = ['@sveltery/command', '@sveltery/day-picker', '@sveltery/input-otp', '@sveltery/resizable', '@sveltery/svelte'];
  await run('pnpm', [...helpers.flatMap((name) => ['--filter', name]), 'build'], repoRoot);
  await run('pnpm', [...['@sveltery/ui', ...helpers].flatMap((name) => ['--filter', name]), 'pack', '--pack-destination', tarballs], repoRoot);
  const tarball = (name) => {
    const prefix = `${name.replace('@', '').replace('/', '-')}-`;
    const file = readdirSync(tarballs).find((entry) => entry.startsWith(prefix) && /^\d/.test(entry.slice(prefix.length)));
    assert.ok(file, `packed ${name}`);
    return `file:${join(tarballs, file)}`;
  };
  const rootManifest = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'));
  const overrides = {
    '@sveltery/ui': tarball('@sveltery/ui'),
    '@sveltery/base': rootManifest.devDependencies['@sveltery/base'],
    ...Object.fromEntries(helpers.map((name) => [name, tarball(name)])),
  };
  const allowBuilds = /^allowBuilds:\n(?: {2}.*\n)+/m.exec(readFileSync(join(repoRoot, 'pnpm-workspace.yaml'), 'utf8'))?.[0] ?? '';
  writeFileSync(join(app, 'pnpm-workspace.yaml'), `${allowBuilds}overrides:\n${Object.entries(overrides).map(([name, spec]) => `  ${JSON.stringify(name)}: ${JSON.stringify(spec)}\n`).join('')}`);
  // Nothing is on npm yet, and `pnpm add` asks the registry before it applies an override, so the app declares the packed packages up front.
  const appManifest = JSON.parse(readFileSync(join(app, 'package.json'), 'utf8'));
  const { '@sveltery/ui': cliTarball, ...runtime } = overrides;
  appManifest.devDependencies = { ...appManifest.devDependencies, '@sveltery/ui': cliTarball };
  appManifest.dependencies = { ...appManifest.dependencies, ...runtime };
  writeFileSync(join(app, 'package.json'), JSON.stringify(appManifest, null, 2));
  await run('pnpm', ['install'], app);

  const cliExec = ['exec', '--yes', `--package=${overrides['@sveltery/ui']}`, '--', 'sveltery'];
  // Each preset runs in its own copy of the app, made before any init.
  for (const [code, expected] of [
    ['b0', { style: 'nova', baseColor: 'neutral', imports: ['@fontsource-variable/inter'], primary: 'oklch(0.205 0 0)', fonts: ["--font-sans: 'Inter Variable', sans-serif;", '--font-heading: var(--font-sans);'] }],
    [
      'b4xFeBLg4O',
      {
        style: 'sera',
        baseColor: 'taupe',
        imports: ['@fontsource-variable/noto-sans', '@fontsource-variable/playfair-display'],
        primary: 'oklch(0.214 0.009 43.1)',
        fonts: ["--font-sans: 'Noto Sans Variable', sans-serif;", "--font-heading: 'Playfair Display Variable', serif;"],
      },
    ],
  ]) {
    step(`sveltery init --preset ${code}`);
    const presetApp = join(work, `preset-${code}`);
    mkdirSync(presetApp);
    for (const file of ['package.json', 'src']) cpSync(join(app, file), join(presetApp, file), { recursive: true });
    await run('npm', [...cliExec, 'init', '--preset', code, '--no-install'], presetApp, env);
    const presetConfig = JSON.parse(readFileSync(join(presetApp, 'components.json'), 'utf8'));
    // The values shadcn@4.21.1 writes for the same code.
    assert.deepEqual(
      [presetConfig.style, presetConfig.tailwind.baseColor, presetConfig.iconLibrary, presetConfig.menuColor, presetConfig.menuAccent],
      [expected.style, expected.baseColor, 'lucide', 'default', 'subtle'],
      `${code} writes its settings to components.json`,
    );
    const presetCss = readFileSync(join(presetApp, presetConfig.tailwind.css), 'utf8');
    for (const target of expected.imports) assert.match(presetCss, new RegExp(`@import ['"]${target}['"];`), `${code} imports ${target}`);
    for (const line of [`--primary: ${expected.primary};`, ...expected.fonts]) assert.ok(presetCss.includes(line), `${code} writes ${line}`);
    assert.match(presetCss, /html \{\s*@apply font-sans;/, `${code} applies the body font to html`);
  }

  step('sveltery init --preset btLmMa prints why /init rejects a gray base color');
  const grayApp = join(work, 'preset-gray');
  mkdirSync(grayApp);
  for (const file of ['package.json', 'src']) cpSync(join(app, file), join(grayApp, file), { recursive: true });
  // shadcn@4.21.1 has no gray base color either, so the code is rejected rather than mapped.
  await assert.rejects(capture('npm', [...cliExec, 'init', '--preset', 'btLmMa', '--no-install'], grayApp, env), (error) => /Invalid baseColor "gray"/.test(error.output), 'init prints the reason from /init');

  step('sveltery init -y keeps a bold menuAccent from components.json in the theme');
  const boldApp = join(work, 'menu-accent-bold');
  mkdirSync(boldApp);
  for (const file of ['package.json', 'src']) cpSync(join(app, file), join(boldApp, file), { recursive: true });
  writeFileSync(join(boldApp, 'components.json'), JSON.stringify({ menuAccent: 'bold' }));
  await run('npm', [...cliExec, 'init', '-y', '--no-install'], boldApp, env);
  const boldCss = readFileSync(join(boldApp, JSON.parse(readFileSync(join(boldApp, 'components.json'), 'utf8')).tailwind.css), 'utf8');
  const modes = [...boldCss.matchAll(/^(?::root|\.dark) \{([^}]*)\}/gm)].map((match) => match[1]);
  assert.equal(modes.length, 2, 'the theme has a light and a dark block');
  for (const block of modes) {
    const value = (name) => new RegExp(`--${name}: ([^;]+);`).exec(block)?.[1];
    assert.equal(value('accent'), value('primary'), 'a bold menu accent is the primary color');
    assert.equal(value('accent-foreground'), value('primary-foreground'), 'a bold menu accent foreground is the primary foreground');
  }

  // Each icon library gets its own copy of the app with every item, so their icon props are type-checked against the real packages.
  for (const icons of ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']) {
    step(`sveltery init --icons ${icons}, add --all and blocks, check and build`);
    const allApp = join(work, `all-${icons}`);
    cpSync(app, allApp, { recursive: true, filter: (source) => !source.includes('node_modules') });
    await run('pnpm', ['install'], allApp);
    await run('npm', [...cliExec, 'init', '-y', '--icons', icons], allApp, env);
    await run('pnpm', ['exec', 'sveltery', 'add', '--all', '-y'], allApp, env);
    const blocks = icons === 'lucide' ? ['login-01', 'signup-03', 'sidebar-07', 'dashboard-01', 'preview'] : ['sidebar-07'];
    await run('pnpm', ['exec', 'sveltery', 'add', ...blocks, '-y'], allApp, env);
    await run('pnpm', ['run', 'check'], allApp);
    if (icons === 'lucide') await run('pnpm', ['exec', 'vite', 'build'], allApp);
  }

  step('sveltery init -y');
  await run('npm', ['exec', '--yes', `--package=${overrides['@sveltery/ui']}`, '--', 'sveltery', 'init', '-y'], app, env);
  const config = JSON.parse(readFileSync(join(app, 'components.json'), 'utf8'));
  assert.equal(config.registry, env.SVELTERY_REGISTRY_URL, 'init writes the registry it used');
  const css = readFileSync(join(app, config.tailwind.css), 'utf8');
  await run('npm', ['exec', '--yes', `--package=${overrides['@sveltery/ui']}`, '--', 'sveltery', 'init', '-y'], app, env);
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

  step('sveltery search and list');
  const found = JSON.parse(await cli('search', '-q', 'dialog', '-t', 'ui', '--json'));
  assert.deepEqual(found.items.map((entry) => entry.name), ['dialog', 'alert-dialog'], 'search ranks the exact name first');
  assert.deepEqual(found.items[0], { name: 'dialog', title: 'Dialog', type: 'registry:ui', registry: '@sveltery', addCommandArgument: 'dialog' });
  const listed = await cli('list', '-t', 'block', '-l', '2', '-o', '1');
  assert.match(listed, new RegExp(`^Showing 2-3 of ${registry.get('index.json').blocks.length}$`, 'm'), 'list is search with paging');
  await assert.rejects(cli('search', '@acme'), (error) => /Unknown registry "@acme"/.test(error.output), 'search names the registries it does not know');

  writeFileSync(
    join(app, 'src/routes/+page.svelte'),
    // The import form the docs print, an explicit index, and a deep import of one file.
    `<script lang="ts">\n  import { Button } from '${config.aliases.ui}/button';\n  import { Dialog, DialogTrigger } from '${config.aliases.ui}/dialog/index.js';\n  import DeepButton from '${config.aliases.ui}/button/Button.svelte';\n</script>\n<Button>Click</Button>\n<DeepButton>Deep</DeepButton>\n<Dialog><DialogTrigger>Open</DialogTrigger></Dialog>\n`,
  );

  step('svelte-check and vite build');
  await run('pnpm', ['run', 'check'], app);
  await run('pnpm', ['exec', 'vite', 'build'], app);

  step('render the Button in Chromium');
  const port = 4300 + Math.floor(Math.random() * 500);
  preview = spawn('pnpm', ['exec', 'vite', 'preview', '--port', String(port), '--strictPort', '--host', '127.0.0.1'], { cwd: app, stdio: 'inherit' });
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
