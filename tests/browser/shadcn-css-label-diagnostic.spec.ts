import { expect, test } from '@playwright/test';

test('record actual Label selectors against the independent full original CSS document', async ({ page }, testInfo) => {
  // Evidence-only diagnostic: every pre-existing Label assertion remains in
  // place, including the historical false-opacity expectation that fails.
  // A successfully captured measurement is not Label acceptance credit.
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const results = [];
  for (const [environment, url] of [
    ['actual-native-production', '/label-probe'],
    ['actual-react-production', '/label-probe-reference'],
    ['independent-react-full-original-css', 'http://127.0.0.1:5175/label'],
  ]) {
    await page.goto(url);
    await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
    const measurement = await page.locator('[data-testid=selectors]').evaluate(section => ({
      rootClasses: document.documentElement.className,
      labels: [...section.querySelectorAll('label')].map(node => {
        const css = getComputedStyle(node);
        const peer = node.previousElementSibling;
        return {
          id: node.getAttribute('data-testid'), tag: node.tagName, classes: node.className,
          opacity: css.opacity, pointerEvents: css.pointerEvents, cursor: css.cursor,
          peerDataDisabled: peer?.getAttribute('data-disabled') ?? null,
          peerHasDisabledAttribute: peer?.hasAttribute('disabled') ?? false,
          peerMatchesOriginalDisabledVariant: peer?.matches('[data-disabled="true"], [data-disabled]:not([data-disabled="false"])') ?? false,
        };
      }),
    }));
    expect(measurement.labels.some(label => label.id === 'aria-data-false')).toBe(true);
    if (environment === 'independent-react-full-original-css') expect(measurement.rootClasses).toBe('style-nova');
    results.push({ environment, url, ...measurement });
  }
  expect(errors).toEqual([]);
  const evidence = { sourceCommit: 'd75a96ab781f3d659be1ad287347d5887ce9f2fc', classification: 'Secured browser diagnostic measurements; no component acceptance or ordinary-test credit', results, errors };
  await testInfo.attach('label-full-original-css-measurements', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  console.log(JSON.stringify(evidence));
});
