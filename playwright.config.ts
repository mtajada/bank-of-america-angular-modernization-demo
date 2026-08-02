import { defineConfig, devices } from '@playwright/test';

const evidenceRoot =
  process.env['BOFA_PLAYWRIGHT_EVIDENCE_DIR'] ?? 'evidence/browser';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 8_000 },
  outputDir: `${evidenceRoot}/test-results`,
  reporter: [
    ['line'],
    [
      'html',
      { outputFolder: `${evidenceRoot}/playwright-report`, open: 'never' },
    ],
    ['json', { outputFile: `${evidenceRoot}/results.json` }],
  ],
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'on',
  },
  projects: [
    {
      name: 'bank-of-america-demo-video',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 980 },
      },
    },
  ],
  webServer: [
    {
      command: './scripts/serve-app.sh retail-banking 4200',
      url: 'http://127.0.0.1:4200',
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: './scripts/serve-app.sh customer-servicing 4300',
      url: 'http://127.0.0.1:4300',
      reuseExistingServer: true,
      timeout: 120_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
