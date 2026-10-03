// Reusable framework probes for the checkout and fresh consumers; source-derived, not upstream test copies.
import { expect, test, type Page } from '@playwright/test';
const slots = ['card', 'card-header', 'card-title', 'card-description', 'card-action', 'card-content', 'card-footer'];
const ids = slots.map(slot => `lifecycle-${slot}`);
export function cardConsumerCases() {
  test('Card SSR/hydration retains all seven native hosts, refs, attachments and reactive children', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    // Complete development dependency discovery before capturing a fresh SSR document.
    await page.goto('/card'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
    await page.route('**/*', async route => { if (route.request().resourceType() === 'script') await gate; await route.continue(); });
    const hosts = page.locator('[data-lifecycle] [data-slot]');
    const state = page.getByTestId('card-state');
    try {
      await page.goto('/card', { waitUntil: 'commit' }); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'false');
      await expect(hosts).toHaveCount(7);
      expect(await hosts.evaluateAll(nodes => nodes.map(node => ({ id: node.id, slot: node.getAttribute('data-slot'), tag: node.tagName, title: node.getAttribute('title'), attached: node.hasAttribute('data-attached') })))).toEqual(slots.map(slot => ({ id: `lifecycle-${slot}`, slot, tag: 'DIV', title: 'Initial card part', attached: false })));
      await expect(page.locator('#lifecycle-card')).toHaveAttribute('data-size', 'default');
      await hosts.evaluateAll(nodes => { (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts = nodes; });
      release(); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
      const sameSSRHosts = () => hosts.evaluateAll(nodes => nodes.every((node, index) => node === (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts?.[index]));
      expect(await sameSSRHosts()).toBe(true);
      await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 7, detached: 0 }));
      for (const id of ids) await expect(page.locator(`#${id}`)).toHaveAttribute('data-attached', 'true');
      await page.getByRole('button', { name: 'Update card parts', exact: true }).click();
      for (const id of ids) {
        await expect(page.locator(`#${id}`)).toHaveAttribute('title', 'Updated card part');
        await expect(page.locator(`#${id}`)).toHaveClass(/px-6/);
        await expect(page.locator(`#${id}`)).not.toHaveClass(/px-3/);
      }
      for (const part of ['title', 'description', 'action', 'content', 'footer']) await expect(page.locator(`#lifecycle-card-${part}`)).toHaveText(`Updated ${part}`);
      await expect(page.locator('#lifecycle-card')).toHaveAttribute('data-size', 'sm');
      expect(await sameSSRHosts()).toBe(true);
      await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 7, detached: 0 }));
      await page.getByRole('button', { name: 'Toggle card parts', exact: true }).click();
      await expect(hosts).toHaveCount(0); await expect(state).toHaveText(JSON.stringify({ refs: Array(7).fill(null), attached: 7, detached: 7 }));
      await page.getByRole('button', { name: 'Toggle card parts', exact: true }).click();
      await expect(hosts).toHaveCount(7); await expect(state).toHaveText(JSON.stringify({ refs: ids, attached: 14, detached: 7 }));
      expect(await hosts.evaluateAll(nodes => nodes.every((node, index) => node !== (window as Window & { cardSSRHosts?: Element[] }).cardSSRHosts?.[index]))).toBe(true);
      await expect(page.locator('#lifecycle-card-title')).toHaveText('Updated title');
      expect(errors).toEqual([]);
    } finally { release(); }
  });
}

// Authored source-derived witnesses for the genuine seven-example tree.
export const cardGallerySelector = '[data-slot="example-wrapper"]';
export const cardGalleryHosts = `div:has(> ${cardGallerySelector}), ${cardGallerySelector}, ${cardGallerySelector} *`;
export const cardBodySelector = `${cardGallerySelector} > [data-slot="example"] > [data-slot="example-content"] [data-slot], [data-supplemental] [data-slot]`;
export const cardTitles = ['Default Size', 'Small Size', 'Content Edge to Edge', 'Header with Border', 'Footer with Border', 'Header with Border (Small)', 'Footer with Border (Small)'];
export function cardGalleryHydrated(page: Page) { return page.locator('main[data-hydrated], main > div > div[data-hydrated], main > div[data-hydrated]'); }
export async function cardGallerySnapshot(page: Page) {
  return page.locator(cardGallerySelector).evaluate(wrapper => {
    const snapshot = (node: Element): unknown => ({ tag: node.tagName, attrs: Object.fromEntries([...node.attributes].map(attr => [attr.name, attr.value]).sort(([a], [b]) => a.localeCompare(b))), text: [...node.childNodes].filter(child => child.nodeType === 3).map(child => child.textContent!.replace(/\s+/gu, ' ').trim()).filter(Boolean), children: [...node.children].map(snapshot) });
    return snapshot(wrapper.parentElement!);
  });
}
export async function cardGalleryMeasurements(page: Page) {
  return page.locator(cardGallerySelector).evaluate(wrapper => {
    const css = getComputedStyle(wrapper); const shell = wrapper.parentElement!; const parent = shell.parentElement!; const parentCss = getComputedStyle(parent);
    return { shellTag: shell.tagName, shellClass: shell.className, shellAttributes: shell.getAttributeNames().sort(), shellWidth: shell.getBoundingClientRect().width, shellBackground: getComputedStyle(shell).backgroundColor,
      availableWidth: parent.clientWidth - parseFloat(parentCss.paddingLeft) - parseFloat(parentCss.paddingRight),
      tag: wrapper.tagName, attributes: wrapper.getAttributeNames().sort(), class: wrapper.className, width: wrapper.getBoundingClientRect().width, minHeight: css.minHeight, maxWidth: css.maxWidth, columns: css.gridTemplateColumns, gap: css.gap, padding: css.padding,
      examples: [...wrapper.children].map(example => {
        const title = example.firstElementChild!; const content = example.lastElementChild!; const contentCss = getComputedStyle(content); const body = content.firstElementChild!;
        return { tag: example.tagName, attributes: example.getAttributeNames().sort(), slot: example.getAttribute('data-slot'), class: example.className, childCount: example.children.length, width: example.getBoundingClientRect().width,
          titleTag: title.tagName, title: title.textContent, titleClass: title.className, titleAttributes: title.getAttributeNames().sort(), titleFont: getComputedStyle(title).fontSize,
          contentTag: content.tagName, contentSlot: content.getAttribute('data-slot'), contentClass: content.className, contentChildCount: content.children.length, contentAttributes: content.getAttributeNames().sort(), contentWidth: content.getBoundingClientRect().width, contentPadding: contentCss.padding, contentGap: contentCss.gap, radius: contentCss.borderRadius,
          bodyTag: body.tagName, bodySlot: body.getAttribute('data-slot'), bodyClass: body.className, bodyWidth: body.getBoundingClientRect().width,
          innerWidth: content.getBoundingClientRect().width - parseFloat(contentCss.paddingLeft) - parseFloat(contentCss.paddingRight),
        };
      }),
    };
  });
}
export async function assertCardGalleryScaffold(page: Page, width: number, height: number, fullOriginalCSS = false) {
  const m = await cardGalleryMeasurements(page);
  expect(m.shellTag).toBe('DIV'); expect(m.shellClass).toBe('w-full bg-muted dark:bg-background'); expect(m.shellAttributes).toEqual(['class']); expect(m.shellWidth).toBeCloseTo(m.availableWidth, 4);
  expect(m.tag).toBe('DIV'); expect(m.attributes).toEqual(['class', 'data-slot']); expect(m.class).toBe('mx-auto grid min-h-screen w-full max-w-5xl min-w-0 content-center items-start gap-8 p-4 pt-2 sm:gap-12 sm:p-6 md:grid-cols-2 md:gap-8 lg:p-12 2xl:max-w-6xl');
  expect(m.width).toBeCloseTo(Math.min(m.availableWidth, width >= 1536 ? 1152 : 1024), 4); expect(m.maxWidth).toBe(width >= 1536 ? '1152px' : '1024px'); expect(m.minHeight).toBe(`${height}px`);
  expect(m.columns.split(' ')).toHaveLength(width >= 768 ? 2 : 1); expect(m.gap).toBe(width >= 640 && width < 768 ? '48px' : '32px'); expect(m.padding).toBe(width >= 1024 ? '48px' : width >= 640 ? '24px' : '8px 16px 16px');
  expect(m.examples).toHaveLength(7);
  for (const [index, example] of m.examples.entries()) {
    expect(example.tag).toBe('DIV'); expect(example.slot).toBe('example'); expect(example.attributes).toEqual(['class', 'data-slot']); expect(example.class).toBe('mx-auto flex w-full max-w-lg min-w-0 flex-col gap-1 self-stretch lg:max-w-none'); expect(example.childCount).toBe(2);
    expect(example.titleTag).toBe('DIV'); expect(example.title).toBe(cardTitles[index]); expect(example.titleClass).toBe('px-1.5 py-2 text-xs font-medium text-muted-foreground'); expect(example.titleAttributes).toEqual(['class']); expect(example.titleFont).toBe('12px');
    expect(example.contentTag).toBe('DIV'); expect(example.contentSlot).toBe('example-content'); expect(example.contentAttributes).toEqual(['class', 'data-slot']); expect(example.contentClass).toBe("flex min-w-0 flex-1 flex-col items-start gap-6 rounded-xl bg-card p-12 text-foreground style-lyra:rounded-none style-sera:rounded-none *:[div:not([class*='w-'])]:w-full"); expect(example.contentChildCount).toBe(1);
    expect(example.contentWidth).toBeCloseTo(example.width, 4); expect(example.contentPadding).toBe('48px'); expect(example.contentGap).toBe('24px');
    expect(example.bodyTag).toBe('DIV'); expect(example.bodySlot).toBe('card'); expect(example.bodyClass).toContain('mx-auto w-full max-w-sm'); expect(example.bodyWidth).toBeCloseTo(Math.min(384, example.innerWidth), 4);
    // Inherited registered consumer radius mapping differs from original globals; record both.
    expect(example.radius).toBe(fullOriginalCSS ? '14px' : '12px');
  }
  expect(await page.locator(`${cardGallerySelector} section, ${cardGallerySelector} h2, ${cardGallerySelector} [data-supplemental]`).count()).toBe(0);
  expect(await page.locator(`${cardGallerySelector} [data-slot]`).count()).toBe(54);
  expect(await page.locator(`${cardGallerySelector} [data-slot="example-content"] [data-slot]`).count()).toBe(40);
  expect(await page.locator(cardGalleryHosts).count()).toBe(74);
  return m;
}
export async function assertCardGalleryVariants(page: Page) {
  // Source-selector witness only; two consumer tokens do not constitute a palette port.
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark', 'style-lyra', 'style-sera');
    document.documentElement.style.setProperty('--muted', 'rgb(10, 20, 30)'); document.documentElement.style.setProperty('--background', 'rgb(40, 50, 60)');
  });
  expect((await cardGalleryMeasurements(page)).shellBackground).toBe('rgb(10, 20, 30)');
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  expect((await cardGalleryMeasurements(page)).shellBackground).toBe('rgb(40, 50, 60)');
  for (const style of ['style-lyra', 'style-sera']) {
    await page.evaluate(styleClass => { document.documentElement.classList.remove('style-lyra', 'style-sera'); document.documentElement.classList.add(styleClass); }, style);
    expect((await cardGalleryMeasurements(page)).examples.map(example => example.radius)).toEqual(Array(7).fill('0px'));
  }
}
