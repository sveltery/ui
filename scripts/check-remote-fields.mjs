import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

const repo = fileURLToPath(new URL('../', import.meta.url));
const fixture = fileURLToPath(new URL('../apps/docs/remote-fields-fixture/', import.meta.url));
const origin = 'http://127.0.0.1:5185';
const server = spawn(process.execPath, [`${repo}node_modules/vite/bin/vite.js`, 'preview', '--host', '127.0.0.1', '--port', '5185', '--strictPort'], { cwd: fixture, stdio: ['ignore', 'pipe', 'pipe'] });
let serverOutput = '';
let startupError;
server.stdout.on('data', chunk => { serverOutput += chunk; });
server.stderr.on('data', chunk => { serverOutput += chunk; });
server.on('error', error => { startupError = error; });

try {
  let initial;
  for (let attempt = 0; attempt < 200; attempt++) {
    if (startupError) throw startupError;
    if (server.exitCode !== null) throw new Error(`Remote fixture exited before readiness: ${serverOutput}`);
    try {
      const response = await fetch(origin, { signal: AbortSignal.timeout(1000) });
      if (response.ok) { initial = await response.text(); break; }
    } catch { /* A newly started preview may not be listening yet. */ }
    await setTimeout(50);
  }
  assert(initial, `Remote fixture did not become ready: ${serverOutput}`);
  const initialDOM = new JSDOM(initial, { url: origin });
  try {
    const { document } = initialDOM.window;
    assert.equal(document.querySelector('#ui-text').value, 'Draft');
    assert.equal(document.querySelector('#empty-text').value, '');
    // Version-scoped native spread-only diagnostic, not positive UI SSR parity.
    assert.equal(document.querySelector('#native-text').value, '');
    console.log('Kit 2.70.3 native spread-only textarea SSR diagnostic: empty text content (known baseline limitation)');
    const form = document.querySelector('#probe');
    for (const [id, key, value] of [['native-submit', 'action', 'native'], ['base-submit', 'baseAction', 'base'], ['ui-submit', 'uiAction', 'ui']]) {
      const body = new URLSearchParams(new initialDOM.window.FormData(form, document.getElementById(id)));
      body.set('nativeText', `HTTP ${value}`); body.set('text', 'HTTP UI\n<&>'); body.set('emptyText', 'HTTP empty');
      const response = await fetch(new URL(form.getAttribute('action'), origin), { method: 'POST', headers: { Origin: origin, Accept: 'text/html' }, body });
      assert.equal(response.status, 200);
      const returned = new JSDOM(await response.text());
      try {
        const result = JSON.parse(returned.window.document.querySelector('#result').textContent);
        assert.equal(result.parsed.nativeText, `HTTP ${value}`); assert.equal(result.parsed.text, 'HTTP UI\n<&>'); assert.equal(result.parsed.emptyText, 'HTTP empty');
        for (const name of ['action', 'baseAction', 'uiAction']) assert.equal(result.parsed[name], name === key ? value : undefined);
        assert.equal(returned.window.document.querySelector('#ui-text').value, 'Draft');
        assert.equal(returned.window.document.querySelector('#empty-text').value, '');
      } finally { returned.window.close(); }
    }
    const invalidBody = new URLSearchParams(new initialDOM.window.FormData(form, document.querySelector('#ui-submit')));
    invalidBody.set('nativeText', 'x'); invalidBody.set('text', 'x');
    const invalidResponse = await fetch(new URL(form.getAttribute('action'), origin), { method: 'POST', headers: { Origin: origin, Accept: 'text/html' }, body: invalidBody });
    assert.equal(invalidResponse.status, 200);
    const invalidDOM = new JSDOM(await invalidResponse.text());
    try {
      const invalidDocument = invalidDOM.window.document;
      assert.equal(JSON.parse(invalidDocument.querySelector('#result').textContent), null);
      assert.equal(invalidDocument.querySelector('#ui-text').value, 'x');
      assert.equal(invalidDocument.querySelector('#ui-text').getAttribute('aria-invalid'), 'true');
      const paths = JSON.parse(invalidDocument.querySelector('#issues').textContent).map(issue => issue.path);
      assert.deepEqual(paths, [['nativeText'], ['text']]);
    } finally { invalidDOM.window.close(); }
    console.log('Actual Kit remote fields: UI SSR/defaults, three no-JS submitters, parsed text and field validation PASS');
  } finally { initialDOM.window.close(); }
} finally { server.kill('SIGTERM'); }
