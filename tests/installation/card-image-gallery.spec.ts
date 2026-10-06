// Same canonical two bodies in real archive/source-copy documented and experimental consumers.
import { expect, test } from '@playwright/test';
import { assertCardImages, cardImageTree, cardImageTextBounds, cardImageMeasurements, cardImageTheme, assertCardImageGeometry, cardImageStyles, cardImageLibraries, settleCardImages } from '../browser/card-image-gallery-cases';
for (const library of cardImageLibraries) test('fresh genuine Card images/' + library + ' retain actual original image and complete source tree', async ({ page, context, request }) => {
  test.setTimeout(120_000); // New finite actual-source matrix in every fresh mode.
  const errors: string[] = []; const reference = await context.newPage();
  try {
    const response = await request.get('/card-images?library=' + library); expect(response.ok()).toBe(true);
    const html = await response.text(); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('Photo by mymind on Unsplash');
    for (const [current, route] of [[page, '/card-images?library=' + library], [reference, 'http://127.0.0.1:5175/card-images?library=' + library]] as const) {
      current.on('pageerror', error => errors.push(error.message)); current.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      await current.goto(route); await settleCardImages(current);
    }
    const styles = library === 'lucide' ? cardImageStyles : ['nova'];
    for (const style of styles) for (const dark of [false, true]) for (const width of [390, 768, 1536]) {
      await test.step(style + '/' + dark + '/' + width, async () => {
        for (const current of [page, reference]) { await current.setViewportSize({ width, height: 1600 }); await cardImageTheme(current, style, dark); await assertCardImages(current); await assertCardImageGeometry(current); }
        expect(await cardImageTree(page)).toEqual(await cardImageTree(reference)); expect(await cardImageTextBounds(page)).toEqual(await cardImageTextBounds(reference)); expect(await cardImageMeasurements(page)).toEqual(await cardImageMeasurements(reference));
      });
    }
    expect(errors).toEqual([]);
  } finally { await reference.close(); }
});
