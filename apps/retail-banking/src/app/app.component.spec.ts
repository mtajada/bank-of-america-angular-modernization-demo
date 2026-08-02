import { TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FINANCIAL_DATA_PROVIDER,
  MFA_GATEWAY,
  MemoryProprietaryAnalyticsSdk,
  PROPRIETARY_ANALYTICS_SDK,
  RedactedTransferAnalyticsAdapter,
  SSO_SESSION_GATEWAY,
  TRANSFER_ANALYTICS,
} from '@bank-of-america-demo/shared-integrations';
import { SharedSecureTransferModule } from '@bank-of-america-demo/secure-transfer';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, SharedSecureTransferModule],
      declarations: [AppComponent],
      providers: [
        {
          provide: MFA_GATEWAY,
          useValue: { challenge: async () => 'approved' },
        },
        {
          provide: SSO_SESSION_GATEWAY,
          useValue: {
            currentSession: async () => ({
              assurance: 'sso+mfa',
              channel: 'digital-banking',
              expiresInMinutes: 12,
            }),
          },
        },
        {
          provide: PROPRIETARY_ANALYTICS_SDK,
          useClass: MemoryProprietaryAnalyticsSdk,
        },
        {
          provide: TRANSFER_ANALYTICS,
          useClass: RedactedTransferAnalyticsAdapter,
        },
        {
          provide: FINANCIAL_DATA_PROVIDER,
          useValue: {
            quote: async () => ({
              fee: 0,
              expectedArrival: 'Monday',
              sources: ['Harbor Rates', 'Atlas Clearing', 'Meridian Holidays'],
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the Retail consumer and synthetic boundary', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Review your transfer'
    );
    expect(compiled.textContent).toContain('Synthetic interview simulation');
  });
});
