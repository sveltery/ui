// Source-derived diagnosis only. These strict cases may remain red; no upstream
// ordinary-test, new implementation or acceptance-exception credit is claimed.
import { expect, test, type Page } from '@playwright/test';
import { createHash } from 'node:crypto';
import { labelNativeAssertions } from './label-cases';
import { captureLabelFailure } from './label-failure-diagnostics';

const originalCssLabel = 'http://127.0.0.1:5175/label';

test('diagnose strict Label association in pinned React with complete original CSS', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 1100 });
  await page.goto(originalCssLabel);
  await expect(page.locator('html')).toHaveAttribute('class', 'style-nova');
  await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
  try {
    await labelNativeAssertions(page);
  } catch (failure) {
    try { await captureLabelFailure(testInfo, 'pinned-react-full-original-css', [{ environment: 'pinned-react-full-original-css', page }], failure, errors); }
    catch (diagnosticFailure) { console.log('LABEL_ASSOCIATION_DIAGNOSTIC_FAILURE', String(diagnosticFailure)); }
    throw failure;
  }
  expect(errors).toEqual([]);
});

async function installPlainNativeWitness(page: Page) {
  // Read the actual compiled complete-original stylesheet from the independent
  // reference document, then create a fresh plain-HTML document. No failed
  // document or label association is reset or invalidated by this setup.
  await page.goto(originalCssLabel);
  await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
  await expect(page.locator('html')).toHaveAttribute('class', 'style-nova');
  const styles = await page.locator('style[data-vite-dev-id]').evaluateAll(nodes => nodes.map(node => ({
    source: node.getAttribute('data-vite-dev-id'), css: node.textContent ?? '',
  })));
  expect(styles.some(style => style.source?.endsWith('/themes/reference-app/reference.css'))).toBe(true);
  expect(styles.every(style => style.css.length > 0)).toBe(true);
  await page.setContent('<!doctype html><html class="style-nova"><head></head><body><main class="p-8"><section data-testid="association"><label id="probe-label" for="probe-first" data-slot="label" data-custom="initial" style="color: rgb(30, 40, 50)" class="cn-label flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed">Account name<span data-testid="label-child">optional</span></label><input id="probe-first" type="text"><input id="probe-second" type="text"></section><button type="button">Update label</button><output data-testid="probe-state">{"changed":false,"clicks":0}</output></main></body></html>');
  await page.evaluate(styles => {
    for (const original of styles) {
      const style = document.createElement('style'); style.textContent = original.css;
      style.setAttribute('data-original-css-source', original.source ?? ''); document.head.append(style);
    }
    const label = document.querySelector<HTMLLabelElement>('#probe-label')!;
    let clicks = 0;
    let changed = false;
    const state = () => { document.querySelector('output')!.textContent = JSON.stringify({ changed, clicks }); };
    label.addEventListener('click', () => { clicks++; state(); });
    document.querySelector('button')!.addEventListener('click', () => {
      changed = true;
      // The genuine React/Svelte native bindings update the for attribute.
      label.setAttribute('for', 'probe-second'); label.firstChild!.textContent = 'Updated name';
      label.setAttribute('data-slot', 'label-override'); label.setAttribute('data-custom', 'updated');
      label.setAttribute('aria-disabled', 'true'); label.classList.add('gap-4', 'text-lg');
      label.style.color = 'rgb(60, 70, 80)'; state();
    });
  }, styles);
  return styles.map(({ source, css }) => ({ source, bytes: Buffer.byteLength(css), sha256: createHash('sha256').update(css).digest('hex') }));
}

async function strictNativeAssociation(page: Page, primeSecond: boolean) {
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-first');
  await expect(page.locator('#probe-first')).toHaveAccessibleName(/Account name/);
  expect(await page.locator('#probe-first').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['probe-label']);
  // This separate authored scenario exposes the historically failed read order;
  // it neither changes the existing production case nor weakens its assertion.
  if (primeSecond) expect(await page.locator('#probe-second').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual([]);
  await page.locator('#probe-label').click();
  await expect(page.locator('#probe-first')).toBeFocused();
  expect(JSON.parse(await page.getByTestId('probe-state').innerText()).clicks).toBe(1);
  await page.getByRole('button', { name: 'Update label', exact: true }).click();
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-second');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-slot', 'label-override');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-custom', 'updated');
  await expect(page.locator('#probe-label')).toHaveAttribute('aria-disabled', 'true');
  // Exact unchanged second-name expectation from the failed production probe.
  await expect(page.locator('#probe-second')).toHaveAccessibleName(/Updated name/);
  expect(await page.locator('#probe-label').evaluate((label: HTMLLabelElement) => label.control?.id)).toBe('probe-second');
  expect(await page.locator('#probe-second').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['probe-label']);
  await page.locator('#probe-label').click();
  await expect(page.locator('#probe-second')).toBeFocused();
  expect(JSON.parse(await page.getByTestId('probe-state').innerText()).clicks).toBe(2);
}

for (const primeSecond of [false, true]) test(`diagnose strict plain-native Label with full original CSS (${primeSecond ? 'both-targets-primed' : 'first-only-primed'})`, async ({ page }, testInfo) => {
  const environment = primeSecond ? 'plain-native-both-targets-primed' : 'plain-native-first-only-primed';
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 390, height: 1100 });
  const css = await installPlainNativeWitness(page);
  console.log('LABEL_NATIVE_DIAGNOSTIC_SOURCE', JSON.stringify({ environment, sourceCommit: 'd75a96ab781f3d659be1ad287347d5887ce9f2fc', css, classification: 'Authored plain HTML with genuine complete CSS; zero new implementation or ordinary-test credit' }));
  try {
    await strictNativeAssociation(page, primeSecond);
  } catch (failure) {
    try { await captureLabelFailure(testInfo, environment, [{ environment, page }], failure, errors); }
    catch (diagnosticFailure) { console.log('LABEL_ASSOCIATION_DIAGNOSTIC_FAILURE', String(diagnosticFailure)); }
    throw failure;
  }
  expect(errors).toEqual([]);
});
