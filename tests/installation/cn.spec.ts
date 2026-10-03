import { test } from '@playwright/test';
import { verifyClassInputs } from '../shared/cn-browser';
test('fresh archive/source-copy pinned cn public classes survive SSR, hydration and updates', async ({ page, request }) => {
  await verifyClassInputs(page, request);
});
