import { expect, Page, test } from '@playwright/test';

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const hasOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth
  );
  expect(hasOverflow).toBe(false);
}

test('captures the redesigned desktop and mobile banking journeys', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 980 });
  await page.goto('http://127.0.0.1:4200');
  await expect(
    page.getByRole('heading', { name: 'Review your transfer' })
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: 'evidence/browser/redesign/retail-initial-desktop.png',
    fullPage: true,
  });

  await page.goto('http://127.0.0.1:4300');
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expect(page.getByTestId('status')).toBeFocused();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: 'evidence/browser/redesign/servicing-confirmed-desktop.png',
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4200');
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: 'evidence/browser/redesign/retail-confirmed-mobile.png',
    fullPage: true,
  });

  await page.goto('http://127.0.0.1:4300');
  await page.getByTestId('mfa-code').fill('000000');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText(
    'challenge was rejected'
  );
  await expect(page.getByTestId('status')).toBeFocused();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: 'evidence/browser/redesign/servicing-rejected-mobile.png',
    fullPage: true,
  });
});
