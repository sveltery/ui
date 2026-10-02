// Temporary source-derived classification witnesses. Existing acceptance assertions remain unchanged.
import { expect, test } from '@playwright/test';

test('diagnose Alert source spacing against pinned React and native CSS', async ({ page }) => {
  for (const route of ['/alert-probe-reference', '/alert-probe']) {
    await page.goto(route); await expect(page.locator('[data-alert-probe]')).toHaveAttribute('data-hydrated', 'true');
    const result = await page.locator('#probe-action').evaluate(action => {
      const witness = document.createElement('div');
      witness.style.cssText = 'position:absolute;top:calc(2 * var(--spacing));right:calc(2 * var(--spacing))';
      action.parentElement!.append(witness);
      const css = getComputedStyle(action); const native = getComputedStyle(witness);
      const rules: string[] = [];
      const collect = (list: CSSRuleList) => { for (const rule of list) { if (rule instanceof CSSStyleRule && rule.selectorText.includes('cn-alert-action') && action.matches(rule.selectorText)) rules.push(rule.cssText); if ('cssRules' in rule) collect((rule as CSSGroupingRule).cssRules); } };
      for (const sheet of document.styleSheets) collect(sheet.cssRules);
      const value = { top: css.top, right: css.right, nativeTop: native.top, nativeRight: native.right, spacing: css.getPropertyValue('--spacing'), rootFont: getComputedStyle(document.documentElement).fontSize, actionFont: css.fontSize, rules };
      witness.remove(); return value;
    });
    console.log('ALERT_NATIVE_SPACING', JSON.stringify({ route, ...result }));
  }
});

test('diagnose dynamic Label associations against pinned React and native HTML', async ({ page }) => {
  for (const route of ['/label-probe-reference', '/label-probe', 'native']) {
    if (route === 'native') {
      await page.setContent('<label id="probe-label" for="probe-first">Account name<span>optional</span></label><input id="probe-first"><input id="probe-second"><button type="button">Update label</button>');
      await page.evaluate(() => document.querySelector('button')!.addEventListener('click', () => { const label = document.querySelector('label')!; label.htmlFor = 'probe-second'; label.firstChild!.textContent = 'Updated name'; }));
    } else {
      await page.goto(route); await expect(page.locator('[data-label-probe]')).toHaveAttribute('data-hydrated', 'true');
    }
    await expect(page.locator('#probe-first')).toHaveAccessibleName(/Account name/);
    await page.getByRole('button', { name: 'Update label', exact: true }).click();
    await expect(page.locator('#probe-label')).toHaveAttribute('for', 'probe-second');
    await expect(page.locator('#probe-second')).toHaveAccessibleName(/Updated name/);
    const association = await page.evaluate(() => {
      const label = document.querySelector<HTMLLabelElement>('#probe-label')!;
      return { for: label.htmlFor, control: label.control?.id, inputs: ['probe-first', 'probe-second'].map(id => { const input = document.getElementById(id) as HTMLInputElement; return { id, labels: Array.from(input.labels ?? [], label => label.id) }; }) };
    });
    console.log('LABEL_NATIVE_ASSOCIATION', JSON.stringify({ route, association, first: await page.locator('#probe-first').ariaSnapshot(), second: await page.locator('#probe-second').ariaSnapshot() }));
    await page.locator('#probe-label').click(); await expect(page.locator('#probe-second')).toBeFocused();
  }
});

test('diagnose single focusable Button tab cycle and a following native control', async ({ page }) => {
  for (const route of ['/button-focus-reference?case=native-focusable', '/button?case=native-focusable', '/button-focus-reference?case=custom-focusable', '/button?case=custom-focusable', 'native']) {
    if (route === 'native') await page.setContent('<button id="tested-button" aria-disabled="true">Save</button>');
    else { await page.goto(route); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true'); }
    const button = page.locator('#tested-button');
    await button.focus(); await expect(button).toBeFocused(); await page.keyboard.press('Tab');
    const withoutFollowing = await page.evaluate(() => ({ tag: document.activeElement?.tagName, id: document.activeElement?.id }));
    await page.evaluate(() => { const following = document.createElement('button'); following.type = 'button'; following.id = 'following-button'; following.textContent = 'Following button'; (document.querySelector('main') ?? document.body).append(following); });
    await button.focus(); await page.keyboard.press('Tab'); await expect(page.locator('#following-button')).toBeFocused();
    console.log('BUTTON_NATIVE_TAB', JSON.stringify({ route, withoutFollowing, withFollowing: await page.evaluate(() => document.activeElement?.id) }));
  }
});

test('diagnose real exit CSS animations separately from CSS transitions in both implementations', async ({ page }) => {
  for (const route of ['/reference', '/dialog']) {
    await page.goto(route); await expect(page.locator('[data-hydrated=true]')).toBeVisible();
    await page.getByTestId('trigger').click(); const popup = page.getByRole('dialog'); await expect(popup).toBeVisible();
    const control = await page.addStyleTag({ content: '[data-slot="dialog-content"], [data-slot="dialog-overlay"] { animation-play-state: paused !important; }' });
    try {
      await popup.getByRole('button', { name: 'Close', exact: true }).evaluate((close: HTMLButtonElement) => close.click());
      await expect(popup).toHaveAttribute('data-closed', '');
      const result = await popup.evaluate(node => { const style = getComputedStyle(node); return { name: style.animationName, duration: style.animationDuration, animations: node.getAnimations().map(animation => ({ kind: animation.constructor.name, cssAnimation: animation instanceof CSSAnimation, cssTransition: animation instanceof CSSTransition, name: animation instanceof CSSAnimation ? animation.animationName : null, property: animation instanceof CSSTransition ? animation.transitionProperty : null, state: animation.playState, timing: animation.effect?.getComputedTiming() })) }; });
      expect(result.name).toBe('exit'); expect(result.duration).toBe('0.1s'); expect(result.animations.length).toBeGreaterThan(0);
      console.log('PAIRED_DIALOG_ANIMATION_KINDS', JSON.stringify({ route, ...result }));
    } finally { await control.evaluate(node => node.remove()); }
    await expect(popup).toHaveCount(0);
  }
});
