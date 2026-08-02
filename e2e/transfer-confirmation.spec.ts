import { expect, test } from '@playwright/test';

test('records the positive path in both downstream applications', async ({ page }) => {
  await page.goto('http://127.0.0.1:4200');
  await expect(page.getByRole('heading', { name: 'Review your transfer' })).toBeVisible();
  await expect(page.getByText('SSO session verified')).toBeVisible();
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expect(page.getByTestId('consumer-status')).toHaveText(
    'Confirmed by Retail Banking'
  );
  await page.screenshot({
    path: 'evidence/browser/retail-confirmed.png',
    fullPage: true,
  });

  await page.goto('http://127.0.0.1:4300');
  await expect(
    page.getByRole('heading', { name: 'Confirm with the customer' })
  ).toBeVisible();
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('confirm-transfer').click();
  await expect(page.getByTestId('status')).toContainText('Transfer confirmed');
  await expect(page.getByTestId('consumer-status')).toHaveText(
    'Confirmed in Customer Servicing'
  );
  await page.screenshot({
    path: 'evidence/browser/servicing-confirmed.png',
    fullPage: true,
  });
});

test('cancel has no MFA, confirmation or analytics side effect', async ({ page }) => {
  await page.goto('http://127.0.0.1:4200');
  await page.getByTestId('mfa-code').fill('482931');
  await page.getByTestId('cancel-transfer').click();

  await expect(page.getByTestId('status')).toContainText(
    'Transfer cancelled. No side effects were created.'
  );
  await expect(page.getByTestId('consumer-status')).toHaveText(
    'Cancelled by Retail Banking'
  );
  await expect(page.getByText('One redacted analytics event')).toHaveCount(0);
  await page.screenshot({
    path: 'evidence/browser/retail-cancelled.png',
    fullPage: true,
  });
});

test('rejected MFA remains free of transfer and analytics side effects', async ({ page }) => {
  await page.goto('http://127.0.0.1:4300');
  await page.getByTestId('mfa-code').fill('000000');
  await page.getByTestId('confirm-transfer').click();

  await expect(page.getByTestId('status')).toContainText(
    'The synthetic challenge was rejected'
  );
  await expect(page.getByTestId('consumer-status')).toHaveText(
    'Assisted review in progress'
  );
});
