import { expect, test } from '@playwright/test';
const rate = Number(process.env.THROTTLE ?? 1);
test.beforeEach(async ({ page }) => {
  await page.addInitScript((fuzz) => {
    if (fuzz) {
      const st = window.setTimeout.bind(window);
      const raf = window.requestAnimationFrame.bind(window);
      (window as any).setTimeout = (fn: any, ms = 0, ...a: any[]) => st(fn, ms + Math.random() * fuzz, ...a);
      (window as any).requestAnimationFrame = (fn: any) => { const d = Math.random() * fuzz; let id = 0; st(() => { id = raf(fn); }, d); return id; };
    }
    const log: string[] = ((window as any).__log = []);
    const d = (el: any) => (el instanceof Element ? `${el.tagName}${el.getAttribute('role') ? '[' + el.getAttribute('role') + ']' : ''}"${(el.textContent ?? '').trim().slice(0, 12)}"` : String(el));
    const t0 = performance.now();
    const at = () => (performance.now() - t0).toFixed(1);
    for (const type of ['focusin', 'focusout', 'keydown', 'pointerdown', 'pointermove', 'pointerenter', 'mousemove', 'pointerup', 'mouseup', 'click', 'blur', 'focus'])
      document.addEventListener(type, (e: any) => log.push(`${at()} ${type} t=${d(e.target)} r=${d(e.relatedTarget)} ${e.key ?? ''}`), true);
    const dispatch = EventTarget.prototype.dispatchEvent;
    EventTarget.prototype.dispatchEvent = function (event: Event) {
      if (event instanceof CustomEvent) {
        const detail = event.detail ?? {};
        const stack = (new Error().stack ?? '').split('\n').slice(2, 7).map((line) => line.trim().replace(/https?:\/\/[^/]+/, '')).join(' < ');
        log.push(`${at()} custom ${event.type} open=${detail.open} reason=${detail.reason} node=${detail.nodeId} parent=${detail.parentNodeId} :: ${stack}`);
      }
      return dispatch.call(this, event);
    };
    new MutationObserver((ms) => {
      for (const m of ms) {
        if (m.type === 'attributes') log.push(`${at()} attr ${m.attributeName}=${(m.target as Element).getAttribute(m.attributeName!)} on ${d(m.target)}`);
        else for (const n of m.addedNodes) if (n instanceof Element && n.querySelector?.('[role=menu]')) log.push(`${at()} +menu ${d(n.querySelector('[role=menu]'))}`);
        else for (const n of m.removedNodes) if (n instanceof Element && n.querySelector?.('[role=menu]')) log.push(`${at()} -menu`);
      }
    }).observe(document, { subtree: true, childList: true, attributes: true, attributeFilter: ['aria-expanded', 'data-open', 'data-closed'] });
  }, Number(process.env.FUZZ ?? 0));
  if (rate > 1) {
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  }
  await page.goto('/menubar');
  await expect(page.locator('[data-hydrated=true]')).toBeAttached({ timeout: 30000 });
});
test.afterEach(async ({ page }, info) => {
  if (info.status !== info.expectedStatus) console.log('LOG\n' + (await page.evaluate(() => (window as any).__log.join('\n'))));
});
const trigger = (page: import('@playwright/test').Page, name: string) => page.getByRole('menuitem', { name, exact: true }).first();
test('a submenu opens with ArrowRight or hover, shows the open style and closes with ArrowLeft', async ({ page }) => {
  await trigger(page, 'File').click();
  await expect(page.getByRole('menu')).toBeFocused();
  // The File trigger's blur check waits one timer task. A loaded browser can run the keys
  // below first, so focus reaches the submenu before that check, which then closes the menu
  // (sveltery/base#341). Timers with equal delays run in order, so this waits for the check.
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve)));
  const share = page.getByRole('menuitem', { name: 'Share' });
  await page.keyboard.press('ArrowUp');
  await expect(page.getByRole('menuitem', { name: 'Delete' })).toBeFocused();
  await page.keyboard.press('ArrowUp');
  await expect(share).toBeFocused();
  await expect(share).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('menu')).toHaveCount(2);
  await expect(share).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('menuitem', { name: 'Email link' })).toBeFocused();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByRole('menu')).toHaveCount(1);
  await expect(share).toBeFocused();
});
