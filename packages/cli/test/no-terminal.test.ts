// @vitest-environment node
import { execFile, execFileSync, spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import { tmpdir } from 'node:os';
import { promisify } from 'node:util';
import { join } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, expect, test } from 'vitest';

const execFileAsync = promisify(execFile);
const cliDir = new URL('..', import.meta.url).pathname;
const bin = join(cliDir, 'dist/index.js');

const item = (name: string, rest: object) => ({ $schema: 'https://example.test/schema/registry-item.json', name, type: 'registry:ui', ...rest });
const registryFiles: Record<string, unknown> = {
  'index.json': { $schema: 'https://example.test/schema/registry.json', name: 'sveltery', registryVersion: 1, styles: ['nova'], baseColors: ['neutral'], iconLibraries: ['lucide'], items: [{ name: 'button', type: 'registry:ui' }], blocks: [] },
  'styles/nova/button.json': item('button', { files: [{ type: 'registry:ui', target: 'button/Button.svelte', content: '<button></button>\n' }] }),
  'themes/neutral.json': item('neutral', { type: 'registry:theme', files: [], cssVars: { light: { background: 'oklch(1 0 0)' } } }),
};

let server: Server;
let registryUrl: string;
let cwd: string;

beforeAll(async () => {
  execFileSync('pnpm', ['run', 'build'], { cwd: cliDir, stdio: 'ignore' });
  server = createServer((request, response) => {
    const body = registryFiles[(request.url ?? '').replace(/^\/r\//, '')];
    response.writeHead(body ? 200 : 404, { 'content-type': 'application/json' }).end(body ? JSON.stringify(body) : '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  const address = server.address();
  registryUrl = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/r`;
});
afterAll(() => void server.close());

beforeEach(() => {
  cwd = mkdtempSync(join(tmpdir(), 'sveltery-no-terminal-'));
  writeFileSync(join(cwd, 'package.json'), JSON.stringify({ devDependencies: { '@sveltejs/kit': '^2.0.0', svelte: '^5.0.0', tailwindcss: '^4.0.0' } }));
  mkdirSync(join(cwd, 'src'));
  writeFileSync(join(cwd, 'src/app.css'), "@import 'tailwindcss';\n");
});
afterEach(() => rmSync(cwd, { recursive: true, force: true }));

/** Runs the built CLI with stdin closed, as CI and scripts do. */
function run(...args: string[]): Promise<{ code: number | null; output: string }> {
  return new Promise((done) => {
    const child = spawn(process.execPath, [bin, ...args, '--no-install'], { cwd, stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, SVELTERY_REGISTRY_URL: registryUrl } });
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (code) => done({ code, output }));
  });
}

const buttonPath = 'src/lib/components/ui/button/Button.svelte';
const message = 'No terminal to confirm in. Re-run with --yes.';

test('init without --yes stops before writing anything', async () => {
  const { code, output } = await run('init');
  expect([code, output.includes(message), existsSync(join(cwd, 'components.json'))]).toEqual([1, true, false]);
});

test('add without --yes stops before writing anything, and --yes still adds', async () => {
  expect((await run('init', '--yes')).code).toBe(0);
  const { code, output } = await run('add', 'button');
  expect([code, output.includes(message), existsSync(join(cwd, buttonPath))]).toEqual([1, true, false]);
  expect((await run('add', 'button', '--yes')).code).toBe(0);
  expect(readFileSync(join(cwd, buttonPath), 'utf8')).toBe('<button></button>\n');
});

test('update without --yes keeps a changed file', async () => {
  expect((await run('init', '--yes')).code).toBe(0);
  expect((await run('add', 'button', '--yes')).code).toBe(0);
  writeFileSync(join(cwd, buttonPath), 'mine\n');
  const { code, output } = await run('update');
  expect([code, output.includes(message), readFileSync(join(cwd, buttonPath), 'utf8')]).toEqual([1, true, 'mine\n']);
});

test('init --monorepo without --yes or --name stops before creating the project', async () => {
  rmSync(join(cwd, 'package.json'));
  rmSync(join(cwd, 'src'), { recursive: true });
  const { code, output } = await run('init', '--monorepo');
  expect([code, output.includes(message), readdirSync(cwd)]).toEqual([1, true, []]);
});

test.each([{ flags: [] }, { flags: ['--preset'] }])('init --monorepo --name acme $flags without --yes stops before creating the project', async ({ flags }) => {
  rmSync(join(cwd, 'package.json'));
  rmSync(join(cwd, 'src'), { recursive: true });
  const { code, output } = await run('init', '--monorepo', '--name', 'acme', ...flags);
  expect([code, output.includes(message), readdirSync(cwd)]).toEqual([1, true, []]);
});

test("every usage block in cli.md is the built CLI's --help", async () => {
  const doc = readFileSync(new URL('../../../apps/docs/content/docs/cli.md', import.meta.url), 'utf8');
  const blocks = [...doc.matchAll(/```txt\n(Usage: sveltery (.*?) \[options\].*\n[\s\S]*?)```/g)].map(([, block, command]) => ({ block, command: command! }));
  expect(blocks.length).toBeGreaterThan(0);
  const helps = await Promise.all(blocks.map(({ command }) => execFileAsync(process.execPath, [bin, ...command.split(' ').map((part) => part.split('|')[0]!), '--help'], { encoding: 'utf8' })));
  expect(helps.map(({ stdout }, index) => [blocks[index]!.command, stdout])).toEqual(blocks.map(({ command, block }) => [command, block]));
}, 30_000);
