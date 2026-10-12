import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { registerHooks } from 'node:module';
import { fileURLToPath } from 'node:url';
import { compile, compileModule } from 'svelte/compiler';

// Node cannot load Svelte files, so compile them for the server the way a bundler would.
registerHooks({
  load(url, context, nextLoad) {
    const svelte = url.endsWith('.svelte');
    if (!svelte && !/\.svelte\.js$/.test(url)) return nextLoad(url, context);
    const filename = fileURLToPath(url);
    const options = { filename, generate: 'server' };
    const result = svelte ? compile(readFileSync(filename, 'utf8'), options) : compileModule(readFileSync(filename, 'utf8'), options);
    return { format: 'module', shortCircuit: true, source: result.js.code };
  },
});

const { render } = await import('svelte/server');
const { default: App } = await import('./App.svelte');
const { body } = render(App);
for (const slot of ['alert', 'alert-title', 'alert-description', 'alert-action', 'aspect-ratio', 'avatar', 'button', 'card', 'card-header', 'card-title', 'card-content', 'dialog-trigger', 'empty', 'empty-title', 'kbd', 'label', 'separator', 'skeleton', 'table-container', 'table', 'table-body', 'table-row', 'table-cell', 'textarea']) {
  assert(body.includes(`data-slot="${slot}"`), `server markup renders ${slot}`);
}
assert(!body.includes('role="dialog"'), 'closed dialog content stays out of server markup');
assert.match(body, /<textarea[^>]*>Draft<\/textarea>/);
for (const file of ['nova.css', 'themes.css', 'styles.css', 'styles/nova.css']) {
  assert(readFileSync(fileURLToPath(import.meta.resolve(`@sveltery/ui/${file}`)), 'utf8').length > 0, `${file} ships`);
}
console.log('Packed @sveltery/ui installs and renders every component on the server');
