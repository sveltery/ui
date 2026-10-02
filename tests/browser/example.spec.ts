import { expect, test, type Page } from '@playwright/test';
import { exampleLifecycleCases } from './example-cases';
exampleLifecycleCases();
async function geometry(page: Page) {
  return page.locator('#probe-wrapper').evaluate(node => {
    const css = getComputedStyle(node); const box = node.getBoundingClientRect();
    const example = node.querySelector('#probe-example')!; const content = example.querySelector('[data-slot=example-content]')!; const title = example.firstElementChild!;
    const contentCss = getComputedStyle(content); const contentBox = content.getBoundingClientRect();
    return { tag: node.tagName, shellClass: node.parentElement!.className, shellBackground: getComputedStyle(node.parentElement!).backgroundColor, width: box.width, minHeight: css.minHeight, columns: css.gridTemplateColumns, gap: css.gap, padding: css.padding,
      example: { tag: example.tagName, class: example.className, color: getComputedStyle(example).color, titleTag: title.tagName, title: title.textContent, titleClass: title.className, titleFont: getComputedStyle(title).fontSize, contentClass: content.className, padding: contentCss.padding, gap: contentCss.gap, radius: contentCss.borderRadius, background: contentCss.backgroundColor, color: contentCss.color, innerWidth: contentBox.width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight), plainWidth: node.querySelector('[data-testid=unclassed-child]')!.getBoundingClientRect().width, sizedWidth: node.querySelector('[data-testid=sized-child]')!.getBoundingClientRect().width } };
  });
}
for (const width of [390, 640, 768, 1024, 1536]) test(`actual pinned Example responsive grid/classes/title and child width selector at ${width}px`, async ({ page, context }) => {
  await page.setViewportSize({ width, height: 900 }); await page.goto('/example'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const reference = await context.newPage(); await reference.setViewportSize({ width, height: 900 }); await reference.goto('/example-reference'); await expect(reference.locator('main')).toHaveAttribute('data-hydrated', 'true');
  const actual = await geometry(page); expect(actual).toEqual(await geometry(reference));
  expect(actual.width).toBe(Math.min(width, width >= 1536 ? 1152 : 1024)); expect(actual.minHeight).toBe('900px');
  expect(actual.columns.split(' ')).toHaveLength(width >= 768 ? 2 : 1); expect(actual.gap).toBe(width >= 640 && width < 768 ? '48px' : '32px');
  expect(actual.padding).toBe(width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px');
  expect(actual.example.titleTag).toBe('DIV'); expect(actual.example.title).toBe('Example & <draft>'); expect(actual.example.titleFont).toBe('12px');
  expect(actual.example.padding).toBe('16px'); expect(actual.example.gap).toBe('8px'); expect(actual.example.plainWidth).toBe(actual.example.innerWidth); expect(actual.example.sizedWidth).toBe(96);
  for (const current of [page, reference]) {
    // Witness only source variant selection. A chosen full dark palette is a separate theme concern.
    await current.evaluate(() => { document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)'); });
  }
  expect((await geometry(page)).shellBackground).toBe('rgb(10, 20, 30)');
  for (const current of [page, reference]) await current.evaluate(() => { document.documentElement.classList.add('dark'); });
  expect(await geometry(page)).toEqual(await geometry(reference)); expect((await geometry(page)).shellBackground).toBe('rgb(40, 50, 60)');
  for (const style of ['style-lyra', 'style-sera']) {
    for (const current of [page, reference]) await current.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
    expect(await geometry(page)).toEqual(await geometry(reference)); expect((await geometry(page)).example.radius).toBe('0px');
  }
  await reference.close();
});
