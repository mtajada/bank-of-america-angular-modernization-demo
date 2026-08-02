import { Component } from '@angular/core';
import { TransferSummary } from '@bank-of-america-demo/shared-integrations';

@Component({
  selector: 'bofa-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly transfer: TransferSummary = {
    amount: 12000,
    currency: 'USD',
    recipientAlias: 'Cedar Ridge Supplies',
    destinationMask: '•••• 1108',
    requestedDate: 'Tuesday, August 4',
    transferReference: 'TRX-SYNTH-2084',
    sourceAccountId: 'ACC-SYNTH-7810',
    routingNumber: '000000000',
    customerId: 'CUS-SYNTH-3387',
  };

  outcome = 'Assisted review in progress';
}
