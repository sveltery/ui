import { expect, test } from '@playwright/test';
test('fresh Textarea tarball/source copy: SSR, binding, labels, native forms and Nova at mobile/desktop', async ({ page, request }) => {
  const html = await (await request.get('/textarea')).text();
  expect(html).toContain('cn-textarea'); expect(html).toContain('data-hydrated="false"'); expect(html).toContain('>Initial</textarea>'); expect(html).toContain('>Draft</textarea>');
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 }); await page.goto('/textarea'); await expect(page.locator('main')).toHaveAttribute('data-hydrated', 'true');
    await expect(page.getByTestId('state')).toContainText('"ref":"message"');
    await page.locator('label').click(); await expect(page.locator('#message')).toBeFocused(); await expect(page.locator('#message')).toHaveAccessibleDescription('Write a message');
    await page.locator('#message').fill('Typed'); await expect(page.getByTestId('state')).toContainText('"value":"Typed","inputs":1,"changes":0');
    await page.locator('#draft').fill('Unsaved'); await expect(page.getByTestId('state')).toContainText('"changes":1');
    await page.getByRole('button', { name: 'Submit', exact: true }).click(); await expect(page.getByTestId('submitted')).toHaveText('[["message","Typed"],["draft","Unsaved"]]');
    await page.getByRole('button', { name: 'Reset', exact: true }).click(); await expect(page.locator('#draft')).toHaveValue('Draft');
    await expect(page.locator('#disabled')).toBeDisabled();
    expect(await page.locator('#disabled').evaluate(node => getComputedStyle(node).opacity)).toBe('0.5');
    expect(await page.locator('#message').evaluate(node => getComputedStyle(node).fontSize)).toBe(width < 768 ? '16px' : '14px');
    expect(await page.locator('#invalid').evaluate(node => getComputedStyle(node).boxShadow)).not.toBe('none');
    expect(await page.locator('#override').evaluate(node => ({ padding: getComputedStyle(node).paddingLeft, radius: getComputedStyle(node).borderRadius, height: node.getBoundingClientRect().height, width: node.getBoundingClientRect().width }))).toEqual({ padding: '24px', radius: '0px', height: 128, width: 256 });
    await page.getByRole('button', { name: 'Inspect attachments' }).click(); await expect(page.getByTestId('submitted')).toHaveText('1');
  }
  expect(errors).toEqual([]);
});
