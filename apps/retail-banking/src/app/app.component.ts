import { Component } from '@angular/core';
import { TransferSummary } from '@bank-of-america-demo/shared-integrations';

@Component({
  selector: 'bofa-demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly transfer: TransferSummary = {
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

  outcome = 'Awaiting review';
}
