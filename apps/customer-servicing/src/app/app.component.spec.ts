import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedDesignSystemModule } from '@bank-of-america-demo/design-system';
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
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        SharedDesignSystemModule,
        SharedSecureTransferModule,
      ],
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
              fee: 5,
              expectedArrival: 'Tuesday',
              sources: ['Harbor Rates', 'Atlas Clearing', 'Meridian Holidays'],
            }),
          },
        },
      ],
    }).compileComponents();
  });

  it('renders the Servicing consumer and synthetic boundary', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Confirm with the customer'
    );
    expect(compiled.textContent).toContain('Synthetic interview simulation');
    expect(
      compiled.querySelector('[data-testid="service-brand-icon"] svg')
    ).toBeTruthy();
  });
});
