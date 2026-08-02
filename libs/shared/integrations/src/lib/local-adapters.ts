import { Inject, Injectable } from '@angular/core';

import {
  FinancialDataProvider,
  MfaGateway,
  PROPRIETARY_ANALYTICS_SDK,
  ProprietaryAnalyticsSdk,
  SsoSessionGateway,
  TransferAnalytics,
  TransferAnalyticsEvent,
  TransferQuote,
  TransferSummary,
} from './contracts';

@Injectable()
export class LocalMfaGateway implements MfaGateway {
  async challenge(code: string): Promise<'approved' | 'rejected'> {
    await new Promise((resolve) => setTimeout(resolve, 650));
    return code === '482931' ? 'approved' : 'rejected';
  }
}

@Injectable()
export class LocalSsoSessionGateway implements SsoSessionGateway {
  async currentSession() {
    await Promise.resolve();
    return {
      assurance: 'sso+mfa' as const,
      channel: 'digital-banking' as const,
      expiresInMinutes: 12,
    };
  }
}

@Injectable()
export class MemoryProprietaryAnalyticsSdk implements ProprietaryAnalyticsSdk {
  private readonly payloads: Record<string, string>[] = [];

  emit(eventName: string, payload: Record<string, string>): void {
    this.payloads.push(Object.freeze({ eventName, ...payload }));
  }

  capturedPayloads(): readonly Record<string, string>[] {
    return this.payloads.map((payload) => ({ ...payload }));
  }
}

@Injectable()
export class RedactedTransferAnalyticsAdapter implements TransferAnalytics {
  private readonly events: TransferAnalyticsEvent[] = [];

  constructor(
    @Inject(PROPRIETARY_ANALYTICS_SDK)
    private readonly sdk: ProprietaryAnalyticsSdk
  ) {}

  track(event: TransferAnalyticsEvent): void {
    this.events.push(Object.freeze({ ...event }));
    this.sdk.emit(event.name, {
      channel: event.channel,
      outcome: event.outcome,
      amountBand: event.amountBand,
    });
  }

  recordedEvents(): readonly TransferAnalyticsEvent[] {
    return this.events.map((event) => ({ ...event }));
  }

  reset(): void {
    this.events.splice(0, this.events.length);
  }
}

@Injectable()
export class CompositeFinancialDataProvider implements FinancialDataProvider {
  async quote(transfer: TransferSummary): Promise<TransferQuote> {
    await Promise.resolve();
    return {
      fee: transfer.amount >= 5000 ? 5 : 0,
      expectedArrival: transfer.requestedDate,
      sources: ['Harbor Rates', 'Atlas Clearing', 'Meridian Holidays'],
    };
  }
}
