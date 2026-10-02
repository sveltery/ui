import { test } from '@playwright/test';
import { verifyClassInputs } from '../shared/cn-browser';
test('pinned cn Unicode public classes survive SSR, hydration and reactive ASCII updates', async ({ page, request }) => {
  await verifyClassInputs(page, request);
});
