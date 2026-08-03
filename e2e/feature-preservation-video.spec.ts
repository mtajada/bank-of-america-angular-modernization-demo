import { expect, test, type Page } from '@playwright/test';
import { join } from 'node:path';

const evidenceRoot =
  process.env['BOFA_PLAYWRIGHT_EVIDENCE_DIR'] ?? 'output/playwright';
const pauseForPlayback = (page: Page) => page.waitForTimeout(900);

test('records the preserved transfer flow across both downstream applications', async ({
  page,
}) => {
  test.slow();

  await test.step('Retail Banking confirms an approved transfer', async () => {
    await page.goto('http://127.0.0.1:4200');
    await expect(
      page.getByRole('heading', { name: 'Review your transfer' })
    ).toBeVisible();
    await expect(page.getByText('SSO session verified')).toBeVisible();
    await pauseForPlayback(page);

    await page.getByTestId('mfa-code').fill('482931');
    await pauseForPlayback(page);
    await page.getByTestId('confirm-transfer').click();

    await expect(page.getByTestId('status')).toContainText(
      'Transfer confirmed'
    );
    await expect(page.getByTestId('consumer-status')).toHaveText(
      'Confirmed by Retail Banking'
    );
    await expect(page.getByText('Redacted event recorded')).toBeVisible();
    await page.screenshot({
      path: join(evidenceRoot, 'feature-preservation-retail-confirmed.png'),
      fullPage: true,
    });
    await pauseForPlayback(page);
  });

  await test.step('Customer Servicing cancels without side effects', async () => {
    await page.goto('http://127.0.0.1:4300');
    await expect(
      page.getByRole('heading', { name: 'Confirm with the customer' })
    ).toBeVisible();
    await pauseForPlayback(page);

    await page.getByTestId('mfa-code').fill('482931');
    await pauseForPlayback(page);
    await page.getByTestId('cancel-transfer').click();

    await expect(page.getByTestId('status')).toContainText(
      'Transfer cancelled. No side effects were created.'
    );
    await expect(page.getByTestId('consumer-status')).toHaveText(
      'Cancelled in Customer Servicing'
    );
    await expect(
      page.getByTestId('transfer-card').getByText('No event created')
    ).toBeVisible();
    await expect(page.getByText('One redacted analytics event')).toHaveCount(0);
    await page.screenshot({
      path: join(evidenceRoot, 'feature-preservation-servicing-cancelled.png'),
      fullPage: true,
    });
    await pauseForPlayback(page);
  });
});
