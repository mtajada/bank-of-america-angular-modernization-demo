import { safeConfirmationEvent, TransferSummary } from './contracts';
import {
  CompositeFinancialDataProvider,
  MemoryProprietaryAnalyticsSdk,
  RedactedTransferAnalyticsAdapter,
} from './local-adapters';

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

describe('safeConfirmationEvent', () => {
  it('emits an allowlisted analytics shape without identifiers', () => {
    const event = safeConfirmationEvent(transfer, 'retail');
    const payload = JSON.stringify(event);

    expect(event).toEqual({
      name: 'secure_transfer_confirmed',
      channel: 'retail',
      outcome: 'approved',
      amountBand: '1k-10k',
    });
    expect(payload).not.toContain(transfer.transferReference);
    expect(payload).not.toContain(transfer.sourceAccountId);
    expect(payload).not.toContain(transfer.routingNumber);
    expect(payload).not.toContain(transfer.customerId);
  });

  it('adapts the allowlisted shape to the proprietary SDK boundary', () => {
    const sdk = new MemoryProprietaryAnalyticsSdk();
    const analytics = new RedactedTransferAnalyticsAdapter(sdk);

    analytics.track(safeConfirmationEvent(transfer, 'servicing'));
    const payload = JSON.stringify(sdk.capturedPayloads());

    expect(sdk.capturedPayloads()).toEqual([
      {
        eventName: 'secure_transfer_confirmed',
        channel: 'servicing',
        outcome: 'approved',
        amountBand: '1k-10k',
      },
    ]);
    expect(payload).not.toContain(transfer.customerId);
    expect(payload).not.toContain(transfer.transferReference);
  });

  it('aggregates several deterministic financial data providers', async () => {
    const quote = await new CompositeFinancialDataProvider().quote(transfer);

    expect(quote.sources).toEqual([
      'Harbor Rates',
      'Atlas Clearing',
      'Meridian Holidays',
    ]);
  });
});
