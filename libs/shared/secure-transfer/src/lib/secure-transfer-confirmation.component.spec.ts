import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedDesignSystemModule } from '@bank-of-america-demo/design-system';
import {
  FINANCIAL_DATA_PROVIDER,
  MemoryProprietaryAnalyticsSdk,
  MFA_GATEWAY,
  PROPRIETARY_ANALYTICS_SDK,
  RedactedTransferAnalyticsAdapter,
  SSO_SESSION_GATEWAY,
  TRANSFER_ANALYTICS,
  TransferSummary,
} from '@bank-of-america-demo/shared-integrations';

import { SecureTransferConfirmationComponent } from './secure-transfer-confirmation.component';

const transfer: TransferSummary = {
  amount: 2450,
  currency: 'USD',
  recipientAlias: 'Morgan Household',
  destinationMask: '•••• 8842',
  requestedDate: 'Monday, August 3',
  transferReference: 'TRX-SYNTH-1042',
  sourceAccountId: 'ACC-SYNTH-2201',
  routingNumber: '000000000',
  customerId: 'CUS-SYNTH-9401',
};

describe('SecureTransferConfirmationComponent', () => {
  let fixture: ComponentFixture<SecureTransferConfirmationComponent>;
  let analytics: RedactedTransferAnalyticsAdapter;
  const challenge = jest.fn(async (code: string) =>
    code === '482931' ? ('approved' as const) : ('rejected' as const)
  );

  beforeEach(async () => {
    analytics = new RedactedTransferAnalyticsAdapter(
      new MemoryProprietaryAnalyticsSdk()
    );
    challenge.mockClear();

    await TestBed.configureTestingModule({
      declarations: [SecureTransferConfirmationComponent],
      imports: [FormsModule, NoopAnimationsModule, SharedDesignSystemModule],
      providers: [
        { provide: MFA_GATEWAY, useValue: { challenge } },
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
        { provide: TRANSFER_ANALYTICS, useValue: analytics },
        {
          provide: FINANCIAL_DATA_PROVIDER,
          useValue: {
            quote: async () => ({
              fee: 0,
              expectedArrival: 'Monday, August 3',
              sources: ['Harbor Rates', 'Atlas Clearing', 'Meridian Holidays'],
            }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SecureTransferConfirmationComponent);
    fixture.componentInstance.transfer = transfer;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('cancels without starting MFA or emitting analytics', () => {
    const button = fixture.debugElement.query(
      By.css('[data-testid="cancel-transfer"]')
    );
    const cancelled = jest.spyOn(fixture.componentInstance.cancelled, 'emit');

    button.triggerEventHandler('click', new MouseEvent('click'));

    expect(challenge).not.toHaveBeenCalled();
    expect(analytics.recordedEvents()).toEqual([]);
    expect(fixture.componentInstance.status).toBe('cancelled');
    expect(cancelled).toHaveBeenCalledTimes(1);
  });

  it('requires an approved MFA challenge before confirming', async () => {
    fixture.componentInstance.mfaCode = '482931';
    await fixture.componentInstance.confirm();

    expect(challenge).toHaveBeenCalledWith('482931');
    expect(fixture.componentInstance.status).toBe('confirmed');
    expect(analytics.recordedEvents()).toHaveLength(1);
  });

  it('has no side effects after a rejected challenge', async () => {
    fixture.componentInstance.mfaCode = '000000';
    await fixture.componentInstance.confirm();

    expect(fixture.componentInstance.status).toBe('rejected');
    expect(analytics.recordedEvents()).toEqual([]);
  });
});
