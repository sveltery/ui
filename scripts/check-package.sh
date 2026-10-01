#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
source scripts/toolchain.sh
consumer_directory="$(mktemp -d /tmp/sveltery-ui-consumer.XXXXXX)"
trap 'rm -rf "$consumer_directory"' EXIT
pnpm --filter @sveltery/ui pack --pack-destination "$consumer_directory"
mkdir -p "$consumer_directory/node_modules/@sveltery/ui" "$consumer_directory/node_modules/@sveltery/base"
tar -xzf "$consumer_directory/sveltery-ui-0.0.0.tgz" --strip-components=1 -C "$consumer_directory/node_modules/@sveltery/ui"
tar -xzf .vendor/sveltery-base-0.0.0.tgz --strip-components=1 -C "$consumer_directory/node_modules/@sveltery/base"
for dependency in svelte clsx tailwind-merge class-variance-authority; do
  ln -s "$sveltery_repo_root/node_modules/$dependency" "$consumer_directory/node_modules/$dependency"
done
cmp packages/ui/LICENSE "$consumer_directory/node_modules/@sveltery/ui/LICENSE"
cmp packages/ui/THIRD_PARTY_NOTICES.md "$consumer_directory/node_modules/@sveltery/ui/THIRD_PARTY_NOTICES.md"
cat > "$consumer_directory/Consumer.svelte" <<'SVELTE'
<script>
  import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogContent } from '@sveltery/ui';
  import * as Parts from '@sveltery/ui/dialog';
  import { Button, buttonVariants } from '@sveltery/ui/button';
</script>
<Button name="save" value="yes" variant="secondary" size="lg" class="px-6">Save</Button>
<Button disabled focusableWhenDisabled type="submit">Unavailable</Button>
<button class={buttonVariants({ variant: 'outline', size: 'sm' })}>Composed style</button>
<Dialog defaultOpen><DialogTrigger>First</DialogTrigger><DialogHeader><DialogTitle>First title</DialogTitle><DialogDescription>First description</DialogDescription></DialogHeader><DialogFooter><DialogClose>Close</DialogClose></DialogFooter><DialogContent>Client only content</DialogContent></Dialog>
<Parts.Dialog><Parts.DialogTrigger>Second</Parts.DialogTrigger><Parts.DialogTitle>Second title</Parts.DialogTitle><Parts.DialogPortal><Parts.DialogOverlay /></Parts.DialogPortal></Parts.Dialog>
SVELTE
cat > "$consumer_directory/check.mjs" <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import Consumer from './Consumer.svelte';
import * as Root from '@sveltery/ui';
import * as Parts from '@sveltery/ui/dialog';
import * as Buttons from '@sveltery/ui/button';
const names = ['Dialog', 'DialogClose', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogOverlay', 'DialogPortal', 'DialogTitle', 'DialogTrigger'];
assert.deepEqual(Object.keys(Root).sort(), [...names, 'Button', 'buttonVariants', 'variants', 'sizes'].sort());
assert.deepEqual(Object.keys(Buttons).sort(), ['Button', 'buttonVariants', 'sizes', 'variants']);
assert.deepEqual(Object.keys(Parts).sort(), names);
for (const path of ['index.d.ts', 'dialog/index.d.ts', 'button/index.d.ts', 'button/Button.svelte.d.ts', 'button/types.d.ts', ...names.map(name => `dialog/${name}.svelte.d.ts`)]) {
  assert(readFileSync(new URL(`./node_modules/@sveltery/ui/dist/${path}`, import.meta.url), 'utf8').length > 0);
}
const first = render(Consumer).body;
const second = render(Consumer).body;
for (const html of [first, second]) {
  assert.equal((html.match(/aria-haspopup="dialog"/g) ?? []).length, 2);
  const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1]);
  assert.equal(ids.length, 5);
  assert.equal(new Set(ids).size, 5);
  assert(!html.includes('data-base-ui-portal'));
  assert(!html.includes('role="dialog"'));
  assert(html.includes('data-slot="dialog-header"'));
  assert(html.includes('First description'));
  assert(html.includes('cn-button-variant-secondary'));
  assert(html.includes('cn-button-size-lg'));
  assert(html.includes('aria-disabled="true"'));
  assert(html.includes('name="save"'));
  assert.match(html, /<button[^>]*name="save"[^>]*class="[^"]*px-6/);
}
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-dialog-content'));
console.log('Isolated UI tarball: Dialog and Button root/subpath exports, SSR, IDs, absent portals, CSS, declarations and notices PASS');
JS
node --import "$sveltery_repo_root/scripts/svelte-ssr-loader.mjs" "$consumer_directory/check.mjs"
cat > "$consumer_directory/types.ts" <<'TS'
import type { ComponentProps } from 'svelte';
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@sveltery/ui';
import { DialogPortal, DialogOverlay } from '@sveltery/ui/dialog';
const root: ComponentProps<typeof Dialog> = { modal: false, actions: null };
const trigger: ComponentProps<typeof DialogTrigger> = { nativeButton: false, onclick: event => event.preventBaseUIHandler() };
const popup: ComponentProps<typeof DialogContent> = { showCloseButton: true, class: state => state.open ? 'p-8' : '', initialFocus: false };
const footer: ComponentProps<typeof DialogFooter> = { showCloseButton: true };
const portal: ComponentProps<typeof DialogPortal> = { keepMounted: true, container: null };
const overlay: ComponentProps<typeof DialogOverlay> = { forceRender: true };
import { Button, buttonVariants, type ButtonState } from '@sveltery/ui/button';
const button: ComponentProps<typeof Button> = { variant: 'destructive', size: 'icon-xs', type: 'submit', focusableWhenDisabled: true, nativeButton: false, class: state => state.disabled ? 'px-6' : 'px-4', onclick: event => event.preventBaseUIHandler() };
const state: ButtonState = { disabled: false };
buttonVariants({ variant: null, size: null, class: 'px-6' });
// @ts-expect-error unsupported styled variant
const invalidButton: ComponentProps<typeof Button> = { variant: 'danger' };
// @ts-expect-error packaged declarations reject CSS objects
const badStyle: ComponentProps<typeof DialogContent> = { style: { color: 'red' } };
// @ts-expect-error no new Button variant API
const badVariant: ComponentProps<typeof DialogTrigger> = { variant: 'ghost' };
void [root, trigger, popup, footer, portal, overlay, badStyle, badVariant, button, state, invalidButton];
TS
node "$sveltery_repo_root/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck --moduleResolution Bundler --module ESNext --target ES2022 --lib ES2022,DOM,DOM.Iterable "$consumer_directory/types.ts"
echo 'Isolated packaged public type assertions: PASS'
