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
for dependency in svelte clsx tailwind-merge class-variance-authority jsdom; do
  ln -s "$sveltery_repo_root/node_modules/$dependency" "$consumer_directory/node_modules/$dependency"
done
cmp packages/ui/LICENSE "$consumer_directory/node_modules/@sveltery/ui/LICENSE"
cmp packages/ui/THIRD_PARTY_NOTICES.md "$consumer_directory/node_modules/@sveltery/ui/THIRD_PARTY_NOTICES.md"
cat > "$consumer_directory/Consumer.svelte" <<'SVELTE'
<script lang="ts">
  import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogContent } from '@sveltery/ui';
  import * as Parts from '@sveltery/ui/dialog';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Textarea } from '@sveltery/ui/textarea';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@sveltery/ui/table';
  import type { Snippet } from 'svelte';
</script>
{#snippet replacement(props: Record<string | symbol, unknown>, _state: { disabled: boolean }, children: Snippet | undefined)}
  <span {...props}>{#if children}{@render children()}{:else}SSR fallback label{/if}</span>
{/snippet}
<KbdGroup data-probe="kbd-group"><Kbd data-probe="kbd">Ctrl &amp; K</Kbd></KbdGroup>
<Skeleton data-probe="skeleton" class="h-4 w-32" />
<Table data-probe="native-table"><TableCaption>Consumer ledger</TableCaption><TableHeader><TableRow><TableHead scope="col">Invoice</TableHead><TableHead scope="col">Amount</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell rowspan={2}>INV001</TableCell><TableCell>$250.00</TableCell></TableRow><TableRow><TableCell>$150.00</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell colspan={2}>Total $400.00</TableCell></TableRow></TableFooter></Table>
<Textarea name="notes" defaultValue="SSR & draft" rows={6} class="px-6" aria-invalid="true" />
<Button nativeButton={false} render={replacement} />
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
import { JSDOM } from 'jsdom';
import Consumer from './Consumer.svelte';
import * as Root from '@sveltery/ui';
import * as Parts from '@sveltery/ui/dialog';
import * as Buttons from '@sveltery/ui/button';
import * as Textareas from '@sveltery/ui/textarea';
import * as Skeletons from '@sveltery/ui/skeleton';
import * as Keys from '@sveltery/ui/kbd';
import * as Tables from '@sveltery/ui/table';
const tableNames = ['Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHead', 'TableCell', 'TableCaption'];
assert.deepEqual(Object.keys(Tables).sort(), tableNames.slice().sort());
for (const name of tableNames) assert.equal(Root[name], Tables[name]);
const names = ['Dialog', 'DialogClose', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogOverlay', 'DialogPortal', 'DialogTitle', 'DialogTrigger'];
assert.deepEqual(Object.keys(Root).sort(), [...names, ...tableNames, 'Button', 'buttonVariants', 'variants', 'sizes', 'Textarea', 'Skeleton', 'Kbd', 'KbdGroup'].sort());
assert.deepEqual(Object.keys(Buttons).sort(), ['Button', 'buttonVariants', 'sizes', 'variants']);
assert.deepEqual(Object.keys(Parts).sort(), names);
assert.deepEqual(Object.keys(Textareas), ['Textarea']);
assert.equal(Root.Textarea, Textareas.Textarea);
assert.deepEqual(Object.keys(Skeletons), ['Skeleton']);
assert.equal(Root.Skeleton, Skeletons.Skeleton);
assert.deepEqual(Object.keys(Keys).sort(), ['Kbd', 'KbdGroup']);
assert.equal(Root.Kbd, Keys.Kbd); assert.equal(Root.KbdGroup, Keys.KbdGroup);
for (const path of ['table/index.d.ts', ...tableNames.map(name => `table/${name}.svelte.d.ts`), 'index.d.ts', 'dialog/index.d.ts', 'button/index.d.ts', 'button/Button.svelte.d.ts', 'button/types.d.ts', 'textarea/index.d.ts', 'textarea/Textarea.svelte.d.ts', 'skeleton/index.d.ts', 'skeleton/Skeleton.svelte.d.ts', 'kbd/index.d.ts', 'kbd/Kbd.svelte.d.ts', 'kbd/KbdGroup.svelte.d.ts', 'kbd/types.d.ts', ...names.map(name => `dialog/${name}.svelte.d.ts`)]) {
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
  assert(html.includes('SSR fallback label'));
  assert.match(html, /<textarea[^>]*data-slot="textarea"[^>]*name="notes"[^>]*>SSR &amp; draft<\/textarea>/);
  assert(html.includes('cn-textarea'));
  const nativeTable = new JSDOM(html).window.document.querySelector('[data-probe=native-table]');
  assert.equal(nativeTable.tagName, 'TABLE');
  assert.equal(nativeTable.parentElement.getAttribute('data-slot'), 'table-container');
  assert.equal(nativeTable.querySelector('caption').textContent, 'Consumer ledger');
  assert.equal(nativeTable.querySelector('th').scope, 'col');
  assert.equal(nativeTable.querySelector('td').rowSpan, 2);
  assert.equal(nativeTable.querySelector('tfoot td').colSpan, 2);
  assert.equal(nativeTable.querySelector('tfoot td').textContent, 'Total $400.00');
  const nativeSkeleton = new JSDOM(html).window.document.querySelector('[data-probe=skeleton]');
  assert.equal(nativeSkeleton.tagName, 'DIV'); assert.equal(nativeSkeleton.getAttribute('data-slot'), 'skeleton'); assert.equal(nativeSkeleton.textContent, '');
  assert(html.includes('cn-skeleton'));
  const nativeGroup = new JSDOM(html).window.document.querySelector('[data-probe=kbd-group]');
  assert.equal(nativeGroup.tagName, 'KBD'); assert.equal(nativeGroup.getAttribute('data-slot'), 'kbd-group');
  assert.equal(nativeGroup.firstElementChild.tagName, 'KBD'); assert.equal(nativeGroup.firstElementChild.getAttribute('data-slot'), 'kbd'); assert.equal(nativeGroup.textContent, 'Ctrl & K');
  assert(html.includes('role="button"'));
  assert.match(html, /<button[^>]*name="save"[^>]*class="[^"]*px-6/);
}
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-dialog-content'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-textarea'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-skeleton'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-kbd-group'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-table-container'));
console.log('Isolated Table plus existing UI tarball: Dialog, Button, Textarea, Skeleton and Kbd root/subpath exports, SSR, IDs, absent portals, CSS, declarations and notices PASS');
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
import { Textarea } from '@sveltery/ui/textarea';
const textarea: ComponentProps<typeof Textarea> = { ref: null, value: 'Message', defaultValue: 'Draft', class: ['px-6'], rows: 6, required: true, readonly: true, maxlength: 40, style: 'resize: none', oninput: event => { const node: HTMLTextAreaElement = event.currentTarget; void node; } };
// @ts-expect-error no Textarea variant API
const badTextarea: ComponentProps<typeof Textarea> = { variant: 'outline' };
import { Skeleton } from '@sveltery/ui/skeleton';
const skeleton: ComponentProps<typeof Skeleton> = { ref: undefined, class: ['h-4'], style: 'width: 100px', onclick: event => { const node: HTMLDivElement = event.currentTarget; void node; } };
// @ts-expect-error native Skeleton has no render API
const badSkeleton: ComponentProps<typeof Skeleton> = { render: () => {} };
import { Kbd, KbdGroup, type KbdProps, type KbdGroupProps } from '@sveltery/ui/kbd';
const kbd: KbdProps = { ref: undefined, class: ['px-3'], style: 'color: red', onclick: event => { const node: HTMLElement = event.currentTarget; void node; } };
const group: KbdGroupProps = { ref: undefined, title: 'Keys' };
const kbdComponent: ComponentProps<typeof Kbd> = kbd;
const groupComponent: ComponentProps<typeof KbdGroup> = group;
// @ts-expect-error native Kbd has no render API
const badKbd: KbdProps = { render: () => {} };
void [kbdComponent, groupComponent, badKbd];
void [skeleton, badSkeleton];
void [textarea, badTextarea];
void [root, trigger, popup, footer, portal, overlay, badStyle, badVariant, button, state, invalidButton];
TS
sed 's#../apps/docs/registry/bases/base/ui/table/index.js#@sveltery/ui/table#' tests/types-table.ts > "$consumer_directory/table-types.ts"
node "$sveltery_repo_root/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck --moduleResolution Bundler --module ESNext --target ES2022 --lib ES2022,DOM,DOM.Iterable "$consumer_directory/types.ts" "$consumer_directory/table-types.ts"
echo 'Isolated packaged public type assertions: PASS'
