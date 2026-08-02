import {
  ConsumerChannel,
  TransferSummary,
} from '@bank-of-america-demo/shared-integrations';

interface ConsumerContract {
  team: string;
  channel: ConsumerChannel;
  transfer: TransferSummary;
}

const baseTransfer: TransferSummary = {
  amount: 500,
  currency: 'USD',
  recipientAlias: 'Synthetic recipient',
  destinationMask: '•••• 0001',
  requestedDate: 'Next business day',
  transferReference: 'TRX-SYNTH-CONTRACT',
  sourceAccountId: 'ACC-SYNTH-CONTRACT',
  routingNumber: '000000000',
  customerId: 'CUS-SYNTH-CONTRACT',
};

const downstreamContracts: ConsumerContract[] = [
  { team: 'Retail Transfers', channel: 'retail', transfer: baseTransfer },
  { team: 'Customer Servicing', channel: 'servicing', transfer: baseTransfer },
  { team: 'Scheduled Payments', channel: 'retail', transfer: baseTransfer },
  { team: 'Disputes and Claims', channel: 'servicing', transfer: baseTransfer },
  { team: 'Financial Wellness', channel: 'retail', transfer: baseTransfer },
];

describe('downstream consumer contracts', () => {
  it.each(downstreamContracts)(
    '$team compiles against the shared public types',
    (contract) => {
      expect(contract.transfer.currency).toBe('USD');
      expect(['retail', 'servicing']).toContain(contract.channel);
    }
  );
});
