import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ConsumerChannel,
  FINANCIAL_DATA_PROVIDER,
  FinancialDataProvider,
  MFA_GATEWAY,
  MfaGateway,
  safeConfirmationEvent,
  SSO_SESSION_GATEWAY,
  SsoSessionGateway,
  TRANSFER_ANALYTICS,
  TransferAnalytics,
  TransferQuote,
  TransferSummary,
} from '@bank-of-america-demo/shared-integrations';

type TransferStatus =
  | 'ready'
  | 'verifying'
  | 'rejected'
  | 'confirmed'
  | 'cancelled';

@Component({
  selector: 'bofa-demo-secure-transfer-confirmation',
  templateUrl: './secure-transfer-confirmation.component.html',
  styleUrls: ['./secure-transfer-confirmation.component.scss'],
})
export class SecureTransferConfirmationComponent implements OnInit {
  @Input() transfer!: TransferSummary;
  @Input() channel: ConsumerChannel = 'retail';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @ViewChild('statusMessage') private statusMessage?: ElementRef<HTMLElement>;

  quote?: TransferQuote;
  mfaCode = '';
  status: TransferStatus = 'ready';
  sessionVerified = false;

  constructor(
    @Inject(MFA_GATEWAY) private readonly mfa: MfaGateway,
    @Inject(SSO_SESSION_GATEWAY) private readonly sso: SsoSessionGateway,
    @Inject(TRANSFER_ANALYTICS) readonly analytics: TransferAnalytics,
    @Inject(FINANCIAL_DATA_PROVIDER)
    private readonly financialData: FinancialDataProvider
  ) {}

  async ngOnInit(): Promise<void> {
    const [quote, session] = await Promise.all([
      this.financialData.quote(this.transfer),
      this.sso.currentSession(),
    ]);
    this.quote = quote;
    this.sessionVerified = session.assurance === 'sso+mfa';
  }

  async confirm(): Promise<void> {
    if (this.status === 'verifying' || this.status === 'confirmed') return;

    this.status = 'verifying';
    const outcome = await this.mfa.challenge(this.mfaCode.trim());

    if (outcome === 'rejected') {
      this.status = 'rejected';
      this.focusResult();
      return;
    }

    this.analytics.track(safeConfirmationEvent(this.transfer, this.channel));
    this.status = 'confirmed';
    this.confirmed.emit();
    this.focusResult();
  }

  cancel(): void {
    this.status = 'cancelled';
    this.cancelled.emit();
    this.focusResult();
  }

  private focusResult(): void {
    setTimeout(() => this.statusMessage?.nativeElement.focus());
  }
}
