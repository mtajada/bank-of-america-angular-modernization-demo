import { expect, Page, test } from '@playwright/test';
import { join } from 'node:path';

const evidenceRoot =
  process.env['BOFA_PLAYWRIGHT_EVIDENCE_DIR'] ?? 'evidence/browser';

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
  await expect(page.getByTestId('bank-brand-icon')).toBeVisible();
  await expect(
    page.getByTestId('bank-brand-icon').locator('svg')
  ).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.bank-brand__mark')).toHaveCount(0);
  await expect(page.locator('.brand-rail')).toHaveCount(0);
  await expect(page.locator('img')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'retail-initial-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('http://127.0.0.1:4200');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'retail-initial-tablet.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 1440, height: 980 });
  await page.goto('http://127.0.0.1:4300');
  await expect(page.getByTestId('service-brand-icon')).toBeVisible();
  await expect(
    page.getByTestId('service-brand-icon').locator('svg')
  ).toHaveAttribute('aria-hidden', 'true');
  await expect(page.locator('.service-brand__mark')).toHaveCount(0);
  await expect(page.locator('.brand-rail')).toHaveCount(0);
  await expect(page.locator('img')).toHaveCount(0);
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expect(page.getByTestId('status')).toBeFocused();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'servicing-confirmed-desktop.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('http://127.0.0.1:4300');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'servicing-medium.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4200');
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'retail-confirmed-mobile.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('http://127.0.0.1:4200');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'retail-initial-compact.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4300');
  await page.getByTestId('mfa-code').fill('000000');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText(
    'challenge was rejected'
  );
  await expect(page.getByTestId('status')).toBeFocused();
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'servicing-rejected-mobile.png'),
    fullPage: true,
  });

  await page.setViewportSize({ width: 320, height: 760 });
  await page.goto('http://127.0.0.1:4300');
  await expectNoHorizontalOverflow(page);
  await page.screenshot({
    path: join(evidenceRoot, 'redesign', 'servicing-initial-compact.png'),
    fullPage: true,
  });
});
