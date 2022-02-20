const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');

describe('Wallet', () => {
  let wallet, tp, bc;

  beforeEach(() => {
    wallet = new Wallet();
    tp = new TransactionPool();
  });

  describe('creating a transaction', () => {
  let transaction, sendAmount, recipient;

  beforeEach(() => {
    sendAmount = 50;
    recipient = 'recieverOne';
    transaction = wallet.createTransaction(recipient, sendAmount, tp);
  });

  describe('and doing the same transaction', () => {
      beforeEach(() => {
        wallet.createTransaction(recipient, sendAmount, tp);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.senderAddress === wallet.publicKey).balanceAmount)
          .toEqual(wallet.balance - sendAmount * 2);
      });

      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.recipientAddress === recipient)
          .map(output => output.amountSent)).toEqual([sendAmount, sendAmount]);
      });
    });
  });

})
