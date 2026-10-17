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
for (const slot of ['command', 'command-input', 'command-list', 'command-group', 'command-item', 'message-scroller', 'message-scroller-viewport', 'message-scroller-content', 'message-scroller-item', 'message-scroller-button', 'questionnaire', 'questionnaire-progress', 'questionnaire-item', 'questionnaire-title', 'questionnaire-choice', 'questionnaire-next', 'questionnaire-submit', 'resizable-panel-group', 'resizable-panel', 'resizable-handle']) {
  assert(body.includes(`data-slot="${slot}"`), `server markup renders ${slot}`);
}
assert.match(body, /data-slot="resizable-panel"[^>]*style="[^"]*flex-grow:30"/, 'a default layout renders on the server');
assert.match(body, /data-slot="questionnaire-progress"[^>]*>(<!---->)?Question 1 of 2/, 'questionnaire progress renders on the server');
assert.match(body, /data-shortcut="B"[^>]*data-slot="questionnaire-choice"|data-slot="questionnaire-choice"[^>]*data-shortcut="B"/, 'questionnaire shortcuts render on the server');
assert.match(body, /<fieldset[^>]*hidden=""[^>]*data-slot="questionnaire-item"|<fieldset[^>]*data-slot="questionnaire-item"[^>]*hidden=""/, 'inactive questionnaire items render hidden');
const tag = (slot) => body.match(new RegExp(`<[a-z]+ [^>]*data-slot="${slot}"[^>]*>`))?.[0] ?? '';
assert(tag('message-scroller').includes('data-pending-scroll=""'), 'the transcript stays pending until it opens at the end');
assert(tag('message-scroller-viewport').includes('role="region"') && tag('message-scroller-viewport').includes('aria-label="Messages"'), 'the viewport is a labelled region');
assert(tag('message-scroller-content').includes('role="log"'), 'the content is a log');
assert(tag('message-scroller-item').includes('data-message-id="m1"') && tag('message-scroller-item').includes('data-scroll-anchor="true"'), 'items carry their id and anchor flag');
assert(tag('message-scroller-button').includes('inert=""') && tag('message-scroller-button').includes('data-active="false"'), 'the scroll button starts inert');
assert(tag('command-input').includes('role="combobox"'), 'the command input is a combobox');
assert(tag('command-list').includes('role="listbox"'), 'the command list is a listbox');
assert.match(body, /data-slot="command-item"[^>]*data-value="calc"|data-value="calc"[^>]*data-slot="command-item"/, 'command items render their value on the server');
assert(!body.includes('data-slot="command-empty"'), 'the empty state waits for the client');
console.log('Packed helpers install and render on the server');
