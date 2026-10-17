import { expect, test, type Page } from '@playwright/test';

// The fixture renders every style's switches at four sub-pixel offsets. A fractional thumb inset rounds to
// unequal top and bottom margins at some of them, so this counts the painted track rows above and below the thumb.
// It reads the checked switch, whose dark track separates cleanly from the thumb and the page; the thumb sits at
// the same height when unchecked, which the last assertion checks.

async function insets(page: Page, scale: number) {
  const png = (await page.screenshot({ fullPage: true })).toString('base64');
  return page.evaluate(
    async ({ png, scale }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${png}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d')!;
      context.drawImage(image, 0, 0);
      const luminance = (x: number, y: number) => {
        const [r, g, b] = context.getImageData(x, y, 1, 1).data;
        return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
      };
      return [...document.querySelectorAll<HTMLElement>('[data-slot=switch][data-checked]')].map((root) => {
        const track = root.getBoundingClientRect();
        const thumb = root.querySelector('[data-slot=switch-thumb]')!.getBoundingClientRect();
        const x = Math.round((thumb.left + thumb.width / 2) * scale);
        const middle = Math.round((thumb.top + thumb.height / 2) * scale);
        const pageColor = luminance(x, Math.floor(track.top * scale) - 2);
        const thumbColor = luminance(x, middle);
        const isTrack = (y: number) => Math.abs(luminance(x, y) - pageColor) > 30 && Math.abs(luminance(x, y) - thumbColor) > 30;
        let top = 0;
        let bottom = 0;
        for (let y = Math.floor(track.top * scale) - 2; y < middle; y++) if (isTrack(y)) top++;
        for (let y = middle; y <= Math.ceil(track.bottom * scale) + 2; y++) if (isTrack(y)) bottom++;
        return { name: root.getAttribute('aria-label'), top, bottom };
      });
    },
    { png, scale },
  );
}

for (const scale of [1, 2]) {
  test.describe(`at device scale ${scale}`, () => {
    test.use({ deviceScaleFactor: scale, viewport: { width: 400, height: 1200 } });

    test('every style centers the switch thumb vertically', async ({ page }) => {
      await page.goto('/switch-insets');
      await expect(page.locator('[data-hydrated=true]')).toBeAttached();
      const measured = await insets(page, scale);
      expect(measured).toHaveLength(64);
      for (const { name, top, bottom } of measured) {
        expect(top, name!).toBeGreaterThan(0);
        expect(bottom, `${name}: ${top} track rows above the thumb`).toBe(top);
      }
    });
  });
}

test('the thumb sits at the same height checked and unchecked', async ({ page }) => {
  await page.goto('/switch-insets');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached();
  const offsets = await page.$$eval('[data-slot=switch]', (roots) =>
    roots.map((root) => root.querySelector('[data-slot=switch-thumb]')!.getBoundingClientRect().top - root.getBoundingClientRect().top),
  );
  for (let i = 0; i < offsets.length; i += 2) expect(offsets[i]).toBe(offsets[i + 1]);
});
