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
for dependency in svelte cn clsx class-variance-authority jsdom shadcn; do
  ln -s "$sveltery_repo_root/node_modules/$dependency" "$consumer_directory/node_modules/$dependency"
done
# Base's own runtime dependencies (esm-env and Floating UI since sveltery/base#93) resolve beside its installed copy.
base_dependencies="$(realpath "$sveltery_repo_root/node_modules/@sveltery/base")/../.."
for dependency in esm-env @floating-ui/dom @floating-ui/utils; do
  mkdir -p "$(dirname "$consumer_directory/node_modules/$dependency")"
  ln -s "$(realpath "$base_dependencies/$dependency")" "$consumer_directory/node_modules/$dependency"
done
cmp packages/ui/LICENSE "$consumer_directory/node_modules/@sveltery/ui/LICENSE"
cmp packages/ui/THIRD_PARTY_NOTICES.md "$consumer_directory/node_modules/@sveltery/ui/THIRD_PARTY_NOTICES.md"
cmp tests/reference/cn-upstream/LICENSE "$consumer_directory/node_modules/cn/LICENSE"
cmp tests/reference/shadcn-css-upstream/LICENSE.md "$consumer_directory/node_modules/shadcn/LICENSE.md"
cmp tests/reference/themes/upstream/shadcn-tailwind.css "$consumer_directory/node_modules/shadcn/dist/tailwind.css"
for license in lucide-LICENSE tabler-LICENSE hugeicons-core-LICENSE.md phosphor-LICENSE remix-LICENSE; do
  cmp "tests/reference/icons/licenses/$license" "$consumer_directory/node_modules/@sveltery/ui/dist/icons/licenses/$license"
done
for module in fallback lucide tabler hugeicons phosphor remixicon; do
  cmp "apps/docs/registry/bases/base/ui/icons/generated/$module.js" "$consumer_directory/node_modules/@sveltery/ui/dist/icons/generated/$module.js"
done
if find "$consumer_directory/node_modules/@sveltery/ui" -iname '*hugeicons-react*' -print -quit | read -r restricted_renderer; then
  echo 'Restricted Hugeicons renderer must remain reference-only' >&2
  exit 1
fi
cat > "$consumer_directory/Consumer.svelte" <<'SVELTE'
<script lang="ts">
  import { Dialog, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter, DialogClose, DialogContent } from '@sveltery/ui';
  import * as Parts from '@sveltery/ui/dialog';
  import { Button, buttonVariants } from '@sveltery/ui/button';
  import { Textarea } from '@sveltery/ui/textarea';
  import { Label } from '@sveltery/ui/label';
  import { Alert, AlertTitle, AlertDescription, AlertAction } from '@sveltery/ui/alert';
  import { AspectRatio } from '@sveltery/ui/aspect-ratio';
  import { Example, ExampleWrapper } from '@sveltery/ui/example';
  import { Separator } from '@sveltery/ui/separator';
  import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyContent, EmptyMedia } from '@sveltery/ui/empty';
  import { Skeleton } from '@sveltery/ui/skeleton';
  import { Kbd, KbdGroup } from '@sveltery/ui/kbd';
  import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@sveltery/ui/table';
  import { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount } from '@sveltery/ui/avatar';
  import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@sveltery/ui/card';
  import type { Snippet } from 'svelte';
</script>
{#snippet replacement(props: Record<string | symbol, unknown>, _state: { disabled: boolean }, children: Snippet | undefined)}
  <span {...props}>{#if children}{@render children()}{:else}SSR fallback label{/if}</span>
{/snippet}
<Separator data-probe="separator" orientation="vertical" /><Separator data-probe="separator-callback" class={() => 'ignored'} />
<ExampleWrapper data-probe="example-wrapper"><Example data-probe="example" title="Example &amp; notes" class="p-4" containerClassName="max-w-none">Scaffold content</Example></ExampleWrapper>
<Alert variant="destructive" data-probe="alert"><AlertTitle>Notice</AlertTitle><AlertDescription>Description</AlertDescription><AlertAction><button>Undo</button></AlertAction></Alert>
<Empty data-probe="empty"><EmptyHeader><EmptyMedia variant="icon">Media</EmptyMedia><EmptyTitle>Empty title</EmptyTitle><EmptyDescription>Description &amp; notes</EmptyDescription></EmptyHeader><EmptyContent>Content</EmptyContent></Empty>
<EmptyMedia data-probe="empty-media-null" variant={null} />
<Card size="sm" data-probe="card"><CardHeader><CardTitle>Title</CardTitle><CardDescription>Description</CardDescription><CardAction>Action</CardAction></CardHeader><CardContent>Content</CardContent><CardFooter>Footer</CardFooter></Card>
<AvatarGroup data-probe="avatar-group"><Avatar size="sm" data-probe="avatar"><AvatarImage src="/consumer-avatar.png" alt="Consumer portrait" /><AvatarFallback>CN</AvatarFallback><AvatarBadge data-probe="avatar-badge">Badge</AvatarBadge></Avatar><AvatarGroupCount data-probe="avatar-count">+3</AvatarGroupCount></AvatarGroup>
<KbdGroup data-probe="kbd-group"><Kbd data-probe="kbd">Ctrl &amp; K</Kbd></KbdGroup>
<Label data-probe="label" for="consumer-message">Message &amp; notes</Label>
<AspectRatio data-probe="aspect-ratio" ratio={16 / 9}>Aspect &amp; ratio</AspectRatio>
<AspectRatio data-probe="aspect-ratio-override" ratio={16 / 9} style="--ratio: 1; color: red" />
<Skeleton data-probe="skeleton" class="h-4 w-32" />
<Skeleton data-probe="cn-nonbreaking" class={'p-2\u00a0p-4'} />
<Skeleton data-probe="cn-line-separator" class={'p-2\u2028p-4'} />
<Table data-probe="native-table"><TableCaption>Consumer ledger</TableCaption><TableHeader><TableRow><TableHead scope="col">Invoice</TableHead><TableHead scope="col">Amount</TableHead></TableRow></TableHeader><TableBody><TableRow><TableCell rowspan={2}>INV001</TableCell><TableCell>$250.00</TableCell></TableRow><TableRow><TableCell>$150.00</TableCell></TableRow></TableBody><TableFooter><TableRow><TableCell colspan={2}>Total $400.00</TableCell></TableRow></TableFooter></Table>
<Textarea name="notes" defaultValue="SSR & draft" rows={6} class="px-6" aria-invalid="true" />
<Button nativeButton={false} render={replacement} />
<Button name="save" value="yes" variant="secondary" size="lg" class="px-6">Save</Button>
<Button disabled focusableWhenDisabled type="submit">Unavailable</Button>
<button class={buttonVariants({ variant: 'outline', size: 'sm' })}>Composed style</button>
<Dialog defaultOpen><DialogTrigger>First</DialogTrigger><DialogHeader><DialogTitle>First title</DialogTitle><DialogDescription>First description</DialogDescription></DialogHeader><DialogFooter><DialogClose>Close</DialogClose></DialogFooter><DialogContent>Client only content</DialogContent></Dialog>
<Parts.Dialog><Parts.DialogTrigger>Second</Parts.DialogTrigger><Parts.DialogTitle>Second title</Parts.DialogTitle><Parts.DialogPortal><Parts.DialogOverlay /></Parts.DialogPortal></Parts.Dialog>
SVELTE
cat > "$consumer_directory/IconConsumer.svelte" <<'SVELTE'
<script lang="ts">
  import { IconPlaceholder, IconLibraryProvider, type IconLibraryName } from '@sveltery/ui/icons';
  let { library = 'lucide' }: { library?: IconLibraryName } = $props();
  const names = { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' };
</script>
<IconLibraryProvider {library}><IconPlaceholder {...names} data-probe="packaged-icon" strokeWidth={7} /></IconLibraryProvider>
SVELTE
cat > "$consumer_directory/check.mjs" <<'JS'
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { render } from 'svelte/server';
import { JSDOM } from 'jsdom';
import Consumer from './Consumer.svelte';
import IconConsumer from './IconConsumer.svelte';
import * as Root from '@sveltery/ui';
import * as Parts from '@sveltery/ui/dialog';
import * as Buttons from '@sveltery/ui/button';
import * as Textareas from '@sveltery/ui/textarea';
import * as Labels from '@sveltery/ui/label';
import * as Ratios from '@sveltery/ui/aspect-ratio';
assert.deepEqual(Object.keys(Ratios), ['AspectRatio']);
assert.equal(Root.AspectRatio, Ratios.AspectRatio);
import * as Skeletons from '@sveltery/ui/skeleton';
import * as Keys from '@sveltery/ui/kbd';
import * as Separators from '@sveltery/ui/separator';
assert.deepEqual(Object.keys(Separators), ['Separator']); assert.equal(Root.Separator, Separators.Separator);
import * as Icons from '@sveltery/ui/icons';
const iconNames = ['IconPlaceholder', 'IconLibraryProvider', 'iconLibraries'];
assert.deepEqual(Object.keys(Icons).sort(), iconNames.toSorted());
for (const name of iconNames) assert.equal(Root[name], Icons[name]);
assert.deepEqual(Icons.iconLibraries, ['lucide', 'tabler', 'hugeicons', 'phosphor', 'remixicon']);
const firstIcon = new JSDOM(render(IconConsumer).body).window.document.querySelector('svg');
assert.equal(firstIcon.getAttribute('class'), 'lucide lucide-square');
assert.equal(firstIcon.getAttribute('stroke-width'), '7');
for (const library of Icons.iconLibraries) {
  const props = { library };
  render(IconConsumer, { props });
  // Observe actual asynchronous completion through the public renderer. Native
  // ESM filesystem work may need more than one turn; the expected glyph stays fixed.
  const deadline = performance.now() + 5000;
  let icon;
  do {
    await new Promise(resolve => setTimeout(resolve, 5));
    icon = new JSDOM(render(IconConsumer, { props }).body).window.document.querySelector('svg');
  } while (icon?.classList.contains('lucide-square') && performance.now() < deadline);
  assert(icon.querySelector('path'), `${library}: genuine settled packaged geometry`);
  assert.equal(icon.getAttribute(library), { lucide: 'ArrowLeftIcon', tabler: 'IconArrowLeft', hugeicons: 'ArrowLeft01Icon', phosphor: 'ArrowLeftIcon', remixicon: 'RiArrowLeftLine' }[library]);
  assert.equal(icon.classList.contains('lucide-square'), false, `${library}: no unresolved fallback`);
}

import * as Examples from '@sveltery/ui/example';
assert.deepEqual(Object.keys(Examples).sort(), ['Example', 'ExampleWrapper']);
assert.equal(Root.Example, Examples.Example); assert.equal(Root.ExampleWrapper, Examples.ExampleWrapper);
import * as Empties from '@sveltery/ui/empty';
const emptyNames = ['Empty', 'EmptyHeader', 'EmptyTitle', 'EmptyDescription', 'EmptyContent', 'EmptyMedia'];
assert.deepEqual(Object.keys(Empties).sort(), emptyNames.toSorted());
for (const name of emptyNames) assert.equal(Root[name], Empties[name]);
import * as Cards from '@sveltery/ui/card';
import * as Alerts from '@sveltery/ui/alert';
const alertNames = ['Alert', 'AlertTitle', 'AlertDescription', 'AlertAction'];
assert.deepEqual(Object.keys(Alerts).sort(), alertNames.toSorted());
for (const name of alertNames) assert.equal(Root[name], Alerts[name]);
const cardNames = ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardAction', 'CardContent', 'CardFooter'];
assert.deepEqual(Object.keys(Cards).sort(), cardNames.toSorted());
for (const name of cardNames) assert.equal(Root[name], Cards[name]);
import * as Avatars from '@sveltery/ui/avatar';
const avatarNames = ['Avatar', 'AvatarImage', 'AvatarFallback', 'AvatarBadge', 'AvatarGroup', 'AvatarGroupCount'];
assert.deepEqual(Object.keys(Avatars).sort(), avatarNames.toSorted());
for (const name of avatarNames) assert.equal(Root[name], Avatars[name]);
import * as Tables from '@sveltery/ui/table';
const tableNames = ['Table', 'TableHeader', 'TableBody', 'TableFooter', 'TableRow', 'TableHead', 'TableCell', 'TableCaption'];
assert.deepEqual(Object.keys(Tables).sort(), tableNames.slice().sort());
for (const name of tableNames) assert.equal(Root[name], Tables[name]);
const names = ['Dialog', 'DialogClose', 'DialogContent', 'DialogDescription', 'DialogFooter', 'DialogHeader', 'DialogOverlay', 'DialogPortal', 'DialogTitle', 'DialogTrigger'];
assert.deepEqual(Object.keys(Root).sort(), [...names, ...tableNames, ...cardNames, ...avatarNames, ...alertNames, ...emptyNames, ...iconNames, 'Separator', 'Example', 'ExampleWrapper', 'Button', 'buttonVariants', 'variants', 'sizes', 'Textarea', 'Label', 'AspectRatio', 'Skeleton', 'Kbd', 'KbdGroup'].sort());
assert.deepEqual(Object.keys(Buttons).sort(), ['Button', 'buttonVariants', 'sizes', 'variants']);
assert.deepEqual(Object.keys(Parts).sort(), names);
assert.deepEqual(Object.keys(Labels), ['Label']);
assert.equal(Root.Label, Labels.Label);
assert.deepEqual(Object.keys(Textareas), ['Textarea']);
assert.equal(Root.Textarea, Textareas.Textarea);
assert.deepEqual(Object.keys(Skeletons), ['Skeleton']);
assert.equal(Root.Skeleton, Skeletons.Skeleton);
assert.deepEqual(Object.keys(Keys).sort(), ['Kbd', 'KbdGroup']);
assert.equal(Root.Kbd, Keys.Kbd); assert.equal(Root.KbdGroup, Keys.KbdGroup);
for (const path of ['avatar/index.d.ts', 'avatar/types.d.ts', ...avatarNames.map(name => `avatar/${name}.svelte.d.ts`), 'separator/index.d.ts', 'separator/types.d.ts', 'separator/Separator.svelte.d.ts', 'example/index.d.ts', 'example/types.d.ts', 'example/Example.svelte.d.ts', 'example/ExampleWrapper.svelte.d.ts', 'icons/index.d.ts', 'icons/types.d.ts', 'icons/config.d.ts', 'icons/IconPlaceholder.svelte.d.ts', 'icons/IconLibraryProvider.svelte.d.ts', 'empty/index.d.ts', 'empty/types.d.ts', ...emptyNames.map(name => `empty/${name}.svelte.d.ts`), 'alert/index.d.ts', 'alert/types.d.ts', ...alertNames.map(name => `alert/${name}.svelte.d.ts`), 'table/index.d.ts', ...tableNames.map(name => `table/${name}.svelte.d.ts`), 'label/index.d.ts', 'label/Label.svelte.d.ts', 'index.d.ts', 'dialog/index.d.ts', 'button/index.d.ts', 'button/Button.svelte.d.ts', 'button/types.d.ts', 'textarea/index.d.ts', 'textarea/Textarea.svelte.d.ts', 'skeleton/index.d.ts', 'skeleton/Skeleton.svelte.d.ts', 'kbd/index.d.ts', 'kbd/Kbd.svelte.d.ts', 'kbd/KbdGroup.svelte.d.ts', 'kbd/types.d.ts', 'card/index.d.ts', 'card/types.d.ts', ...cardNames.map(name => `card/${name}.svelte.d.ts`), ...names.map(name => `dialog/${name}.svelte.d.ts`)]) {
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
  const separator = new JSDOM(html).window.document.querySelector('[data-probe=separator]');
  assert.equal(separator.tagName, 'DIV'); assert.equal(separator.getAttribute('role'), 'separator'); assert.equal(separator.getAttribute('aria-orientation'), 'vertical'); assert.equal(separator.getAttribute('data-orientation'), 'vertical'); assert.equal(separator.hasAttribute('data-vertical'), false); assert.equal(separator.getAttribute('data-slot'), 'separator');
  assert.equal(new JSDOM(html).window.document.querySelector('[data-probe=separator-callback]').classList.contains('ignored'), false);
  const exampleWrapper = new JSDOM(html).window.document.querySelector('[data-probe=example-wrapper]');
  assert.equal(exampleWrapper.tagName, 'DIV'); assert.equal(exampleWrapper.getAttribute('data-slot'), 'example-wrapper');
  assert.equal(exampleWrapper.parentElement.className, 'w-full bg-muted dark:bg-background');
  const example = exampleWrapper.querySelector('[data-probe=example]');
  assert.equal(example.tagName, 'DIV'); assert.equal(example.hasAttribute('title'), false);
  assert.equal(example.firstElementChild.textContent, 'Example & notes');
  assert.equal(example.querySelector('[data-slot=example-content]').textContent, 'Scaffold content');
  assert(example.classList.contains('max-w-none')); assert(example.querySelector('[data-slot=example-content]').classList.contains('p-4'));
  const aspectRatio = new JSDOM(html).window.document.querySelector('[data-probe=aspect-ratio]');
  assert.equal(aspectRatio.tagName, 'DIV');
  assert.equal(aspectRatio.getAttribute('data-slot'), 'aspect-ratio');
  assert.equal(aspectRatio.style.getPropertyValue('--ratio'), String(16 / 9));
  assert.equal(aspectRatio.className, 'relative aspect-(--ratio)');
  assert.equal(aspectRatio.textContent, 'Aspect & ratio');
  const ratioOverride = new JSDOM(html).window.document.querySelector('[data-probe=aspect-ratio-override]');
  assert.equal(ratioOverride.style.getPropertyValue('--ratio'), '1');
  assert.equal(ratioOverride.style.color, 'red');
  const nativeLabel = new JSDOM(html).window.document.querySelector('[data-probe=label]');
  assert.equal(nativeLabel.tagName, 'LABEL');
  assert.equal(nativeLabel.htmlFor, 'consumer-message');
  assert.equal(nativeLabel.textContent, 'Message & notes');
  assert.equal(nativeLabel.getAttribute('data-slot'), 'label');
  assert(nativeLabel.classList.contains('cn-label'));
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
  for (const [probe, expected] of [['cn-nonbreaking', 'cn-skeleton animate-pulse p-2\u00a0p-4'], ['cn-line-separator', 'cn-skeleton animate-pulse p-2\u2028p-4']]) {
    assert.equal(new JSDOM(html).window.document.querySelector(`[data-probe=${probe}]`).getAttribute('class'), expected);
  }
  const avatarGroup = new JSDOM(html).window.document.querySelector('[data-probe=avatar-group]');
  assert.equal(avatarGroup.tagName, 'DIV');
  const avatar = avatarGroup.querySelector('[data-probe=avatar]');
  assert.equal(avatar.tagName, 'SPAN'); assert.equal(avatar.getAttribute('data-size'), 'sm');
  assert.equal(avatar.querySelector('[data-slot=avatar-fallback]').textContent, 'CN');
  assert.equal(avatar.querySelector('[data-slot=avatar-image]'), null);
  assert.equal(avatar.querySelector('[data-probe=avatar-badge]').tagName, 'SPAN');
  assert.equal(avatarGroup.querySelector('[data-probe=avatar-count]').textContent, '+3');
  const nativeGroup = new JSDOM(html).window.document.querySelector('[data-probe=kbd-group]');
  assert.equal(nativeGroup.tagName, 'KBD'); assert.equal(nativeGroup.getAttribute('data-slot'), 'kbd-group');
  assert.equal(nativeGroup.firstElementChild.tagName, 'KBD'); assert.equal(nativeGroup.firstElementChild.getAttribute('data-slot'), 'kbd'); assert.equal(nativeGroup.textContent, 'Ctrl & K');
  const alert = new JSDOM(html).window.document.querySelector('[data-probe=alert]');
  assert.equal(alert.tagName, 'DIV'); assert.equal(alert.getAttribute('role'), 'alert');
  assert.equal(alert.getAttribute('data-slot'), 'alert');
  assert(alert.classList.contains('cn-alert-variant-destructive'));
  assert.equal(alert.querySelectorAll('[data-slot^=alert-]').length, 3);
  assert.equal(alert.textContent, 'NoticeDescriptionUndo');
  const empty = new JSDOM(html).window.document.querySelector('[data-probe=empty]');
  assert.equal(empty.tagName, 'DIV'); assert.equal(empty.getAttribute('data-slot'), 'empty');
  assert.equal(empty.querySelectorAll('[data-slot^=empty]').length, 5);
  assert.equal(empty.querySelector('[data-slot=empty-description]').tagName, 'DIV');
  assert.equal(empty.querySelector('[data-slot=empty-description]').textContent, 'Description & notes');
  assert.equal(empty.querySelector('[data-slot=empty-icon]').getAttribute('data-variant'), 'icon');
  const emptyNull = new JSDOM(html).window.document.querySelector('[data-probe=empty-media-null]');
  assert.equal(emptyNull.hasAttribute('data-variant'), false);
  assert.equal(emptyNull.classList.contains('cn-empty-media-default'), false);
  assert.equal(emptyNull.classList.contains('cn-empty-media-icon'), false);
  const card = new JSDOM(html).window.document.querySelector('[data-probe=card]');
  assert.equal(card.tagName, 'DIV'); assert.equal(card.getAttribute('data-size'), 'sm');
  assert.equal(card.querySelectorAll('[data-slot^=card]').length, 6);
  assert.equal(card.textContent, 'TitleDescriptionActionContentFooter');
  assert(html.includes('role="button"'));
  assert.match(html, /<button[^>]*name="save"[^>]*class="[^"]*px-6/);
}
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-dialog-content'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-textarea'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-skeleton'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-kbd-group'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-table-container'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-card-footer'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-label'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-alert-action'));
assert(readFileSync(import.meta.resolve('@sveltery/ui/nova.css').replace('file://', ''), 'utf8').includes('.cn-empty-media-icon'));
for (const style of ['vega', 'nova', 'maia', 'lyra', 'mira', 'luma', 'sera', 'rhea']) {
  const css = readFileSync(import.meta.resolve(`@sveltery/ui/styles/${style}.css`).replace('file://', ''), 'utf8');
  assert(css.includes(`.style-${style}`)); assert(css.includes('.cn-dialog-content')); assert(css.includes('.cn-textarea'));
}
assert(readFileSync(import.meta.resolve('@sveltery/ui/styles.css').replace('file://', ''), 'utf8').includes('./scoped/rhea.css'));
const themes = readFileSync(import.meta.resolve('@sveltery/ui/themes.css').replace('file://', ''), 'utf8');
assert(themes.includes('@custom-variant dark (&:is(.dark *))'));
assert(themes.includes('.theme-taupe')); assert(themes.includes('.theme-yellow'));
assert(themes.includes('--background: oklch(0.145 0 0)'));
console.log('Isolated Avatar, Alert, Empty, AspectRatio, Label, Table plus Card and existing UI tarball: Dialog, Button, Textarea, Skeleton, Kbd and Card root/subpath exports, SSR, IDs, absent portals, CSS, declarations and notices PASS');
JS
node --import "$sveltery_repo_root/scripts/svelte-ssr-loader.mjs" "$consumer_directory/check.mjs"
cat > "$consumer_directory/types.ts" <<'TS'
import type { ComponentProps } from 'svelte';
import { Dialog, DialogTrigger, DialogContent, DialogFooter } from '@sveltery/ui';
import { DialogPortal, DialogOverlay } from '@sveltery/ui/dialog';
const root: ComponentProps<typeof Dialog> = { modal: false, open: false, triggerId: null };
const trigger: ComponentProps<typeof DialogTrigger> = { nativeButton: false, onclick: event => event.preventDefault() };
const popup: ComponentProps<typeof DialogContent> = { showCloseButton: true, class: ['p-8'], initialFocus: false };
const footer: ComponentProps<typeof DialogFooter> = { showCloseButton: true };
const portal: ComponentProps<typeof DialogPortal> = { keepMounted: true, container: null };
const overlay: ComponentProps<typeof DialogOverlay> = { forceRender: true };
import { Button, buttonVariants, type ButtonState } from '@sveltery/ui/button';
const button: ComponentProps<typeof Button> = { variant: 'destructive', size: 'icon-xs', type: 'submit', focusableWhenDisabled: true, nativeButton: false, class: 'px-6', onclick: event => event.preventDefault() };
const state: ButtonState = { disabled: false };
buttonVariants({ variant: null, size: null, class: 'px-6' });
// @ts-expect-error Base parts have no ref prop (use {@attach})
const badRef: ComponentProps<typeof Button> = { ref: null };
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
void [badRef, root, trigger, popup, footer, portal, overlay, badStyle, badVariant, button, state, invalidButton];
TS
sed 's#../apps/docs/registry/bases/base/ui/table/index.js#@sveltery/ui/table#' tests/types-table.ts > "$consumer_directory/table-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/card/index.js#@sveltery/ui/card#' tests/card-types.ts > "$consumer_directory/card-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/label/index.js#@sveltery/ui/label#' tests/label-types.ts > "$consumer_directory/label-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/aspect-ratio/index.js#@sveltery/ui/aspect-ratio#' tests/aspect-ratio-types.ts > "$consumer_directory/aspect-ratio-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/alert/index.js#@sveltery/ui/alert#' tests/alert-types.ts > "$consumer_directory/alert-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/empty/index.js#@sveltery/ui/empty#' tests/empty-types.ts > "$consumer_directory/empty-types.ts"
sed -e 's#../apps/docs/registry/bases/base/ui/icons/index.js#@sveltery/ui/icons#' -e 's#../apps/docs/registry/bases/base/ui/index.js#@sveltery/ui#' tests/icons-types.ts > "$consumer_directory/icons-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/example/index.js#@sveltery/ui/example#' tests/example-types.ts > "$consumer_directory/example-types.ts"
sed 's#../apps/docs/registry/bases/base/ui/separator/index.js#@sveltery/ui/separator#' tests/separator-types.ts > "$consumer_directory/separator-types.ts"
node "$sveltery_repo_root/node_modules/typescript/bin/tsc" --noEmit --strict --skipLibCheck --moduleResolution Bundler --module ESNext --target ES2022 --lib ES2022,DOM,DOM.Iterable "$consumer_directory/types.ts" "$consumer_directory/table-types.ts" "$consumer_directory/label-types.ts" "$consumer_directory/card-types.ts" "$consumer_directory/aspect-ratio-types.ts" "$consumer_directory/alert-types.ts" "$consumer_directory/empty-types.ts" "$consumer_directory/icons-types.ts" "$consumer_directory/example-types.ts" "$consumer_directory/separator-types.ts"
echo 'Isolated packaged public type assertions: PASS'
