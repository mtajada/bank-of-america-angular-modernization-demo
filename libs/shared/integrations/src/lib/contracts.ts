import { InjectionToken } from '@angular/core';

export type ConsumerChannel = 'retail' | 'servicing';

export interface TransferSummary {
  amount: number;
  currency: 'USD';
  recipientAlias: string;
  destinationMask: string;
  requestedDate: string;
  transferReference: string;
  sourceAccountId: string;
  routingNumber: string;
  customerId: string;
}

export interface TransferQuote {
  fee: number;
  expectedArrival: string;
  sources: readonly string[];
}

export interface AuthenticatedSession {
  assurance: 'sso+mfa';
  channel: 'digital-banking';
  expiresInMinutes: number;
}

export interface SsoSessionGateway {
  currentSession(): Promise<AuthenticatedSession>;
}

export interface MfaGateway {
  challenge(code: string): Promise<'approved' | 'rejected'>;
}

export interface TransferAnalyticsEvent {
  name: 'secure_transfer_confirmed';
  channel: ConsumerChannel;
  outcome: 'approved';
  amountBand: 'under-1k' | '1k-10k' | 'over-10k';
}

export interface TransferAnalytics {
  track(event: TransferAnalyticsEvent): void;
  recordedEvents(): readonly TransferAnalyticsEvent[];
  reset(): void;
}

export interface ProprietaryAnalyticsSdk {
  emit(eventName: string, payload: Record<string, string>): void;
  capturedPayloads(): readonly Record<string, string>[];
}

export interface FinancialDataProvider {
  quote(transfer: TransferSummary): Promise<TransferQuote>;
}

export const MFA_GATEWAY = new InjectionToken<MfaGateway>('MFA_GATEWAY');
export const SSO_SESSION_GATEWAY =
  new InjectionToken<SsoSessionGateway>('SSO_SESSION_GATEWAY');
export const TRANSFER_ANALYTICS =
  new InjectionToken<TransferAnalytics>('TRANSFER_ANALYTICS');
export const PROPRIETARY_ANALYTICS_SDK =
  new InjectionToken<ProprietaryAnalyticsSdk>('PROPRIETARY_ANALYTICS_SDK');
export const FINANCIAL_DATA_PROVIDER =
  new InjectionToken<FinancialDataProvider>('FINANCIAL_DATA_PROVIDER');

export function amountBand(amount: number): TransferAnalyticsEvent['amountBand'] {
  if (amount < 1000) return 'under-1k';
  if (amount <= 10000) return '1k-10k';
  return 'over-10k';
}

export function safeConfirmationEvent(
  transfer: TransferSummary,
  channel: ConsumerChannel
): TransferAnalyticsEvent {
  return {
    name: 'secure_transfer_confirmed',
    channel,
    outcome: 'approved',
    amountBand: amountBand(transfer.amount),
  };
}
