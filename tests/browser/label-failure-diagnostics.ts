// Authored diagnostics only: no copied upstream test or passing implementation credit.
import type { Page, TestInfo } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

function errorText(error: unknown) {
  return error instanceof Error ? { message: error.message, stack: error.stack } : { message: String(error) };
}

export async function captureLabelFailure(
  testInfo: TestInfo,
  failedEnvironment: string,
  pages: readonly { environment: string; page: Page }[],
  failure: unknown,
  errors: readonly string[],
) {
  const observations = [];
  // This function is called only after the original assertion has already failed.
  // Read DOM/list state before any additional accessibility snapshot. Never mutate
  // the failed document, patch a getter or insert a cache-invalidating label.
  for (const { environment, page } of pages) {
    try {
      const dom = await page.evaluate(() => {
        const label = document.querySelector<HTMLLabelElement>('#probe-label');
        const css = label ? getComputedStyle(label) : null;
        return {
          url: location.href,
          rootClasses: document.documentElement.className,
          label: label ? {
            tag: label.tagName, connected: label.isConnected,
            attrs: Object.fromEntries(Array.from(label.attributes, attr => [attr.name, attr.value])),
            text: label.textContent, html: label.outerHTML,
            for: label.htmlFor, control: label.control?.id ?? null,
            computed: css ? { display: css.display, visibility: css.visibility, opacity: css.opacity, pointerEvents: css.pointerEvents, color: css.color } : null,
          } : null,
          inputs: ['probe-first', 'probe-second'].map(id => {
            const input = document.getElementById(id) as HTMLInputElement | null;
            return input ? {
              id, connected: input.isConnected,
              attrs: Object.fromEntries(Array.from(input.attributes, attr => [attr.name, attr.value])),
              labels: Array.from(input.labels ?? [], item => ({ id: item.id, for: item.htmlFor, text: item.textContent, connected: item.isConnected })),
            } : { id, missing: true };
          }),
          active: document.activeElement?.id ?? null,
          state: document.querySelector('[data-testid="probe-state"]')?.textContent ?? null,
        };
      });
      const observation: { environment: string; url: string; dom: typeof dom; snapshots?: { first: string; second: string }; snapshotFailure?: ReturnType<typeof errorText> } = { environment, url: page.url(), dom };
      observations.push(observation);
      try {
        observation.snapshots = {
          first: await page.locator('#probe-first').ariaSnapshot(),
          second: await page.locator('#probe-second').ariaSnapshot(),
        };
      } catch (error) { observation.snapshotFailure = errorText(error); }
    } catch (error) {
      observations.push({ environment, url: page.url(), observationFailure: errorText(error) });
    }
  }
  const evidence = {
    classification: 'Post-failure source-derived diagnosis; zero copied ordinary-test and new implementation credit',
    sourceCommit: 'd75a96ab781f3d659be1ad287347d5887ce9f2fc',
    browser: testInfo.project.name,
    failedEnvironment,
    afterOriginalFailure: true,
    failure: errorText(failure),
    observations,
    errors,
    errorsScope: 'Shared browser-error list from the observed pages',
    limitations: 'Observations occur after failure; they cannot establish earlier browser or isolated-world reads. React reference is 19.3.0; original lock is 19.2.3. No acceptance exception.',
  };
  console.log('LABEL_ASSOCIATION_FAILURE', JSON.stringify(evidence));
  try {
    const path = testInfo.outputPath('label-association-failure.json');
    await writeFile(path, JSON.stringify(evidence, null, 2), 'utf8');
    await testInfo.attach('label-association-failure', { path, contentType: 'application/json' });
  } catch (error) {
    console.log('LABEL_ASSOCIATION_DIAGNOSTIC_PERSISTENCE_FAILURE', JSON.stringify(errorText(error)));
  }
}
