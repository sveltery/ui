import { expect, test } from '@playwright/test';
import { exampleLifecycleCases } from '../browser/example-cases';
exampleLifecycleCases();
test('fresh native scaffold archive/source copy retains responsive utilities, child width selector and source variants', async ({ page }) => {
  for (const width of [390, 640, 768, 1024, 1536]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/example'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    const geometry = await page.locator('#probe-wrapper').evaluate(node => {
      const css = getComputedStyle(node); const content = node.querySelector('[data-slot=example-content]')!; const contentCss = getComputedStyle(content);
      return { width: node.getBoundingClientRect().width, columns: css.gridTemplateColumns.split(' ').length, gap: css.gap, padding: css.padding, innerWidth: content.getBoundingClientRect().width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight), plainWidth: node.querySelector('[data-testid=unclassed-child]')!.getBoundingClientRect().width, sizedWidth: node.querySelector('[data-testid=sized-child]')!.getBoundingClientRect().width };
    });
    expect(geometry.width).toBe(Math.min(width, width >= 1536 ? 1152 : 1024)); expect(geometry.columns).toBe(width >= 768 ? 2 : 1); expect(geometry.gap).toBe(width >= 640 && width < 768 ? '48px' : '32px'); expect(geometry.padding).toBe(width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px');
    expect(geometry.plainWidth).toBe(geometry.innerWidth); expect(geometry.sizedWidth).toBe(96);
    await page.evaluate(() => { document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)'); document.documentElement.classList.remove('dark'); });
    const background = () => page.locator('#probe-wrapper').evaluate(node => getComputedStyle(node.parentElement!).backgroundColor);
    expect(await background()).toBe('rgb(10, 20, 30)'); await page.evaluate(() => { document.documentElement.classList.add('dark'); }); expect(await background()).toBe('rgb(40, 50, 60)');
    for (const style of ['style-lyra', 'style-sera']) {
      await page.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
      expect(await page.locator('#probe-example > [data-slot=example-content]').evaluate(node => getComputedStyle(node).borderRadius)).toBe('0px');
    }
    await page.evaluate(() => { document.documentElement.classList.remove('dark', 'style-lyra', 'style-sera'); });
  }
});
