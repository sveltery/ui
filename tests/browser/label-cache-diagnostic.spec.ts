// Temporary supplemental diagnosis only: no copied upstream tests or new UI acceptance credit.
// The original label.spec.ts and label-cases.ts assertions remain unchanged and still run.
import { expect, test, type Page } from '@playwright/test';
import { labelNativeAssertions } from './label-cases';

async function observeLabelReads(page: Page) {
  await page.addInitScript(() => {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'labels')!;
    const nativeGetter = descriptor.get!;
    const reads: unknown[] = [];
    Object.defineProperty(window, '__labelCacheReads', { value: reads });
    Object.defineProperty(HTMLInputElement.prototype, 'labels', {
      ...descriptor,
      get(this: HTMLInputElement) {
        const result = Reflect.apply(nativeGetter, this, []) as NodeListOf<HTMLLabelElement> | null;
        if (['probe-first', 'probe-second'].includes(this.id) && reads.length < 100) {
          reads.push({
            id: this.id, for: document.querySelector<HTMLLabelElement>('#probe-label')?.htmlFor,
            // Do not enumerate the returned live list: that would prime a cache the caller may not read.
            stack: new Error().stack,
          });
        }
        return result;
      },
    });
  });
}

async function observations(page: Page) {
  // Save the pass-through read trace before the diagnostic itself queries input.labels.
  const reads = await page.evaluate(() => Reflect.get(window, '__labelCacheReads'));
  const dom = await page.evaluate(() => {
    const label = document.querySelector<HTMLLabelElement>('#probe-label')!;
    return {
      for: label.htmlFor, control: label.control?.id, text: label.textContent,
      attrs: Object.fromEntries(Array.from(label.attributes, attr => [attr.name, attr.value])),
      inputs: ['probe-first', 'probe-second'].map(id => {
        const input = document.getElementById(id) as HTMLInputElement;
        return { id, labels: Array.from(input.labels ?? [], item => item.id) };
      }),
      active: document.activeElement?.id,
    };
  });
  return {
    reads, dom,
    firstSnapshot: await page.locator('#probe-first').ariaSnapshot(),
    secondSnapshot: await page.locator('#probe-second').ariaSnapshot(),
  };
}

async function nativeAssociationOperations(page: Page, primeSecond: boolean) {
  // Independent literal native flex label and two-input anatomy, without either framework.
  await page.goto('about:blank');
  await page.setContent('<main><section><label id="probe-label" for="probe-first" style="display:flex;gap:8px">Account name<span>optional</span></label><input id="probe-first" type="text"><input id="probe-second" type="text"></section><button type="button">Update label</button></main>');
  await page.evaluate(() => document.querySelector('button')!.addEventListener('click', () => {
    const label = document.querySelector('label')!;
    label.htmlFor = 'probe-second'; label.firstChild!.textContent = 'Updated name';
    label.setAttribute('data-slot', 'label-override'); label.setAttribute('data-custom', 'updated');
    label.setAttribute('aria-disabled', 'true'); label.style.gap = '16px';
  }));
  await expect(page.locator('#probe-first')).toHaveAccessibleName(/Account name/);
  expect(await page.locator('#probe-first').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual(['probe-label']);
  if (primeSecond) expect(await page.locator('#probe-second').evaluate((input: HTMLInputElement) => Array.from(input.labels ?? [], label => label.id))).toEqual([]);
  await page.locator('#probe-label').click(); await expect(page.locator('#probe-first')).toBeFocused();
  await page.getByRole('button', { name: 'Update label', exact: true }).click();
  await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-second');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-slot', 'label-override');
  await expect(page.locator('#probe-label')).toHaveAttribute('data-custom', 'updated');
  await expect(page.locator('#probe-label')).toHaveAttribute('aria-disabled', 'true');
  // This is the same expectation that failed in the real test. Diagnosis does not change it.
  await expect(page.locator('#probe-second')).toHaveAccessibleName(/Updated name/);
  await page.locator('#probe-label').click(); await expect(page.locator('#probe-second')).toBeFocused();
}

for (const source of ['svelte', 'pinned-react', 'native-first-only', 'native-both-primed'] as const) {
  test(`diagnose Label labels getter and names at 390px light: ${source}`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: 390, height: 1100 });
    await observeLabelReads(page);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    let failure: unknown;
    try {
      if (source === 'svelte' || source === 'pinned-react') {
        await page.goto(source === 'svelte' ? '/label-probe' : '/label-probe-reference');
        await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
        await labelNativeAssertions(page);
      } else {
        await nativeAssociationOperations(page, source === 'native-both-primed');
      }
    } catch (error) { failure = error; }
    const evidence = { source, browser: testInfo.project.name, observed: await observations(page), errors, failure: failure instanceof Error ? failure.message : failure };
    console.log('LABEL_CACHE_DIAGNOSTIC', JSON.stringify(evidence));
    await testInfo.attach(`label-cache-${source}`, { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
    if (failure) throw failure;
    expect(errors).toEqual([]);
  });
}
