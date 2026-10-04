// Authored isolated original-React experiment. Zero UI/native/copied-test credit.
import { test, expect, type Browser, type BrowserContext, type Page, type TestInfo } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { lstat, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { performance as hostClock } from 'node:perf_hooks';
import ts from 'typescript';
import { alertGallery, alertStyles, alertWidths, alertTheme, settledAlert, assertAlertGallery, alertGalleryTree, alertGalleryMeasurements, alertInlineTypographyDiagnostics } from '../../tests/browser/alert-gallery-cases';
import { baselineHead, upstreamPin, prefix, sha256, jsonHash, errorRecord, protectedSourceSnapshot, installedRuntime } from './vite.config';

const classification = 'authored-isolated-original-react-control';
const credit = { uiRuntime: 0, nativeParity: 0, copiedOrdinaryTests: 0, ordinaryDiscovery: 0 };
const contextSettings = { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1, locale: 'en-US', colorScheme: 'light' as const, reducedMotion: 'no-preference' as const };
const urls = { original: 'http://127.0.0.1:5175/alert?library=lucide', split: 'http://127.0.0.1:5176/alert?library=lucide', joined: 'http://127.0.0.1:5177/alert?library=lucide' };
type Variant = keyof typeof urls;
type Inline = Awaited<ReturnType<typeof alertInlineTypographyDiagnostics>>;
const archive = {
  run: '37185389097', artifact: '11296842690', zipBytes: 2378646, zipSha256: '63dbe30e182a8445545896936d8a641a1bf2536e3441c1070f28ba230264a172',
  jsonBytes: 3172558, jsonSha256: 'eb735f361f0146478b3a387122a98b01580b9ff8d82965698975a48ee88fc29a',
  member: 'alert-three-original-Alert-06f92--all-eight-styles-and-modes-chromium/alert-strict-geometry-failure-observations.json', sourceHead: baselineHead,
  originalURL: urls.original, scene: { library: 'lucide', style: 'lyra', dark: false, width: 390 },
  // Digests of genuine original fields, read from the authenticated physical JSON.
  // Ancestor/body text is omitted from these digests; every other recorded field remains exact.
  fields: { description: '1694cfbd83c748c7b1ad88b8480d32879a00cbaf37ea33f4604b39f3de535d4b', childNodes: 'a9106e5ff78f709c311762c07d1f9554c25303d5f7c81dddd0702f9548db4464', links: '4027f112d7d542765c18faa33fb81ef7845c4058860f6a28a84b9252301df00b', ancestors: '3c1c9536390c657ee3a5cb572370d699f32d7f9f62b2eb750ef23e73a3e0bb6c', body: '6b6afc3cb87737140a556922cb5ea64bd88ed71f6ff50bc065839c30788d091b' },
  absolute: { description: { x: 131, y: 595, width: 152, height: 78 }, anchor: { x: 131, y: 636, width: 104.078125, height: 33.5 }, fragments: [{ x: 175.03125, y: 636, width: 60.046875, height: 14, right: 235.078125 }, { x: 131, y: 655.5, width: 18.015625, height: 14 }] },
  shellRelative: { description: { x: 99, y: 563, width: 152, height: 78 }, anchor: { x: 99, y: 604, width: 104.078125, height: 33.5 } },
};
function archivedHashes(raw: Inline) {
  const withoutText = ({ text: _text, ...rest }: Inline['body']) => rest;
  return { description: jsonHash(raw.description), childNodes: jsonHash(raw.childNodes), links: jsonHash(raw.links), ancestors: jsonHash(raw.ancestors.map(withoutText)), body: jsonHash(withoutText(raw.body)) };
}
function reproduction(raw: Inline) {
  const actual = archivedHashes(raw);
  return { ok: JSON.stringify(actual) === JSON.stringify(archive.fields) && raw.fontStatus === 'loaded', expected: archive.fields, actual, fontStatus: raw.fontStatus, historicalAbsolute: archive.absolute, historicalShellRelative: archive.shellRelative };
}
function topology(raw: Inline, variant: Variant) {
  const actual = raw.childNodes.map(node => [node.type, node.name, node.value, node.text]);
  const lead = variant === 'joined' ? [[3, '#text', `${prefix} `, `${prefix} `]] : [[3, '#text', prefix, prefix], [3, '#text', ' ', ' ']];
  const expected = [...lead, [1, 'A', null, 'But it has a link'], [3, '#text', ' and a ', ' and a '], [1, 'A', null, 'second link'], [3, '#text', '.', '.']];
  return { ok: JSON.stringify(actual) === JSON.stringify(expected) && raw.description.text === `${prefix} But it has a link and a second link.`, actual, expected, aggregateText: raw.description.text, leadCodePoints: [...String(raw.childNodes[0]?.value ?? '')].map(char => char.codePointAt(0)) };
}

async function callerInputs(page: Page) {
  return page.evaluate(() => ({
    url: location.href, timeOrigin: performance.timeOrigin, documentReadyState: document.readyState,
    htmlAttributes: Object.fromEntries([...document.documentElement.attributes].map(attr => [attr.name, attr.value])),
    bodyAttributes: Object.fromEntries([...document.body.attributes].map(attr => [attr.name, attr.value])),
    viewport: { width: innerWidth, height: innerHeight, devicePixelRatio }, scroll: { x: scrollX, y: scrollY },
    language: navigator.language, languages: [...navigator.languages], userAgent: navigator.userAgent,
    media: { dark: matchMedia('(prefers-color-scheme: dark)').matches, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches },
    fonts: { status: document.fonts.status, bodyFont: getComputedStyle(document.body).fontFamily, rootFont: getComputedStyle(document.documentElement).fontFamily, sansVariable: document.documentElement.style.getPropertyValue('--font-sans'), headingVariable: document.documentElement.style.getPropertyValue('--font-heading') },
    galleryAggregateText: document.querySelector('[data-alert-gallery]')?.textContent ?? null,
    cssInputs: { rootStyleText: document.documentElement.style.cssText, headStyleIdentities: [...document.querySelectorAll('style')].map(node => ({ attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])), textUTF16Length: node.textContent?.length ?? 0 })), links: [...document.querySelectorAll('link[rel=stylesheet]')].map(node => ({ attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value])) })) },
  }));
}
type Inputs = Awaited<ReturnType<typeof callerInputs>>;
function equalCallerInputs(input: Inputs) {
  // Only explicitly differing origin/URL/clock and CSS source identities are omitted.
  // Actual CSS text/source identities remain separately persisted and source-bound.
  const comparable: Partial<Inputs> = { ...input };
  delete comparable.url; delete comparable.timeOrigin; delete comparable.cssInputs;
  return comparable;
}
async function rangesAndCSS(page: Page) {
  return page.locator(alertGallery).evaluate((wrapper, prefixLength) => {
    const description = wrapper.querySelectorAll('[data-slot=alert-description]')[2]!;
    const rect = (value: DOMRect) => ({ x: value.x, y: value.y, width: value.width, height: value.height, top: value.top, right: value.right, bottom: value.bottom, left: value.left });
    const readRange = (node: Text, start: number, end: number) => { const range = document.createRange(); range.setStart(node, start); range.setEnd(node, end); return { start, end, text: range.toString(), bounding: rect(range.getBoundingClientRect()), clientRects: [...range.getClientRects()].map(rect) }; };
    const textNodes = [...description.childNodes].flatMap((node, index) => node instanceof Text ? [{ index, value: node.data, utf16Length: node.length, full: readRange(node, 0, node.length), characters: Array.from({ length: node.length }, (_, offset) => readRange(node, offset, offset + 1)) }] : []);
    const first = description.firstChild;
    const prefixAndSpace = first instanceof Text ? { prefix: readRange(first, 0, Math.min(prefixLength, first.length)), finalCodePoint: first.data.codePointAt(first.data.length - 1), finalCharacter: readRange(first, Math.max(0, first.length - 1), first.length), nextTextNode: first.nextSibling instanceof Text ? { value: first.nextSibling.data, full: readRange(first.nextSibling, 0, first.nextSibling.length) } : null } : null;
    const styleSheets = [...document.styleSheets].map(sheet => {
      try { return { href: sheet.href, disabled: sheet.disabled, rules: [...sheet.cssRules].map(rule => rule.cssText), unavailable: null }; }
      catch (error) { return { href: sheet.href, disabled: sheet.disabled, rules: null, unavailable: String(error) }; }
    });
    const shell = wrapper.parentElement!.getBoundingClientRect();
    return { capturedAt: performance.now(), target: { attrs: Object.fromEntries([...description.attributes].map(attr => [attr.name, attr.value])), html: description.innerHTML, aggregateText: description.textContent, absolute: rect(description.getBoundingClientRect()), shellRelative: { x: description.getBoundingClientRect().x - shell.x, y: description.getBoundingClientRect().y - shell.y } }, textNodes, prefixAndSpace, styleSheets };
  }, prefix.length);
}

async function platformFonts(context: BrowserContext, page: Page) {
  const requests: unknown[] = [];
  let session: Awaited<ReturnType<BrowserContext['newCDPSession']>> | undefined;
  const results: unknown[] = [];
  try {
    session = await context.newCDPSession(page);
    requests.push({ method: 'DOM.enable' }); await session.send('DOM.enable');
    requests.push({ method: 'CSS.enable' }); await session.send('CSS.enable');
    requests.push({ method: 'DOM.getDocument', params: { depth: 0, pierce: true } });
    const document = await session.send('DOM.getDocument', { depth: 0, pierce: true });
    for (const selector of ['[data-alert-gallery] [data-slot="example"]:nth-child(2) [data-slot="alert"]:nth-child(2) [data-slot="alert-description"]', '[data-alert-gallery] [data-slot="example"]:nth-child(2) [data-slot="alert"]:nth-child(2) [data-slot="alert-description"] > a:first-of-type']) {
      requests.push({ method: 'DOM.querySelector', params: { nodeId: document.root.nodeId, selector } });
      const { nodeId } = await session.send('DOM.querySelector', { nodeId: document.root.nodeId, selector });
      if (!nodeId) throw new Error(`No CDP node for ${selector}`);
      requests.push({ method: 'CSS.getPlatformFontsForNode', params: { nodeId } });
      results.push({ selector, nodeId, response: await session.send('CSS.getPlatformFontsForNode', { nodeId }) });
    }
    return { supported: true, requests, results, limitation: 'Reported platform faces do not authenticate font file identity.' };
  } catch (error) { return { supported: false, requests, results, unavailable: errorRecord(error) }; }
  finally { if (session) try { await session.detach(); } catch (error) { results.push({ detachError: errorRecord(error) }); } }
}

type Scene = { ordinal: number; style: string; dark: boolean; width: number; height: number; started: number; completed?: number; inputs?: Inputs; treeHash?: string; error?: ReturnType<typeof errorRecord> };
type Observation = {
  variant: Variant; requestedURL: string; contextIdentity: string; pageIdentity: string; freshContextSettings: typeof contextSettings;
  hostStarted: number; hostEnded?: number; status: 'partial' | 'complete' | 'failed'; currentAwait: string | null; lastCompletedAwait: string | null;
  errors: unknown[]; console: unknown[]; helperEvents: unknown[]; resources: unknown[]; scenes: Scene[];
  contextInitialStorage?: Awaited<ReturnType<BrowserContext['storageState']>>; contextFinalStorage?: Awaited<ReturnType<BrowserContext['storageState']>>;
  initialInputs?: Inputs; finalInputs?: Inputs; initialTree?: unknown; finalTree?: unknown;
  measurements?: Awaited<ReturnType<typeof alertGalleryMeasurements>>; firstGeometry?: Inline; topology?: ReturnType<typeof topology>; reproduction?: ReturnType<typeof reproduction>;
  additionalRangesAndCSS?: Awaited<ReturnType<typeof rangesAndCSS>>; platformFonts?: Awaited<ReturnType<typeof platformFonts>>; postFontGeometry?: Inline; partialGeometry?: Inline;
  error?: ReturnType<typeof errorRecord>;
};
function runIdentity(browser: Browser, testInfo: TestInfo) { return { runId: process.env.GITHUB_RUN_ID ?? null, attempt: process.env.GITHUB_RUN_ATTEMPT ?? null, job: process.env.GITHUB_JOB ?? null, project: testInfo.project.name, retry: testInfo.retry, browserVersion: browser.version(), launchOptions: testInfo.project.use.launchOptions, workers: testInfo.config.workers, contextSettings, sourceHead: null as string | null }; }
type RunIdentity = ReturnType<typeof runIdentity>;
type CaseEvidence = { schemaVersion: number; classification: string; credit: typeof credit; order: string; actualVariantOrder: Variant[]; sourceManifestPath: string; runIdentity: RunIdentity; startedUTC: string; endedUTC?: string; complete: boolean; observations: Observation[]; errors: unknown[]; captureErrors: unknown[]; controls?: unknown; caseError?: ReturnType<typeof errorRecord> | null };
function compiledModule(code: string, url: string) {
  const source = ts.createSourceFile(url, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const strings: string[] = [];
  const visit = (node: ts.Node) => { if (ts.isStringLiteral(node)) strings.push(node.text); ts.forEachChild(node, visit); };
  visit(source);
  return { url, bytes: Buffer.byteLength(code), sha256: sha256(code), prefixLiteralCount: strings.filter(value => value === prefix).length, joinedLiteralCount: strings.filter(value => value === `${prefix} `).length, explicitU0020LiteralCount: strings.filter(value => value === ' ').length };
}
async function checkpoint(testInfo: TestInfo, evidence: CaseEvidence) {
  const path = testInfo.outputPath(evidence.order, 'observations.json');
  try { await mkdir(dirname(path), { recursive: true }); await writeFile(path, `${JSON.stringify(evidence, null, 2)}\n`); }
  catch (error) { evidence.captureErrors.push({ stage: 'physical-observation-checkpoint', error: errorRecord(error) }); }
}
async function collect(browser: Browser, variant: Variant, testInfo: TestInfo, evidence: CaseEvidence) {
  const observation: Observation = { variant, requestedURL: urls[variant], contextIdentity: randomUUID(), pageIdentity: randomUUID(), freshContextSettings: contextSettings, hostStarted: hostClock.now(), status: 'partial', currentAwait: null, lastCompletedAwait: null, errors: [], console: [], helperEvents: [], resources: [], scenes: [] };
  evidence.observations.push(observation);
  let context: BrowserContext | undefined;
  let page: Page | undefined;
  const resourceReads: Promise<void>[] = [];
  const awaitStage = async <T>(stage: string, run: () => Promise<T>) => { observation.currentAwait = stage; const result = await run(); observation.lastCompletedAwait = stage; observation.currentAwait = null; return result; };
  const observe = (stage: string, completed: boolean, raw?: unknown) => observation.helperEvents.push({ stage, completed, raw, hostTime: hostClock.now(), sceneOrdinal: observation.scenes.at(-1)?.ordinal ?? 0 });
  try {
    context = await awaitStage('fresh-context', () => browser.newContext(contextSettings));
    observation.contextInitialStorage = await context.storageState();
    page = await awaitStage('fresh-page', () => context!.newPage());
    const current = page;
    page.on('pageerror', error => observation.errors.push({ kind: 'pageerror', hostTime: hostClock.now(), error: errorRecord(error) }));
    page.on('console', message => observation.console.push({ type: message.type(), text: message.text(), location: message.location(), hostTime: hostClock.now() }));
    page.on('response', response => {
      const url = response.url();
      if (!/\.(?:tsx?|css|js)(?:\?|$)/.test(url)) return;
      resourceReads.push((async () => {
        try {
          const body = await response.body();
          const module = url.includes('/AlertGallery.tsx') ? compiledModule(body.toString('utf8'), url) : null;
          observation.resources.push({ url, status: response.status(), contentType: response.headers()['content-type'] ?? null, bytes: body.length, sha256: sha256(body), module });
        } catch (error) { observation.resources.push({ url, unavailable: errorRecord(error) }); }
      })());
    });
    await awaitStage('original-document-goto', () => current.goto(urls[variant]));
    await awaitStage('settled-original-gallery', () => settledAlert(current, observe));
    observation.initialTree = await awaitStage('initial-genuine-tree', () => alertGalleryTree(current));
    observation.initialInputs = await awaitStage('actual-initial-caller-inputs', () => callerInputs(current));
    expect(observation.initialInputs.htmlAttributes.class).toBe('style-nova');
    expect(observation.initialInputs.viewport).toEqual({ width: 1280, height: 900, devicePixelRatio: 1 });
    const replay = [...alertStyles.slice(0, 3).flatMap(style => [false, true].flatMap(dark => alertWidths.map(width => ({ style, dark, width, height: 1800 })))), { style: alertStyles[3], dark: false, width: alertWidths[0], height: 1800 }];
    expect(alertStyles.slice(0, 4)).toEqual(['vega', 'nova', 'maia', 'lyra']);
    expect(alertWidths).toEqual([390, 640, 768, 1024, 1280, 1536]);
    for (const [index, input] of replay.entries()) {
      const scene: Scene = { ordinal: index + 1, ...input, started: hostClock.now() };
      observation.scenes.push(scene);
      try {
        await awaitStage(`scene-${scene.ordinal}-viewport`, () => current.setViewportSize({ width: input.width, height: input.height }));
        await awaitStage(`scene-${scene.ordinal}-genuine-theme`, () => alertTheme(current, input.style, input.dark, observe));
        await awaitStage(`scene-${scene.ordinal}-genuine-gallery-assertion`, () => assertAlertGallery(current, input.width, input.style, 'lucide'));
        const tree = await awaitStage(`scene-${scene.ordinal}-genuine-tree`, () => alertGalleryTree(current));
        expect(tree).toEqual(observation.initialTree);
        scene.treeHash = jsonHash(tree);
        scene.inputs = await awaitStage(`scene-${scene.ordinal}-actual-caller-inputs`, () => callerInputs(current));
        scene.completed = hostClock.now();
      } catch (error) { scene.error = errorRecord(error); throw error; }
      if (scene.ordinal % alertWidths.length === 0 || scene.ordinal === replay.length) await checkpoint(testInfo, evidence);
    }
    // Preserve this first untouched geometry before Range offset/CSS/CDP reads.
    observation.measurements = await awaitStage('first-unchanged-gallery-measurements', () => alertGalleryMeasurements(current));
    observation.firstGeometry = await awaitStage('first-unchanged-inline-geometry', () => alertInlineTypographyDiagnostics(current));
    observation.finalTree = await awaitStage('final-genuine-tree', () => alertGalleryTree(current));
    observation.finalInputs = await awaitStage('actual-final-caller-inputs', () => callerInputs(current));
    observation.topology = topology(observation.firstGeometry, variant);
    if (variant !== 'joined') observation.reproduction = reproduction(observation.firstGeometry);
    await checkpoint(testInfo, evidence);
    observation.additionalRangesAndCSS = await awaitStage('post-geometry-read-only-ranges-css', () => rangesAndCSS(current));
    observation.platformFonts = await awaitStage('post-geometry-optional-cdp-platform-fonts', () => platformFonts(context!, current));
    observation.postFontGeometry = await awaitStage('post-font-probe-unchanged-inline-geometry', () => alertInlineTypographyDiagnostics(current));
    await Promise.all(resourceReads);
    observation.contextFinalStorage = await context.storageState();
    observation.status = 'complete';
  } catch (error) {
    observation.status = 'failed'; observation.error = errorRecord(error);
    if (page && !page.isClosed() && !observation.firstGeometry) {
      try { observation.partialGeometry = await alertInlineTypographyDiagnostics(page); }
      catch (captureError) { observation.errors.push({ kind: 'partial-geometry-capture', error: errorRecord(captureError) }); }
    }
    throw error;
  }
  finally {
    if (context) try { await context.close(); } catch (error) { observation.errors.push({ kind: 'context-close', error: errorRecord(error) }); }
    observation.hostEnded = hostClock.now();
    await checkpoint(testInfo, evidence);
  }
}

function caseControls(observations: Observation[]) {
  const original = observations.find(row => row.variant === 'original');
  const split = observations.find(row => row.variant === 'split');
  const joined = observations.find(row => row.variant === 'joined');
  const guards: { name: string; passed: boolean; details?: unknown }[] = [];
  const guard = (name: string, passed: boolean, details?: unknown) => guards.push({ name, passed, details });
  guard('three-complete-independent-fresh-contexts', observations.length === 3 && observations.every(row => row.status === 'complete') && new Set(observations.map(row => row.contextIdentity)).size === 3);
  for (const row of observations) {
    guard(`${row.variant}-runtime-topology-and-aggregate`, row.topology?.ok === true, row.topology);
    guard(`${row.variant}-37-complete-actual-replay-scenes`, row.scenes.length === 37 && row.scenes.every(scene => scene.completed !== undefined));
    guard(`${row.variant}-fresh-storage`, row.contextInitialStorage?.cookies.length === 0 && row.contextInitialStorage.origins.length === 0);
    const modules = row.resources.flatMap(resource => { const item = resource as { module?: ReturnType<typeof compiledModule> }; return item.module ? [item.module] : []; });
    guard(`${row.variant}-actual-served-compiled-module`, modules.length === 1 && modules[0].prefixLiteralCount === (row.variant === 'joined' ? 0 : 1) && modules[0].joinedLiteralCount === (row.variant === 'joined' ? 1 : 0), modules);
    guard(`${row.variant}-no-page-console-errors`, row.errors.length === 0 && !row.console.some(message => (message as { type: string }).type === 'error'));
    if (row.variant !== 'joined') guard(`${row.variant}-exact-genuine-archived-reproduction`, row.reproduction?.ok === true, row.reproduction);
    if (row.firstGeometry && row.postFontGeometry) guard(`${row.variant}-post-observer-geometry-stability`, JSON.stringify(archivedHashes(row.firstGeometry)) === JSON.stringify(archivedHashes(row.postFontGeometry)));
  }
  const inputs = (row: Observation | undefined) => row?.initialInputs && row.finalInputs ? { initial: equalCallerInputs(row.initialInputs), final: equalCallerInputs(row.finalInputs), scenes: row.scenes.map(scene => ({ style: scene.style, dark: scene.dark, width: scene.width, height: scene.height, inputs: scene.inputs ? equalCallerInputs(scene.inputs) : null })) } : null;
  guard('equal-actual-initial-final-and-replayed-caller-inputs', inputs(original) !== null && JSON.stringify(inputs(original)) === JSON.stringify(inputs(split)) && JSON.stringify(inputs(split)) === JSON.stringify(inputs(joined)));
  guard('equal-full-genuine-gallery-tree', original?.finalTree !== undefined && JSON.stringify(original.finalTree) === JSON.stringify(split?.finalTree) && JSON.stringify(split?.finalTree) === JSON.stringify(joined?.finalTree));
  guard('equal-original-live-and-isolated-split-measurements', original?.measurements !== undefined && JSON.stringify(original.measurements) === JSON.stringify(split?.measurements));
  return { ok: guards.every(row => row.passed), guards };
}
function rawDeltas(split: unknown, joined: unknown, path = ''): unknown[] {
  if (typeof split === 'number' && typeof joined === 'number') return Object.is(split, joined) ? [] : [{ path, split, joined, joinedMinusSplit: joined - split }];
  if (Array.isArray(split) && Array.isArray(joined)) return Array.from({ length: Math.max(split.length, joined.length) }, (_, index) => rawDeltas(split[index], joined[index], `${path}[${index}]`)).flat();
  if (split && joined && typeof split === 'object' && typeof joined === 'object') return [...new Set([...Object.keys(split), ...Object.keys(joined)])].flatMap(key => rawDeltas((split as Record<string, unknown>)[key], (joined as Record<string, unknown>)[key], `${path}.${key}`));
  return JSON.stringify(split) === JSON.stringify(joined) ? [] : [{ path, split, joined }];
}
function stableRangeGeometry(raw: Inline | undefined) {
  // Link text/DOM units are identical in both variants. Description full-range
  // rect counts can change solely because the controlled text nodes were joined.
  return raw ? { description: { rect: raw.description.rect, clientRects: raw.description.clientRects, css: raw.description.css }, links: raw.links.map(link => ({ text: link.text, rect: link.rect, clientRects: link.clientRects, rangeRects: link.rangeRects, childNodes: link.childNodes })), ancestors: raw.ancestors.map(node => ({ tag: node.tag, rect: node.rect, clientRects: node.clientRects, css: node.css })) } : null;
}
async function attachJSON(testInfo: TestInfo, filename: string, value: unknown, attempt = 0) {
  const canonicalPath = testInfo.outputPath(filename);
  const path = testInfo.outputPath(`delivery-attempt-${attempt}`, filename);
  const bytes = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  await mkdir(dirname(path), { recursive: true });
  await mkdir(dirname(canonicalPath), { recursive: true });
  await writeFile(canonicalPath, bytes);
  await writeFile(path, bytes);
  const reference = { filename, attempt, canonicalPath, path, bytes: bytes.length, sha256: sha256(bytes), attached: false, attachmentPath: null as string | null, attachmentBytes: null as number | null, attachmentSha256: null as string | null, byteIdentical: false, attachmentError: null as ReturnType<typeof errorRecord> | null };
  try {
    const index = testInfo.attachments.length;
    await testInfo.attach(`${filename.replace(/\.json$/, '').replace(/\//g, '-')}-snapshot-${attempt}`, { path, contentType: 'application/json' });
    const attachment = testInfo.attachments[index];
    if (!attachment?.path) throw new Error('Path attachment returned no physical copy path');
    reference.attachmentPath = attachment.path;
    const stat = await lstat(attachment.path);
    if (!stat.isFile() || stat.isSymbolicLink()) throw new Error('Path attachment copy is not a regular nonsymlink file');
    const copy = await readFile(attachment.path);
    reference.attachmentBytes = copy.length; reference.attachmentSha256 = sha256(copy);
    reference.byteIdentical = copy.equals(bytes);
    if (!reference.byteIdentical) throw new Error('Physical path attachment copy differs from authored JSON');
    reference.attached = true;
  }
  catch (error) { reference.attachmentError = errorRecord(error); }
  return reference;
}
async function otherOrder(testInfo: TestInfo, evidence: CaseEvidence) {
  const root = testInfo.project.outputDir;
  const found: { path: string; bytes: number; sha256: string; valid: boolean; evidence: CaseEvidence }[] = [];
  const walk = async (directory: string) => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      if (entry.isSymbolicLink()) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('delivery-attempt-')) await walk(path);
      else if (entry.isFile() && entry.name === 'observations.json' && path !== testInfo.outputPath(evidence.order, 'observations.json')) {
        try {
          const bytes = await readFile(path); const prior = JSON.parse(bytes.toString('utf8')) as CaseEvidence;
          const base = dirname(dirname(path));
          if (prior.sourceManifestPath !== join(base, 'source-runtime-manifest.json') || path !== join(base, prior.order, 'observations.json')) continue;
          const manifest = JSON.parse(await readFile(prior.sourceManifestPath, 'utf8'));
          const receipt = JSON.parse(await readFile(join(base, 'diagnostic-delivery-receipt.json'), 'utf8'));
          const opposite = evidence.order === 'split-then-joined' ? 'joined-then-split' : 'split-then-joined';
          const expectedOrder = opposite === 'split-then-joined' ? ['original', 'split', 'joined'] : ['original', 'joined', 'split'];
          const identityMatches = JSON.stringify(prior.runIdentity) === JSON.stringify(evidence.runIdentity) && JSON.stringify(manifest.runIdentity) === JSON.stringify(evidence.runIdentity) && JSON.stringify(receipt.runIdentity) === JSON.stringify(evidence.runIdentity);
          const required = ['source-runtime-manifest.json', `${prior.order}/observations.json`, 'diagnostic-summary.json'];
          let physicalCopiesMatch = true;
          for (const filename of required) {
            const reference = (receipt.canonicalReferences as Awaited<ReturnType<typeof attachJSON>>[]).find(row => row.filename === filename);
            if (!reference || !reference.attached || !reference.byteIdentical || reference.canonicalPath !== join(base, filename) || !reference.attachmentPath?.startsWith(`${base}/`)) { physicalCopiesMatch = false; continue; }
            const actual = await readFile(reference.canonicalPath); const copy = await readFile(reference.attachmentPath);
            if (actual.length !== reference.bytes || sha256(actual) !== reference.sha256 || !actual.equals(copy)) physicalCopiesMatch = false;
          }
          if (prior.classification === classification && prior.order === opposite && manifest.sourcePre?.actualHead === evidence.runIdentity.sourceHead) found.push({ path, bytes: bytes.length, sha256: sha256(bytes), valid: identityMatches && physicalCopiesMatch && JSON.stringify(prior.actualVariantOrder) === JSON.stringify(expectedOrder) && prior.complete === true && prior.observations.length === 3 && prior.captureErrors.length === 0 && prior.caseError === null && receipt.captureErrors.length === 0 && receipt.finalCaseError === null && manifest.sourcePre.ok === true && manifest.sourcePost?.ok === true && manifest.sourcesUnchangedDuringRun === true && manifest.caseError === null && (prior.controls as { ok?: boolean } | undefined)?.ok === true, evidence: prior });
        } catch { /* Actual absent/partial JSON is not reconstructed. */ }
      }
    }
  };
  await walk(root);
  const prior = found.length === 1 ? found[0] : null;
  const comparisons = (['original', 'split', 'joined'] as Variant[]).map(variant => {
    const before = prior?.evidence.observations.find(row => row.variant === variant);
    const now = evidence.observations.find(row => row.variant === variant);
    return { variant, bothComplete: before?.status === 'complete' && now?.status === 'complete', firstGeometryEqual: !!before?.firstGeometry && !!now?.firstGeometry && JSON.stringify(archivedHashes(before.firstGeometry)) === JSON.stringify(archivedHashes(now.firstGeometry)), measurementsEqual: before?.measurements !== undefined && JSON.stringify(before.measurements) === JSON.stringify(now?.measurements), callerInputsEqual: !!before?.finalInputs && !!now?.finalInputs && JSON.stringify(equalCallerInputs(before.finalInputs)) === JSON.stringify(equalCallerInputs(now.finalInputs)) };
  });
  return { status: prior ? (prior.valid && (evidence.controls as { ok?: boolean } | undefined)?.ok === true && comparisons.every(row => row.bothComplete && row.firstGeometryEqual && row.measurementsEqual && row.callerInputsEqual) ? 'stable-in-both-observed-orders' : 'unstable-or-incomplete') : found.length > 1 ? 'unstable-or-incomplete' : 'other-order-not-yet-available', candidates: found.map(({ evidence: _evidence, ...reference }) => reference), comparisons, limit: 'Fresh contexts and order reversal do not establish cold browser-process font/shaping caches.' };
}

for (const order of ['split-then-joined', 'joined-then-split'] as const) test(`isolated original React ${order}`, async ({ browser }, testInfo) => {
  const actualVariantOrder: Variant[] = order === 'split-then-joined' ? ['original', 'split', 'joined'] : ['original', 'joined', 'split'];
  const manifestPath = testInfo.outputPath('source-runtime-manifest.json');
  const identity = runIdentity(browser, testInfo);
  const evidence: CaseEvidence = { schemaVersion: 1, classification, credit, order, actualVariantOrder, sourceManifestPath: manifestPath, runIdentity: identity, startedUTC: new Date().toISOString(), complete: false, observations: [], errors: [], captureErrors: [] };
  const manifest: Record<string, unknown> = { schemaVersion: 1, classification, credit, baselineHead, upstreamPin, archive, urls, order, runIdentity: identity, contextSettings, browserVersion: browser.version(), sourcePre: null, sourcePost: null, runtime: null,
    run: { runId: process.env.GITHUB_RUN_ID ?? null, attempt: process.env.GITHUB_RUN_ATTEMPT ?? null, job: process.env.GITHUB_JOB ?? null, workflow: process.env.GITHUB_WORKFLOW ?? null, eventSHA: process.env.GITHUB_SHA ?? null, project: testInfo.project.name, workerIndex: testInfo.workerIndex, parallelIndex: testInfo.parallelIndex, retry: testInfo.retry, processArgv: process.argv, exactCLI: "bash -c 'source scripts/toolchain.sh; pnpm exec playwright test --config diagnostics/alert-child-segmentation/playwright.config.ts --project chromium'" },
    controls: { launchOptions: testInfo.project.use.launchOptions, retries: testInfo.project.retries, workers: testInfo.config.workers, diagnosticCaseTimeout: testInfo.timeout, diagnosticGlobalTimeout: testInfo.config.globalTimeout, unchangedOrdinaryDefaultTimeout: 30000, limitation: 'Diagnostic observations and bounds receive no ordinary timing-equivalence credit.' },
  };
  let originalError: unknown;
  try {
    expect(testInfo.project.name).toBe('chromium'); expect(testInfo.project.use.launchOptions?.chromiumSandbox).toBe(true); expect(testInfo.project.retries).toBe(0); expect(testInfo.config.workers).toBe(1);
    const sourcePre = protectedSourceSnapshot(); manifest.sourcePre = sourcePre;
    identity.sourceHead = sourcePre.actualHead;
    expect(sourcePre.ok, JSON.stringify(sourcePre.failures)).toBe(true);
    const runtime = installedRuntime(); manifest.runtime = runtime;
    expect(runtime.ok, JSON.stringify(runtime.failures)).toBe(true);
    const preDelivery = await attachJSON(testInfo, 'source-runtime-manifest.pre.json', manifest);
    if (!preDelivery.attached) throw new Error(`Pre-render manifest attachment failed: ${JSON.stringify(preDelivery.attachmentError)}`);
    for (const variant of actualVariantOrder) {
      try { await collect(browser, variant, testInfo, evidence); }
      catch (error) { evidence.errors.push({ variant, error: errorRecord(error) }); if (originalError === undefined) originalError = error; }
    }
    const controls = caseControls(evidence.observations); evidence.controls = controls;
    if (!controls.ok && originalError === undefined) originalError = new Error(`Invalid/inconclusive diagnostic controls: ${JSON.stringify(controls.guards.filter(row => !row.passed))}`);
    evidence.complete = evidence.observations.length === 3 && evidence.observations.every(row => row.status === 'complete');
  } catch (error) { if (originalError === undefined) originalError = error; evidence.errors.push({ stage: 'source-runtime-or-case-guard', error: errorRecord(error) }); }
  finally {
    evidence.endedUTC = new Date().toISOString();
    try {
      const sourcePost = protectedSourceSnapshot(); manifest.sourcePost = sourcePost;
      const sourcePre = manifest.sourcePre as ReturnType<typeof protectedSourceSnapshot> | null;
      const unchanged = !!sourcePre && sourcePost.ok && JSON.stringify(sourcePost.rows) === JSON.stringify(sourcePre.rows) && sourcePost.actualHead === sourcePre.actualHead && sourcePost.actualTree === sourcePre.actualTree;
      manifest.sourcesUnchangedDuringRun = unchanged;
      if (!unchanged && originalError === undefined) originalError = new Error('Protected sources or actual source head changed during diagnostic');
    } catch (error) { manifest.sourcePostError = errorRecord(error); if (originalError === undefined) originalError = error; }
    let stability: Awaited<ReturnType<typeof otherOrder>> | null = null;
    try {
      stability = await otherOrder(testInfo, evidence);
      if (stability.status === 'unstable-or-incomplete' && originalError === undefined) originalError = new Error('Order reversal showed unstable or incomplete controls');
      if (order === 'joined-then-split' && stability.status !== 'stable-in-both-observed-orders' && originalError === undefined) originalError = new Error('Second declared case lacks a valid physically delivered opposite-order witness');
    } catch (error) { evidence.captureErrors.push({ stage: 'other-order-observation', error: errorRecord(error) }); if (originalError === undefined) originalError = error; }
    const failCapture = () => { if (evidence.captureErrors.length && originalError === undefined) originalError = new Error(`Physical diagnostic capture failed: ${JSON.stringify(evidence.captureErrors)}`); };
    failCapture();
    const split = evidence.observations.find(row => row.variant === 'split'); const joined = evidence.observations.find(row => row.variant === 'joined');
    const deltas = split?.measurements && joined?.measurements ? rawDeltas(split.measurements, joined.measurements, 'measurements') : null;
    const rangeDeltas = split?.firstGeometry && joined?.firstGeometry ? rawDeltas(stableRangeGeometry(split.firstGeometry), stableRangeGeometry(joined.firstGeometry), 'stableRangeGeometry') : null;
    const receiptPath = testInfo.outputPath('diagnostic-delivery-receipt.json');
    const attempts: { attempt: number; references: Awaited<ReturnType<typeof attachJSON>>[] }[] = [];
    let repaired = false;
    const deliver = async (attempt: number) => {
      manifest.caseError = originalError === undefined ? null : errorRecord(originalError);
      manifest.captureErrorsThroughSnapshot = [...evidence.captureErrors];
      manifest.finalDeliveryReceiptPath = receiptPath;
      evidence.caseError = manifest.caseError as ReturnType<typeof errorRecord> | null;
      const references: Awaited<ReturnType<typeof attachJSON>>[] = [];
      attempts.push({ attempt, references });
      for (const [filename, value] of [['source-runtime-manifest.json', manifest], [`${order}/observations.json`, evidence]] as const) {
        try {
          const reference = await attachJSON(testInfo, filename, value, attempt); references.push(reference);
          if (!reference.attached) evidence.captureErrors.push({ stage: 'physical-path-attachment', attempt, reference });
        } catch (error) { evidence.captureErrors.push({ stage: 'physical-json-write-or-attachment', attempt, filename, error: errorRecord(error) }); }
      }
      failCapture();
      const validity = originalError === undefined && evidence.captureErrors.length === 0 && manifest.sourcesUnchangedDuringRun === true;
      const summary = { schemaVersion: 1, classification, credit, order, runIdentity: identity, actualHead: identity.sourceHead, references, finalDeliveryReceiptPath: receiptPath, complete: evidence.complete, validThroughThisSnapshot: validity, caseError: originalError === undefined ? null : errorRecord(originalError), twoOrderStability: stability, rawUnroundedMeasurementDeltas: deltas, rawUnroundedStableRangeGeometryDeltas: rangeDeltas, splitReproduction: split?.reproduction ?? null, sourcesUnchangedDuringRun: manifest.sourcesUnchangedDuringRun ?? null, conclusion: !validity ? 'inconclusive-guard-or-execution-failure' : stability?.status !== 'stable-in-both-observed-orders' ? 'awaiting-valid-stable-other-order' : deltas?.length === 0 && rangeDeltas?.length === 0 ? 'valid-negative-for-recorded-element-and-anchor-range-geometry' : 'bounded-original-react-segmentation-effect-observed', captureErrorsThroughSnapshot: [...evidence.captureErrors], unresolvedStrictAcceptance: true, limitation: 'The final receipt must validate delivery before interpretation. No diagnostic result supplies a source-faithful native fix, parity, independent review, merge or release approval.' };
      try {
        const reference = await attachJSON(testInfo, 'diagnostic-summary.json', summary, attempt); references.push(reference);
        if (!reference.attached) evidence.captureErrors.push({ stage: 'summary-physical-path-attachment', attempt, reference });
      } catch (error) { evidence.captureErrors.push({ stage: 'summary-physical-write-or-attachment', attempt, error: errorRecord(error) }); }
      failCapture();
    };
    await deliver(0);
    if (JSON.stringify(manifest.caseError) !== JSON.stringify(originalError === undefined ? null : errorRecord(originalError)) || JSON.stringify(manifest.captureErrorsThroughSnapshot) !== JSON.stringify(evidence.captureErrors)) { repaired = true; await deliver(1); }
    const receipt = () => ({ schemaVersion: 1, classification, credit, order, runIdentity: identity, complete: evidence.complete, finalCaseError: originalError === undefined ? null : errorRecord(originalError), captureErrors: [...evidence.captureErrors], canonicalReferences: attempts.at(-1)?.references ?? [], deliveryAttempts: attempts, maximumRepairAttempts: 1, repaired, ownAttachment: 'unverified-within-its-own-bytes; hosted physical ZIP audit must authenticate it', interpretationAllowed: originalError === undefined && evidence.captureErrors.length === 0 && stability?.status === 'stable-in-both-observed-orders', twoOrderStability: stability });
    try {
      const reference = await attachJSON(testInfo, 'diagnostic-delivery-receipt.json', receipt());
      if (!reference.attached) evidence.captureErrors.push({ stage: 'receipt-physical-path-attachment', reference });
    } catch (error) { evidence.captureErrors.push({ stage: 'receipt-physical-write-or-attachment', error: errorRecord(error) }); }
    failCapture();
    if (JSON.stringify(manifest.caseError) !== JSON.stringify(originalError === undefined ? null : errorRecord(originalError)) && !repaired) { repaired = true; await deliver(1); }
    // If receipt attachment itself failed, retain actual final error/capture data
    // physically without an unbounded self-attachment repair loop.
    if (evidence.captureErrors.length) {
      try { await mkdir(dirname(receiptPath), { recursive: true }); await writeFile(receiptPath, `${JSON.stringify(receipt(), null, 2)}\n`); }
      catch (error) { console.log(`Diagnostic final receipt write failed: ${JSON.stringify(errorRecord(error))}`); if (originalError === undefined) originalError = error; }
    }
  }
  if (originalError !== undefined) throw originalError;
});
