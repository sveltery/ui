import { expect, test } from '@playwright/test';

test('actual Label selectors retain the proven false guard against independent full original CSS', async ({ page }, testInfo) => {
  // Source-backed supplemental regression. Historical ee88 secured measurements
  // independently established the complete original CSS behavior; no ordinary
  // upstream test or unchanged historical expectation credit is claimed.
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
  const evidence = { sourceCommit: 'd75a96ab781f3d659be1ad287347d5887ce9f2fc', classification: 'Source-backed supplemental CSS regression; no ordinary-test or unchanged historical expectation credit', results, errors };
  await testInfo.attach('label-full-original-css-measurements', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  console.log(JSON.stringify(evidence));
  for (const result of results) {
    expect(result.labels.length, result.environment).toBe(14);
    expect(result.labels, result.environment).toEqual(results[0].labels);
    for (const label of result.labels) {
      expect(label.tag, `${result.environment}/${label.id}`).toBe('LABEL');
      const expected = label.id === 'group-true'
        ? { opacity: '0.5', pointerEvents: 'none', cursor: 'default' }
        : label.id === 'peer-disabled'
          ? { opacity: '0.5', pointerEvents: 'auto', cursor: 'not-allowed' }
          : label.id === 'aria-data-empty'
            ? { opacity: '0.5', pointerEvents: 'auto', cursor: 'default' }
            : { opacity: '1', pointerEvents: 'auto', cursor: 'default' };
      expect({ opacity: label.opacity, pointerEvents: label.pointerEvents, cursor: label.cursor }, `${result.environment}/${label.id}`).toEqual(expected);
    }
    expect(result.labels.find(label => label.id === 'aria-data-empty')?.peerMatchesOriginalDisabledVariant).toBe(true);
    expect(result.labels.find(label => label.id === 'aria-data-false')?.peerMatchesOriginalDisabledVariant).toBe(false);
  }
});
